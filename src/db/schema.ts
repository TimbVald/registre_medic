import { pgTable, text, varchar, date, integer, boolean, pgEnum, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  email: varchar("email", { length: 255 }),
  lieuNaissance: varchar("lieu_naissance", { length: 255 }), // from "Lieu"
  ageMois: integer("age_mois"),
  ageAnnees: integer("age_annees"),
  sexe: sexeEnum("sexe"),
  typeResidence: typeResidenceEnum("type_residence"),
  lieuResidence: varchar("lieu_residence", { length: 255 }),
  scolarise: boolean("scolarise"),
  personnesVivantsAvec: varchar("personnes_vivants_avec", { length: 255 }), // Père, Mère, Tuteur, etc.
  groupeSanguin: groupeSanguinEnum("groupe_sanguin"),

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
// --- Nouveaux Enums pour les Antécédents ---
export const depistageTypeEnum = pgEnum("depistage_type", ["Anténatal", "Néonatal", "Post-natal"]);
export const familleLienEnum = pgEnum("famille_lien", ["Fratrie", "Famille paternelle", "Famille maternelle"]);
export const nbCasEnum = pgEnum("nb_cas", ["01", "02", "03", "04", "Plus"]);

// --- Table Antécédents ---
export const antecedents = pgTable("antecedents", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  
  // Âge de découverte
  ageDecouverteAnnees: integer("age_decouverte_annees"),
  ageDecouverteMois: integer("age_decouverte_mois"),
  
  // Circonstances de découverte
  circonstancesDecouverte: text("circonstances_decouverte").array(), // Multi-select
  typeDepistage: depistageTypeEnum("type_depistage"),
  
  // Histoire Familiale
  notionFamilleDrepanocytose: boolean("notion_famille_drepanocytose").default(false),
  liensFamille: familleLienEnum("liens_famille").array(), // Multi-select
  nbFreresSoeursDrepanocytaires: nbCasEnum("nb_freres_soeurs_drepanocytaires"),
  decesFamilleDrepanocytose: boolean("deces_famille_drepanocytose").default(false),
  nbDecesFamille: nbCasEnum("nb_deces_famille"),
  
  // Complications
  complicationsAigues: text("complications_aigues").array(), // Multi-select (Anémie, Crise, etc.)
  complicationsChroniques: text("complications_chroniques").array(), // Multi-select
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Enums pour les Examens Paracliniques ---
export const causeNonRealisationEnum = pgEnum("cause_non_realisation", [
  "Manque d'argent",
  "Distance/Transport difficile",
  "Manque de compréhension de l'utilité",
  "Manque de temps/Travail",
  "Charge familiale",
  "Manque de rappel",
  "Autre"
]);

export const interpretationHemoEnum = pgEnum("interpretation_hemo", ["Normal", "Diminué (Anémie)", "Augmenté (Polyglobulie)"]);
export const interpretationReticEnum = pgEnum("interpretation_retic", ["Normal", "Diminué (Production médullaire insuffisante)", "Augmenté (Réponse médullaire accrue)"]);
export const interpretationGBEnum = pgEnum("interpretation_gb", ["Normal", "Diminué (Leucopénie)", "Augmenté (Leucocytose)"]);
export const interpretationPlaqEnum = pgEnum("interpretation_plaq", ["Normal", "Diminué (Thrombopénie)", "Augmenté (Thrombocytose)"]);
export const interpretationAsatAlatEnum = pgEnum("interpretation_asat_alat", ["Normal", "Augmenté (Cytolyse hépatite)"]);

// --- Table Examens Paracliniques ---
export const examensParacliniques = pgTable("examens_paracliniques", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  
  // Hémoglobine
  hemoRealise: boolean("hemo_realise").default(false),
  hemoCause: causeNonRealisationEnum("hemo_cause"),
  hemoTauxBase: varchar("hemo_taux_base", { length: 100 }),
  hemoTauxRecent: varchar("hemo_taux_recent", { length: 100 }),
  hemoInterpretation: interpretationHemoEnum("hemo_interpretation"),
  
  // Réticulocytes
  reticRealise: boolean("retic_realise").default(false),
  reticCause: causeNonRealisationEnum("retic_cause"),
  reticTauxBase: varchar("retic_taux_base", { length: 100 }),
  reticTauxRecent: varchar("retic_taux_recent", { length: 100 }),
  reticInterpretation: interpretationReticEnum("retic_interpretation"),

  // Globules Blancs
  gbRealise: boolean("gb_realise").default(false),
  gbCause: causeNonRealisationEnum("gb_cause"),
  gbTauxBase: varchar("gb_taux_base", { length: 100 }),
  gbTauxRecent: varchar("gb_taux_recent", { length: 100 }),
  gbInterpretation: interpretationGBEnum("gb_interpretation"),

  // Plaquettes
  plaqRealise: boolean("plaq_realise").default(false),
  plaqCause: causeNonRealisationEnum("plaq_cause"),
  plaqTauxBase: varchar("plaq_taux_base", { length: 100 }),
  plaqTauxRecent: varchar("plaq_taux_recent", { length: 100 }),
  plaqInterpretation: interpretationPlaqEnum("plaq_interpretation"),

  // ASAT/ALAT
  asatAlatRealise: boolean("asat_alat_realise").default(false),
  asatAlatCause: causeNonRealisationEnum("asat_alat_cause"),
  asatAlatTauxBase: varchar("asat_alat_taux_base", { length: 100 }),
  asatAlatInterpretation: interpretationAsatAlatEnum("asat_alat_interpretation"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Enums pour les Consultations ---
export const etatGeneralEnum = pgEnum("etat_general", ["Satisfaisant", "Non satisfaisant"]);
export const rdvHonoreEnum = pgEnum("rdv_honore", ["Oui", "Non"]);
export const frequenceRappelEnum = pgEnum("frequence_rappel", ["01 fois/sem.", "02 fois/sem.", "03 fois/sem."]);
export const modeRappelEnum = pgEnum("mode_rappel", ["SMS classique", "Appel classique", "WhatsApp (SMS)", "Email"]);
export const conclusionTraitementEnum = pgEnum("conclusion_traitement", ["Adhérence", "Compliance", "Observance"]);
export const regulariteTraitementEnum = pgEnum("regularite_traitement", ["Régulier", "Irrégulier"]);
export const typeConsultationEnum = pgEnum("type_consultation", ["Systématique"]);

// --- Table Consultations Externes ---
export const consultationsExternes = pgTable("consultations_externes", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  dateConsultation: date("date_consultation").defaultNow().notNull(),
  typeConsultation: typeConsultationEnum("type_consultation").notNull(),
  
  // Paramètres
  etatGeneral: etatGeneralEnum("etat_general"),
  temperature: varchar("temperature", { length: 10 }),
  fc: varchar("fc", { length: 10 }),
  fr: varchar("fr", { length: 10 }),
  pa: varchar("pa", { length: 20 }),
  sao2: varchar("sao2", { length: 10 }),
  
  // Plaintes
  plaintesExist: boolean("plaintes_exist").default(false),
  plaintesDetails: text("plaintes_details").array(), // Multi-select symptoms
  plaintesAutre: text("plaintes_autre"),
  
  // Données RDV
  dateRdvPrevue: date("date_rdv_prevue"),
  rdvHonore: rdvHonoreEnum("rdv_honore"),
  rappelFrequence: frequenceRappelEnum("rappel_frequence"),
  rappelReception: boolean("rappel_reception").default(false),
  rappelRetour: boolean("rappel_retour").default(false),
  rappelMode: modeRappelEnum("rappel_mode"),
  causeNonHonore: text("cause_non_honore"),
  
  // Traitement (Stockés en JSON pour la flexibilité des posologies/causes)
  traitementAcideFolique: jsonb("traitement_acide_folique"),
  traitementHydroxyuree: jsonb("traitement_hydroxyuree"),
  traitementAntibioProphylaxie: jsonb("traitement_antibio_prophylaxie"),
  traitementHydratation: jsonb("traitement_hydratation"),
  traitementAutres: jsonb("traitement_autres"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Table Hospitalisations ---
export const hospitalisations = pgTable("hospitalisations", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  dateHospitalisation: date("date_hospitalisation").defaultNow().notNull(),
  agePatient: integer("age_patient"), // Âge au moment de l'hospitalisation
  
  // Paramètres
  temperature: varchar("temperature", { length: 10 }),
  fc: varchar("fc", { length: 10 }),
  fr: varchar("fr", { length: 10 }),
  pa: varchar("pa", { length: 20 }),
  sao2: varchar("sao2", { length: 10 }),
  
  // Plaintes (JSON complexe pour les sous-catégories)
  plaintesExist: boolean("plaintes_exist").default(false),
  detailsPlaintes: jsonb("details_plaintes"),
  
  // Traitements (JSON pour Posologie, Régularité, Causes, Conclusion)
  traitementAcideFolique: jsonb("traitement_acide_folique"),
  traitementHydroxyuree: jsonb("traitement_hydroxyuree"),
  traitementAntibioProphylaxie: jsonb("traitement_antibio_prophylaxie"),
  traitementHydratation: jsonb("traitement_hydratation"),
  
  // Résumé et Suivi
  resume: text("resume"),
  dateProchainRdv: date("date_prochain_rdv"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Table Historique des Notifications ---
export const notificationsLogs = pgTable("notifications_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id, { onDelete: "cascade" }),
  consultationId: uuid("consultation_id").references(() => consultationsExternes.id, { onDelete: "set null" }),
  type: varchar("type", { length: 50 }).notNull(), // "Email", "SMS", "WhatsApp"
  destinataire: varchar("destinataire", { length: 255 }).notNull(),
  statut: varchar("statut", { length: 50 }).notNull(), // "Success", "Error"
  messageId: varchar("message_id", { length: 255 }), // ID fourni par Resend
  erreur: text("erreur"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Relations ---
export const patientsRelations = relations(patients, ({ many }) => ({
  antecedents: many(antecedents),
  examensParacliniques: many(examensParacliniques),
  consultationsExternes: many(consultationsExternes),
  hospitalisations: many(hospitalisations),
}));

export const antecedentsRelations = relations(antecedents, ({ one }) => ({
  patient: one(patients, {
    fields: [antecedents.patientId],
    references: [patients.id],
  }),
}));

export const examensParacliniquesRelations = relations(examensParacliniques, ({ one }) => ({
  patient: one(patients, {
    fields: [examensParacliniques.patientId],
    references: [patients.id],
  }),
}));

export const consultationsExternesRelations = relations(consultationsExternes, ({ one }) => ({
  patient: one(patients, {
    fields: [consultationsExternes.patientId],
    references: [patients.id],
  }),
}));

export const notificationsLogsRelations = relations(notificationsLogs, ({ one }) => ({
  patient: one(patients, {
    fields: [notificationsLogs.patientId],
    references: [patients.id],
  }),
  consultation: one(consultationsExternes, {
    fields: [notificationsLogs.consultationId],
    references: [consultationsExternes.id],
  }),
}));

export const hospitalisationsRelations = relations(hospitalisations, ({ one }) => ({
  patient: one(patients, {
    fields: [hospitalisations.patientId],
    references: [patients.id],
  }),
}));
