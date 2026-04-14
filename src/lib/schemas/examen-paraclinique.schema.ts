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
  realise: z.boolean().default(false).catch(false),
  cause: z.string().optional().nullable().catch(null),
  tauxBase: z.string().optional().nullable().catch(null),
  tauxRecent: z.string().optional().nullable().catch(null),
});

export const examenParacliniqueSchema = z.object({
  // Hémoglobine
  hemo: examBasics.extend({
    interpretation: z.string().optional().nullable().catch(null),
  }),
  // Réticulocytes
  retic: examBasics.extend({
    interpretation: z.string().optional().nullable().catch(null),
  }),
  // Globules Blancs
  gb: examBasics.extend({
    interpretation: z.string().optional().nullable().catch(null),
  }),
  // Plaquettes
  plaq: examBasics.extend({
    interpretation: z.string().optional().nullable().catch(null),
  }),
  // ASAT/ALAT
  asatAlat: z.object({
    realise: z.boolean().default(false).catch(false),
    cause: z.string().optional().nullable().catch(null),
    tauxBase: z.string().optional().nullable().catch(null),
    interpretation: z.string().optional().nullable().catch(null),
  }),
  // ELHB
  elhb: z.object({
    realise: z.boolean().default(false).catch(false),
    cause: z.string().optional().nullable().catch(null),
    tauxA: z.string().optional().nullable().catch(null),
    tauxS: z.string().optional().nullable().catch(null),
    tauxF: z.string().optional().nullable().catch(null),
  }).optional().default({ realise: false, cause: null, tauxA: null, tauxS: null, tauxF: null }).catch({ realise: false, cause: null, tauxA: null, tauxS: null, tauxF: null }),
});

export type ExamenParacliniqueFormValues = z.infer<typeof examenParacliniqueSchema>;
