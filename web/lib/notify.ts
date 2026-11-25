/**
 * Les messages de réussite, en toasts. Les échecs restent dans l'encart
 * d'erreur de l'écran, qui donne le détail et ne s'efface pas tout seul.
 */
'use client';

import { toast } from 'sonner';

import type { AccountEvent } from '@core/account-flow';

/** Une action a réussi. */
export function notify(title: string, description?: string): void {
  toast.success(title, description ? { description } : undefined);
}

/** Les étapes réussies de l'écran de compte. */
export function notifyAccount(event: AccountEvent): void {
  switch (event.type) {
    case 'signed-in':
      return notify('Connexion réussie');
    case 'verified':
      return notify('Adresse confirmée', 'Ton compte est actif et tu es connecté.');
    case 'password-reset':
      return notify('Mot de passe changé', 'Tes autres appareils ont été déconnectés.');
    case 'code-sent':
      return notify(
        event.again ? 'Nouveau code envoyé' : 'Code envoyé',
        event.purpose === 'verify'
          ? `Regarde ta boîte de réception : ${event.email}.`
          : `Si un compte existe pour ${event.email}, il vient de recevoir un code.`,
      );
  }
}
