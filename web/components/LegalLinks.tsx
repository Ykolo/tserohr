import Link from 'next/link';

import { LEGAL_PAGES } from '@/lib/legal';

import s from './legal.module.css';

/** Les trois pages légales, en petits liens : pied d'écran, connexion, compte. */
export function LegalLinks({ current }: { current?: string }) {
  return (
    <nav className={s.links} aria-label="Informations légales">
      {LEGAL_PAGES.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className={s.link}
          aria-current={page.href === current ? 'page' : undefined}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}
