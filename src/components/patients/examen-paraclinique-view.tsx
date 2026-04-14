"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, 
  Droplet, 
  Dna, 
  TestTube2, 
  Activity, 
  Edit3, 
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  History,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

interface ExamenParacliniqueViewProps {
  patientId: string;
  examens: any[];
}

function getInterpretationColor(interp: string) {
  if (!interp) return "text-muted-foreground bg-muted";
  if (interp.includes("Normal")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
  if (interp.includes("Diminué") || interp.includes("Anémie")) return "text-rose-700 bg-rose-50 border-rose-100";
  if (interp.includes("Augmenté") || interp.includes("Polyglobulie") || interp.includes("Leucocytose") || interp.includes("Thrombocytose")) return "text-amber-700 bg-amber-50 border-amber-100";
  return "text-indigo-700 bg-indigo-50 border-indigo-100";
}

function getTrendIcon(base: string, recent: string) {
  const b = parseFloat(base);
  const r = parseFloat(recent);
  if (isNaN(b) || isNaN(r)) return <Minus className="h-3 w-3" />;
  if (r > b) return <TrendingUp className="h-3 w-3 text-emerald-500" />;
  if (r < b) return <TrendingDown className="h-3 w-3 text-rose-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function BilanCard({ data }: { data: any }) {
  const examCards = [
    { id: "hemo", title: "Hémoglobine", icon: Droplet, color: "rose", realise: data.hemoRealise, cause: data.hemoCause, tauxBase: data.hemoTauxBase, tauxRecent: data.hemoTauxRecent, interp: data.hemoInterpretation, unit: "g/dl" },
    { id: "retic", title: "Réticulocytes", icon: Dna, color: "emerald", realise: data.reticRealise, cause: data.reticCause, tauxBase: data.reticTauxBase, tauxRecent: data.reticTauxRecent, interp: data.reticInterpretation, unit: "/mm³" },
    { id: "gb", title: "Globules Blancs", icon: Activity, color: "blue", realise: data.gbRealise, cause: data.gbCause, tauxBase: data.gbTauxBase, tauxRecent: data.gbTauxRecent, interp: data.gbInterpretation, unit: "/mm³" },
    { id: "plaq", title: "Plaquettes", icon: TestTube2, color: "amber", realise: data.plaqRealise, cause: data.plaqCause, tauxBase: data.plaqTauxBase, tauxRecent: data.plaqTauxRecent, interp: data.plaqInterpretation, unit: "/mm³" },
    { id: "asatAlat", title: "ASAT / ALAT", icon: FlaskConical, color: "indigo", realise: data.asatAlatRealise, cause: data.asatAlatCause, tauxBase: data.asatAlatTauxBase, interp: data.asatAlatInterpretation, unit: "UI/L" },
  ];

  const elhb = data.elhb as { realise?: boolean; cause?: string; tauxA?: string; tauxS?: string; tauxF?: string } | null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {examCards.map((exam) => (
          <Card key={exam.id} className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className={cn(
              "pb-3 border-b border-zinc-100",
              exam.color === "rose" && "bg-rose-50/50",
              exam.color === "emerald" && "bg-emerald-50/50",
              exam.color === "blue" && "bg-blue-50/50",
              exam.color === "amber" && "bg-amber-50/50",
              exam.color === "indigo" && "bg-indigo-50/50"
            )}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <exam.icon className={cn(
                    "h-4 w-4",
                    exam.color === "rose" && "text-rose-500",
                    exam.color === "emerald" && "text-emerald-500",
                    exam.color === "blue" && "text-blue-500",
                    exam.color === "amber" && "text-amber-500",
                    exam.color === "indigo" && "text-indigo-500"
                  )} />
                  {exam.title}
                </CardTitle>
                {exam.realise ? (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-0">Réalisé</Badge>
                ) : (
                  <Badge variant="outline" className="text-rose-600 border-rose-100 bg-rose-50 text-[10px] uppercase font-bold px-2 py-0">Non réalisé</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-5 flex-1 space-y-4">
              {exam.realise ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 shadow-inner">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Base</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-foreground">{exam.tauxBase || "-"}</span>
                        <span className="text-[10px] font-medium text-muted-foreground">{exam.unit}</span>
                      </div>
                    </div>
                    {exam.tauxRecent !== undefined && (
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 shadow-inner">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Récent</p>
                          {exam.tauxBase && exam.tauxRecent && getTrendIcon(exam.tauxBase, exam.tauxRecent)}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className={cn(
                            "text-lg font-black",
                            exam.tauxBase && exam.tauxRecent && parseFloat(exam.tauxRecent) < parseFloat(exam.tauxBase) ? "text-rose-600" : "text-foreground"
                          )}>{exam.tauxRecent || "-"}</span>
                          <span className="text-[10px] font-medium text-muted-foreground">{exam.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Interprétation</p>
                    <div className={cn("text-xs font-bold p-3 rounded-xl border transition-colors", getInterpretationColor(exam.interp))}>
                      {exam.interp || "Non interprété"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center py-6 space-y-3 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <AlertCircle className="h-5 w-5 text-rose-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-muted-foreground">Cause du manquement</p>
                    <p className="text-sm font-medium text-rose-500 mt-1">{exam.cause || "Non précisée"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Carte ELHB */}
        {elhb && (
          <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="pb-3 border-b border-zinc-100 bg-primary/5">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-primary" /> ELHB (Profil A, S, F)
                </CardTitle>
                {elhb.realise ? (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-0">Réalisé</Badge>
                ) : (
                  <Badge variant="outline" className="text-rose-600 border-rose-100 bg-rose-50 text-[10px] uppercase font-bold px-2 py-0">Non réalisé</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-5 flex-1 space-y-4">
              {elhb.realise ? (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "A", value: elhb.tauxA, color: "bg-blue-50 border-blue-100" },
                    { label: "S", value: elhb.tauxS, color: "bg-rose-50 border-rose-100" },
                    { label: "F", value: elhb.tauxF, color: "bg-amber-50 border-amber-100" },
                  ].map(p => (
                    <div key={p.label} className={cn("p-3 rounded-xl border shadow-inner text-center", p.color)}>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{p.label}</p>
                      <span className="text-xl font-black text-foreground">{p.value || "-"}</span>
                      <span className="text-[10px] font-medium text-muted-foreground ml-0.5">%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center py-6 space-y-3 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                  <AlertCircle className="h-5 w-5 text-rose-300" />
                  <p className="text-sm font-medium text-rose-500">{elhb.cause || "Non précisée"}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function ExamenParacliniqueView({ patientId, examens }: ExamenParacliniqueViewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!examens || examens.length === 0) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-border rounded-3xl bg-card p-12 text-center flex flex-col items-center justify-center gap-6">
        <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center">
          <FlaskConical className="h-10 w-10 text-indigo-500/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Aucun bilan paraclinique</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Les résultats des examens biologiques de base n'ont pas encore été enregistrés.
          </p>
        </div>
        <Button className="rounded-xl px-8 py-6 h-auto shadow-lg shadow-indigo-500/10 bg-indigo-600 hover:bg-indigo-700" asChild>
          <Link href={`/dashboard/patients/${patientId}/examens`}>
            <Plus className="mr-2 h-4 w-4" /> Enregistrer le premier bilan
          </Link>
        </Button>
      </Card>
    );
  }

  const latest = examens[0];
  const history = examens.slice(1);

  // Compter les examens réalisés
  const countRealises = (d: any) => {
    let count = 0;
    if (d.hemoRealise) count++;
    if (d.reticRealise) count++;
    if (d.gbRealise) count++;
    if (d.plaqRealise) count++;
    if (d.asatAlatRealise) count++;
    if (d.elhb?.realise) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-indigo-500" /> Bilan Paraclinique
          <Badge className="ml-2 bg-indigo-100 text-indigo-700 border-indigo-200 text-xs font-bold">
            {examens.length} bilan{examens.length > 1 ? "s" : ""}
          </Badge>
        </h2>
        <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20" asChild>
          <Link href={`/dashboard/patients/${patientId}/examens`}>
            <Plus className="mr-2 h-4 w-4" /> Nouveau bilan
          </Link>
        </Button>
      </div>

      {/* Dernier bilan (mis en avant) */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-bold text-foreground">Dernier bilan</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(latest.createdAt), "d MMMM yyyy", { locale: fr })}
          </span>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]">Récent</Badge>
        </div>
        <BilanCard data={latest} />
      </div>

      {/* Historique des bilans précédents */}
      {history.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-1 border-t border-border pt-6">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">Bilans précédents ({history.length})</span>
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
                      <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <FlaskConical className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          Bilan du {format(new Date(item.createdAt), "d MMMM yyyy", { locale: fr })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {countRealises(item)}/6 examens réalisés
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
                    <BilanCard data={item} />
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
