/**
 * Les toasts : le composant `Sonner` de shadcn/ui (bibliothèque `sonner`),
 * aux couleurs et à la police du site. Le site n'a qu'un thème clair : pas
 * de `next-themes` ici.
 *
 * En haut de l'écran : en bas, la barre d'onglets les cacherait.
 */
'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import type { CSSProperties } from 'react';

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      offset={16}
      mobileOffset={12}
      duration={3500}
      richColors={false}
      className="toaster"
      style={{
        '--normal-bg': 'var(--card)',
        '--normal-text': 'var(--ink)',
        '--normal-border': 'var(--border)',
        '--success-bg': 'var(--card)',
        '--success-text': 'var(--ink)',
        '--success-border': 'var(--border)',
        '--border-radius': 'var(--radius-button)',
        fontFamily: 'var(--font-sans), system-ui, sans-serif',
      } as CSSProperties}
      toastOptions={{
        classNames: {
          description: 'toast-description',
          icon: 'toast-icon',
        },
      }}
      {...props}
    />
  );
}
