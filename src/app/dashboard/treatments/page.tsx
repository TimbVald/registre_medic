import Link from "next/link";
import { Activity, Search, Pill, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockPrescriptions } from "@/lib/mock-data";

export default function TreatmentsPage() {
  const activePrescriptions = mockPrescriptions.filter(p => p.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-900">Suivi des Traitements</h2>
        <p className="text-muted-foreground mt-1">
          Visualisez l'état des traitements en cours pour tous les patients.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un traitement..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activePrescriptions.map((rx) => (
          <Link key={rx.id} href={`/dashboard/patients/${rx.patientId}`}>
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-emerald-500 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rx.patient?.id}`} />
                  <AvatarFallback>{rx.patient?.firstName?.[0]}{rx.patient?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-medium">{rx.patient?.firstName} {rx.patient?.lastName}</CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 mt-1">
                    En cours
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-4 space-y-3">
                {rx.medications.map((med, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <Pill className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-slate-900">{med.medication}</span>
                      <div className="text-muted-foreground text-xs">{med.dosage} • {med.frequency}</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 pt-4 border-t">
                  <Activity className="h-3 w-3" />
                  <span>Prescrit le {new Date(rx.date).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
