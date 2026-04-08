"use server";

import { db } from "@/db";
import { examensParacliniques } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { examenParacliniqueSchema, ExamenParacliniqueFormValues } from "@/lib/schemas/examen-paraclinique.schema";

/**
 * Récupère le bilan paraclinique récent d'un patient
 */
export async function getExamenParacliniqueByPatientId(patientId: string) {
  try {
    return await db.query.examensParacliniques.findFirst({
      where: eq(examensParacliniques.patientId, patientId),
      orderBy: (examens, { desc }) => [desc(examens.createdAt)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des examens paracliniques:", error);
    return null;
  }
}

/**
 * Enregistre ou met à jour un bilan paraclinique
 */
export async function upsertExamenParaclinique(patientId: string, data: ExamenParacliniqueFormValues) {
  try {
    // Validation
    const validatedData = examenParacliniqueSchema.parse(data);

    // Recherche de l'existant
    const existing = await getExamenParacliniqueByPatientId(patientId);

    const values = {
      patientId,
      // Hémoglobine
      hemoRealise: validatedData.hemo.realise,
      hemoCause: (validatedData.hemo.realise ? null : validatedData.hemo.cause) as any,
      hemoTauxBase: validatedData.hemo.tauxBase,
      hemoTauxRecent: validatedData.hemo.tauxRecent,
      hemoInterpretation: validatedData.hemo.interpretation as any,
      
      // Réticulocytes
      reticRealise: validatedData.retic.realise,
      reticCause: (validatedData.retic.realise ? null : validatedData.retic.cause) as any,
      reticTauxBase: validatedData.retic.tauxBase,
      reticTauxRecent: validatedData.retic.tauxRecent,
      reticInterpretation: validatedData.retic.interpretation as any,

      // Globules Blancs
      gbRealise: validatedData.gb.realise,
      gbCause: (validatedData.gb.realise ? null : validatedData.gb.cause) as any,
      gbTauxBase: validatedData.gb.tauxBase,
      gbTauxRecent: validatedData.gb.tauxRecent,
      gbInterpretation: validatedData.gb.interpretation as any,

      // Plaquettes
      plaqRealise: validatedData.plaq.realise,
      plaqCause: (validatedData.plaq.realise ? null : validatedData.plaq.cause) as any,
      plaqTauxBase: validatedData.plaq.tauxBase,
      plaqTauxRecent: validatedData.plaq.tauxRecent,
      plaqInterpretation: validatedData.plaq.interpretation as any,

      // ASAT/ALAT
      asatAlatRealise: validatedData.asatAlat.realise,
      asatAlatCause: (validatedData.asatAlat.realise ? null : validatedData.asatAlat.cause) as any,
      asatAlatTauxBase: validatedData.asatAlat.tauxBase,
      asatAlatInterpretation: validatedData.asatAlat.interpretation as any,
      
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(examensParacliniques)
        .set(values)
        .where(eq(examensParacliniques.id, existing.id));
    } else {
      await db.insert(examensParacliniques).values({
        ...values,
      });
    }

    revalidatePath(`/dashboard/patients/${patientId}`);
    return { success: true, message: "Bilan paraclinique enregistré avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des examens paracliniques:", error);
    return { success: false, message: "Une erreur est survenue lors de l'enregistrement" };
  }
}
