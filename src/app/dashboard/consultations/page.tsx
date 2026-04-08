import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationsList } from "@/components/consultations/consultations-list";
import { getConsultations } from "@/app/actions/patient.actions";

export default async function ConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const consultations = await getConsultations(query);

  // Mappe les données réelles vers le type attendu par ConsultationsList si nécessaire
  // Le type Consultation attendu par ConsultationsList est différent du schéma DB.
  // On va adapter ConsultationsList pour supporter les deux ou créer une version pour les données réelles.
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Consultations</h2>
        <Link href="/dashboard/patients">
          <Button className="rounded-xl shadow-lg shadow-primary/20 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Consultation
          </Button>
        </Link>
      </div>

      <ConsultationsList consultations={consultations as any} />
    </div>
  );
}
