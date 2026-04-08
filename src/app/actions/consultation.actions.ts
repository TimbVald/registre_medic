"use server";

import { db } from "@/db";
import { consultationsExternes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { consultationSchema, ConsultationFormValues } from "@/lib/schemas/consultation.schema";

/**
 * Enregistre une nouvelle consultation externe systématique
 */
export async function createConsultation(patientId: string, data: ConsultationFormValues) {
  try {
    // Validation des données
    const validatedData = consultationSchema.parse(data);

    // Insertion
    await db.insert(consultationsExternes).values({
      patientId,
      dateConsultation: validatedData.dateConsultation.toISOString().split('T')[0],
      
      // Paramètres
      etatGeneral: validatedData.etatGeneral as any,
      temperature: validatedData.temperature,
      fc: validatedData.fc,
      fr: validatedData.fr,
      pa: validatedData.pa,
      sao2: validatedData.sao2,
      
      // Plaintes
      plaintesExist: validatedData.plaintesExist,
      plaintesDetails: validatedData.plaintesDetails,
      plaintesAutre: validatedData.plaintesAutre,
      
      // RDV
      dateRdvPrevue: validatedData.dateRdvPrevue ? validatedData.dateRdvPrevue.toISOString().split('T')[0] : null,
      rdvHonore: validatedData.rdvHonore as any,
      rappelFrequence: validatedData.rappelFrequence as any,
      rappelReception: validatedData.rappelReception,
      rappelRetour: validatedData.rappelRetour,
      rappelMode: validatedData.rappelMode as any,
      causeNonHonore: validatedData.causeNonHonore,
      
      // Traitements (JSONB auto-handled by Drizzle for objects)
      traitementAcideFolique: validatedData.traitementAcideFolique,
      traitementHydroxyuree: validatedData.traitementHydroxyuree,
      traitementAntibioProphylaxie: validatedData.traitementAntibioProphylaxie,
    });

    revalidatePath(`/dashboard/patients/${patientId}`);
    return { success: true, message: "Consultation enregistrée avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la consultation:", error);
    return { success: false, message: "Une erreur est survenue lors de l'enregistrement" };
  }
}

/**
 * Récupère l'historique des consultations d'un patient
 */
export async function getConsultationsByPatientId(patientId: string) {
  try {
    return await db.query.consultationsExternes.findMany({
      where: eq(consultationsExternes.patientId, patientId),
      orderBy: [desc(consultationsExternes.dateConsultation)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des consultations:", error);
    return [];
  }
}
