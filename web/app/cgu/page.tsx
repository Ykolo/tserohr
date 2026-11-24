import type { Metadata } from 'next';
import Link from 'next/link';

import { LegalPage } from '@/components/LegalPage';
import { EDITOR } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Conditions générales d’utilisation · Tserohr',
  description: 'Les règles d’utilisation du site et de l’application Tserohr.',
};

export default function Cgu() {
  return (
    <LegalPage title="Conditions générales d’utilisation" path="/cgu">
      <h2>1. Objet</h2>
      <p>
        Ces conditions encadrent l’utilisation du site tserohr.com et de l’application Tserohr (ensemble, « le
        service »), édités à titre non professionnel par {EDITOR.name}. Elles sont acceptées à la création d’un
        compte ; utiliser le service sans compte vaut aussi acceptation.
      </p>

      <h2>2. Le service</h2>
      <p>
        Tserohr fusionne deux sauvegardes JW Library (<code>.jwlibrary</code>) en une seule. La fusion se fait sur
        votre appareil. Un compte facultatif permet de déposer des sauvegardes et de retrouver ses fusions sur
        plusieurs appareils.
      </p>
      <p>
        Le service est gratuit. Tserohr est un outil indépendant, sans lien avec Watch Tower Bible and Tract Society
        of Pennsylvania ni avec jw.org.
      </p>

      <h2>3. Compte</h2>
      <ul>
        <li>Le compte est réservé aux personnes de 15 ans et plus.</li>
        <li>
          Garder des fichiers dans le compte demande un accord explicite à leur stockage, qui peut être retiré à tout
          moment depuis « Mon compte » ; les fichiers sont alors effacés.
        </li>
        <li>Vous fournissez une adresse e-mail valide et gardez votre mot de passe confidentiel.</li>
        <li>
          Vous pouvez supprimer votre compte à tout moment depuis « Mon compte ». Tous vos fichiers sont alors
          effacés.
        </li>
      </ul>

      <h2>4. Utilisation</h2>
      <p>Vous vous engagez à :</p>
      <ul>
        <li>ne déposer que vos propres sauvegardes, ou celles d’une personne qui vous y a autorisé ;</li>
        <li>ne pas déposer d’autres types de fichiers ;</li>
        <li>
          ne pas tenter de contourner les limites, d’accéder aux données d’autres utilisateurs ou de perturber le
          service.
        </li>
      </ul>
      <p>
        Limites actuelles : 30 fusions conservées par compte, 20 envois par heure. Les sauvegardes déposées sont
        effacées au bout de 30 jours. Ces limites peuvent évoluer.
      </p>

      <h2>5. Vos fichiers</h2>
      <p>
        Vous restez propriétaire de vos fichiers. Vous autorisez seulement leur stockage et leur transmission vers vos
        appareils, pour faire fonctionner le service.
      </p>
      <p>
        Avant de restaurer une fusion dans JW Library, gardez une copie de vos sauvegardes d’origine. La restauration
        remplace les données de l’appareil.
      </p>

      <h2>6. Disponibilité et responsabilité</h2>
      <p>
        Le service est fourni gratuitement et en l’état. L’éditeur fait de son mieux pour qu’il fonctionne
        correctement, mais ne garantit pas une disponibilité continue ni l’absence d’erreur. Il peut interrompre le
        service pour maintenance.
      </p>
      <p>
        L’éditeur n’est pas responsable d’une perte de données due à une mauvaise utilisation, à l’absence de copie de
        sauvegarde ou à une évolution du format JW Library, sauf faute de sa part.
      </p>

      <h2>7. Suspension</h2>
      <p>
        En cas de non-respect de ces conditions, l’éditeur peut suspendre ou supprimer un compte, après avoir prévenu
        l’utilisateur par e-mail lorsque c’est possible.
      </p>

      <h2>8. Données personnelles</h2>
      <p>
        Voir la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>9. Modifications</h2>
      <p>
        Ces conditions peuvent évoluer. En cas de changement important, les utilisateurs ayant un compte seront
        prévenus par e-mail.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Ces conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant
        toute action. Contact : <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>.
      </p>
    </LegalPage>
  );
}
