"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { patientSchema } from "@/lib/schemas/patient.schema";
import { eq, ilike, or, desc } from "drizzle-orm";

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

/**
 * Supprime un patient de la base de données
 */
export async function deletePatient(id: string) {
  try {
    await db.delete(patients).where(eq(patients.id, id));
    revalidatePath("/dashboard/patients");
    return { success: true, message: "Patient supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression du patient :", error);
    return { success: false, error: "Impossible de supprimer le patient" };
  }
}

/**
 * Récupère tous les patients avec recherche
 */
export async function getPatients(search?: string) {
  try {
    if (!search) {
      return await db.query.patients.findMany({
        orderBy: [desc(patients.createdAt)],
      });
    }

    const tSearch = `%${search}%`;

    return await db.query.patients.findMany({
      where: or(
        ilike(patients.noms, tSearch),
        ilike(patients.prenoms, tSearch),
        ilike(patients.numeroFiche, tSearch),
        ilike(patients.telephone, tSearch)
      ),
      orderBy: [desc(patients.createdAt)],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des patients :", error);
    return [];
  }
}

/**
 * Récupère un patient par son ID
 */
export async function getPatientById(id: string) {
  try {
    return await db.query.patients.findFirst({
      where: eq(patients.id, id),
    });
  } catch (error) {
    console.error("Erreur l'ors de la récupération du patient :", error);
    return null;
  }
}
