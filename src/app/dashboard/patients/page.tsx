import { getPatients } from "@/app/actions/patient.actions";
import { PatientTable } from "@/components/patients/patient-table";
import { PatientSearch } from "@/components/patients/patient-search";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface PatientsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const { search } = await searchParams;
  const patientsData = await getPatients(search);

  return (
    <div className="flex flex-col gap-8 pb-8 transition-all">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Registre des Patients</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gérez la base de données des patients de la clinique ({patientsData.length} records).
          </p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Link href="/dashboard/patients/new">
            <UserPlus className="mr-2 h-4 w-4" /> Enregistrer un Patient
          </Link>
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200">
        <Suspense fallback={<Loader2 className="animate-spin text-muted-foreground h-4 w-4" />}>
           <PatientSearch />
        </Suspense>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="h-11 rounded-xl text-xs font-semibold px-4 flex-1 sm:flex-none">
                Filtrer par statut
            </Button>
            <Button variant="outline" className="h-11 rounded-xl text-xs font-semibold px-4 flex-1 sm:flex-none text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                Export PDF
            </Button>
        </div>
      </div>

      {/* Main Content Table */}
      <Suspense fallback={
        <div className="h-[400px] flex items-center justify-center rounded-xl border border-dashed border-zinc-200">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <PatientTable patients={patientsData} />
      </Suspense>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
          <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")} à {new Date().toLocaleTimeString("fr-FR")}</p>
          <p className="font-semibold text-primary"> MediCare v1.0.0</p>
      </div>
    </div>
  );
}
