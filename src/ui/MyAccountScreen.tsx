/**
 * Mon compte : l'adresse du compte, la déconnexion, et tout en bas la
 * suppression du compte.
 *
 * La suppression passe par une fenêtre de confirmation (`Modal`) qui dit ce
 * qui part et demande le mot de passe : le serveur l'exige aussi, et n'efface
 * le compte qu'une fois les fichiers effacés. `Alert` ne convient pas : il ne
 * sait pas demander un mot de passe sur Android.
 */
import { useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, View,
} from 'react-native';

import { deleteUser } from '../auth-client';
import { describeAuthError } from '../auth-errors';
import { logError, type ErrorView } from '../errors';
import { color, font, radius, space, text } from '../theme';
import { DangerButton, ErrorNotice, Eyebrow, PasswordField, SecondaryButton, TextLink } from './kit';
import { LegalLinks } from './LegalLinks';

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
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Eyebrow>Compte Tserohr</Eyebrow>
        <Text style={text.title}>Mon compte</Text>
        <Text style={text.lead}>
          Connecté en tant que <Text style={styles.email}>{email}</Text>.
        </Text>
      </View>

      <View style={styles.actions}>
        <SecondaryButton label="Se déconnecter" onPress={onSignOut} disabled={busy} />
        <TextLink label="Retour" onPress={onBack} disabled={busy} />
      </View>

      {consented && <WithdrawConsent busy={busy} onWithdraw={onWithdraw} />}

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle} accessibilityRole="header">Supprimer mon compte</Text>
        <Text style={styles.note}>
          Efface le compte, les sauvegardes déposées et les fusions enregistrées. Définitif.
        </Text>
        <DangerButton solid label="Supprimer mon compte" onPress={() => setConfirming(true)} disabled={busy} />
      </View>

      <DeleteDialog
        visible={confirming}
        email={email}
        onCancel={() => setConfirming(false)}
        onDeleted={() => { setConfirming(false); onDeleted(); }}
      />

      <LegalLinks />
    </ScrollView>
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
    <View style={styles.dangerZone}>
      <Text style={styles.sectionTitle} accessibilityRole="header">Fichiers gardés dans le compte</Text>
      <Text style={styles.note}>
        Tu as accepté que tes sauvegardes et tes fusions soient stockées dans ton compte. Retirer cet accord les efface
        toutes du serveur ; le compte, lui, reste.
      </Text>
      {asking ? (
        <>
          <DangerButton
            label={working ? 'Effacement…' : 'Retirer et effacer mes fichiers'}
            onPress={() => void confirm()}
            disabled={busy || working}
          />
          <TextLink label="Annuler" onPress={() => setAsking(false)} disabled={working} />
        </>
      ) : (
        <SecondaryButton label="Retirer mon accord" onPress={() => setAsking(true)} disabled={busy} />
      )}
      {error && <ErrorNotice error={error} onDismiss={() => setError(null)} />}
    </View>
  );
}

/** La confirmation : ce qui part, ce qui reste, et le mot de passe. */
function DeleteDialog({ visible, email, onCancel, onDeleted }: {
  visible: boolean;
  email: string;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorView | null>(null);

  const close = () => {
    if (busy) return;
    setPassword('');
    setError(null);
    onCancel();
  };

  const submit = async () => {
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
      setPassword('');
      onDeleted();
    } catch (err) {
      const view = describeAuthError({ message: err instanceof Error ? err.message : String(err) });
      setError(logError('suppression du compte', err, view));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.dialog} accessibilityViewIsModal>
          <ScrollView contentContainerStyle={styles.dialogBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.dialogTitle} accessibilityRole="header">Supprimer ton compte ?</Text>
            <Text style={text.lead}>
              Le compte <Text style={styles.email}>{email}</Text> sera supprimé, avec tout ce qu’il garde sur le serveur :
            </Text>
            <View style={styles.list}>
              <Text style={styles.item}>•  les sauvegardes déposées dans les emplacements A et B ;</Text>
              <Text style={styles.item}>•  toutes les fusions enregistrées dans l’historique du compte.</Text>
            </View>
            <Text style={styles.note}>
              Les fichiers déjà enregistrés sur ton téléphone ne sont pas touchés. La suppression est définitive.
            </Text>

            <PasswordField
              label="Mot de passe, pour confirmer"
              value={password}
              onChangeText={setPassword}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              editable={!busy}
            />

            {error && <ErrorNotice error={error} onDismiss={() => setError(null)} />}

            <DangerButton
              label={busy ? 'Suppression…' : 'Supprimer définitivement'}
              onPress={() => void submit()}
              disabled={busy || !password}
            />
            <TextLink label="Annuler" onPress={close} disabled={busy} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.screenTop, paddingHorizontal: space.gutter, paddingBottom: 32 },
  header: { gap: 6 },
  email: { fontFamily: font.sansSemi, color: color.inkSoft },
  actions: { gap: 16, marginTop: 26 },
  dangerZone: {
    gap: 12,
    marginTop: 48,
    paddingTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.border,
  },
  dangerTitle: { fontFamily: font.sansSemi, fontSize: 15, color: color.danger },
  sectionTitle: { fontFamily: font.sansSemi, fontSize: 15, color: color.inkSoft },
  note: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, color: color.muted },
  backdrop: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.35)' },
  dialog: { maxHeight: '90%', backgroundColor: color.card, borderRadius: radius.card },
  dialogBody: { gap: 16, padding: 24 },
  dialogTitle: { fontFamily: font.serif, fontSize: 24, lineHeight: 28, color: color.ink },
  list: { gap: 4 },
  item: { fontFamily: font.sans, fontSize: 15, lineHeight: 22, color: color.inkSoft },
});
