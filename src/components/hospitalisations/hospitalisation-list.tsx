"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, 
  Activity, 
  ChevronRight, 
  Pill, 
  Thermometer,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteHospitalisation } from "@/app/actions/hospitalisation.actions";
import { toast } from "sonner";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  hospitalisations: any[];
  patientId: string;
}

export function HospitalisationList({ hospitalisations, patientId }: Props) {
  const [isPending, startTransition] = useTransition();

  if (hospitalisations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border border-dashed rounded-3xl space-y-4">
        <Activity className="h-12 w-12 text-muted-foreground/40" />
        <div className="text-center">
          <p className="font-bold text-zinc-500">Aucune hospitalisation enregistrée</p>
          <p className="text-sm text-muted-foreground">Les dossiers d'hospitalisation apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteHospitalisation(id, patientId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      {hospitalisations.map((h) => (
        <Card key={h.id} className="group overflow-hidden border-none shadow-sm ring-1 ring-border hover:ring-primary/20 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
              {/* DATE & IDENTIFIANT */}
              <div className="flex items-center gap-4 min-w-[180px]">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900">
                    {format(new Date(h.dateHospitalisation), "dd MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    ID: {h.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              {/* PARAMÈTRES RÉSUMÉS */}
              <div className="flex flex-wrap gap-3 flex-1">
                {h.temperature && (
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-100 rounded-lg px-3 py-1 gap-1.5 flex items-center">
                    <Thermometer className="h-3 w-3" /> {h.temperature}°C
                  </Badge>
                )}
                {h.fc && (
                   <Badge variant="secondary" className="bg-rose-50 text-rose-700 border-rose-100 rounded-lg px-3 py-1 flex items-center gap-1.5">
                    <Activity className="h-3 w-3" /> FC: {h.fc}
                  </Badge>
                )}
                {h.sao2 && (
                   <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-lg px-3 py-1 flex items-center gap-1.5">
                    SaO2: {h.sao2}%
                  </Badge>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 mt-4 md:mt-0 justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-destructive transition-colors rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" /> Confirmation de suppression
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce dossier d'hospitalisation ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(h.id)} className="bg-destructive hover:bg-destructive/90 rounded-xl">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="outline" className="rounded-xl gap-2 font-bold group-hover:bg-primary group-hover:text-white transition-all border-zinc-200">
                  Détails <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* TRAITEMENTS ACTIFS */}
            <div className="px-6 pb-6 pt-0 flex gap-4 overflow-x-auto no-scrollbar">
              {["traitementAcideFolique", "traitementHydroxyuree", "traitementAntibioProphylaxie", "traitementHydratation"].map(key => {
                if (h[key]?.active) {
                  const label = key.replace("traitement", "").replace(/([A-Z])/g, ' $1').trim();
                  return (
                    <div key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100 shrink-0">
                      <Pill className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-bold text-zinc-600 uppercase">{label}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
