/**
 * Connexion et inscription par e-mail et mot de passe, confirmation de
 * l'adresse par un code reçu par e-mail, et mot de passe oublié.
 *
 * Le compte reste facultatif : la fusion marche sans. Il sert à retrouver ses
 * sauvegardes et ses fusions d'un appareil à l'autre. La session est gardée
 * dans le trousseau du téléphone et survit au redémarrage de l'app.
 *
 * Le déroulé (étapes, appels, renvoi du code) est celui du site :
 * `useAccountFlow`, dans `src/account-flow.ts`.
 */
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { codeSentLead, resendLabel, useAccountFlow, type AccountClient, type AccountStep } from '../account-flow';
import { emailOtp, signIn, signUp } from '../auth-client';
import { MIN_PASSWORD } from '../auth-errors';
import { color, font, space, text } from '../theme';
import { ErrorNotice, Eyebrow, OtpField, PasswordField, PrimaryButton, Segmented, TextField, TextLink } from './kit';
import { LegalLinks, openLegalPage } from './LegalLinks';

const MODES = [
  { value: 'sign-in', label: 'Se connecter' },
  { value: 'sign-up', label: 'Créer un compte' },
] as const;

const client: AccountClient = {
  signIn: (body) => signIn.email(body),
  signUp: (body) => signUp.email(body),
  verifyEmail: (body) => emailOtp.verifyEmail(body),
  sendVerificationOtp: ({ email }) => emailOtp.sendVerificationOtp({ email, type: 'email-verification' }),
  requestPasswordReset: (body) => emailOtp.requestPasswordReset(body),
  resetPassword: (body) => emailOtp.resetPassword(body),
};

const TITLES: Record<AccountStep, string> = {
  'sign-in': 'Se connecter',
  'sign-up': 'Créer un compte',
  verify: 'Confirme ton adresse',
  'forgot-email': 'Mot de passe oublié',
  'forgot-reset': 'Nouveau mot de passe',
};

const ACTIONS: Record<AccountStep, string> = {
  'sign-in': 'Se connecter',
  'sign-up': 'Créer mon compte',
  verify: 'Confirmer',
  'forgot-email': 'Recevoir un code',
  'forgot-reset': 'Changer le mot de passe',
};

const LEAD = 'Pour retrouver tes sauvegardes et tes fusions sur tous tes appareils. La fusion, elle, marche sans compte.';

export function AccountScreen({ onDone }: { onDone: () => void }) {
  const flow = useAccountFlow(client, onDone);
  const { step, busy } = flow;
  const entering = step === 'sign-in' || step === 'sign-up';
  const codeStep = step === 'verify' || step === 'forgot-reset';
  const submit = () => void flow.submit();

  const lead = codeStep
    ? codeSentLead(step, flow.email)
    : step === 'forgot-email'
      ? 'Saisis l’adresse de ton compte : tu y recevras un code pour choisir un nouveau mot de passe.'
      : LEAD;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Eyebrow>Compte Tserohr</Eyebrow>
          <Text style={text.title}>{TITLES[step]}</Text>
          <Text style={text.lead}>{lead}</Text>
        </View>

        <View style={styles.form}>
          {entering && <Segmented options={MODES} value={step} onChange={flow.go} disabled={busy} />}

          {(entering || step === 'forgot-email') && (
            <TextField
              label="Adresse e-mail"
              value={flow.email}
              onChangeText={flow.setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType={step === 'forgot-email' ? 'go' : 'next'}
              onSubmitEditing={step === 'forgot-email' ? submit : undefined}
              editable={!busy}
            />
          )}

          {codeStep && (
            <OtpField
              key={step}
              label="Code reçu par e-mail"
              value={flow.otp}
              onChangeText={flow.setOtp}
              onSubmitEditing={step === 'verify' ? submit : undefined}
              editable={!busy}
              autoFocus
            />
          )}

          {step === 'sign-in' && (
            <>
              <PasswordField
                label="Mot de passe"
                value={flow.password}
                onChangeText={flow.setPassword}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={submit}
                editable={!busy}
              />
              <View style={styles.forgot}>
                <TextLink label="Mot de passe oublié ?" small onPress={() => flow.go('forgot-email')} disabled={busy} />
              </View>
            </>
          )}

          {(step === 'sign-up' || step === 'forgot-reset') && (
            <>
              <PasswordField
                label={step === 'sign-up' ? 'Mot de passe' : 'Nouveau mot de passe'}
                value={flow.password}
                onChangeText={flow.setPassword}
                autoComplete="new-password"
                textContentType="newPassword"
                hint={`${MIN_PASSWORD} caractères au moins.`}
                returnKeyType="next"
                editable={!busy}
              />
              <PasswordField
                label="Confirmer le mot de passe"
                value={flow.confirmation}
                onChangeText={flow.setConfirmation}
                autoComplete="new-password"
                textContentType="newPassword"
                error={flow.mismatch}
                returnKeyType="go"
                onSubmitEditing={submit}
                editable={!busy}
              />
            </>
          )}

          {step === 'sign-up' && (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: flow.accepted, disabled: busy }}
              disabled={busy}
              onPress={() => flow.setAccepted(!flow.accepted)}
              style={({ pressed }) => [styles.agree, pressed && styles.pressed]}
            >
              <View style={[styles.box, flow.accepted && styles.boxOn]}>
                {flow.accepted && <Text style={styles.boxMark}>✓</Text>}
              </View>
              <Text style={styles.agreeLabel}>
                J’ai 15 ans ou plus, et j’accepte les{' '}
                <Text style={styles.inlineLink} onPress={() => openLegalPage('/cgu')}>CGU</Text> et la{' '}
                <Text style={styles.inlineLink} onPress={() => openLegalPage('/confidentialite')}>
                  politique de confidentialité
                </Text>.
              </Text>
            </Pressable>
          )}

          {flow.error && <ErrorNotice error={flow.error} onDismiss={flow.dismissError} />}

          <PrimaryButton label={busy ? 'Un instant…' : ACTIONS[step]} onPress={submit} disabled={busy || !flow.ready} />

          {codeStep && (
            <TextLink
              label={resendLabel(flow.resendRemaining)}
              onPress={() => void flow.resend()}
              disabled={busy || flow.resendRemaining > 0}
            />
          )}
          {step === 'verify' && <TextLink label="Changer d’adresse" onPress={flow.leaveVerify} disabled={busy} />}
          {(step === 'forgot-email' || step === 'forgot-reset') && (
            <TextLink label="Retour à la connexion" onPress={() => flow.go('sign-in')} disabled={busy} />
          )}
          {entering && <TextLink label="Continuer sans compte" onPress={onDone} disabled={busy} />}
        </View>

        <LegalLinks />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingTop: space.screenTop, paddingHorizontal: space.gutter, paddingBottom: 24 },
  header: { gap: 6 },
  form: { gap: 16, marginTop: 26 },
  // « Mot de passe oublié ? », à droite sous le champ.
  forgot: { alignItems: 'flex-end', marginTop: -6 },

  // La case d'accord, comme « Garder aussi dans le compte » sur l'accueil.
  agree: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  pressed: { opacity: 0.7 },
  box: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: color.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: color.accent, borderColor: color.accent },
  boxMark: { fontFamily: font.sansSemi, fontSize: 13, lineHeight: 15, color: color.onAccent },
  agreeLabel: { flexShrink: 1, fontFamily: font.sans, fontSize: 14, lineHeight: 20, color: color.inkSoft },
  inlineLink: { color: color.accent, textDecorationLine: 'underline' },
});
