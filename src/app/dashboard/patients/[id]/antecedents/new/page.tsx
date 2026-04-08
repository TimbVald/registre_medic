import { getAntecedentsByPatientId } from "@/app/actions/antecedent.actions";
import { getPatientById } from "@/app/actions/patient.actions";
import { AntecedentForm } from "@/components/patients/antecedent-form";
import { notFound } from "next/navigation";
import { ChevronRight, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewAntecedentsPage({ params }: PageProps) {
  const { id } = await params;
  
  const patient = await getPatientById(id);
  if (!patient) notFound();

  const initialData = await getAntecedentsByPatientId(id);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span>Patients</span>
          <ChevronRight className="h-4 w-4" />
          <span>{patient.noms} {patient.prenoms}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-900">Antécédents</span>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
                    <History className="h-8 w-8 text-primary" />
                    Saisie des Antécédents
                </h1>
                <p className="text-muted-foreground mt-1">
                    Enregistrez l'histoire médicale complète de la drépanocytose pour ce patient.
                </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs font-bold bg-primary/5 text-primary border-primary/20">
                Patient: {patient.numeroFiche}
            </Badge>
        </div>
      </div>

      <AntecedentForm patientId={id} initialData={initialData} />
    </div>
  );
}
