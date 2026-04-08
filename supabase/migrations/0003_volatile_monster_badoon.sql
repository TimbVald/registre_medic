CREATE TYPE "public"."cause_non_realisation" AS ENUM('Manque d''argent', 'Distance/Transport difficile', 'Manque de compréhension de l''utilité', 'Manque de temps/Travail', 'Charge familiale', 'Manque de rappel', 'Autre');--> statement-breakpoint
CREATE TYPE "public"."conclusion_traitement" AS ENUM('Adhérence', 'Compliance', 'Observance');--> statement-breakpoint
CREATE TYPE "public"."etat_general" AS ENUM('Satisfaisant', 'Non satisfaisant');--> statement-breakpoint
CREATE TYPE "public"."frequence_rappel" AS ENUM('01 fois/sem.', '02 fois/sem.', '03 fois/sem.');--> statement-breakpoint
CREATE TYPE "public"."interpretation_asat_alat" AS ENUM('Normal', 'Augmenté (Cytolyse hépatite)');--> statement-breakpoint
CREATE TYPE "public"."interpretation_gb" AS ENUM('Normal', 'Diminué (Leucopénie)', 'Augmenté (Leucocytose)');--> statement-breakpoint
CREATE TYPE "public"."interpretation_hemo" AS ENUM('Normal', 'Diminué (Anémie)', 'Augmenté (Polyglobulie)');--> statement-breakpoint
CREATE TYPE "public"."interpretation_plaq" AS ENUM('Normal', 'Diminué (Thrombopénie)', 'Augmenté (Thrombocytose)');--> statement-breakpoint
CREATE TYPE "public"."interpretation_retic" AS ENUM('Normal', 'Diminué (Production médullaire insuffisante)', 'Augmenté (Réponse médullaire accrue)');--> statement-breakpoint
CREATE TYPE "public"."mode_rappel" AS ENUM('SMS classique', 'Appel classique', 'WhatsApp (SMS)');--> statement-breakpoint
CREATE TYPE "public"."rdv_honore" AS ENUM('Oui', 'Non');--> statement-breakpoint
CREATE TYPE "public"."regularite_traitement" AS ENUM('Régulier', 'Irrégulier');--> statement-breakpoint
CREATE TABLE "consultations_externes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"date_consultation" date DEFAULT now() NOT NULL,
	"etat_general" "etat_general",
	"temperature" varchar(10),
	"fc" varchar(10),
	"fr" varchar(10),
	"pa" varchar(20),
	"sao2" varchar(10),
	"plaintes_exist" boolean DEFAULT false,
	"plaintes_details" text[],
	"plaintes_autre" text,
	"date_rdv_prevue" date,
	"rdv_honore" "rdv_honore",
	"rappel_frequence" "frequence_rappel",
	"rappel_reception" boolean DEFAULT false,
	"rappel_retour" boolean DEFAULT false,
	"rappel_mode" "mode_rappel",
	"cause_non_honore" text,
	"traitement_acide_folique" jsonb,
	"traitement_hydroxyuree" jsonb,
	"traitement_antibio_prophylaxie" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "examens_paracliniques" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"hemo_realise" boolean DEFAULT false,
	"hemo_cause" "cause_non_realisation",
	"hemo_taux_base" varchar(100),
	"hemo_taux_recent" varchar(100),
	"hemo_interpretation" "interpretation_hemo",
	"retic_realise" boolean DEFAULT false,
	"retic_cause" "cause_non_realisation",
	"retic_taux_base" varchar(100),
	"retic_taux_recent" varchar(100),
	"retic_interpretation" "interpretation_retic",
	"gb_realise" boolean DEFAULT false,
	"gb_cause" "cause_non_realisation",
	"gb_taux_base" varchar(100),
	"gb_taux_recent" varchar(100),
	"gb_interpretation" "interpretation_gb",
	"plaq_realise" boolean DEFAULT false,
	"plaq_cause" "cause_non_realisation",
	"plaq_taux_base" varchar(100),
	"plaq_taux_recent" varchar(100),
	"plaq_interpretation" "interpretation_plaq",
	"asat_alat_realise" boolean DEFAULT false,
	"asat_alat_cause" "cause_non_realisation",
	"asat_alat_taux_base" varchar(100),
	"asat_alat_interpretation" "interpretation_asat_alat",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "consultations_externes" ADD CONSTRAINT "consultations_externes_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examens_paracliniques" ADD CONSTRAINT "examens_paracliniques_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;