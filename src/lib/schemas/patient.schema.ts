import { z } from "zod";

// Base enumerations matching the Drizzle schema
export const SEXE_ENUM = z.enum(["Masculin", "Féminin"], {
  required_error: "Le sexe est requis.",
});
export const TYPE_RESIDENCE_ENUM = z.enum(["Urbain", "Péri-urbain", "Rural"]);
export const ETAT_PARENT_ENUM = z.enum(["Vivant", "Décédé", "Invalide", "Abandon"]);
export const NIVEAU_SCOLAIRE_ENUM = z.enum([
  "Non scolarisé",
  "Primaire",
  "Secondaire",
  "Universitaire",
  "Post-universitaire",
]);
export const PROFESSION_ENUM = z.enum([
  "Secteur public",
  "Secteur privé formel",
  "Indépendant formel",
  "Secteur informel",
  "Travail précaire",
  "Sans emploi",
]);
export const REVENUS_ENUM = z.enum([
  "<1x SMIC (<36.000)",
  "1-2x SMIC (36.000-72.000)",
  "2-5x SMIC (72.000-180.000)",
  "5-10x SMIC (180.000-360.000)",
  "10-15xSMIC (360.000-540.000)",
  "15-20xSMIC (540.000-720.000)",
  "20-25xSMIC (720.000-900.000)",
  ">25xSMIC",
]);
export const SITUATION_MATRIMONIALE_ENUM = z.enum([
  "Célibataire",
  "Marié Monogame",
  "Marié Polyandre",
  "Marié Polygame",
  "Veuf",
  "Divorcé",
  "Séparation de corps",
]);
export const RELIGION_ENUM = z.enum([
  "Christianisme",
  "Islam",
  "Animisme",
  "Témoin de Jehovah",
  "Inconnue",
]);
export const GROUPE_SANGUIN_ENUM = z.enum(["A+", "B+", "AB+", "A-", "B-", "AB-", "O+", "O-"]);
export const ELECTROPHORESE_ENUM = z.enum(["AA", "AS", "SS"]);

export const patientSchema = z.object({
  // Identification
  noms: z.string().min(1, "Les noms sont requis."),
  prenoms: z.string().optional(),
  dateNaissance: z.date({
    required_error: "La date de naissance est requise.",
  }),
  lieuNaissance: z.string().optional(),
  ageMois: z.number().optional(),
  ageAnnees: z.number().optional(),
  sexe: SEXE_ENUM,
  typeResidence: TYPE_RESIDENCE_ENUM.optional(),
  lieuResidence: z.string().optional(),
  scolarise: z.boolean().default(false).optional(),
  personnesVivantsAvec: z.string().optional(),

  // Père ou Tuteur
  pereNom: z.string().optional(),
  pereEtat: ETAT_PARENT_ENUM.optional(),
  pereTelClassique: z.string().optional(),
  pereTelWhatsapp: z.string().optional(),
  pereAge: z.number().optional(),
  pereNiveauScolaire: NIVEAU_SCOLAIRE_ENUM.optional(),
  pereProfession: PROFESSION_ENUM.optional(),
  pereRevenus: REVENUS_ENUM.optional(),
  pereSituationMatrimoniale: SITUATION_MATRIMONIALE_ENUM.optional(),
  pereReligion: RELIGION_ENUM.optional(),
  pereGroupeSanguin: GROUPE_SANGUIN_ENUM.optional(),
  pereElectrophorese: ELECTROPHORESE_ENUM.optional(),

  // Mère ou Tutrice
  mereNom: z.string().optional(),
  mereEtat: ETAT_PARENT_ENUM.optional(),
  mereTelClassique: z.string().optional(),
  mereTelWhatsapp: z.string().optional(),
  mereAge: z.number().optional(),
  mereNiveauScolaire: NIVEAU_SCOLAIRE_ENUM.optional(),
  mereProfession: PROFESSION_ENUM.optional(),
  mereRevenus: REVENUS_ENUM.optional(),
  mereSituationMatrimoniale: SITUATION_MATRIMONIALE_ENUM.optional(),
  mereReligion: RELIGION_ENUM.optional(),
  mereGroupeSanguin: GROUPE_SANGUIN_ENUM.optional(),
  mereElectrophorese: ELECTROPHORESE_ENUM.optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
