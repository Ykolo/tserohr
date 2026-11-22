/**
 * Ce que les trois pages légales partagent : l'éditeur, la date de mise à
 * jour et leurs adresses. Les textes viennent des brouillons Notion
 * (« Tserohr / Pages légales ») ; un champ encore entre crochets est à
 * remplir ici, une seule fois, avant la mise en ligne.
 */

export const EDITOR = {
  name: 'Loïc Lau',
  status: 'entrepreneur individuel (micro-entreprise)',
  siren: '108 428 798',
  siret: '108 428 798 00012',
  address: '[ADRESSE]',
  phone: '[TÉLÉPHONE]',
  email: 'loiclaupro@gmail.com',
} as const;

/** Date affichée en tête de chaque page. */
export const LEGAL_UPDATED = '22 novembre 2026';

export const LEGAL_PAGES = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/cgu', label: 'CGU' },
] as const;
