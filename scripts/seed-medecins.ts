import "dotenv/config";
import { db } from "../src/db";
import { medecins } from "../src/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding médecins...");

  const medecinsSeed = [
    {
      numeroSerie: "MED-2026-001",
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@clinique.com",
      telephone: "+237690000001",
      specialite: "Hématologie pédiatrique",
      motDePasse: "motdepasse123",
    },
    {
      numeroSerie: "MED-2026-002",
      nom: "Mbarga",
      prenom: "Sophie",
      email: "sophie.mbarga@clinique.com",
      telephone: "+237690000002",
      specialite: "Pédiatrie",
      motDePasse: "motdepasse456",
    },
  ];

  for (const medecin of medecinsSeed) {
    const hashedPassword = await bcrypt.hash(medecin.motDePasse, 10);

    await db
      .insert(medecins)
      .values({
        numeroSerie: medecin.numeroSerie,
        nom: medecin.nom,
        prenom: medecin.prenom,
        email: medecin.email,
        telephone: medecin.telephone,
        specialite: medecin.specialite,
        motDePasse: hashedPassword,
      })
      .onConflictDoNothing();

    console.log(`✅ Médecin inséré : ${medecin.prenom} ${medecin.nom} (${medecin.numeroSerie})`);
  }

  console.log("\n✅ Seeding terminé !");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur lors du seeding :", err);
  process.exit(1);
});
