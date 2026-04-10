import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { consultationsExternes, patients, notificationsLogs } from "@/db/schema";
import { eq, and, isNotNull, gte, lte, sql } from "drizzle-orm";
import { sendReminderEmail } from "@/lib/mail";
import { addDays, format, isSameDay } from "date-fns";

// Securité : Vérifier une clé secrète pour éviter les appels abusifs
// En production, Vercel envoie un header spécifique (CRON_SECRET)
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response('Non autorisé', { status: 401 });
  }

  try {
    const today = new Date();
    const nextWeek = addDays(today, 7);

    // 1. Récupérer les consultations avec des RDV prévus dans la semaine à venir
    const pendingReminders = await db
      .select({
        consultation: consultationsExternes,
        patient: patients,
      })
      .from(consultationsExternes)
      .innerJoin(patients, eq(consultationsExternes.patientId, patients.id))
      .where(
        and(
          isNotNull(consultationsExternes.dateRdvPrevue),
          gte(consultationsExternes.dateRdvPrevue, format(today, "yyyy-MM-dd")),
          lte(consultationsExternes.dateRdvPrevue, format(nextWeek, "yyyy-MM-dd")),
          eq(consultationsExternes.rappelMode, "Email")
        )
      );

    const results = [];

    for (const item of pendingReminders) {
      const { consultation, patient } = item;
      
      if (!patient.email) continue;

      // Logique simplifiée de fréquence : 
      // Si "01 fois/sem.", on envoie à J-3.
      // Si "02 fois/sem.", on envoie à J-7 et J-2.
      // Si "03 fois/sem.", on envoie à J-7, J-4 et J-1.
      
      const rdvDate = new Date(consultation.dateRdvPrevue!);
      const diffDays = Math.ceil((rdvDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let shouldSend = false;
      const freq = consultation.rappelFrequence;

      if (freq === "01 fois/sem." && diffDays === 3) shouldSend = true;
      else if (freq === "02 fois/sem." && (diffDays === 7 || diffDays === 2)) shouldSend = true;
      else if (freq === "03 fois/sem." && (diffDays === 7 || diffDays === 4 || diffDays === 1)) shouldSend = true;

      // Forcer l'envoi pour le test si nécessaire (ex: si diffDays est 0-7 et c'est le premier jour)
      // Pour une démo réelle, on enlèverait cette souplesse.

      if (shouldSend) {
        const mailResult = await sendReminderEmail({
          email: patient.email,
          patientName: `${patient.noms} ${patient.prenoms}`,
          appointmentDate: format(rdvDate, "dd/MM/yyyy"),
          appointmentType: consultation.typeConsultation,
        });

        // 3. Enregistrer le log
        await db.insert(notificationsLogs).values({
          patientId: patient.id,
          consultationId: consultation.id,
          type: "Email",
          destinataire: patient.email,
          statut: mailResult.success ? "Success" : "Error",
          messageId: (mailResult.data as any)?.id,
          erreur: mailResult.success ? null : JSON.stringify(mailResult.error),
        });

        results.push({ patient: patient.noms, status: mailResult.success ? "Sent" : "Failed" });
      }
    }

    return NextResponse.json({ 
      message: "Traitement des rappels terminé", 
      processed: pendingReminders.length,
      sent: results 
    });

  } catch (error) {
    console.error("Erreur Cron Job Reminders:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
