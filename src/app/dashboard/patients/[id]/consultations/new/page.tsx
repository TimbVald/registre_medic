import { ConsultationForm } from "@/components/consultations/consultation-form";
import { getPatientById } from "@/app/actions/patient.actions";
import { notFound } from "next/navigation";
import { ChevronLeft, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewConsultationPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild className="-ml-2 h-8 text-zinc-500 hover:text-zinc-900">
               <Link href={`/dashboard/patients/${params.id}`}>
                 <ChevronLeft className="h-4 w-4 mr-1" /> Retour au profil
               </Link>
            </Button>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-primary" />
             </div>
             Consultation Externe Systématique
          </h2>
          <p className="text-zinc-500">
             Nouvelle session de suivi pour <span className="font-semibold text-zinc-900">{patient.noms} {patient.prenoms}</span>
          </p>
        </div>
      </div>

      <ConsultationForm patientId={params.id} />
    </div>
  );
}
