import { getPatientById } from "@/app/actions/patient.actions";
import { getExamenParacliniqueByPatientId } from "@/app/actions/examen-paraclinique.actions";
import { ExamenParacliniqueForm } from "@/components/patients/examen-paraclinique-form";
import { notFound } from "next/navigation";
import { ChevronRight, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamenParacliniquePage({ params }: PageProps) {
  const { id } = await params;
  
  const patient = await getPatientById(id);
  if (!patient) notFound();

  const initialData = await getExamenParacliniqueByPatientId(id);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span>Patients</span>
          <ChevronRight className="h-4 w-4" />
          <span>{patient.noms} {patient.prenoms}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-900">Bilan Paraclinique</span>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                    <FlaskConical className="h-8 w-8 text-indigo-600" />
                    Bilan Paraclinique de Base
                </h1>
                <p className="text-muted-foreground mt-1">
                    Enregistrez les résultats des examens biologiques de base pour le suivi clinique.
                </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border-indigo-200">
                Patient: {patient.numeroFiche}
            </Badge>
        </div>
      </div>

      <ExamenParacliniqueForm patientId={id} initialData={initialData} />
    </div>
  );
}
