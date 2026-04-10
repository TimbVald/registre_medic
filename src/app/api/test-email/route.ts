import { NextRequest, NextResponse } from "next/server";
import { sendReminderEmail } from "@/lib/mail";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("to") || "test@example.com";

  try {
    const result = await sendReminderEmail({
      email: email,
      patientName: "Patient de Test",
      appointmentDate: "12 Avril 2026",
      appointmentType: "Consultation de Routine",
    });

    if (result.success) {
      return NextResponse.json({ 
        message: "Email envoyé avec succès !", 
        data: result.data 
      });
    } else {
      return NextResponse.json({ 
        message: "Échec de l'envoi", 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
