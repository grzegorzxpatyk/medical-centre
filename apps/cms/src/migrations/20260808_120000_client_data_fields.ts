import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Schema changes needed to hold the practice's real details:
 *
 * - `doctors.order` — the collection lists all personnel, and Payload's default
 *   `-createdAt` sort would show them newest-first instead of in the order the
 *   practice gave.
 * - `dane_ogolne.legal_name` — the registered name ("… Sp. z o.o.") is too long
 *   for the header logo, so the footer copyright carries it separately.
 * - `dane_ogolne.email` becomes nullable — the practice registers patients by
 *   phone only and publishes no address.
 *
 * Column defaults are updated alongside the field defaults in the configs, so a
 * database that has never had the global saved still serves correct values.
 *
 * Hand-written to match the schema `push` produces in development; the migration
 * snapshots in this directory are stale, so `payload migrate:create` would emit a
 * diff of unrelated collections alongside this change.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0;

  ALTER TABLE "dane_ogolne" ADD COLUMN IF NOT EXISTS "legal_name" varchar;

  ALTER TABLE "dane_ogolne" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "dane_ogolne" ALTER COLUMN "email" DROP DEFAULT;

  ALTER TABLE "dane_ogolne" ALTER COLUMN "name" SET DEFAULT 'Gabinet Lekarza Rodzinnego Zielonki';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "tagline" SET DEFAULT 'Podstawowa opieka zdrowotna';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "description" SET DEFAULT 'Zapewniamy opiekę lekarza rodzinnego, pediatry i radiologa oraz opiekę pielęgniarki środowiskowej mieszkańcom Zielonek i okolic.';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "opening_hours" SET DEFAULT 'Pon - Pt: 8:00 - 18:00';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "phone" SET DEFAULT '12 285 01 12';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "address" SET DEFAULT 'ul. Galicyjska 15, 32-087 Zielonki';

  ALTER TABLE "dane_ogolne" ALTER COLUMN "social_facebook" DROP DEFAULT;
  ALTER TABLE "dane_ogolne" ALTER COLUMN "social_instagram" DROP DEFAULT;
  ALTER TABLE "dane_ogolne" ALTER COLUMN "social_maps" DROP DEFAULT;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctors" DROP COLUMN IF EXISTS "order";

  ALTER TABLE "dane_ogolne" DROP COLUMN IF EXISTS "legal_name";

  UPDATE "dane_ogolne" SET "email" = 'rejestracja@osrodekzdrowia.pl' WHERE "email" IS NULL;
  ALTER TABLE "dane_ogolne" ALTER COLUMN "email" SET DEFAULT 'rejestracja@osrodekzdrowia.pl';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "email" SET NOT NULL;

  ALTER TABLE "dane_ogolne" ALTER COLUMN "name" SET DEFAULT 'Ośrodek Zdrowia';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "tagline" SET DEFAULT 'Twoje zdrowie w dobrych rękach';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "description" SET DEFAULT 'Zapewniamy kompleksową opiekę medyczną dla Ciebie i Twojej rodziny.';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "opening_hours" SET DEFAULT 'Pon - Pt: 7:00 - 18:00';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "phone" SET DEFAULT '123 456 789';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "address" SET DEFAULT 'ul. Zdrowa 1, 00-000 Twoje Miasto';

  ALTER TABLE "dane_ogolne" ALTER COLUMN "social_facebook" SET DEFAULT 'https://facebook.com';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "social_instagram" SET DEFAULT 'https://instagram.com';
  ALTER TABLE "dane_ogolne" ALTER COLUMN "social_maps" SET DEFAULT 'https://maps.google.com';`)
}
