import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the `dane-ogolne` global — site-wide contact details and navigation that
 * used to be hard-coded in apps/web/src/lib/site-config.ts.
 *
 * Column defaults mirror the field defaults in the global's config, so a
 * database that has never had the document saved still serves the values the
 * site shipped with.
 *
 * Hand-written to match the schema `push` produced in development; the
 * migration snapshots in this directory are stale, so `payload migrate:create`
 * would emit a diff of unrelated collections alongside this change.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "dane_ogolne_main_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "dane_ogolne_top_bar_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "dane_ogolne_patient_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "dane_ogolne" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Ośrodek Zdrowia' NOT NULL,
  	"tagline" varchar DEFAULT 'Twoje zdrowie w dobrych rękach' NOT NULL,
  	"description" varchar DEFAULT 'Zapewniamy kompleksową opiekę medyczną dla Ciebie i Twojej rodziny.' NOT NULL,
  	"opening_hours" varchar DEFAULT 'Pon - Pt: 7:00 - 18:00' NOT NULL,
  	"phone" varchar DEFAULT '123 456 789' NOT NULL,
  	"email" varchar DEFAULT 'rejestracja@osrodekzdrowia.pl' NOT NULL,
  	"address" varchar DEFAULT 'ul. Zdrowa 1, 00-000 Twoje Miasto' NOT NULL,
  	"social_facebook" varchar DEFAULT 'https://facebook.com',
  	"social_instagram" varchar DEFAULT 'https://instagram.com',
  	"social_maps" varchar DEFAULT 'https://maps.google.com',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "dane_ogolne_main_nav" ADD CONSTRAINT "dane_ogolne_main_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dane_ogolne"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dane_ogolne_top_bar_nav" ADD CONSTRAINT "dane_ogolne_top_bar_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dane_ogolne"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dane_ogolne_patient_nav" ADD CONSTRAINT "dane_ogolne_patient_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dane_ogolne"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "dane_ogolne_main_nav_order_idx" ON "dane_ogolne_main_nav" USING btree ("_order");
  CREATE INDEX "dane_ogolne_main_nav_parent_id_idx" ON "dane_ogolne_main_nav" USING btree ("_parent_id");
  CREATE INDEX "dane_ogolne_top_bar_nav_order_idx" ON "dane_ogolne_top_bar_nav" USING btree ("_order");
  CREATE INDEX "dane_ogolne_top_bar_nav_parent_id_idx" ON "dane_ogolne_top_bar_nav" USING btree ("_parent_id");
  CREATE INDEX "dane_ogolne_patient_nav_order_idx" ON "dane_ogolne_patient_nav" USING btree ("_order");
  CREATE INDEX "dane_ogolne_patient_nav_parent_id_idx" ON "dane_ogolne_patient_nav" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "dane_ogolne_main_nav" CASCADE;
  DROP TABLE "dane_ogolne_top_bar_nav" CASCADE;
  DROP TABLE "dane_ogolne_patient_nav" CASCADE;
  DROP TABLE "dane_ogolne" CASCADE;`)
}
