import type { Metadata } from 'next';

import { LegalPage, LegalTable } from '@/components/LegalPage';
import { EDITOR } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Politique de confidentialité · Tserohr',
  description: 'Quelles données Tserohr traite, pourquoi, combien de temps, et quels sont vos droits.',
};

export default function Confidentialite() {
  const mail = <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>;

  return (
    <LegalPage title="Politique de confidentialité" path="/confidentialite">
      <p>Cette politique explique quelles données Tserohr traite, pourquoi, et quels sont vos droits.</p>

      <h2>Responsable du traitement</h2>
      <p>{EDITOR.name}, particulier, joignable à {mail}.</p>

      <h2>En bref</h2>
      <ul>
        <li>Sans compte, la fusion se fait entièrement sur votre appareil. Vos fichiers ne sont envoyés nulle part.</li>
        <li>
          Avec un compte, vos fichiers sont stockés pour que vous les retrouviez sur vos autres appareils. Le serveur
          ne les ouvre jamais.
        </li>
        <li>Pas de publicité, pas de revente, pas de profilage.</li>
      </ul>

      <h2>Données traitées</h2>
      <LegalTable
        head={['Données', 'Pourquoi', 'Base légale', 'Durée de conservation']}
        rows={[
          [
            'Adresse e-mail, mot de passe (stocké chiffré par hachage)',
            'Créer et sécuriser votre compte',
            'Exécution du service (art. 6.1.b RGPD)',
            'Jusqu’à la suppression du compte',
          ],
          [
            'Compte dont l’adresse n’a jamais été confirmée',
            'Finir l’inscription',
            'Exécution du service',
            '7 jours, puis effacé',
          ],
          [
            'Dates d’acceptation des CGU et du consentement au stockage des fichiers',
            'Prouver votre accord',
            'Obligation légale (art. 7.1 RGPD)',
            'Jusqu’à la suppression du compte ; celle du consentement, jusqu’à son retrait',
          ],
          [
            'Codes envoyés par e-mail (stockés sous forme d’empreinte)',
            'Vérifier l’adresse, réinitialiser le mot de passe',
            'Exécution du service',
            '10 minutes, puis effacés sous 24 heures',
          ],
          [
            'Sessions : adresse IP, type d’appareil et de navigateur',
            'Garder la connexion, détecter les abus',
            'Intérêt légitime (sécurité)',
            'Jusqu’à l’expiration de la session, puis effacées sous 24 heures',
          ],
          [
            'Compteurs anti-abus : adresse IP, ou empreinte de l’adresse e-mail',
            'Limiter les tentatives de connexion, d’envoi de codes et de dépôt',
            'Intérêt légitime (sécurité)',
            '24 heures au plus',
          ],
          [
            <>Fichiers <code>.jwlibrary</code> déposés et fusions</>,
            'Synchroniser et retrouver vos sauvegardes',
            'Consentement explicite (art. 9.2.a RGPD)',
            'Sauvegardes : 30 jours. Fusions : les 30 plus récentes, jusqu’à leur suppression, le retrait du consentement ou la suppression du compte',
          ],
          [
            'Métadonnées des fichiers : nom, taille, empreinte SHA-256, appareil',
            'Afficher l’historique, éviter les doublons',
            'Exécution du service',
            'Comme le fichier correspondant',
          ],
          [
            'Journaux techniques de l’hébergeur',
            'Faire fonctionner et sécuriser le service',
            'Intérêt légitime',
            'Selon la politique de l’hébergeur',
          ],
        ]}
      />

      <h2>Données sensibles</h2>
      <p>
        Une sauvegarde JW Library peut contenir vos notes, surlignages, marque-pages et historique de lecture. Ces
        informations peuvent révéler des convictions religieuses, ce qui en fait des données sensibles au sens de
        l’article 9 du RGPD.
      </p>
      <p>C’est pourquoi :</p>
      <ul>
        <li>
          nous vous demandons un consentement explicite avant votre premier dépôt, et en gardons la date. Sans lui,
          le serveur refuse tout envoi ;
        </li>
        <li>la fusion se fait sur votre appareil et le serveur n’ouvre jamais vos fichiers ;</li>
        <li>
          les fichiers sont envoyés et téléchargés par des liens temporaires (10 minutes pour l’envoi, 5 minutes pour
          le téléchargement) ;
        </li>
        <li>
          vous pouvez retirer votre consentement à tout moment depuis « Mon compte » (« Retirer mon accord ») : tous
          vos fichiers sont alors effacés du serveur, et le compte reste. Supprimer le compte le retire aussi. Le
          retrait ne remet pas en cause ce qui a été fait avant.
        </li>
      </ul>
      <p>Vous pouvez aussi utiliser Tserohr sans compte : rien ne quitte alors votre appareil.</p>

      <h2>Sous-traitants</h2>
      <LegalTable
        head={['Prestataire', 'Rôle', 'Localisation']}
        rows={[
          ['Vercel', 'Hébergement du site et du serveur', 'Serveur à Francfort (UE) ; société établie aux États-Unis'],
          ['Neon (groupe Databricks)', 'Base de données (comptes et métadonnées)', 'Francfort (UE) ; société établie aux États-Unis'],
          ['Cloudflare (R2)', 'Stockage des fichiers déposés', 'Union européenne (juridiction UE) ; société établie aux États-Unis'],
          ['Resend', 'Envoi des e-mails (codes de vérification)', 'États-Unis'],
        ]}
      />
      <p>
        Lorsque des données sont traitées hors de l’Union européenne, le transfert est encadré par le cadre de
        protection des données UE–États-Unis (Data Privacy Framework) ou par les clauses contractuelles types de la
        Commission européenne.
      </p>

      <h2>Sécurité</h2>
      <ul>
        <li>Connexions chiffrées (HTTPS).</li>
        <li>Mots de passe hachés, jamais stockés en clair.</li>
        <li>Fichiers chiffrés au repos par le prestataire de stockage.</li>
        <li>Emplacements des fichiers construits par le serveur, jamais fournis par l’appareil.</li>
        <li>Limites d’envoi pour empêcher les abus.</li>
      </ul>

      <h2>Cookies</h2>
      <p>Tserohr utilise uniquement un cookie de session, nécessaire pour rester connecté. Il est exempté de consentement.</p>
      <p>
        Aucun outil de mesure d’audience, de publicité ou de suivi n’est utilisé. Le site garde dans votre navigateur
        l’historique de vos fusions, pour vous seul : il n’est envoyé nulle part.
      </p>

      <h2>Mineurs</h2>
      <p>
        Le compte est réservé aux personnes de 15 ans et plus, ce que l’inscription fait confirmer. L’utilisation
        sans compte reste possible à tout âge.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez accéder à vos données, les corriger, les effacer, les récupérer, vous opposer à un traitement ou
        retirer votre consentement.
      </p>
      <ul>
        <li>Supprimer votre compte et tous vos fichiers : écran « Mon compte ».</li>
        <li>Retirer votre consentement et effacer vos fichiers, en gardant le compte : « Mon compte », « Retirer mon accord ».</li>
        <li>Télécharger vos fichiers : historique des sauvegardes.</li>
        <li>Pour toute autre demande : {mail}. Réponse sous un mois.</li>
      </ul>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (
        <a href="https://www.cnil.fr">cnil.fr</a>).
      </p>

      <h2>Modifications</h2>
      <p>En cas de changement important, les utilisateurs ayant un compte seront prévenus par e-mail.</p>
    </LegalPage>
  );
}
