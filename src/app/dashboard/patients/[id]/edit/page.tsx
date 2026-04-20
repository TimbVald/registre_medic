import PatientForm from "@/components/patients/patient-form";
import { getPatientById } from "@/app/actions/patient.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function EditPatientPage({ params }: { params: any }) {
  const resolvedParams = params instanceof Promise ? await params : await Promise.resolve(params);
  const { id } = resolvedParams;
  
  if (!id) {
    notFound();
  }

  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-700">
      {/* Navigation & Context */}
      <div className="flex flex-col gap-6">
        <Link 
          href={`/dashboard/patients/${patient.id}`} 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour au dossier patient
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm ring-1 ring-zinc-100">
           <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                 <EditIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Modifier le Profil</h1>
                <p className="text-sm font-medium text-zinc-400 mt-1 italic">
                  Édition des informations de <span className="text-zinc-900 font-bold">{patient.noms} {patient.prenoms}</span>
                </p>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-1">
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-black px-4 py-1.5 text-[10px] uppercase tracking-widest rounded-full">
                  Fiche: {patient.numeroFiche}
              </Badge>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                 <ShieldCheck className="h-3 w-3" />
                 Numéro immuable
              </div>
           </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="relative">
         <PatientForm initialData={patient} />
      </div>
    </div>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
