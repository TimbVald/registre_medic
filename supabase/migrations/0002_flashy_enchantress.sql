CREATE TYPE "public"."depistage_type" AS ENUM('Anténatal', 'Néonatal', 'Post-natal');--> statement-breakpoint
CREATE TYPE "public"."famille_lien" AS ENUM('Fratrie', 'Famille paternelle', 'Famille maternelle');--> statement-breakpoint
CREATE TYPE "public"."nb_cas" AS ENUM('01', '02', '03', '04', 'Plus');--> statement-breakpoint
CREATE TABLE "antecedents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"age_decouverte_annees" integer,
	"age_decouverte_mois" integer,
	"circonstances_decouverte" text[],
	"type_depistage" "depistage_type",
	"notion_famille_drepanocytose" boolean DEFAULT false,
	"liens_famille" "famille_lien"[],
	"nb_freres_soeurs_drepanocytaires" "nb_cas",
	"deces_famille_drepanocytose" boolean DEFAULT false,
	"nb_deces_famille" "nb_cas",
	"complications_aigues" text[],
	"complications_chroniques" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "antecedents" ADD CONSTRAINT "antecedents_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;