/**
 * Le consentement explicite au dépôt de fichiers (art. 9 RGPD) : une
 * sauvegarde JW Library peut révéler des convictions religieuses. Sans lui,
 * aucun envoi ni aucune copie vers le compte n'est accepté.
 *
 * Le retrait efface tous les fichiers du compte, puis leurs lignes : ce qui a
 * été déposé sous un consentement retiré ne reste pas.
 *
 * Réservé au serveur.
 */
import 'server-only';

import { apiError } from '@/lib/api';
import { prisma } from '@/lib/db';
import { purgeUserFiles } from '@/lib/purge';

/** La date du consentement, ou null s'il n'a pas été donné. */
export async function consentOf(userId: string): Promise<Date | null> {
  const row = await prisma.user.findUnique({ where: { id: userId }, select: { sensitiveConsentAt: true } });
  return row?.sensitiveConsentAt ?? null;
}

/** Une réponse 403 à renvoyer telle quelle si le consentement manque, sinon null. */
export async function requireConsent(userId: string): Promise<Response | null> {
  if (await consentOf(userId)) return null;
  return apiError(
    403,
    'consent_required',
    'Pour garder des fichiers dans ton compte, donne d’abord ton accord à leur stockage.',
  );
}

/** Enregistre le consentement ; la date d'un consentement déjà donné est gardée. */
export async function giveConsent(userId: string, now = new Date()): Promise<Date> {
  const current = await consentOf(userId);
  if (current) return current;
  await prisma.user.update({ where: { id: userId }, data: { sensitiveConsentAt: now } });
  return now;
}

/**
 * Retire le consentement : fichiers R2 d'abord (une panne laisse tout en
 * place, et le retrait peut être retenté), puis les lignes, puis la date.
 */
export async function withdrawConsent(userId: string): Promise<void> {
  await purgeUserFiles(userId);
  await prisma.$transaction([
    prisma.backup.deleteMany({ where: { userId } }),
    prisma.merge.deleteMany({ where: { userId } }),
    prisma.user.update({ where: { id: userId }, data: { sensitiveConsentAt: null } }),
  ]);
}
