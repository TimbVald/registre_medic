import Link from "next/link";
import { Activity, Search, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPrescriptions } from "@/app/actions/prescription.actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function TreatmentsPage() {
  const prescriptions = await getPrescriptions();
  const activePrescriptions = prescriptions.filter(p => p.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-900">Suivi des Traitements</h2>
          <p className="text-muted-foreground mt-1">
            Visualisez l'état des traitements en cours pour tous les patients.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un traitement..."
            className="pl-9 rounded-xl border-zinc-200 bg-zinc-50/50"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activePrescriptions.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground italic border-2 border-dashed border-zinc-100 rounded-3xl">
            Aucun traitement actif en cours.
          </div>
        ) : (
          activePrescriptions.map((rx) => (
            <Link key={rx.id} href={`/dashboard/patients/${rx.patientId}`}>
              <Card className="group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer border-none shadow-sm ring-1 ring-zinc-100 rounded-2xl overflow-hidden flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 bg-zinc-50/30">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rx.patient?.id}`} />
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                      {rx.patient?.noms?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {rx.patient?.noms} {rx.patient?.prenoms}
                    </CardTitle>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 mt-1 rounded-lg text-[10px] font-bold uppercase tracking-wider h-5">
                      En cours
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="mt-4 flex-1 space-y-4">
                  <div className="space-y-3">
                    {(rx.medications as { medication: string, dosage: string, frequency: string, duration: string }[]).map((med, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="h-5 w-5 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Pill className="h-3 w-3 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-800 leading-tight">{med.medication}</div>
                          <div className="text-[11px] text-zinc-400 font-medium">{med.dosage} • {med.frequency} • {med.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground mt-4 pt-4 border-t border-zinc-50 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3" />
                      <span>DEPUIS LE {format(new Date(rx.date), "dd/MM/yyyy", { locale: fr })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
