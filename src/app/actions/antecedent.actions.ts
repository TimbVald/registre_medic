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
    // Validation des données avec log détaillé des erreurs
    const parsed = antecedentSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Erreurs Zod détaillées:", JSON.stringify(parsed.error.flatten(), null, 2));
      return { success: false, message: `Données invalides: ${parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(" | ")}` };
    }
    const validatedData = parsed.data;

    // Format dates to string
    const formattedData: any = { ...validatedData };
    if (formattedData.dernierDeparasitage instanceof Date) {
      formattedData.dernierDeparasitage = formattedData.dernierDeparasitage.toISOString().split('T')[0];
    }
    if (formattedData.complicationsAigues) {
      formattedData.complicationsAigues = formattedData.complicationsAigues.map((comp: any) => {
        if (comp.dernierEpisode instanceof Date) {
          return { ...comp, dernierEpisode: comp.dernierEpisode.toISOString().split('T')[0] };
        }
        return comp;
      });
    }

    // Insertion de la nouvelle évaluation (historique)
    await db.insert(antecedents).values({
      ...formattedData,
      patientId,
    });

    revalidatePath(`/dashboard/patients/${patientId}`);
    return { success: true, message: "Évaluation d'antécédents enregistrée avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des antécédents:", error);
    return { success: false, message: "Erreur lors de l'enregistrement. Vérifiez les données.", error: String(error) };
  }
}
