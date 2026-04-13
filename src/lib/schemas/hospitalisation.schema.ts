import { z } from "zod";
import { 
  REGULARITE_TRAITEMENT_OPTIONS, 
  CONCLUSION_TRAITEMENT_OPTIONS,
  CAUSES_IRREGULARITE_TRAITEMENT
} from "./consultation.schema";

// --- Enumerations spécifiques à l'Hospitalisation ---

export const PLAINTES_CATEGORIES_HOSP = {
  douleurs: ["Osseuses", "Articulaires", "Lombaires", "Thoraciques", "Abdominales", "Priapisme"],
  fievre: ["Isolée", "Associée avec des frissons"],
  fatigue: ["Extrême", "Baisse de l'endurance", "Faiblesse"],
  irritabilite: ["Avec refus de téter", "Sans refus de téter"],
  coloration: ["Pâleur", "Ictère"],
  difficultesRespiratoires: ["Essoufflement", "Respiration rapide"],
  gonflementSignesNeuro: ["Gonflement d'un côté du corps", "Céphalées intenses", "Somnolence"],
} as const;

export const CAUSES_IRREGULARITE_HYDRATATION = [
  ...CAUSES_IRREGULARITE_TRAITEMENT.filter(c => c !== "Rupture de stock" && c !== "Distance transport" && c !== "Déplacement"),
  "Coupure fréquente d'eau",
  "Point d'eau éloigné"
] as const;

// --- Sub-schemas ---

const treatmentSchema = z.object({
  active: z.boolean().default(false),
  posologie: z.string().optional().nullable(),
  regularite: z.enum(REGULARITE_TRAITEMENT_OPTIONS).optional().nullable(),
  causesIrregularite: z.array(z.string()).default([]),
  conclusion: z.enum(CONCLUSION_TRAITEMENT_OPTIONS).optional().nullable(),
});

const plaintesDetailsSchema = z.object({
  douleurs: z.array(z.string()).default([]),
  fievre: z.array(z.string()).default([]),
  fatigue: z.array(z.string()).default([]),
  irritabilite: z.array(z.string()).default([]),
  coloration: z.array(z.string()).default([]),
  difficultesRespiratoires: z.array(z.string()).default([]),
  gonflementSignesNeuro: z.array(z.string()).default([]),
  retardCroissance: z.boolean().default(false),
  plaieJambes: z.boolean().default(false),
});

// --- Main Schema ---

export const hospitalisationSchema = z.object({
  dateHospitalisation: z.date().default(() => new Date()),
  agePatient: z.number().optional().nullable(),

  // Paramètres
  temperature: z.string().optional().nullable(),
  fc: z.string().optional().nullable(),
  fr: z.string().optional().nullable(),
  pa: z.string().optional().nullable(),
  sao2: z.string().optional().nullable(),

  // Plaintes
  plaintesExist: z.boolean().default(false),
  detailsPlaintes: plaintesDetailsSchema.optional(),

  // Traitements
  traitementAcideFolique: treatmentSchema.optional(),
  traitementHydroxyuree: treatmentSchema.optional(),
  traitementAntibioProphylaxie: treatmentSchema.optional(),
  traitementHydratation: treatmentSchema.optional(),

  // Résumé et Suivi
  resume: z.string().optional().nullable(),
  dateProchainRdv: z.date().optional().nullable(),
});

export type HospitalisationFormValues = z.infer<typeof hospitalisationSchema>;
