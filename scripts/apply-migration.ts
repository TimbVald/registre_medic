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

  // Trouver le fichier de migration le plus récent
  const migrationsDir = path.join(process.cwd(), "supabase/migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort((a, b) => b.localeCompare(a)); // Plus récent en premier

  if (files.length === 0) {
    console.error("❌ Aucun fichier de migration trouvé dans", migrationsDir);
    process.exit(1);
  }

  const migrationFile = path.join(migrationsDir, files[0]);

  console.log(`🚀 Application de la migration SQL : ${files[0]}...`);
  const sqlContent = fs.readFileSync(migrationFile, "utf8");

  try {
    // Découper par statement si nécessaire, mais postgres.js peut gérer les blocs
    // Drizzle utilise --> statement-breakpoint
    const statements = sqlContent.split("--> statement-breakpoint");

    for (const statement of statements) {
      const cleanStatement = statement.trim();
      if (!cleanStatement) continue;
      if (cleanStatement.startsWith("--")) continue;
      
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
