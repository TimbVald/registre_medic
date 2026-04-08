import { z } from "zod";

export const CAUSE_NON_REALISATION_OPTIONS = [
  "Manque d'argent",
  "Distance/Transport difficile",
  "Manque de compréhension de l'utilité",
  "Manque de temps/Travail",
  "Charge familiale",
  "Manque de rappel",
  "Autre"
] as const;

export const INTERPRETATION_HEMO_OPTIONS = ["Normal", "Diminué (Anémie)", "Augmenté (Polyglobulie)"] as const;
export const INTERPRETATION_RETIC_OPTIONS = ["Normal", "Diminué (Production médullaire insuffisante)", "Augmenté (Réponse médullaire accrue)"] as const;
export const INTERPRETATION_GB_OPTIONS = ["Normal", "Diminué (Leucopénie)", "Augmenté (Leucocytose)"] as const;
export const INTERPRETATION_PLAQ_OPTIONS = ["Normal", "Diminué (Thrombopénie)", "Augmenté (Thrombocytose)"] as const;
export const INTERPRETATION_ASAT_ALAT_OPTIONS = ["Normal", "Augmenté (Cytolyse hépatite)"] as const;

const examBasics = z.object({
  realise: z.boolean().default(false),
  cause: z.string().optional().nullable(),
  tauxBase: z.string().optional().nullable(),
  tauxRecent: z.string().optional().nullable(),
});

export const examenParacliniqueSchema = z.object({
  // Hémoglobine
  hemo: examBasics.extend({
    interpretation: z.enum(INTERPRETATION_HEMO_OPTIONS).optional().nullable(),
  }),
  // Réticulocytes
  retic: examBasics.extend({
    interpretation: z.enum(INTERPRETATION_RETIC_OPTIONS).optional().nullable(),
  }),
  // Globules Blancs
  gb: examBasics.extend({
    interpretation: z.enum(INTERPRETATION_GB_OPTIONS).optional().nullable(),
  }),
  // Plaquettes
  plaq: examBasics.extend({
    interpretation: z.enum(INTERPRETATION_PLAQ_OPTIONS).optional().nullable(),
  }),
  // ASAT/ALAT (pas de taux récent dans l'image pour celui-là)
  asatAlat: z.object({
    realise: z.boolean().default(false),
    cause: z.string().optional().nullable(),
    tauxBase: z.string().optional().nullable(),
    interpretation: z.enum(INTERPRETATION_ASAT_ALAT_OPTIONS).optional().nullable(),
  }),
});

export type ExamenParacliniqueFormValues = z.infer<typeof examenParacliniqueSchema>;
