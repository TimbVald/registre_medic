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
  email: z.string().email("L'email doit être valide.").optional().nullable().or(z.literal("")),
  telephone: z.string().optional().nullable().or(z.literal("")),
  lieuNaissance: z.string().optional().nullable(),
  ageMois: z.number().optional().nullable(),
  ageAnnees: z.number().optional().nullable(),
  sexe: SEXE_ENUM,
  typeResidence: TYPE_RESIDENCE_ENUM.optional().nullable(),
  lieuResidence: z.string().optional().nullable(),
  scolarise: z.boolean().default(false).optional().nullable(),
  personnesVivantsAvec: z.string().optional().nullable(),
  groupeSanguin: GROUPE_SANGUIN_ENUM.optional().nullable(),

  // Père ou Tuteur
  pereNom: z.string().optional().nullable(),
  pereEtat: ETAT_PARENT_ENUM.optional().nullable(),
  pereTelClassique: z.string().optional().nullable(),
  pereTelWhatsapp: z.string().optional().nullable(),
  pereAge: z.number().optional().nullable(),
  pereNiveauScolaire: NIVEAU_SCOLAIRE_ENUM.optional().nullable(),
  pereProfession: PROFESSION_ENUM.optional().nullable(),
  pereRevenus: REVENUS_ENUM.optional().nullable(),
  pereSituationMatrimoniale: SITUATION_MATRIMONIALE_ENUM.optional().nullable(),
  pereReligion: RELIGION_ENUM.optional().nullable(),
  pereGroupeSanguin: GROUPE_SANGUIN_ENUM.optional().nullable(),
  pereElectrophorese: ELECTROPHORESE_ENUM.optional().nullable(),

  // Mère ou Tutrice
  mereNom: z.string().optional().nullable(),
  mereEtat: ETAT_PARENT_ENUM.optional().nullable(),
  mereTelClassique: z.string().optional().nullable(),
  mereTelWhatsapp: z.string().optional().nullable(),
  mereAge: z.number().optional().nullable(),
  mereNiveauScolaire: NIVEAU_SCOLAIRE_ENUM.optional().nullable(),
  mereProfession: PROFESSION_ENUM.optional().nullable(),
  mereRevenus: REVENUS_ENUM.optional().nullable(),
  mereSituationMatrimoniale: SITUATION_MATRIMONIALE_ENUM.optional().nullable(),
  mereReligion: RELIGION_ENUM.optional().nullable(),
  mereGroupeSanguin: GROUPE_SANGUIN_ENUM.optional().nullable(),
  mereElectrophorese: ELECTROPHORESE_ENUM.optional().nullable(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
