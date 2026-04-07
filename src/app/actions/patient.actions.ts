"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { patientSchema } from "@/lib/schemas/patient.schema";

export async function createPatient(data: z.infer<typeof patientSchema>) {
  try {
    // Validation des données avec Zod
    const validatedData = patientSchema.parse(data);

    // Génération automatique du numéro de fiche : P-[Année]-[NombreAléatoire]
    // Exemple : P-2026-12345
    const annee = new Date().getFullYear();
    const numeroAleatoire = Math.floor(10000 + Math.random() * 90000); 
    const numeroFiche = `P-${annee}-${numeroAleatoire}`;

    // Insertion dans la base de données via Drizzle
    await db.insert(patients).values({
      ...validatedData,
      numeroFiche,
      dateNaissance: validatedData.dateNaissance.toISOString().split('T')[0],
      pereReligion: validatedData.pereReligion as any,
      mereReligion: validatedData.mereReligion as any
    } as any);

    // Revalider le cache pour mettre à jour la liste des patients
    revalidatePath("/dashboard/patients");

    return { 
      success: true, 
      message: "Patient enregistré avec succès",
      numeroFiche 
    };
  } catch (error) {
    console.error("Erreur l'ors de l'enregistrement du patient :", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Erreur de validation des données", details: error.errors };
    }
    return { success: false, error: "Erreur interne lors de l'enregistrement du patient" };
  }
}
