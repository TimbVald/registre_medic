import { getPatientById } from "@/app/actions/patient.actions";
import { MedicalRecordReport } from "@/components/patients/medical-record-report";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PatientDossierPage({ params }: { params: any }) {
  const resolvedParams = params instanceof Promise ? await params : await Promise.resolve(params);
  const { id } = resolvedParams;

  if (!id) {
    notFound();
  }

  const session = await getSession();
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  // Sécurité : Un patient ne peut voir que SON propre dossier
  if (session?.user?.role === "PATIENT" && session?.user?.id !== patient.id) {
    redirect(`/dashboard/patients/${session.user.id}/dossier`);
  }

  return (
    <div className="min-h-screen bg-zinc-100/50 py-10 print:p-0 print:bg-white">
      <MedicalRecordReport patient={patient} />
    </div>
  );
}
