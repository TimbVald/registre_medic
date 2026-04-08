"use server";

import { db } from "@/db";
import { antecedents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { antecedentSchema, AntecedentFormValues } from "@/lib/schemas/antecedent.schema";

/**
 * Récupère les antécédents d'un patient
 */
export async function getAntecedentsByPatientId(patientId: string) {
  try {
    return await db.query.antecedents.findFirst({
      where: eq(antecedents.patientId, patientId),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des antécédents:", error);
    return null;
  }
}

/**
 * Ajoute ou met à jour les antécédents d'un patient
 */
export async function upsertAntecedents(patientId: string, data: AntecedentFormValues) {
  try {
    // Validation des données
    const validatedData = antecedentSchema.parse(data);

    // Vérifier si des antécédents existent déjà pour ce patient
    const existing = await getAntecedentsByPatientId(patientId);

    if (existing) {
      // Mise à jour
      await db.update(antecedents)
        .set({
          ...validatedData,
          updatedAt: new Date(),
        })
        .where(eq(antecedents.patientId, patientId));
    } else {
      // Création
      await db.insert(antecedents).values({
        ...validatedData,
        patientId,
      });
    }

    revalidatePath(`/dashboard/patients/${patientId}`);
    return { success: true, message: "Antécédents enregistrés avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des antécédents:", error);
    return { success: false, message: "Une erreur est survenue lors de l'enregistrement" };
  }
}
