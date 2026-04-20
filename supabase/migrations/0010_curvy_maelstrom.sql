CREATE TYPE "public"."prescription_status" AS ENUM('ACTIVE', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"medecin_id" varchar(100),
	"date" date DEFAULT now() NOT NULL,
	"status" "prescription_status" DEFAULT 'ACTIVE' NOT NULL,
	"medications" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medecin_id_medecins_numero_serie_fk" FOREIGN KEY ("medecin_id") REFERENCES "public"."medecins"("numero_serie") ON DELETE set null ON UPDATE no action;