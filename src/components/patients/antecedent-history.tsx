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
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  ShieldCheck,
  Syringe,
  Bug
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AntecedentHistoryProps {
  patientId: string;
  antecedents: any[];
}

function AntecedentCard({ data }: { data: any }) {
  const complicationsAigues: any[] = Array.isArray(data.complicationsAigues) ? data.complicationsAigues : [];
  const complicationsChroniques: string[] = Array.isArray(data.complicationsChroniques) ? data.complicationsChroniques : [];
  const statutVaccinal: Record<string, { aJour: boolean; causes: string[] }> = data.statutVaccinal || {};
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* DÉCOUVERTE */}
      <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Découverte & Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700">
            <span className="text-sm text-muted-foreground font-medium">Âge au diagnostic</span>
            <span className="text-sm font-bold text-foreground">
              {data.ageDecouverteAnnees ?? 0} ans {data.ageDecouverteMois > 0 && `et ${data.ageDecouverteMois} mois`}
            </span>
          </div>
          {data.typeDepistage && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dépistage</span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 rounded-lg">{data.typeDepistage}</Badge>
            </div>
          )}
          {data.circonstancesDecouverte?.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Circonstances</span>
              <div className="flex flex-wrap gap-1.5">
                {data.circonstancesDecouverte.map((c: string) => (
                  <Badge key={c} variant="outline" className="rounded-lg text-xs">{c}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* HISTOIRE FAMILIALE */}
      <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
        <CardHeader className="bg-amber-50/50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-700/30 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Users className="h-4 w-4" /> Histoire Familiale
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center gap-2">
            {data.notionFamilleDrepanocytose ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm font-medium">
              {data.notionFamilleDrepanocytose ? "Cas familiaux présents" : "Aucun cas familial déclaré"}
            </span>
          </div>
          {data.notionFamilleDrepanocytose && data.liensFamille?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {data.liensFamille.map((l: string) => (
                <Badge key={l} className="bg-amber-100 text-amber-700 border-none rounded-lg text-xs">{l}</Badge>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Fratrie atteinte</p>
              <p className="text-xl font-black text-foreground">{data.nbFreresSoeursDrepanocytaires || "0"}</p>
            </div>
            <div className={cn("p-3 rounded-xl border", data.decesFamilleDrepanocytose ? "bg-rose-50 border-rose-100" : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-700")}>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Décès signalés</p>
              <p className={cn("text-xl font-black", data.decesFamilleDrepanocytose ? "text-rose-600" : "text-foreground")}>
                {data.nbDecesFamille || "0"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRÉVENTION */}
      <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden md:col-span-2">
        <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-100 dark:border-emerald-700/30 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Prévention & Suivi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MILDA */}
            <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
              <Bug className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">MILDA</p>
                <p className="text-sm font-semibold">{data.milda ? "Oui, dort sous MILDA" : "Non"}</p>
              </div>
            </div>
            {/* Déparasitage */}
            <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
              <Calendar className="h-5 w-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Dernier déparasitage</p>
                <p className="text-sm font-semibold">
                  {data.dernierDeparasitage 
                    ? format(new Date(data.dernierDeparasitage), "dd MMM yyyy", { locale: fr })
                    : "Non renseigné"}
                </p>
              </div>
            </div>
          </div>

          {/* Vaccins */}
          {Object.keys(statutVaccinal).length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Syringe className="h-3.5 w-3.5" /> Statut Vaccinal
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {Object.entries(statutVaccinal).map(([vaccin, info]) => (
                  <div key={vaccin} className={cn("p-2.5 rounded-xl border text-center", info.aJour ? "bg-emerald-50 border-emerald-100" : "bg-rose-50/50 border-rose-100")}>
                    <p className="text-xs font-bold text-foreground">{vaccin}</p>
                    <Badge variant="outline" className={cn("mt-1 text-[9px] px-1.5", info.aJour ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-rose-600 border-rose-200 bg-rose-50")}>
                      {info.aJour ? "À jour" : "Non à jour"}
                    </Badge>
                    {!info.aJour && info.causes?.length > 0 && (
                      <p className="text-[9px] text-muted-foreground mt-1 truncate" title={info.causes.join(", ")}>{info.causes[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* COMPLICATIONS AIGUËS */}
      <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
        <CardHeader className="bg-rose-500/10 border-b border-rose-500/20 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-500">
            <Activity className="h-4 w-4" /> Complications Aiguës
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {complicationsAigues.length > 0 ? (
            <div className="space-y-2">
              {complicationsAigues.map((comp: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl">
                  <span className="text-sm font-semibold text-rose-700">{comp.nom || comp}</span>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {comp.nombreParAn && (
                      <Badge variant="outline" className="text-[10px] border-rose-200 text-rose-600 bg-white">
                        {comp.nombreParAn} fois/an
                      </Badge>
                    )}
                    {comp.dernierEpisode && (
                      <Badge variant="outline" className="text-[10px] border-zinc-200 text-zinc-600 bg-white gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        {format(new Date(comp.dernierEpisode), "MM/yyyy", { locale: fr })}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic py-4 text-center">Aucune complication aiguë signalée.</p>
          )}
        </CardContent>
      </Card>

      {/* COMPLICATIONS CHRONIQUES */}
      <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
        <CardHeader className="bg-indigo-500/10 border-b border-indigo-500/20 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-500">
            <Stethoscope className="h-4 w-4" /> Atteintes Chroniques
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-wrap gap-2">
          {complicationsChroniques.length > 0 ? (
            complicationsChroniques.map((c: string) => (
              <Badge key={c} variant="outline" className="rounded-xl border-indigo-200 text-indigo-700 bg-indigo-50/50">{c}</Badge>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic py-4 w-full text-center">Aucune atteinte chronique signalée.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AntecedentHistory({ patientId, antecedents }: AntecedentHistoryProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!antecedents || antecedents.length === 0) {
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
            <Plus className="mr-2 h-4 w-4" /> Composer le dossier initial
          </Link>
        </Button>
      </Card>
    );
  }

  const latest = antecedents[0];
  const history = antecedents.slice(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-amber-500" /> Antécédents Médicaux
          <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 text-xs font-bold">
            {antecedents.length} évaluation{antecedents.length > 1 ? "s" : ""}
          </Badge>
        </h2>
        <Button size="sm" className="rounded-xl bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20" asChild>
          <Link href={`/dashboard/patients/${patientId}/antecedents/new`}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle évaluation
          </Link>
        </Button>
      </div>

      {/* Dernière évaluation (mise en avant) */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-foreground">Dernière évaluation</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(latest.createdAt), "d MMMM yyyy", { locale: fr })}
          </span>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">Récente</Badge>
        </div>
        <AntecedentCard data={latest} />
      </div>

      {/* Historique des évaluations précédentes */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-1 border-t border-border pt-6">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">Évaluations précédentes ({history.length})</span>
          </div>
          <div className="space-y-3">
            {history.map((item: any, idx: number) => (
              <Card key={item.id} className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                >
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-muted/40 flex items-center justify-center">
                        <History className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          Évaluation du {format(new Date(item.createdAt), "d MMMM yyyy", { locale: fr })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(Array.isArray(item.complicationsAigues) ? item.complicationsAigues.length : 0)} complication(s) aiguë(s) • {(item.complicationsChroniques?.length || 0)} chronique(s)
                        </p>
                      </div>
                    </div>
                    {expandedIndex === idx ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedIndex === idx && (
                  <div className="p-4 border-t border-border bg-muted/5">
                    <AntecedentCard data={item} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
