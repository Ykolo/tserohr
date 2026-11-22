/**
 * Cadre commun des pages légales : retour vers l'app, titre, date, texte,
 * et les liens vers les deux autres pages. Rendu côté serveur, sans JS.
 */
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { LEGAL_UPDATED } from '@/lib/legal';

import { LegalLinks } from './LegalLinks';
import s from './legal.module.css';

export function LegalPage({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  return (
    <main className={s.page}>
      <Link href="/" className={s.back}>
        <ArrowLeft size={16} aria-hidden />
        Tserohr
      </Link>

      <header className={s.header}>
        <h1 className={s.title}>{title}</h1>
        <p className={s.updated}>Dernière mise à jour : {LEGAL_UPDATED}</p>
      </header>

      <article className={s.body}>{children}</article>

      <footer className={s.footer}>
        <LegalLinks current={path} />
      </footer>
    </main>
  );
}

/** Tableau à défilement horizontal : quatre colonnes ne tiennent pas sur un téléphone. */
export function LegalTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
