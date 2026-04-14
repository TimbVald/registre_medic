import { z } from "zod";

// --- Enumerations matching the table ---

export const DEPISTAGE_TYPE_ENUM = z.enum(["Anténatal", "Néonatal", "Post-natal"]);
export const FAMILLE_LIEN_ENUM = z.enum(["Fratrie", "Famille paternelle", "Famille maternelle"]);
export const NB_CAS_ENUM = z.enum(["01", "02", "03", "04", "Plus"]);

// --- Multi-select options lists ---

export const CIRCONSTANCES_OPTIONS = [
  "Anémie aiguë sévère",
  "Crise vaso-occlusive",
  "Syndrome pieds-mains",
  "Crises ostéoarticulaires",
  "Crise abdominale",
  "AVC",
  "Syndrome thoracique aiguë",
  "Priapisme",
  "Infections aiguës",
  "Consultation de routine",
  "Bilan de santé",
  "Autres",
] as const;

export const COMPLICATIONS_AIGUES_OPTIONS = [
  "Anémie aiguë sévère",
  "Crise vaso-occlusive",
  "Syndrome pieds-mains",
  "Crises ostéoarticulaires",
  "Crise abdominale",
  "AVC",
  "Syndrome thoracique aiguë",
  "Priapisme",
  "Infections aiguës",
  "Autres",
] as const;

export const COMPLICATIONS_CHRONIQUES_OPTIONS = [
  "Atteinte cardio-pulmonaire",
  "Atteinte hépatobiliaire",
  "Atteinte rénale",
  "Atteinte osseuse",
  "Atteinte du Syst. Nerveux Central",
  "Atteinte ORL",
  "Atteinte cutanée",
  "Atteinte endocrinienne",
  "Atteinte psychologique",
  "Dysfonction érectile",
  "Autres",
] as const;

export const CAUSE_NON_A_JOUR_OPTIONS = [
  "Difficultés financières",
  "Distance /Accès au centre de santé",
  "Manque d'informations",
  "Oubli/Absence de rappel",
  "Croyances culturelles",
  "Croyances religieuses",
  "Déplacement",
  "Rupture de stock",
] as const;

const vaccinSchema = z.object({
  aJour: z.boolean().default(false),
  causes: z.array(z.string()).default([]),
});

const complicationAigueDetailSchema = z.object({
  nom: z.string(),
  nombreParAn: z.string().optional().nullable(),
  dernierEpisode: z.date().optional().nullable(),
});

// --- Antecedent Schema ---

export const antecedentSchema = z.object({
  // Âge de découverte
  ageDecouverteAnnees: z.number().min(0).max(100).optional().nullable(),
  ageDecouverteMois: z.number().min(0).max(11).optional().nullable(),

  // Circonstances
  circonstancesDecouverte: z.array(z.string()).default([]),
  typeDepistage: DEPISTAGE_TYPE_ENUM.optional().nullable(),

  // Histoire Familiale
  notionFamilleDrepanocytose: z.boolean().default(false),
  liensFamille: z.array(FAMILLE_LIEN_ENUM).default([]),
  nbFreresSoeursDrepanocytaires: NB_CAS_ENUM.optional().nullable(),
  decesFamilleDrepanocytose: z.boolean().default(false),
  nbDecesFamille: NB_CAS_ENUM.optional().nullable(),

  // Prévention
  statutVaccinal: z.record(z.string(), vaccinSchema).optional(),
  milda: z.boolean().default(false),
  dernierDeparasitage: z.date().optional().nullable(),

  // Complications
  complicationsAigues: z.array(complicationAigueDetailSchema).default([]),
  complicationsChroniques: z.array(z.string()).default([]),
});

export type AntecedentFormValues = z.infer<typeof antecedentSchema>;
