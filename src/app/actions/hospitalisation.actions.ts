"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { hospitalisations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { hospitalisationSchema } from "@/lib/schemas/hospitalisation.schema";

/**
 * Enregistre ou met à jour une hospitalisation
 */
export async function saveHospitalisation(data: any) {
  try {
    const { id, patientId, ...rest } = data;

    if (id) {
      await db.update(hospitalisations)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(hospitalisations.id, id));
    } else {
      await db.insert(hospitalisations)
        .values({ 
          ...rest, 
          patientId 
        });
    }

    revalidatePath(`/dashboard/patients/${patientId}`);
    return { success: true, message: "Hospitalisation enregistrée avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'hospitalisation :", error);
    return { success: false, error: "Erreur lors de l'enregistrement" };
  }
}

/**
 * Récupère les hospitalisations d'un patient
 */
export async function getHospitalisations(patientId: string) {
  try {
    return await db.query.hospitalisations.findMany({
      where: eq(hospitalisations.patientId, patientId),
      orderBy: [desc(hospitalisations.dateHospitalisation)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des hospitalisations :", error);
    return [];
  }
}

/**
 * Supprime une hospitalisation
 */
export async function deleteHospitalisation(id: string, patientId: string) {
  try {
    await db.delete(hospitalisations).where(eq(hospitalisations.id, id));
    revalidatePath(`/dashboard/patients/${patientId}`);
    return { success: true, message: "Hospitalisation supprimée avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'hospitalisation :", error);
    return { success: false, error: "Impossible de supprimer l'hospitalisation" };
  }
}
