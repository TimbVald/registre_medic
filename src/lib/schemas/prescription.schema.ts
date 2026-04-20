import { z } from "zod";

export const medicationSchema = z.object({
  medication: z.string().min(2, "Nom du médicament requis"),
  dosage: z.string().min(1, "Dosage requis"),
  frequency: z.string().min(1, "Fréquence requise"),
  duration: z.string().min(1, "Durée requise"),
  instructions: z.string().optional().nullable(),
});

export const prescriptionSchema = z.object({
  patientId: z.string().uuid("Patient invalide"),
  medecinId: z.string().min(1, "Médecin requis"),
  date: z.date({
    required_error: "La date est requise",
  }).default(() => new Date()),
  medications: z.array(medicationSchema).min(1, "Au moins un médicament est requis"),
  notes: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;
export type MedicationValues = z.infer<typeof medicationSchema>;
