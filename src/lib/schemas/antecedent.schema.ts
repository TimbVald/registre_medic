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

// --- Antecedent Schema ---

export const antecedentSchema = z.object({
  // Âge de découverte
  ageDecouverteAnnees: z.coerce.number().min(0).max(100).optional().nullable().catch(null),
  ageDecouverteMois: z.coerce.number().min(0).max(11).optional().nullable().catch(null),

  // Circonstances
  circonstancesDecouverte: z.array(z.string()).default([]),
  typeDepistage: DEPISTAGE_TYPE_ENUM.optional().nullable().catch(null),

  // Histoire Familiale
  notionFamilleDrepanocytose: z.boolean().default(false),
  liensFamille: z.array(z.string()).default([]),
  nbFreresSoeursDrepanocytaires: NB_CAS_ENUM.optional().nullable().catch(null),
  decesFamilleDrepanocytose: z.boolean().default(false),
  nbDecesFamille: NB_CAS_ENUM.optional().nullable().catch(null),

  // Prévention - utilise z.any() pour les champs dynamiques complexes
  statutVaccinal: z.record(
    z.string(),
    z.object({
      aJour: z.boolean().default(false).catch(false),
      causes: z.array(z.string()).default([]).catch([]),
    })
  ).optional().default({}).catch({}),
  milda: z.boolean().default(false).catch(false),
  dernierDeparasitage: z.date().optional().nullable().catch(null),

  // Complications
  complicationsAigues: z.array(
    z.object({
      nom: z.string(),
      nombreParAn: z.string().optional().nullable().catch(null),
      dernierEpisode: z.date().optional().nullable().catch(null),
    })
  ).default([]).catch([]),
  complicationsChroniques: z.array(z.string()).default([]).catch([]),
});

export type AntecedentFormValues = z.infer<typeof antecedentSchema>;
