/**
 * Les trois pages légales, en petits liens. Elles vivent sur le site : l'app
 * les ouvre dans le navigateur intégré, à l'adresse du serveur. Google Play
 * exige que la politique de confidentialité soit accessible depuis l'app.
 */
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { API_URL } from '../auth-client';
import { logError } from '../errors';
import { LEGAL_PAGES, type LegalHref } from '../legal';
import { TextLink } from './kit';

/** Ouvre une page légale du site. Un échec ne mérite qu'une trace. */
export function openLegalPage(href: LegalHref): void {
  WebBrowser.openBrowserAsync(`${API_URL}${href}`).catch((err: unknown) => logError(`ouverture de ${href}`, err));
}

export function LegalLinks() {
  return (
    <View style={styles.row} accessibilityLabel="Informations légales">
      {LEGAL_PAGES.map((page) => (
        <TextLink key={page.href} small quiet label={page.label} onPress={() => openLegalPage(page.href)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 18, rowGap: 6, marginTop: 28 },
});
