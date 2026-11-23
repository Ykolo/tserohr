/**
 * Mon compte : l'adresse du compte, la déconnexion, et tout en bas la
 * suppression du compte.
 *
 * La suppression passe par une boîte de confirmation (`<dialog>` modal) qui
 * dit ce qui part et demande le mot de passe : le serveur l'exige aussi, et
 * n'efface le compte qu'une fois les fichiers effacés.
 */
'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

import { describeAuthError } from '@core/auth-errors';
import { logError, type ErrorView } from '@core/errors';

import { deleteUser } from '@/lib/auth-client';

import { DangerButton, ErrorNotice, Eyebrow, PasswordField, SecondaryButton, TextButton } from './kit';import s from './screens.module.css';

export function MyAccountScreen({ email, busy, onBack, onSignOut, onDeleted, consented, onWithdraw }: {
  email: string;
  busy: boolean;
  onBack: () => void;
  onSignOut: () => void;
  onDeleted: () => void;
  /** Le consentement au stockage des fichiers (art. 9 RGPD) est-il donné ? */
  consented: boolean;
  /** Le retire ; le serveur efface alors tous les fichiers du compte. */
  onWithdraw: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={s.screen}>
      <div className={s.scroll}>
        <header className={s.header}>
          <Eyebrow>Compte Tserohr</Eyebrow>
          <h1 className={s.title}>Mon compte</h1>
          <p className={s.lead}>
            Connecté en tant que <strong className={s.deleteEmail}>{email}</strong>.
          </p>
        </header>

        <div className={s.authForm}>
          <SecondaryButton label="Se déconnecter" onClick={onSignOut} disabled={busy} />
          <TextButton label="Retour" onClick={onBack} disabled={busy} />
        </div>

        {consented && <WithdrawConsent busy={busy} onWithdraw={onWithdraw} />}

        <section className={s.dangerZone} aria-labelledby="danger-zone-title">
          <h2 id="danger-zone-title" className={s.dangerTitle}>Supprimer mon compte</h2>
          <p className={s.deleteNote}>
            Efface le compte, les sauvegardes déposées et les fusions enregistrées. Définitif.
          </p>
          <DangerButton solid label="Supprimer mon compte" onClick={() => setConfirming(true)} disabled={busy} />
        </section>
      </div>

      {confirming && (
        <DeleteDialog email={email} onCancel={() => setConfirming(false)} onDeleted={onDeleted} />
      )}
    </div>
  );
}

/**
 * Le retrait du consentement au stockage : il efface les sauvegardes et les
 * fusions du compte, mais garde le compte. Une confirmation en ligne suffit,
 * le compte restant accessible.
 */
function WithdrawConsent({ busy, onWithdraw }: { busy: boolean; onWithdraw: () => Promise<void> }) {
  const [asking, setAsking] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<ErrorView | null>(null);

  const confirm = async () => {
    setError(null);
    setWorking(true);
    try {
      await onWithdraw();
      setAsking(false);
    } catch (err) {
      setError(logError('retrait du consentement', err));
    } finally {
      setWorking(false);
    }
  };

  return (
    <section className={s.dangerZone} aria-labelledby="consent-title">
      <h2 id="consent-title" className={s.dangerTitle}>Fichiers gardés dans le compte</h2>
      <p className={s.deleteNote}>
        Tu as accepté que tes sauvegardes et tes fusions soient stockées dans ton compte. Retirer cet accord les efface
        toutes du serveur ; le compte, lui, reste.
      </p>
      {asking ? (
        <>
          <DangerButton
            label={working ? 'Effacement…' : 'Retirer et effacer mes fichiers'}
            onClick={() => void confirm()}
            disabled={busy || working}
          />
          <TextButton label="Annuler" onClick={() => setAsking(false)} disabled={working} />
        </>
      ) : (
        <SecondaryButton label="Retirer mon accord" onClick={() => setAsking(true)} disabled={busy} />
      )}
      {error && <ErrorNotice error={error} onDismiss={() => setError(null)} />}
    </section>
  );
}

/** La confirmation : ce qui part, ce qui reste, et le mot de passe. */
function DeleteDialog({ email, onCancel, onDeleted }: {
  email: string;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorView | null>(null);

  // `showModal` : le reste de la page devient inerte, Échap ferme, le focus
  // reste dans la boîte.
  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password || busy) return;
    setError(null);
    setBusy(true);
    try {
      const { error: failure } = await deleteUser({ password });
      if (failure) {
        const view = describeAuthError(failure);
        setError(logError('suppression du compte', new Error(view.technical), view));
        return;
      }
      dialog.current?.close();
      onDeleted();
    } catch (err) {
      const view = describeAuthError({ message: err instanceof Error ? err.message : String(err) });
      setError(logError('suppression du compte', err, view));
    } finally {
      setBusy(false);
    }
  };

  return (
    <dialog
      ref={dialog}
      className={s.dialog}
      role="alertdialog"
      aria-labelledby="delete-title"
      aria-describedby="delete-desc"
      onCancel={(e) => { if (busy) e.preventDefault(); else onCancel(); }}
    >
      <form className={s.dialogBody} onSubmit={(e) => void submit(e)}>
        <h2 id="delete-title" className={s.dialogTitle}>Supprimer ton compte ?</h2>
        <div id="delete-desc">
          <p className={s.lead}>
            Le compte <strong className={s.deleteEmail}>{email}</strong> sera supprimé, avec tout ce qu’il garde sur le serveur :
          </p>
          <ul className={s.deleteList}>
            <li>les sauvegardes déposées dans les emplacements A et B ;</li>
            <li>toutes les fusions enregistrées dans l’historique du compte.</li>
          </ul>
          <p className={s.deleteNote}>
            Les fichiers déjà enregistrés sur tes appareils ne sont pas touchés. La suppression est définitive.
          </p>
        </div>

        <PasswordField
          label="Mot de passe, pour confirmer"
          name="delete-password"
          autoComplete="current-password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
        />

        {error && <ErrorNotice error={error} onDismiss={() => setError(null)} />}

        <DangerButton
          type="submit"
          label={busy ? 'Suppression…' : 'Supprimer définitivement'}
          disabled={busy || !password}
        />
        <TextButton label="Annuler" onClick={() => { dialog.current?.close(); onCancel(); }} disabled={busy} />
      </form>
    </dialog>
  );
}
