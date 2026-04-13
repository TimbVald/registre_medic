"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  HospitalisationFormValues, 
  hospitalisationSchema, 
  PLAINTES_CATEGORIES_HOSP,
  CAUSES_IRREGULARITE_HYDRATATION
} from "@/lib/schemas/hospitalisation.schema";
import { 
  REGULARITE_TRAITEMENT_OPTIONS, 
  CONCLUSION_TRAITEMENT_OPTIONS,
  CAUSES_IRREGULARITE_TRAITEMENT 
} from "@/lib/schemas/consultation.schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition, useEffect } from "react";
import { saveHospitalisation } from "@/app/actions/hospitalisation.actions";
import { 
  Activity, 
  Calendar, 
  Pill, 
  Save, 
  Loader2, 
  ClipboardList,
  Thermometer,
  Heart,
  Wind,
  Droplets
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  patientId: string;
  initialData?: any;
  patientAge?: number; // Pour l'affichage auto
}

export function HospitalisationForm({ patientId, initialData, patientAge }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<HospitalisationFormValues>({
    resolver: zodResolver(hospitalisationSchema),
    defaultValues: {
      dateHospitalisation: new Date(),
      agePatient: patientAge || 0,
      plaintesExist: false,
      detailsPlaintes: {
        douleurs: [],
        fievre: [],
        fatigue: [],
        irritabilite: [],
        coloration: [],
        difficultesRespiratoires: [],
        gonflementSignesNeuro: [],
        retardCroissance: false,
        plaieJambes: false,
      },
      traitementAcideFolique: { active: false, causesIrregularite: [] },
      traitementHydroxyuree: { active: false, causesIrregularite: [] },
      traitementAntibioProphylaxie: { active: false, causesIrregularite: [] },
      traitementHydratation: { active: false, causesIrregularite: [] },
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        dateHospitalisation: initialData.dateHospitalisation ? new Date(initialData.dateHospitalisation) : new Date(),
      });
    }
  }, [initialData, form]);

  async function onSubmit(values: HospitalisationFormValues) {
    startTransition(async () => {
      const result = await saveHospitalisation({
        ...values,
        id: initialData?.id,
        patientId,
      });
      
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        router.push(`/dashboard/patients/${patientId}`);
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
        <Tabs defaultValue="vitals" className="w-full space-y-6">
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-auto flex min-w-full md:min-w-0 gap-2">
              <TabsTrigger value="vitals" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md shrink-0">
                <Activity className="h-4 w-4 mr-2" /> Paramètres
              </TabsTrigger>
              <TabsTrigger value="complaints" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md shrink-0">
                <ClipboardList className="h-4 w-4 mr-2" /> Plaintes
              </TabsTrigger>
              <TabsTrigger value="treatments" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md shrink-0">
                <Pill className="h-4 w-4 mr-2" /> Traitements
              </TabsTrigger>
            </TabsList>
          </div>

          {/* PARAMÈTRES VITAUX */}
          <TabsContent value="vitals">
            <Card className="border-none shadow-sm ring-1 ring-border">
              <CardHeader className="bg-muted/30 border-b border-border">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" /> Paramètres Cliniques
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormField
                    control={form.control}
                    name="dateHospitalisation"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date du jour</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className={cn("pl-3 text-left font-normal rounded-xl", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PP") : "Sélectionner"}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Âge du patient</FormLabel>
                    <FormControl><Input value={patientAge ? `${patientAge} ans` : "Non renseigné"} disabled className="rounded-xl bg-muted/50 font-bold" /></FormControl>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Thermometer className="h-3 w-3" /> T° (°C)</FormLabel>
                        <FormControl><Input placeholder="37.5" {...field} value={field.value || ""} className="rounded-xl" /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                  {[
                    { id: "fc", label: "FC", icon: Heart },
                    { id: "fr", label: "FR", icon: Wind },
                    { id: "pa", label: "PA", icon: Activity },
                    { id: "sao2", label: "SaO2", icon: Droplets },
                  ].map((param) => (
                    <FormField
                      key={param.id}
                      control={form.control}
                      name={param.id as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-foreground/70 flex items-center gap-2">
                            <param.icon className="h-3 w-3" /> {param.label}
                          </FormLabel>
                          <FormControl><Input placeholder="..." {...field} value={field.value || ""} className="rounded-xl" /></FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PLAINTES DÉTAILLÉES */}
          <TabsContent value="complaints">
            <Card className="border-none shadow-sm ring-1 ring-border overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border">
                <CardTitle className="flex items-center gap-2">
                   <ClipboardList className="h-5 w-5 text-amber-500" /> Plaintes & Symptômes détaillés
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <FormField
                  control={form.control}
                  name="plaintesExist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-border p-4 bg-muted/30">
                      <FormLabel className="text-lg font-bold">Présence de plaintes ?</FormLabel>
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" /></FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("plaintesExist") && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-top-4">
                    {Object.entries(PLAINTES_CATEGORIES_HOSP).map(([key, options]) => (
                      <div key={key} className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary border-b pb-2">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {options.map((opt) => (
                            <FormField
                              key={opt}
                              control={form.control}
                              name={`detailsPlaintes.${key}` as any}
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-xl hover:bg-accent/30 transition-colors">
                                  <FormControl><Checkbox checked={field.value?.includes(opt)} onCheckedChange={(c) => c ? field.onChange([...(field.value || []), opt]) : field.onChange(field.value?.filter((v: string) => v !== opt))} /></FormControl>
                                  <FormLabel className="text-xs font-semibold cursor-pointer">{opt}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <FormField
                        control={form.control}
                        name="detailsPlaintes.retardCroissance"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-2xl bg-primary/5">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-bold">Retard de croissance</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="detailsPlaintes.plaieJambes"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-2xl bg-primary/5">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-bold">Plaie aux jambes qui ne guérissent pas</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRAITEMENTS */}
          <TabsContent value="treatments">
             <div className="space-y-6">
               {[
                 { id: "traitementAcideFolique", label: "Acide Folique" },
                 { id: "traitementHydroxyuree", label: "Hydroxyurée" },
                 { id: "traitementAntibioProphylaxie", label: "Antibioprophylaxie" },
                 { id: "traitementHydratation", label: "Hydratation" },
               ].map((t) => (
                 <Card key={t.id} className="border-none shadow-sm ring-1 ring-border overflow-hidden rounded-2xl">
                    <CardHeader className="bg-primary/5 py-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-black uppercase tracking-tight">{t.label}</CardTitle>
                        <FormField control={form.control} name={`${t.id}.active` as any} render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5" />} />
                      </div>
                    </CardHeader>
                    {form.watch(`${t.id}.active` as any) && (
                      <CardContent className="pt-6 space-y-6 animate-in zoom-in-95">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control} name={`${t.id}.posologie` as any} render={({ field }) => <FormItem><FormLabel className="text-xs font-bold uppercase">Posologie</FormLabel><FormControl><Input {...field} value={field.value || ""} className="rounded-xl h-10" /></FormControl></FormItem>} />
                            <FormField control={form.control} name={`${t.id}.regularite` as any} render={({ field }) => <FormItem><FormLabel className="text-xs font-bold uppercase">Régularité</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="rounded-xl h-10"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl><SelectContent>{REGULARITE_TRAITEMENT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>} />
                            <FormField control={form.control} name={`${t.id}.conclusion` as any} render={({ field }) => <FormItem><FormLabel className="text-xs font-bold uppercase">Conclusion</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="rounded-xl h-10"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl><SelectContent>{CONCLUSION_TRAITEMENT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>} />
                         </div>
                         <div className="space-y-3">
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground italic">Causes d'irrégularités</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                               {(t.id === "traitementHydratation" ? CAUSES_IRREGULARITE_HYDRATATION : CAUSES_IRREGULARITE_TRAITEMENT).map((cause) => (
                                 <FormField
                                    key={cause}
                                    control={form.control}
                                    name={`${t.id}.causesIrregularite` as any}
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2 space-y-0 p-2 border rounded-lg bg-zinc-50/50">
                                        <FormControl><Checkbox checked={field.value?.includes(cause)} onCheckedChange={(c) => c ? field.onChange([...(field.value || []), cause]) : field.onChange(field.value?.filter((v: string) => v !== cause))} /></FormControl>
                                        <FormLabel className="text-[10px] font-medium leading-none cursor-pointer">{cause}</FormLabel>
                                      </FormItem>
                                    )}
                                  />
                               ))}
                            </div>
                         </div>
                      </CardContent>
                    )}
                 </Card>
               ))}
             </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-4 p-4 sticky bottom-4 z-20 bg-background/80 backdrop-blur-md border border-border rounded-2xl shadow-xl ring-1 ring-primary/10">
            <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isPending} className="rounded-xl px-6">Annuler</Button>
            <Button size="lg" className="rounded-xl px-12 shadow-md shadow-primary/20 bg-primary hover:bg-primary/90" type="submit" disabled={isPending}>
               {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</> : <><Save className="mr-2 h-4 w-4" /> Enregistrer l'Hospitalisation</>}
            </Button>
        </div>
      </form>
    </Form>
  );
}
