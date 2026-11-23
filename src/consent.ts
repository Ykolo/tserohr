/**
 * Le consentement au dépôt de fichiers (art. 9 RGPD), côté écran : commun à
 * l'app et au site. Le serveur le vérifie de son côté à chaque envoi
 * (`consent_required`) ; ici, il sert à ne rien tenter sans lui et à
 * proposer la demande d'accord au bon moment.
 *
 * Rien ici ne dépend de React Native ni du DOM.
 */
import { useCallback, useEffect, useState } from 'react';

import type { CloudClient } from './cloud/client';

/** `unknown` tant que la réponse du serveur n'est pas arrivée, ou sans compte. */
export type ConsentState = 'given' | 'missing' | 'unknown';

export function useConsent(
  cloud: Pick<CloudClient, 'consent' | 'giveConsent' | 'withdrawConsent'>,
  userId: string | null,
  onError: (scope: string, err: unknown) => void,
) {
  const [state, setState] = useState<ConsentState>('unknown');

  useEffect(() => {
    setState('unknown');
    if (!userId) return;
    let cancelled = false;
    cloud.consent().then(
      (dto) => { if (!cancelled) setState(dto.consentedAt ? 'given' : 'missing'); },
      (err: unknown) => { if (!cancelled) onError('lecture du consentement', err); },
    );
    return () => { cancelled = true; };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Donne le consentement ; renvoie vrai s'il est enregistré. */
  const give = useCallback(async (): Promise<boolean> => {
    try {
      const dto = await cloud.giveConsent();
      setState(dto.consentedAt ? 'given' : 'missing');
      return !!dto.consentedAt;
    } catch (err) {
      onError('enregistrement du consentement', err);
      return false;
    }
  }, [cloud, onError]);

  /**
   * Retire le consentement : le serveur efface alors tous les fichiers du
   * compte. Lève l'erreur, que l'écran de confirmation affiche.
   */
  const withdraw = useCallback(async (): Promise<void> => {
    await cloud.withdrawConsent();
    setState('missing');
  }, [cloud]);

  return { state, given: state === 'given', give, withdraw };
}
