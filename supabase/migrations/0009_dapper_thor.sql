ALTER TABLE "antecedents" DROP COLUMN "complications_aigues";--> statement-breakpoint
ALTER TABLE "antecedents" ADD COLUMN "complications_aigues" jsonb;--> statement-breakpoint
ALTER TABLE "antecedents" ADD COLUMN "statut_vaccinal" jsonb;--> statement-breakpoint
ALTER TABLE "antecedents" ADD COLUMN "milda" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "antecedents" ADD COLUMN "dernier_deparasitage" date;--> statement-breakpoint
ALTER TABLE "examens_paracliniques" ADD COLUMN "elhb" jsonb;