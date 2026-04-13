"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Users, 
  Activity, 
  Stethoscope, 
  Edit3, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface AntecedentHistoryProps {
  patientId: string;
  antecedents: any | null;
}

export function AntecedentHistory({ patientId, antecedents }: AntecedentHistoryProps) {
  if (!antecedents) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-border rounded-3xl bg-card p-12 text-center flex flex-col items-center justify-center gap-6">
        <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center">
          <History className="h-10 w-10 text-amber-500/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Aucun antécédent enregistré</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Les antécédents médicaux et familiaux n'ont pas encore été renseignés pour ce patient.
          </p>
        </div>
        <Button className="rounded-xl px-8 py-6 h-auto shadow-lg shadow-amber-500/10 bg-amber-600 hover:bg-amber-700" asChild>
          <Link href={`/dashboard/patients/${patientId}/antecedents/new`}>
            Composer le dossier initial
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-amber-500" /> Historique Médical Complet
        </h2>
        <Button variant="outline" size="sm" className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50" asChild>
          <Link href={`/dashboard/patients/${patientId}/antecedents/new`}>
            <Edit3 className="mr-2 h-4 w-4" /> Mettre à jour
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DÉCOUVERTE */}
        <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden hover:ring-primary/20 transition-all">
          <CardHeader className="bg-muted/30 border-b border-border pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Découverte et Diagnostic
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <span className="text-sm text-muted-foreground font-medium">Âge au diagnostic</span>
              <span className="text-sm font-bold text-foreground">
                {antecedents.ageDecouverteAnnees} ans {antecedents.ageDecouverteMois > 0 && `et ${antecedents.ageDecouverteMois} mois`}
              </span>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Type de dépistage</span>
              <div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 rounded-lg px-2 py-0.5">
                  {antecedents.typeDepistage || "Non renseigné"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Circonstances</span>
              <div className="flex flex-wrap gap-2">
                {antecedents.circonstancesDecouverte?.length > 0 ? (
                  antecedents.circonstancesDecouverte.map((c: string) => (
                    <Badge key={c} variant="outline" className="rounded-lg bg-white shadow-sm border-zinc-200">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs italic text-muted-foreground">Aucune donnée</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HISTOIRE FAMILIALE */}
        <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden hover:ring-amber-500/20 transition-all">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700">
              <Users className="h-4 w-4" /> Histoire Familiale
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2">
              {antecedents.notionFamilleDrepanocytose ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {antecedents.notionFamilleDrepanocytose 
                  ? "Présence de cas dans la famille" 
                  : "Aucun cas familial déclaré"}
              </span>
            </div>

            {antecedents.notionFamilleDrepanocytose && (
              <div className="flex flex-wrap gap-2">
                {antecedents.liensFamille?.map((l: string) => (
                  <Badge key={l} className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none rounded-lg">
                    {l}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Fratrie atteinte</p>
                <p className="text-lg font-black text-foreground">{antecedents.nbFreresSoeursDrepanocytaires || "0"}</p>
              </div>
              <div className={`p-3 rounded-xl border ${antecedents.decesFamilleDrepanocytose ? "bg-rose-50 border-rose-100" : "bg-zinc-50 border-zinc-100"}`}>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Décès signalés</p>
                <p className={`text-lg font-black ${antecedents.decesFamilleDrepanocytose ? "text-rose-600" : "text-foreground"}`}>
                    {antecedents.nbDecesFamille || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COMPLICATIONS AIGUËS */}
        <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden hover:ring-rose-500/20 transition-all">
          <CardHeader className="bg-rose-500/10 border-b border-rose-500/20 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-500">
              <Activity className="h-4 w-4" /> Complications Aiguës
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 flex flex-wrap gap-2">
            {antecedents.complicationsAigues?.length > 0 ? (
              antecedents.complicationsAigues.map((c: string) => (
                <Badge key={c} variant="outline" className="rounded-xl border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-50">
                   {c}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic py-4 w-full text-center">Aucune complication aiguë signalée.</p>
            )}
          </CardContent>
        </Card>

        {/* COMPLICATIONS CHRONIQUES */}
        <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden hover:ring-indigo-500/20 transition-all">
          <CardHeader className="bg-indigo-500/10 border-b border-indigo-500/20 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-500">
              <Stethoscope className="h-4 w-4" /> Atteintes d'organes (Chroniques)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 flex flex-wrap gap-2">
            {antecedents.complicationsChroniques?.length > 0 ? (
              antecedents.complicationsChroniques.map((c: string) => (
                <Badge key={c} variant="outline" className="rounded-xl border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50">
                   {c}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic py-4 w-full text-center">Aucune atteinte chronique signalée.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
