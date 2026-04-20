"use server";

import { db } from "@/db";
import { prescriptions, patients, medecins } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { prescriptionSchema, PrescriptionFormValues } from "@/lib/schemas/prescription.schema";

/**
 * Récupère toutes les prescriptions avec les infos patient et médecin
 */
export async function getPrescriptions() {
  try {
    return await db.query.prescriptions.findMany({
      with: {
        patient: true,
        medecin: true,
      },
      orderBy: [desc(prescriptions.date)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des prescriptions:", error);
    return [];
  }
}

/**
 * Récupère les prescriptions d'un patient spécifique
 */
export async function getPrescriptionsByPatientId(patientId: string) {
  try {
    return await db.query.prescriptions.findMany({
      where: eq(prescriptions.patientId, patientId),
      with: {
        medecin: true,
      },
      orderBy: [desc(prescriptions.date)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des prescriptions du patient:", error);
    return [];
  }
}

/**
 * Crée une nouvelle prescription
 */
export async function createPrescription(data: PrescriptionFormValues) {
  try {
    // Validation Zod (au cas où, même si validé côté client)
    const validated = prescriptionSchema.parse(data);

    const newPrescription = await db.insert(prescriptions).values({
      patientId: validated.patientId,
      medecinId: validated.medecinId,
      date: validated.date.toISOString().split('T')[0], // format YYYY-MM-DD pour le type date de postgres
      status: validated.status,
      medications: validated.medications,
      notes: validated.notes,
    }).returning();

    revalidatePath("/dashboard/prescriptions");
    revalidatePath("/dashboard/treatments");
    revalidatePath(`/dashboard/patients/${validated.patientId}`);
    
    return { success: true, prescription: newPrescription[0] };
  } catch (error) {
    console.error("Erreur lors de la création de la prescription:", error);
    return { success: false, error: "Une erreur est survenue lors de l'enregistrement de l'ordonnance." };
  }
}

/**
 * Met à jour le statut d'une prescription
 */
export async function updatePrescriptionStatus(prescriptionId: string, status: "ACTIVE" | "COMPLETED" | "CANCELLED") {
  try {
    await db.update(prescriptions)
      .set({ status, updatedAt: new Date() })
      .where(eq(prescriptions.id, prescriptionId));
    
    revalidatePath("/dashboard/prescriptions");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return { success: false, error: "Impossible de mettre à jour le statut." };
  }
}
