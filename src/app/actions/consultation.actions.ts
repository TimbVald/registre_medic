"use server";

import { db } from "@/db";
import { consultationsExternes, patients, medecins } from "@/db/schema";
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
    const result = await db.insert(consultationsExternes).values({
      patientId,
      medecinId: validatedData.medecinId,
      dateConsultation: validatedData.dateConsultation.toISOString().split('T')[0],
      typeConsultation: "Systématique",
      
      // Paramètres
      etatGeneral: validatedData.etatGeneral as any,
      temperature: validatedData.temperature,
      poids: validatedData.poids,
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
      dateProchainRdv: validatedData.dateProchainRdv ? validatedData.dateProchainRdv.toISOString().split('T')[0] : null,
      
      // Traitements
      traitementAcideFolique: validatedData.traitementAcideFolique,
      traitementHydroxyuree: validatedData.traitementHydroxyuree,
      traitementAntibioProphylaxie: validatedData.traitementAntibioProphylaxie,
      traitementHydratation: validatedData.traitementHydratation,
      traitementAutres: validatedData.traitementAutres,
    }).returning();

    revalidatePath(`/dashboard/patients/${patientId}`);
    revalidatePath("/dashboard/consultations");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Consultation enregistrée avec succès", data: result[0] };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la consultation:", error);
    return { success: false, message: "Une erreur est survenue lors de l'enregistrement" };
  }
}

/**
 * Met à jour une consultation existante
 */
export async function updateConsultation(consultationId: string, data: ConsultationFormValues) {
  try {
    const validatedData = consultationSchema.parse(data);

    const result = await db.update(consultationsExternes)
      .set({
        medecinId: validatedData.medecinId,
        dateConsultation: validatedData.dateConsultation.toISOString().split('T')[0],
        etatGeneral: validatedData.etatGeneral as any,
        temperature: validatedData.temperature,
        poids: validatedData.poids,
        fc: validatedData.fc,
        fr: validatedData.fr,
        pa: validatedData.pa,
        sao2: validatedData.sao2,
        plaintesExist: validatedData.plaintesExist,
        plaintesDetails: validatedData.plaintesDetails,
        plaintesAutre: validatedData.plaintesAutre,
        dateRdvPrevue: validatedData.dateRdvPrevue ? validatedData.dateRdvPrevue.toISOString().split('T')[0] : null,
        rdvHonore: validatedData.rdvHonore as any,
        rappelFrequence: validatedData.rappelFrequence as any,
        rappelReception: validatedData.rappelReception,
        rappelRetour: validatedData.rappelRetour,
        rappelMode: validatedData.rappelMode as any,
        causeNonHonore: validatedData.causeNonHonore,
        dateProchainRdv: validatedData.dateProchainRdv ? validatedData.dateProchainRdv.toISOString().split('T')[0] : null,
        traitementAcideFolique: validatedData.traitementAcideFolique,
        traitementHydroxyuree: validatedData.traitementHydroxyuree,
        traitementAntibioProphylaxie: validatedData.traitementAntibioProphylaxie,
        traitementHydratation: validatedData.traitementHydratation,
        traitementAutres: validatedData.traitementAutres,
        updatedAt: new Date(),
      })
      .where(eq(consultationsExternes.id, consultationId))
      .returning();

    if (result[0]) {
      revalidatePath(`/dashboard/patients/${result[0].patientId}`);
      revalidatePath("/dashboard/consultations");
    }

    return { success: true, message: "Consultation mise à jour avec succès" };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la consultation:", error);
    return { success: false, message: "Une erreur est survenue" };
  }
}

/**
 * Récupère l'historique des consultations d'un patient avec les infos du médecin
 */
export async function getConsultationsByPatientId(patientId: string) {
  try {
    return await db.query.consultationsExternes.findMany({
      where: eq(consultationsExternes.patientId, patientId),
      with: {
        medecin: true,
      },
      orderBy: [desc(consultationsExternes.dateConsultation)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des consultations:", error);
    return [];
  }
}

/**
 * Récupère toutes les consultations pour la liste globale
 */
export async function getAllConsultations() {
  try {
    return await db.query.consultationsExternes.findMany({
      with: {
        patient: true,
        medecin: true,
      },
      orderBy: [desc(consultationsExternes.dateConsultation)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les consultations:", error);
    return [];
  }
}
