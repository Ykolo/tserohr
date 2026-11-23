/**
 * Ménage quotidien (Cron Vercel, `GET /api/cron/cleanup`) :
 *
 * - les envois abandonnés : lignes `pending` de plus d'une heure, dont l'URL
 *   signée (10 minutes) a expiré depuis longtemps ;
 * - les sauvegardes sorties de leur emplacement depuis plus de 30 jours :
 *   la règle de cycle de vie de R2 a déjà effacé leur fichier, la ligne ne
 *   vise plus rien ;
 * - les sessions et les codes expirés, les comptes jamais confirmés après
 *   7 jours et les compteurs de débit de plus d'un jour : les durées
 *   annoncées par la politique de confidentialité.
 *
 * Pour chaque ligne, le fichier d'abord, puis la ligne : un échec de R2 laisse
 * la ligne, et donc la trace du fichier, pour le prochain passage.
 *
 * Réservé au serveur.
 */
import 'server-only';

import { prisma } from '@/lib/db';
import { remove } from '@/lib/r2';

/** Âge au-delà duquel un envoi non confirmé est abandonné. */
export const PENDING_MAX_AGE_MS = 60 * 60 * 1000;
/** Durée de vie d'une sauvegarde dans R2 (règle de cycle de vie sur `backups/`). */
export const BACKUP_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
/** Âge au-delà duquel un compte dont l'adresse n'a jamais été confirmée est effacé. */
export const UNVERIFIED_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** Âge au-delà duquel un compteur de débit est effacé ; ses fenêtres durent une heure au plus. */
export const RATE_LIMIT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
/** Lignes traitées par table et par passage, pour tenir dans le temps d'une fonction. */
export const BATCH = 500;

export interface CleanupReport {
  pendingBackups: number;
  pendingMerges: number;
  releasedBackups: number;
  expiredSessions: number;
  expiredCodes: number;
  unverifiedUsers: number;
  staleRateLimits: number;
  failures: number;
}

type Row = { id: string; objectKey: string };

async function sweep(rows: Row[], drop: (id: string) => Promise<unknown>, report: CleanupReport): Promise<number> {
  let done = 0;
  for (const row of rows) {
    try {
      await remove(row.objectKey);
      await drop(row.id);
      done++;
    } catch (err) {
      report.failures++;
      console.error(`[ménage] ${row.objectKey} : échec, nouvel essai au prochain passage`, err);
    }
  }
  return done;
}

export async function cleanup(now = new Date()): Promise<CleanupReport> {
  const report: CleanupReport = {
    pendingBackups: 0, pendingMerges: 0, releasedBackups: 0,
    expiredSessions: 0, expiredCodes: 0, unverifiedUsers: 0, staleRateLimits: 0,
    failures: 0,
  };
  const pendingBefore = new Date(now.getTime() - PENDING_MAX_AGE_MS);
  const releasedBefore = new Date(now.getTime() - BACKUP_MAX_AGE_MS);
  const select = { id: true, objectKey: true } as const;

  const pendingBackups = await prisma.backup.findMany({
    where: { status: 'pending', createdAt: { lt: pendingBefore } },
    select,
    take: BATCH,
  });
  report.pendingBackups = await sweep(pendingBackups, (id) => prisma.backup.delete({ where: { id } }), report);

  const pendingMerges = await prisma.merge.findMany({
    where: { status: 'pending', createdAt: { lt: pendingBefore } },
    select,
    take: BATCH,
  });
  report.pendingMerges = await sweep(pendingMerges, (id) => prisma.merge.delete({ where: { id } }), report);

  const released = await prisma.backup.findMany({
    where: { status: 'ready', slot: null, createdAt: { lt: releasedBefore } },
    select,
    take: BATCH,
  });
  report.releasedBackups = await sweep(released, (id) => prisma.backup.delete({ where: { id } }), report);

  // Les données de compte sans plus d'usage, aux durées que promet la
  // politique de confidentialité. Aucun fichier en jeu : de simples lignes.
  const sessions = await prisma.session.deleteMany({ where: { expiresAt: { lt: now } } });
  report.expiredSessions = sessions.count;
  const codes = await prisma.verification.deleteMany({ where: { expiresAt: { lt: now } } });
  report.expiredCodes = codes.count;
  // Un compte jamais confirmé n'a jamais eu de session, donc aucun fichier.
  const unverified = await prisma.user.deleteMany({
    where: { emailVerified: false, createdAt: { lt: new Date(now.getTime() - UNVERIFIED_MAX_AGE_MS) } },
  });
  report.unverifiedUsers = unverified.count;
  // Compteurs de débit (adresse IP, compte ou empreinte d'adresse) : leurs
  // fenêtres durent une heure au plus.
  const counters = await prisma.rateLimit.deleteMany({
    where: { lastRequest: { lt: BigInt(now.getTime() - RATE_LIMIT_MAX_AGE_MS) } },
  });
  report.staleRateLimits = counters.count;

  return report;
}
