import type { Metadata } from 'next';
import Link from 'next/link';

import { LegalPage } from '@/components/LegalPage';
import { EDITOR } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Mentions légales · Tserohr',
  description: 'Éditeur, hébergeur et contact du site et de l’application Tserohr.',
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" path="/mentions-legales">
      <h2>Éditeur</h2>
      <p>
        Le site tserohr.com et l’application Tserohr sont édités à titre non professionnel par un particulier,{' '}
        {EDITOR.name}, qui en est aussi le directeur de la publication. Le service est gratuit, sans publicité ni
        abonnement.
      </p>
      <p>
        Comme la loi pour la confiance dans l’économie numérique le permet à un éditeur non professionnel, son adresse
        et son téléphone ne sont pas publiés : ils ont été communiqués à l’hébergeur ci-dessous. Pour le joindre :{' '}
        <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>.
      </p>

      <h2>Hébergement</h2>
      <p>Le site et son serveur sont hébergés par :</p>
      <ul>
        <li>
          Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis —{' '}
          <a href="https://vercel.com/contact">vercel.com/contact</a> —{' '}
          <a href="mailto:privacy@vercel.com">privacy@vercel.com</a>
        </li>
      </ul>
      <p>Vercel ne publie pas de numéro de téléphone : il se joint par son formulaire de contact ou par e-mail.</p>
      <p>Autres prestataires techniques :</p>
      <ul>
        <li>
          Fichiers déposés, stockés dans l’Union européenne : Cloudflare, Inc. (service R2), 101 Townsend St, San
          Francisco, CA 94107, États-Unis —{' '}
          <a href="https://www.cloudflare.com">cloudflare.com</a>
        </li>
        <li>
          Base de données : Neon, LLC (groupe Databricks), États-Unis — <a href="https://neon.com">neon.com</a>
        </li>
      </ul>

      <h2>Indépendance</h2>
      <p>
        Tserohr est un outil indépendant. Il n’est ni affilié à, ni approuvé par, ni lié à Watch Tower Bible and
        Tract Society of Pennsylvania ou à jw.org. « JW Library » est une marque de son propriétaire, citée
        uniquement pour décrire le format de fichier pris en charge.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Le code, le nom, le logo et les textes de Tserohr appartiennent à leur auteur, {EDITOR.name}, sauf mention
        contraire.
        Les fichiers déposés par les utilisateurs restent leur propriété.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Voir la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question ou pour signaler un contenu : <a href={`mailto:${EDITOR.email}`}>{EDITOR.email}</a>.
      </p>
    </LegalPage>
  );
}
