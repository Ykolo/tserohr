-- Accords datés : CGU acceptées à l'inscription, consentement explicite
-- (art. 9 RGPD) avant tout dépôt de fichier. Les comptes existants n'ont donné
-- ni l'un ni l'autre : ils resteront à null, et l'app comme le site leur
-- demanderont le consentement avant leur prochain dépôt.
ALTER TABLE "user" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
ALTER TABLE "user" ADD COLUMN "sensitiveConsentAt" TIMESTAMP(3);
