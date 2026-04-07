import { pgTable, text, varchar, date, integer, boolean, pgEnum, uuid, timestamp } from "drizzle-orm/pg-core";

// Enums pour le Patient
export const sexeEnum = pgEnum("sexe", ["Masculin", "Féminin"]);
export const typeResidenceEnum = pgEnum("type_residence", ["Urbain", "Péri-urbain", "Rural"]);

// Enums pour les Parents/Tuteurs
export const parentEtatEnum = pgEnum("parent_etat", ["Vivant", "Décédé", "Invalide", "Abandon"]);
export const parentNiveauScolaireEnum = pgEnum("parent_niveau_scolaire", [
  "Non scolarisé",
  "Primaire",
  "Secondaire",
  "Universitaire",
  "Post-universitaire",
]);
export const parentProfessionEnum = pgEnum("parent_profession", [
  "Secteur public",
  "Secteur privé formel",
  "Indépendant formel",
  "Secteur informel",
  "Travail précaire",
  "Sans emploi",
]);
export const parentRevenusEnum = pgEnum("parent_revenus", [
  "<1x SMIC (<36.000)",
  "1-2x SMIC (36.000-72.000)",
  "2-5x SMIC (72.000-180.000)",
  "5-10x SMIC (180.000-360.000)",
  "10-15xSMIC (360.000-540.000)",
  "15-20xSMIC (540.000-720.000)",
  "20-25xSMIC (720.000-900.000)",
  ">25xSMIC",
]);

export const parentSituationMatrimonialeEnum = pgEnum("parent_situation_matrimoniale", [
  "Célibataire",
  "Marié Monogame",
  "Marié Polyandre",
  "Marié Polygame",
  "Veuf",
  "Divorcé",
  "Séparation de corps",
]);

export const parentReligionEnum = pgEnum("parent_religion", [
  "Christianisme",
  "Islam",
  "Animisme",
  "Témoin de Jehova",
  "Inconnue",
]);

export const groupeSanguinEnum = pgEnum("groupe_sanguin", [
  "A+", "B+", "AB+", "A-", "B-", "AB-", "O+", "O-"
]);

export const electrophoreseEnum = pgEnum("electrophorese", [
  "AA", "AS", "SS"
]);

// Table Patient
export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  numeroFiche: varchar("numero_fiche", { length: 50 }).unique().notNull(), // N° .../2026
  noms: varchar("noms", { length: 255 }).notNull(),
  prenoms: varchar("prenoms", { length: 255 }),
  dateNaissance: date("date_naissance"),
  telephone: varchar("telephone", { length: 50 }),
  lieuNaissance: varchar("lieu_naissance", { length: 255 }), // from "Lieu"
  ageMois: integer("age_mois"),
  ageAnnees: integer("age_annees"),
  sexe: sexeEnum("sexe"),
  typeResidence: typeResidenceEnum("type_residence"),
  lieuResidence: varchar("lieu_residence", { length: 255 }),
  scolarise: boolean("scolarise"),
  personnesVivantsAvec: varchar("personnes_vivants_avec", { length: 255 }), // Père, Mère, Tuteur, etc.

  // INFORMATION DU PERE ET OU TUTEUR
  pereNom: varchar("pere_nom", { length: 255 }),
  pereEtat: parentEtatEnum("pere_etat"),
  pereTelClassique: varchar("pere_tel_classique", { length: 50 }),
  pereTelWhatsapp: varchar("pere_tel_whatsapp", { length: 50 }),
  pereAge: integer("pere_age"),
  pereNiveauScolaire: parentNiveauScolaireEnum("pere_niveau_scolaire"),
  pereProfession: parentProfessionEnum("pere_profession"),
  pereRevenus: parentRevenusEnum("pere_revenus"),
  pereSituationMatrimoniale: parentSituationMatrimonialeEnum("pere_situation_matrimoniale"),
  pereReligion: parentReligionEnum("pere_religion"),
  pereGroupeSanguin: groupeSanguinEnum("pere_groupe_sanguin"),
  pereElectrophorese: electrophoreseEnum("pere_electrophorese"),

  // INFORMATION DE LA MERE/TUTRICE
  mereNom: varchar("mere_nom", { length: 255 }),
  mereEtat: parentEtatEnum("mere_etat"),
  mereTelClassique: varchar("mere_tel_classique", { length: 50 }),
  mereTelWhatsapp: varchar("mere_tel_whatsapp", { length: 50 }),
  mereAge: integer("mere_age"),
  mereNiveauScolaire: parentNiveauScolaireEnum("mere_niveau_scolaire"),
  mereProfession: parentProfessionEnum("mere_profession"),
  mereRevenus: parentRevenusEnum("mere_revenus"),
  mereSituationMatrimoniale: parentSituationMatrimonialeEnum("mere_situation_matrimoniale"),
  mereReligion: parentReligionEnum("mere_religion"),
  mereGroupeSanguin: groupeSanguinEnum("mere_groupe_sanguin"),
  mereElectrophorese: electrophoreseEnum("mere_electrophorese"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table Medecin
export const medecins = pgTable("medecins", {
  numeroSerie: varchar("numero_serie", { length: 100 }).primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  prenom: varchar("prenom", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  telephone: varchar("telephone", { length: 50 }),
  specialite: varchar("specialite", { length: 255 }),
  motDePasse: varchar("mot_de_passe", { length: 255 }).notNull(), // Hashed password
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
