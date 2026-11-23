/**
 * Copie, une fois, tous les fichiers d'un bucket R2 vers un autre : ici, de
 * l'ancien bucket (juridiction par défaut, localisé en Amérique du Nord) vers
 * le bucket de juridiction UE.
 *
 * Les clés restent les mêmes (`backups/{userId}/…`, `merges/{userId}/…`) :
 * les lignes de la base, qui ne gardent que la clé, restent donc valables.
 * R2 ne copie pas d'une juridiction à l'autre : chaque objet est lu puis
 * réécrit, depuis la machine qui lance le script.
 *
 * Relançable : un objet déjà présent à la même taille est sauté. Rien n'est
 * effacé de la source ; on la vide à la main une fois la bascule vérifiée.
 *
 * Depuis `web/`, deux jetons R2 (lecture sur la source, écriture sur la cible) :
 *
 *     FROM_R2_ACCOUNT_ID=… FROM_R2_ACCESS_KEY_ID=… FROM_R2_SECRET_ACCESS_KEY=… \
 *     FROM_R2_BUCKET=tserohr-backups \
 *     TO_R2_ACCOUNT_ID=… TO_R2_ACCESS_KEY_ID=… TO_R2_SECRET_ACCESS_KEY=… \
 *     TO_R2_BUCKET=tserohr-backups-eu TO_R2_JURISDICTION=eu \
 *     bun scripts/move-r2.ts [--dry-run]
 *
 * Hors de Next : n'importe pas `lib/r2.ts`, réservé au serveur.
 */
import {
  GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client,
} from '@aws-sdk/client-s3';

interface Side { client: S3Client; bucket: string; label: string }

function side(prefix: 'FROM' | 'TO'): Side {
  const read = (name: string) => (process.env[`${prefix}_R2_${name}`] ?? '').trim();
  const account = read('ACCOUNT_ID');
  const accessKeyId = read('ACCESS_KEY_ID');
  const secretAccessKey = read('SECRET_ACCESS_KEY');
  const bucket = read('BUCKET');
  const jurisdiction = read('JURISDICTION').toLowerCase();
  if (!account || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(`${prefix}_R2_ACCOUNT_ID, _ACCESS_KEY_ID, _SECRET_ACCESS_KEY et _BUCKET sont requis`);
  }
  if (jurisdiction !== '' && jurisdiction !== 'eu') throw new Error(`${prefix}_R2_JURISDICTION : « eu » ou vide`);
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${account}${jurisdiction ? `.${jurisdiction}` : ''}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  return { client, bucket, label: `${bucket}${jurisdiction ? ` (${jurisdiction})` : ''}` };
}

async function sizeIn(to: Side, key: string): Promise<number | null> {
  try {
    const head = await to.client.send(new HeadObjectCommand({ Bucket: to.bucket, Key: key }));
    return head.ContentLength ?? null;
  } catch (err) {
    if ((err as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) return null;
    throw err;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const from = side('FROM');
  const to = side('TO');
  if (from.label === to.label) throw new Error('source et cible identiques');
  console.log(`${from.label} → ${to.label}${dryRun ? ' (à blanc)' : ''}`);

  let copied = 0;
  let skipped = 0;
  let bytes = 0;
  let token: string | undefined;
  do {
    const page = await from.client.send(new ListObjectsV2Command({ Bucket: from.bucket, ContinuationToken: token }));
    for (const object of page.Contents ?? []) {
      const key = object.Key!;
      const size = object.Size ?? 0;
      if (await sizeIn(to, key) === size) { skipped++; continue; }
      if (dryRun) { console.log(`à copier : ${key} (${size} octets)`); copied++; continue; }
      const got = await from.client.send(new GetObjectCommand({ Bucket: from.bucket, Key: key }));
      const body = await got.Body!.transformToByteArray();
      if (body.byteLength !== size) throw new Error(`${key} : ${body.byteLength} octets lus, ${size} attendus`);
      await to.client.send(new PutObjectCommand({
        Bucket: to.bucket,
        Key: key,
        Body: body,
        ContentLength: size,
        ContentType: got.ContentType,
      }));
      copied++;
      bytes += size;
      console.log(`copié : ${key}`);
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);

  console.log(`${copied} objet(s) ${dryRun ? 'à copier' : `copié(s), ${bytes} octets`}, ${skipped} déjà présent(s).`);
}

await main();
