"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { 
  ExamenParacliniqueFormValues, 
  examenParacliniqueSchema,
  CAUSE_NON_REALISATION_OPTIONS,
  INTERPRETATION_HEMO_OPTIONS,
  INTERPRETATION_RETIC_OPTIONS,
  INTERPRETATION_GB_OPTIONS,
  INTERPRETATION_PLAQ_OPTIONS,
  INTERPRETATION_ASAT_ALAT_OPTIONS
} from "@/lib/schemas/examen-paraclinique.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { upsertExamenParaclinique } from "@/app/actions/examen-paraclinique.actions";
import { Save, Loader2, FlaskConical, AlertCircle } from "lucide-react";

interface Props {
  patientId: string;
  initialData?: any;
}

export function ExamenParacliniqueForm({ patientId, initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ExamenParacliniqueFormValues>({
    resolver: zodResolver(examenParacliniqueSchema),
    defaultValues: initialData ? {
      hemo: {
        realise: initialData.hemoRealise,
        cause: initialData.hemoCause,
        tauxBase: initialData.hemoTauxBase,
        tauxRecent: initialData.hemoTauxRecent,
        interpretation: initialData.hemoInterpretation,
      },
      retic: {
        realise: initialData.reticRealise,
        cause: initialData.reticCause,
        tauxBase: initialData.reticTauxBase,
        tauxRecent: initialData.reticTauxRecent,
        interpretation: initialData.reticInterpretation,
      },
      gb: {
        realise: initialData.gbRealise,
        cause: initialData.gbCause,
        tauxBase: initialData.gbTauxBase,
        tauxRecent: initialData.gbTauxRecent,
        interpretation: initialData.gbInterpretation,
      },
      plaq: {
        realise: initialData.plaqRealise,
        cause: initialData.plaqCause,
        tauxBase: initialData.plaqTauxBase,
        tauxRecent: initialData.plaqTauxRecent,
        interpretation: initialData.plaqInterpretation,
      },
      asatAlat: {
        realise: initialData.asatAlatRealise,
        cause: initialData.asatAlatCause,
        tauxBase: initialData.asatAlatTauxBase,
        interpretation: initialData.asatAlatInterpretation,
      },
      elhb: initialData.elhb || { realise: false, cause: null, tauxA: "", tauxS: "", tauxF: "" },
    } : {
      hemo: { realise: false, cause: null, tauxBase: "", tauxRecent: "", interpretation: null },
      retic: { realise: false, cause: null, tauxBase: "", tauxRecent: "", interpretation: null },
      gb: { realise: false, cause: null, tauxBase: "", tauxRecent: "", interpretation: null },
      plaq: { realise: false, cause: null, tauxBase: "", tauxRecent: "", interpretation: null },
      asatAlat: { realise: false, cause: null, tauxBase: "", interpretation: null },
      elhb: { realise: false, cause: null, tauxA: "", tauxS: "", tauxF: "" },
    },
  });

  async function onSubmit(values: ExamenParacliniqueFormValues) {
    startTransition(async () => {
      const result = await upsertExamenParaclinique(patientId, values);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        router.push(`/dashboard/patients/${patientId}`);
      } else {
        toast.error(result.message || "Erreur lors de l'enregistrement.");
      }
    });
  }

  function onError(errors: any) {
    console.error("Erreurs de validation examens:", JSON.stringify(errors, null, 2));
    const fields = Object.keys(errors).join(", ");
    toast.error(`Champs invalides : ${fields}`);
  }

  const exams = [
    { id: "hemo" as const, label: "Taux d'hémoglobine de base (g/dl)", interpretations: INTERPRETATION_HEMO_OPTIONS, hasTauxRecent: true },
    { id: "retic" as const, label: "Taux de réticulocytes de base", interpretations: INTERPRETATION_RETIC_OPTIONS, hasTauxRecent: true },
    { id: "gb" as const, label: "Globules blancs de base", interpretations: INTERPRETATION_GB_OPTIONS, hasTauxRecent: true },
    { id: "plaq" as const, label: "Plaquette de base", interpretations: INTERPRETATION_PLAQ_OPTIONS, hasTauxRecent: true },
    { id: "asatAlat" as const, label: "ASAT / ALAT", interpretations: INTERPRETATION_ASAT_ALAT_OPTIONS, hasTauxRecent: false },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8 pb-12">
        <Card className="border-none shadow-sm ring-1 ring-border overflow-hidden bg-card">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-primary">
              <FlaskConical className="h-5 w-5" />
              Bilan Paraclinique
            </CardTitle>
            <CardDescription>Saisie des examens biologiques de base et interprétations.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto no-scrollbar">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[200px] font-bold">Examens</TableHead>
                  <TableHead className="w-[150px] font-bold text-center">Statut</TableHead>
                  <TableHead className="font-bold">Si non réalisé : causes</TableHead>
                  <TableHead className="font-bold">Si réalisé : Interprétation & Taux</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id} className="group hover:bg-muted/10 transition-colors">
                    {/* Colonne 1: Label */}
                    <TableCell className="font-medium align-top pt-6">
                      {exam.label}
                    </TableCell>

                    {/* Colonne 2: Statut (Radio) */}
                    <TableCell className="align-top pt-6">
                      <FormField
                        control={form.control}
                        name={`${exam.id}.realise`}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={(val) => field.onChange(val === "true")}
                                value={field.value ? "true" : "false"}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="true" id={`${exam.id}-realise`} />
                                  <FormLabel htmlFor={`${exam.id}-realise`} className="font-normal cursor-pointer">Réalisé</FormLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="false" id={`${exam.id}-non-realise`} />
                                  <FormLabel htmlFor={`${exam.id}-non-realise`} className="font-normal cursor-pointer">Pas réalisé</FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Colonne 3: Cause si non réalisé */}
                    <TableCell className="align-top pt-4">
                      {form.watch(`${exam.id}.realise`) === false && (
                        <FormField
                          control={form.control}
                          name={`${exam.id}.cause`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} value={field.value || undefined}>
                                <FormControl>
                                  <SelectTrigger className="bg-background rounded-xl border-border">
                                    <SelectValue placeholder="Choisir une cause" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CAUSE_NON_REALISATION_OPTIONS.map((cause) => (
                                    <SelectItem key={cause} value={cause}>{cause}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </TableCell>

                    <TableCell className="align-top pt-4 space-y-4">
                      {form.watch(`${exam.id}.realise`) === true && (
                        <div className="grid grid-cols-1 gap-4">
                           <div className="grid grid-cols-2 gap-2">
                              <FormField
                                control={form.control}
                                name={`${exam.id}.tauxBase`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] uppercase font-bold text-foreground/70">Taux de base</FormLabel>
                                    <FormControl>
                                      <Input {...field} value={field.value || ""} className="h-8 rounded-lg" placeholder="ex: 8.5" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              {(exam as any).hasTauxRecent && (
                                <FormField
                                  control={form.control}
                                  name={`${exam.id}.tauxRecent` as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[10px] uppercase font-bold text-foreground/70">Plus récent</FormLabel>
                                      <FormControl>
                                        <Input {...field} value={(field.value as any) || ""} className="h-8 rounded-lg" placeholder="ex: 7.2" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              )}
                           </div>
                           
                           <FormField
                              control={form.control}
                              name={`${exam.id}.interpretation`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] uppercase font-bold text-foreground/70">Interprétation</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                                    <FormControl>
                                      <SelectTrigger className="bg-background rounded-xl border-border h-9">
                                        <SelectValue placeholder="Choisir l'interprétation" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {exam.interpretations.map((interp) => (
                                        <SelectItem key={interp} value={interp}>{interp}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Ligne personnalisée pour ELHB */}
                <TableRow className="bg-card">
                  <TableCell className="font-bold align-top pt-6 bg-muted/10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-1 rounded-full bg-primary" />
                      Electrophorèse Hémoglobine (ELHB)
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ml-3 font-normal opacity-70">Profil A, S, F (%)</div>
                  </TableCell>

                  <TableCell className="align-top pt-6">
                    <FormField
                      control={form.control}
                      name="elhb.realise"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) => field.onChange(val === "true")}
                              value={field.value ? "true" : "false"}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="elhb-realise" />
                                <FormLabel htmlFor="elhb-realise" className="font-normal cursor-pointer">Réalisé</FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="elhb-non-realise" />
                                <FormLabel htmlFor="elhb-non-realise" className="font-normal cursor-pointer">Pas réalisé</FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell className="align-top pt-6">
                    {form.watch("elhb.realise") === false && (
                      <FormField
                        control={form.control}
                        name="elhb.cause"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger className="bg-background rounded-xl border-border">
                                  <SelectValue placeholder="Choisir une cause" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CAUSE_NON_REALISATION_OPTIONS.map((cause) => (
                                  <SelectItem key={cause} value={cause}>{cause}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    )}
                  </TableCell>

                  <TableCell className="align-top pt-6 space-y-4">
                    {form.watch("elhb.realise") === true && (
                      <div className="grid grid-cols-3 gap-2">
                        <FormField
                          control={form.control}
                          name="elhb.tauxA"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-bold text-foreground/70">A (%)</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value || ""} className="h-8 rounded-lg" placeholder="ex: 0" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="elhb.tauxS"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-bold text-foreground/70">S (%)</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value || ""} className="h-8 rounded-lg" placeholder="ex: 90" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="elhb.tauxF"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-bold text-foreground/70">F (%)</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value || ""} className="h-8 rounded-lg" placeholder="ex: 10" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pied de page: Actions */}
        <div className="flex items-center justify-end gap-4 p-6 bg-background/80 backdrop-blur-md border border-border ring-1 ring-border rounded-2xl shadow-lg sticky bottom-4 z-20">
            <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isPending}>Annuler</Button>
            <Button size="lg" type="submit" className="rounded-xl px-10 shadow-md shadow-primary/20" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Enregistrer le bilan
                  </>
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
