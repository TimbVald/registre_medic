import { z } from "zod";

// --- Enumerations ---

export const ETAT_GENERAL_OPTIONS = ["Satisfaisant", "Non satisfaisant"] as const;
export const RDV_HONORE_OPTIONS = ["Oui", "Non"] as const;
export const FREQUENCE_RAPPEL_OPTIONS = ["01 fois/sem.", "02 fois/sem.", "03 fois/sem."] as const;
export const MODE_RAPPEL_OPTIONS = ["SMS classique", "Appel classique", "WhatsApp (SMS)"] as const;
export const REGULARITE_TRAITEMENT_OPTIONS = ["Régulier", "Irrégulier"] as const;
export const CONCLUSION_TRAITEMENT_OPTIONS = ["Adhérence", "Compliance", "Observance"] as const;

export const PLAINTES_CATEGORIES = [
  "Douleurs Osseuses", "Douleurs Articulaires", "Douleurs Lombaires", "Douleurs Thoraciques", "Douleurs Abdominales", "Priapisme",
  "Fièvre Isolée", "Fièvre avec Frissons",
  "Fatigue Extrême", "Baisse de l'endurance", "Faiblesse",
  "Irritabilité avec Refus de téter", "Irritabilité sans Refus de téter",
  "Coloration Pâleur", "Coloration Ictère",
  "Essoufflement", "Respiration rapide",
  "Gonflement d'un côté", "Céphalées intenses", "Somnolence",
  "Retard de croissance",
  "Plaie aux jambes"
] as const;

export const CAUSES_NON_HONORE_OPTIONS = [
  "Difficultés de transport", "Manque d'argent", "Contraintes professionnelles ou scolaires",
  "Invalidité physique", "Hospitalisation", "Indisponibilité d'un accompagnant",
  "Facteurs socio-culturels", "Indisponibilités téléphoniques"
] as const;

export const CAUSES_IRREGULARITE_TRAITEMENT = [
  "Manque d'argent", "Rupture de stock", "Effets secondaires", "Manque de temps/Travail",
  "Fatigue psychologique", "Distance transport", "Manque de rappel", "Déplacement",
  "Manque de compréhension de l'utilité", "Autre"
] as const;

// --- Sub-schemas ---

const treatmentSchema = z.object({
  active: z.boolean().default(false),
  posologie: z.string().optional(),
  regularite: z.enum(REGULARITE_TRAITEMENT_OPTIONS).optional().nullable(),
  causesIrregularite: z.array(z.string()).default([]),
  conclusion: z.enum(CONCLUSION_TRAITEMENT_OPTIONS).optional().nullable(),
});

// --- Main Schema ---

export const consultationSchema = z.object({
  dateConsultation: z.date().default(() => new Date()),
  
  // Paramètres
  etatGeneral: z.enum(ETAT_GENERAL_OPTIONS).optional().nullable(),
  temperature: z.string().optional().nullable(),
  fc: z.string().optional().nullable(),
  fr: z.string().optional().nullable(),
  pa: z.string().optional().nullable(),
  sao2: z.string().optional().nullable(),

  // Plaintes
  plaintesExist: z.boolean().default(false),
  plaintesDetails: z.array(z.string()).default([]),
  plaintesAutre: z.string().optional().nullable(),

  // Données RDV
  dateRdvPrevue: z.date().optional().nullable(),
  rdvHonore: z.enum(RDV_HONORE_OPTIONS).optional().nullable(),
  rappelFrequence: z.enum(FREQUENCE_RAPPEL_OPTIONS).optional().nullable(),
  rappelReception: z.boolean().default(false),
  rappelRetour: z.boolean().default(false),
  rappelMode: z.enum(MODE_RAPPEL_OPTIONS).optional().nullable(),
  causeNonHonore: z.string().optional().nullable(),

  // Traitements Routine
  traitementAcideFolique: treatmentSchema.optional(),
  traitementHydroxyuree: treatmentSchema.optional(),
  traitementAntibioProphylaxie: treatmentSchema.optional(),
});

export type ConsultationFormValues = z.infer<typeof consultationSchema>;
