CREATE TABLE "medecins" (
	"numero_serie" varchar(100) PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"prenom" varchar(255),
	"email" varchar(255),
	"telephone" varchar(50),
	"specialite" varchar(255),
	"mot_de_passe" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medecins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "telephone" varchar(50);