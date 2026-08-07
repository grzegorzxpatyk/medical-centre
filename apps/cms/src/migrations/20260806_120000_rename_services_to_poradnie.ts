import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The `services` collection only ever modelled poradnie, so it is renamed
 * rather than dropped and recreated — existing rows are preserved.
 *
 * Hand-written: `payload migrate:create` cannot tell a rename from a
 * drop + create and would throw the data away.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_services_icon" RENAME TO "enum_poradnie_icon";
  ALTER TABLE "services" RENAME TO "poradnie";
  ALTER SEQUENCE "services_id_seq" RENAME TO "poradnie_id_seq";
  ALTER INDEX "services_pkey" RENAME TO "poradnie_pkey";
  ALTER INDEX "services_slug_idx" RENAME TO "poradnie_slug_idx";
  ALTER INDEX "services_updated_at_idx" RENAME TO "poradnie_updated_at_idx";
  ALTER INDEX "services_created_at_idx" RENAME TO "poradnie_created_at_idx";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "services_id" TO "poradnie_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME CONSTRAINT "payload_locked_documents_rels_services_fk" TO "payload_locked_documents_rels_poradnie_fk";
  ALTER INDEX "payload_locked_documents_rels_services_id_idx" RENAME TO "payload_locked_documents_rels_poradnie_id_idx";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_poradnie_icon" RENAME TO "enum_services_icon";
  ALTER TABLE "poradnie" RENAME TO "services";
  ALTER SEQUENCE "poradnie_id_seq" RENAME TO "services_id_seq";
  ALTER INDEX "poradnie_pkey" RENAME TO "services_pkey";
  ALTER INDEX "poradnie_slug_idx" RENAME TO "services_slug_idx";
  ALTER INDEX "poradnie_updated_at_idx" RENAME TO "services_updated_at_idx";
  ALTER INDEX "poradnie_created_at_idx" RENAME TO "services_created_at_idx";
  ALTER TABLE "payload_locked_documents_rels" RENAME COLUMN "poradnie_id" TO "services_id";
  ALTER TABLE "payload_locked_documents_rels" RENAME CONSTRAINT "payload_locked_documents_rels_poradnie_fk" TO "payload_locked_documents_rels_services_fk";
  ALTER INDEX "payload_locked_documents_rels_poradnie_id_idx" RENAME TO "payload_locked_documents_rels_services_id_idx";`)
}
