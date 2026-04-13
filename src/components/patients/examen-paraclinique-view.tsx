"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Clock3,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Minus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ExamenParacliniqueViewProps {
  patientId: string;
  examens: any | null;
}

export function ExamenParacliniqueView({ patientId, examens }: ExamenParacliniqueViewProps) {
  if (!examens) {
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
            Enregistrer le premier bilan
          </Link>
        </Button>
      </Card>
    );
  }

  const examCards = [
    { 
      id: "hemo", 
      title: "Hémoglobine", 
      icon: Droplet, 
      color: "rose",
      realise: examens.hemoRealise,
      cause: examens.hemoCause,
      tauxBase: examens.hemoTauxBase,
      tauxRecent: examens.hemoTauxRecent,
      interp: examens.hemoInterpretation,
      unit: "g/dl"
    },
    { 
      id: "retic", 
      title: "Réticulocytes", 
      icon: Dna, 
      color: "emerald",
      realise: examens.reticRealise,
      cause: examens.reticCause,
      tauxBase: examens.reticTauxBase,
      tauxRecent: examens.reticTauxRecent,
      interp: examens.reticInterpretation,
      unit: "/mm³"
    },
    { 
      id: "gb", 
      title: "Globules Blancs", 
      icon: Activity, 
      color: "blue",
      realise: examens.gbRealise,
      cause: examens.gbCause,
      tauxBase: examens.gbTauxBase,
      tauxRecent: examens.gbTauxRecent,
      interp: examens.gbInterpretation,
      unit: "/mm³"
    },
    { 
      id: "plaq", 
      title: "Plaquettes", 
      icon: TestTube2, 
      color: "amber",
      realise: examens.plaqRealise,
      cause: examens.plaqCause,
      tauxBase: examens.plaqTauxBase,
      tauxRecent: examens.plaqTauxRecent,
      interp: examens.plaqInterpretation,
      unit: "/mm³"
    },
    { 
      id: "asatAlat", 
      title: "ASAT / ALAT", 
      icon: FlaskConical, 
      color: "indigo",
      realise: examens.asatAlatRealise,
      cause: examens.asatAlatCause,
      tauxBase: examens.asatAlatTauxBase,
      interp: examens.asatAlatInterpretation,
      unit: "UI/L"
    }
  ];

  const getInterpretaionColor = (interp: string) => {
    if (!interp) return "text-muted-foreground bg-muted";
    if (interp.includes("Normal")) return "text-emerald-700 bg-emerald-50 border-emerald-100";
    if (interp.includes("Diminué") || interp.includes("Anémie")) return "text-rose-700 bg-rose-50 border-rose-100";
    if (interp.includes("Augmenté") || interp.includes("Polyglobulie") || interp.includes("Leucocytose") || interp.includes("Thrombocytose")) return "text-amber-700 bg-amber-50 border-amber-100";
    return "text-indigo-700 bg-indigo-50 border-indigo-100";
  };

  const getTrendIcon = (base: string, recent: string) => {
    const b = parseFloat(base);
    const r = parseFloat(recent);
    if (isNaN(b) || isNaN(r)) return <Minus className="h-3 w-3" />;
    if (r > b) return <TrendingUp className="h-3 w-3 text-emerald-500" />;
    if (r < b) return <TrendingDown className="h-3 w-3 text-rose-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-indigo-500" /> Bilan Paraclinique Actuel
        </h2>
        <Button variant="outline" size="sm" className="rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50" asChild>
          <Link href={`/dashboard/patients/${patientId}/examens`}>
            <Edit3 className="mr-2 h-4 w-4" /> Mettre à jour le bilan
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examCards.map((exam) => (
          <Card key={exam.id} className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden hover:ring-indigo-500/20 transition-all flex flex-col">
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
                    <div className={cn(
                        "text-xs font-bold p-3 rounded-xl border transition-colors",
                        getInterpretaionColor(exam.interp)
                    )}>
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
      </div>
    </div>
  );
}
