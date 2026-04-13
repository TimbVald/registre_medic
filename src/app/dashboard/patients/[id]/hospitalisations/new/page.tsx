import { getPatientById } from "@/app/actions/patient.actions";
import { HospitalisationForm } from "@/components/hospitalisations/hospitalisation-form";
import { notFound } from "next/navigation";
import { ArrowLeft, BedDouble } from "lucide-react";
import Link from "next/link";

export default async function NewHospitalisationPage({ params }: { params: any }) {
  const resolvedParams = params instanceof Promise ? await params : await Promise.resolve(params);
  const { id } = resolvedParams;

  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4">
        <Link 
          href={`/dashboard/patients/${id}`} 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour au dossier patient
        </Link>
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <BedDouble className="h-8 w-8 text-blue-500" /> Nouvel Enregistrement d'Hospitalisation
          </h1>
          <p className="text-muted-foreground mt-1">Saisie complète des paramètres et soins pour <strong>{patient.noms} {patient.prenoms}</strong></p>
        </div>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm p-1 md:p-6 transition-all ring-1 ring-border">
         <HospitalisationForm 
            patientId={id} 
            patientAge={patient.ageAnnees ?? undefined} 
         />
      </div>
    </div>
  );
}
