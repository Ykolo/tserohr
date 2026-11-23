/**
 * Ce que les trois pages légales partagent : l'éditeur, la date de mise à
 * jour et leurs adresses. Les textes viennent des brouillons Notion
 * (« Tserohr / Pages légales »).
 *
 * Tserohr est édité par un particulier, à titre non professionnel : la LCEN
 * le dispense alors de publier son adresse et son téléphone, pourvu que
 * l'hébergeur ait son identité (le compte Vercel). Seul un contact est donné.
 * Si le service devenait professionnel (publicité, abonnement, rattachement à
 * une entreprise), il faudrait revenir à des mentions complètes.
 */

export { LEGAL_PAGES } from '@core/legal';

export const EDITOR = {
  name: 'Loïc Lau',
  email: 'loiclaupro@gmail.com',
} as const;

/** Date affichée en tête de chaque page. */
export const LEGAL_UPDATED = '23 novembre 2026';
