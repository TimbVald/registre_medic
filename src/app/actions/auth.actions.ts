"use server";

import { db } from "@/db";
import { medecins, patients } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { login } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Authentification du Patient (Vérification multi-critères sans mot de passe)
 */
export async function loginPatient(formData: FormData) {
  const noms = formData.get("noms") as string;
  const prenoms = formData.get("prenoms") as string;
  const dateNaissance = formData.get("dateNaissance") as string; // format YYYY-MM-DD
  const telephone = formData.get("telephone") as string;

  if (!noms || !prenoms || !dateNaissance || !telephone) {
    return { error: "Tous les champs sont obligatoires." };
  }

  try {
    const patientFound = await db.query.patients.findFirst({
      where: and(
        eq(patients.noms, noms),
        eq(patients.prenoms, prenoms),
        eq(patients.dateNaissance, dateNaissance),
        eq(patients.telephone, telephone)
      ),
    });

    if (!patientFound) {
      return { error: "Informations incorrectes. Aucun patient correspondant n'a été trouvé." };
    }

    // Connecter le patient
    await login({
      id: patientFound.id,
      role: "PATIENT",
      name: `${patientFound.noms} ${patientFound.prenoms}`,
    });

    // Rediriger vers le dossier patient
    redirect(`/dashboard/patients/${patientFound.id}`);
  } catch (error) {
    console.error("Erreur login patient:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    return { error: "Une erreur est survenue lors de l'authentification." };
  }
}

/**
 * Authentification du Médecin (Numéro de série + Mot de passe)
 */
export async function loginMedecin(formData: FormData) {
  const numeroSerie = formData.get("numeroSerie") as string;
  const motDePasse = formData.get("motDePasse") as string;

  if (!numeroSerie || !motDePasse) {
    return { error: "Numéro de série et mot de passe requis." };
  }

  try {
    const medecinFound = await db.query.medecins.findFirst({
      where: eq(medecins.numeroSerie, numeroSerie),
    });

    if (!medecinFound) {
      return { error: "Numéro de série ou mot de passe incorrect." };
    }

    const isPasswordValid = await bcrypt.compare(motDePasse, medecinFound.motDePasse);

    if (!isPasswordValid) {
      return { error: "Numéro de série ou mot de passe incorrect." };
    }

    // Connecter le médecin
    await login({
      id: medecinFound.numeroSerie,
      role: "MEDECIN",
      name: `${medecinFound.nom} ${medecinFound.prenom}`,
    });

  } catch (error) {
    console.error("Erreur login médecin:", error);
    return { error: "Une erreur est survenue lors de l'authentification." };
  }

  redirect("/dashboard");
}

/**
 * Déconnexion de l'utilisateur
 */
export async function logout() {
  const { logout: authLogout } = await import("@/lib/auth");
  await authLogout();
}
