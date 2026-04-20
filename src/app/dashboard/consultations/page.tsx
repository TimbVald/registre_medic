import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationsList } from "@/components/consultations/consultations-list";
import { getAllConsultations } from "@/app/actions/consultation.actions";

export default async function ConsultationsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const consultations = await getAllConsultations();

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">Consultations</h2>
          <p className="text-zinc-500 mt-2 font-medium">
            Historique complet des sessions de suivi et examens cliniques.
          </p>
        </div>
        <Link href="/dashboard/patients">
          <Button className="rounded-2xl h-12 px-6 shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 font-bold">
            <Plus className="mr-2 h-5 w-5" />
            Nouvelle Consultation
          </Button>
        </Link>
      </div>

      <ConsultationsList consultations={consultations as any} initialSearch={query} />
    </div>
  );
}
