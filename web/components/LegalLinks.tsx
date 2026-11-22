import Link from 'next/link';

import { LEGAL_PAGES } from '@/lib/legal';

import s from './legal.module.css';

/** Les trois pages légales, en petits liens : pied d'écran, connexion, compte. */
export function LegalLinks({ current, inline }: { current?: string; inline?: boolean }) {
  return (
    <nav className={inline ? `${s.links} ${s.inline}` : s.links} aria-label="Informations légales">
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
