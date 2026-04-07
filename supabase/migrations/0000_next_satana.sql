CREATE TYPE "public"."electrophorese" AS ENUM('AA', 'AS', 'SS');--> statement-breakpoint
CREATE TYPE "public"."groupe_sanguin" AS ENUM('A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-');--> statement-breakpoint
CREATE TYPE "public"."parent_etat" AS ENUM('Vivant', 'Décédé', 'Invalide', 'Abandon');--> statement-breakpoint
CREATE TYPE "public"."parent_niveau_scolaire" AS ENUM('Non scolarisé', 'Primaire', 'Secondaire', 'Universitaire', 'Post-universitaire');--> statement-breakpoint
CREATE TYPE "public"."parent_profession" AS ENUM('Secteur public', 'Secteur privé formel', 'Indépendant formel', 'Secteur informel', 'Travail précaire', 'Sans emploi');--> statement-breakpoint
CREATE TYPE "public"."parent_religion" AS ENUM('Christianisme', 'Islam', 'Animisme', 'Témoin de Jehova', 'Inconnue');--> statement-breakpoint
CREATE TYPE "public"."parent_revenus" AS ENUM('<1x SMIC (<36.000)', '1-2x SMIC (36.000-72.000)', '2-5x SMIC (72.000-180.000)', '5-10x SMIC (180.000-360.000)', '10-15xSMIC (360.000-540.000)', '15-20xSMIC (540.000-720.000)', '20-25xSMIC (720.000-900.000)', '>25xSMIC');--> statement-breakpoint
CREATE TYPE "public"."parent_situation_matrimoniale" AS ENUM('Célibataire', 'Marié Monogame', 'Marié Polyandre', 'Marié Polygame', 'Veuf', 'Divorcé', 'Séparation de corps');--> statement-breakpoint
CREATE TYPE "public"."sexe" AS ENUM('Masculin', 'Féminin');--> statement-breakpoint
CREATE TYPE "public"."type_residence" AS ENUM('Urbain', 'Péri-urbain', 'Rural');--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_fiche" varchar(50) NOT NULL,
	"noms" varchar(255) NOT NULL,
	"prenoms" varchar(255),
	"date_naissance" date,
	"lieu_naissance" varchar(255),
	"age_mois" integer,
	"age_annees" integer,
	"sexe" "sexe",
	"type_residence" "type_residence",
	"lieu_residence" varchar(255),
	"scolarise" boolean,
	"personnes_vivants_avec" varchar(255),
	"pere_nom" varchar(255),
	"pere_etat" "parent_etat",
	"pere_tel_classique" varchar(50),
	"pere_tel_whatsapp" varchar(50),
	"pere_age" integer,
	"pere_niveau_scolaire" "parent_niveau_scolaire",
	"pere_profession" "parent_profession",
	"pere_revenus" "parent_revenus",
	"pere_situation_matrimoniale" "parent_situation_matrimoniale",
	"pere_religion" "parent_religion",
	"pere_groupe_sanguin" "groupe_sanguin",
	"pere_electrophorese" "electrophorese",
	"mere_nom" varchar(255),
	"mere_etat" "parent_etat",
	"mere_tel_classique" varchar(50),
	"mere_tel_whatsapp" varchar(50),
	"mere_age" integer,
	"mere_niveau_scolaire" "parent_niveau_scolaire",
	"mere_profession" "parent_profession",
	"mere_revenus" "parent_revenus",
	"mere_situation_matrimoniale" "parent_situation_matrimoniale",
	"mere_religion" "parent_religion",
	"mere_groupe_sanguin" "groupe_sanguin",
	"mere_electrophorese" "electrophorese",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patients_numero_fiche_unique" UNIQUE("numero_fiche")
);
