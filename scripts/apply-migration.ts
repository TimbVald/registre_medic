import "dotenv/config";
import postgres from "postgres";
import fs from "fs";
import path from "path";

async function applyMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL manquante dans le .env");
    process.exit(1);
  }

  const sql = postgres(connectionString, { ssl: "require", prepare: false });

  // Chemin vers le fichier de migration généré par Drizzle
  const migrationFile = path.join(process.cwd(), "supabase/migrations/0004_useful_malcolm_colcord.sql");

  if (!fs.existsSync(migrationFile)) {
    console.error("❌ Fichier de migration introuvable :", migrationFile);
    process.exit(1);
  }

  console.log("🚀 Application de la migration SQL...");
  const sqlContent = fs.readFileSync(migrationFile, "utf8");

  try {
    // Découper par statement si nécessaire, mais postgres.js peut gérer les blocs
    // Drizzle utilise --> statement-breakpoint
    const statements = sqlContent.split("--> statement-breakpoint");

    for (const statement of statements) {
      const cleanStatement = statement.trim();
      if (!cleanStatement) continue;
      
      console.log(`⏳ Exécution : ${cleanStatement.substring(0, 50)}...`);
      await sql.unsafe(cleanStatement);
    }

    console.log("✅ Migration appliquée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de l'application de la migration :", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();
