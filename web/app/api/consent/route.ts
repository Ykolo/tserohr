/**
 * Le consentement au dépôt de fichiers (art. 9 RGPD), voir `lib/consent.ts`.
 *
 * - `GET /api/consent`    → `200 { consentedAt }` (date ISO, ou null)
 * - `POST /api/consent`   → `200 { consentedAt }` : donne le consentement
 * - `DELETE /api/consent` → `204` : le retire, et efface tous les fichiers
 *   du compte ; `503 storage_purge_failed` si R2 n'a pas répondu, rien
 *   n'étant alors retiré.
 */
import type { ConsentDto } from '@core/cloud/types';

import { apiError } from '@/lib/api';
import { requireUser } from '@/lib/auth';
import { consentOf, giveConsent, withdrawConsent } from '@/lib/consent';

const dto = (date: Date | null): ConsentDto => ({ consentedAt: date?.toISOString() ?? null });

export async function GET(req: Request) {
  const user = await requireUser(req);
  if (user instanceof Response) return user;
  return Response.json(dto(await consentOf(user.id)));
}

export async function POST(req: Request) {
  const user = await requireUser(req);
  if (user instanceof Response) return user;
  return Response.json(dto(await giveConsent(user.id)));
}

export async function DELETE(req: Request) {
  const user = await requireUser(req);
  if (user instanceof Response) return user;
  try {
    await withdrawConsent(user.id);
  } catch (err) {
    console.error(`[consentement] retrait pour ${user.id} : fichiers non effacés`, err);
    return apiError(
      503,
      'storage_purge_failed',
      'Les fichiers du compte n’ont pas pu être effacés ; ton accord est conservé. Réessaie dans un instant.',
    );
  }
  return new Response(null, { status: 204 });
}
