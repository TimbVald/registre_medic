CREATE TYPE "public"."type_consultation" AS ENUM('Systématique');--> statement-breakpoint
ALTER TYPE "public"."mode_rappel" ADD VALUE 'Email';--> statement-breakpoint
CREATE TABLE "hospitalisations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"date_hospitalisation" date DEFAULT now() NOT NULL,
	"age_patient" integer,
	"temperature" varchar(10),
	"fc" varchar(10),
	"fr" varchar(10),
	"pa" varchar(20),
	"sao2" varchar(10),
	"plaintes_exist" boolean DEFAULT false,
	"details_plaintes" jsonb,
	"traitement_acide_folique" jsonb,
	"traitement_hydroxyuree" jsonb,
	"traitement_antibio_prophylaxie" jsonb,
	"traitement_hydratation" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"consultation_id" uuid,
	"type" varchar(50) NOT NULL,
	"destinataire" varchar(255) NOT NULL,
	"statut" varchar(50) NOT NULL,
	"message_id" varchar(255),
	"erreur" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consultations_externes" ADD COLUMN "type_consultation" "type_consultation" NOT NULL;--> statement-breakpoint
ALTER TABLE "hospitalisations" ADD CONSTRAINT "hospitalisations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications_logs" ADD CONSTRAINT "notifications_logs_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications_logs" ADD CONSTRAINT "notifications_logs_consultation_id_consultations_externes_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations_externes"("id") ON DELETE set null ON UPDATE no action;