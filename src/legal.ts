/**
 * Les pages légales et les textes d'accord, communs à l'app et au site.
 *
 * Les pages vivent sur le site (`web/app/mentions-legales`, `confidentialite`,
 * `cgu`) ; l'app les ouvre dans le navigateur, à l'adresse du serveur.
 */

export const LEGAL_PAGES = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/cgu', label: 'CGU' },
] as const;

export type LegalHref = (typeof LEGAL_PAGES)[number]['href'];

/**
 * Le consentement explicite exigé par l'article 9 du RGPD avant le premier
 * dépôt : une sauvegarde JW Library peut révéler des convictions religieuses.
 * Le serveur refuse tout envoi sans lui (`consent_required`).
 */
export const CONSENT_LABEL = 'J’accepte que les sauvegardes que je choisis soient gardées dans mon compte.';

export const CONSENT_DETAIL =
  'Tes notes et surlignages peuvent révéler tes convictions religieuses : ce sont des données sensibles, '
  + 'stockées seulement avec ton accord. Tu peux le retirer à tout moment dans « Mon compte », ce qui efface '
  + 'tous les fichiers du compte.';
