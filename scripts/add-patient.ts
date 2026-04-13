import { db } from "../src/db";
import { patients } from "../src/db/schema";
import "dotenv/config";

async function main() {
  const patientData = {
    id: "aeeb2af9-97f2-46da-a6be-a0fbbadd3793",
    numeroFiche: "P-2026-29872",
    noms: "Toukam Kegne",
    prenoms: "Divine",
    dateNaissance: "2018-09-03",
    telephone: "698031644",
    email: null,
    lieuNaissance: "Cite Verte",
    ageMois: 7,
    ageAnnees: 7,
    sexe: "Féminin" as any,
    typeResidence: "Péri-urbain" as any,
    lieuResidence: "Nkolbisson",
    scolarise: true,
    personnesVivantsAvec: "Mère ",
    pereNom: "",
    pereEtat: null as any,
    mereNom: "Meno Marie",
    mereEtat: "Vivant" as any,
    mereTelClassique: "698031644",
    mereTelWhatsapp: "698031644",
    mereAge: 42,
    mereNiveauScolaire: "Secondaire" as any,
    mereProfession: "Secteur informel" as any,
    mereRevenus: "1-2x SMIC (36.000-72.000)" as any,
    mereSituationMatrimoniale: "Marié Monogame" as any,
    mereReligion: "Christianisme" as any,
    mereGroupeSanguin: "AB+" as any,
    mereElectrophorese: "AS" as any,
  };

  console.log("📥 Ajout du patient Divine...");

  try {
    await db.insert(patients).values(patientData);
    console.log("✅ Patient ajouté avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du patient :", error);
  }

  process.exit(0);
}

main();
