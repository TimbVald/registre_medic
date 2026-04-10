import { Resend } from "resend";
import { ReminderEmail } from "@/emails/ReminderEmail";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendReminderEmailProps {
  email: string;
  patientName: string;
  appointmentDate: string;
  appointmentType: string;
}

/**
 * Envoie un email de rappel de rendez-vous via Resend
 */
export async function sendReminderEmail({
  email,
  patientName,
  appointmentDate,
  appointmentType,
}: SendReminderEmailProps) {
  try {
    const data = await resend.emails.send({
      from: "MediCare Clinique <notifications@resend.dev>", // Utiliser un domaine vérifié en production
      to: email,
      subject: "🔔 Rappel de votre rendez-vous - MediCare",
      react: ReminderEmail({
        patientName,
        appointmentDate,
        appointmentType,
      }) as React.ReactElement,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Erreur d'envoi d'email via Resend:", error);
    return { success: false, error };
  }
}
