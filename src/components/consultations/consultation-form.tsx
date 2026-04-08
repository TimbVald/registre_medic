"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  ConsultationFormValues, 
  consultationSchema, 
  PLAINTES_CATEGORIES,
  ETAT_GENERAL_OPTIONS,
  RDV_HONORE_OPTIONS,
  FREQUENCE_RAPPEL_OPTIONS,
  MODE_RAPPEL_OPTIONS,
  REGULARITE_TRAITEMENT_OPTIONS,
  CONCLUSION_TRAITEMENT_OPTIONS,
} from "@/lib/schemas/consultation.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition, useEffect } from "react";
import { saveConsultation } from "@/app/actions/patient.actions";
import { 
  Stethoscope, 
  Activity, 
  Calendar, 
  Pill, 
  Save, 
  Loader2, 
  ClipboardList,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  patientId: string;
  initialData?: any;
  type?: "Systématique" | "À la demande" | "Sur RDV";
}

export function ConsultationForm({ patientId, initialData, type = "Systématique" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      dateConsultation: new Date(),
      etatGeneral: null,
      plaintesExist: false,
      plaintesDetails: [],
      rappelReception: false,
      rappelRetour: false,
      traitementAcideFolique: { active: false, causesIrregularite: [] },
      traitementHydroxyuree: { active: false, causesIrregularite: [] },
      traitementAntibioProphylaxie: { active: false, causesIrregularite: [] },
    },
  });

  // Pré-remplir le formulaire si des données initiales sont fournies
  useEffect(() => {
    if (initialData) {
      // Conversion des dates de string à Date object si nécessaire
      const formattedData = {
        ...initialData,
        dateConsultation: initialData.dateConsultation ? new Date(initialData.dateConsultation) : new Date(),
        dateRdvPrevue: initialData.dateRdvPrevue ? new Date(initialData.dateRdvPrevue) : null,
      };
      form.reset(formattedData);
    }
  }, [initialData, form]);

  async function onSubmit(values: ConsultationFormValues) {
    startTransition(async () => {
      const result = await saveConsultation({
        ...values,
        id: initialData?.id, // Inclure l'ID pour la mise à jour
        patientId,
        typeConsultation: type,
      });
      
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        // Rediriger vers la page du patient
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
          <TabsList className="bg-zinc-100/80 p-1.5 rounded-2xl h-auto flex flex-wrap gap-2">
            <TabsTrigger value="vitals" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md">
              <Activity className="h-4 w-4 mr-2" /> Paramètres Vitaux
            </TabsTrigger>
            <TabsTrigger value="complaints" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md">
              <ClipboardList className="h-4 w-4 mr-2" /> Plaintes
            </TabsTrigger>
            <TabsTrigger value="rdv" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md">
              <Calendar className="h-4 w-4 mr-2" /> Données RDV
            </TabsTrigger>
            <TabsTrigger value="treatments" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md">
              <Pill className="h-4 w-4 mr-2" /> Traitements
            </TabsTrigger>
          </TabsList>

          {/* PARAMÈTRES VITAUX */}
          <TabsContent value="vitals">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                <CardTitle className="text-zinc-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" /> État Clinique & Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                    control={form.control}
                    name="etatGeneral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>État général</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                          <FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {ETAT_GENERAL_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Température (°C)</FormLabel>
                        <FormControl><Input placeholder="37.5" {...field} value={field.value || ""} className="rounded-xl" /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {["fc", "fr", "pa", "sao2"].map((field: any) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="uppercase">{field}</FormLabel>
                          <FormControl><Input placeholder="..." {...f} value={f.value || ""} className="rounded-xl" /></FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PLAINTES */}
          <TabsContent value="complaints">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-amber-500" /> Plaintes & Symptômes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <FormField
                  control={form.control}
                  name="plaintesExist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-4 bg-zinc-50/50">
                      <FormLabel>Présence de plaintes ?</FormLabel>
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("plaintesExist") && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-4">
                    {PLAINTES_CATEGORIES.map((plainte) => (
                      <FormField
                        key={plainte}
                        control={form.control}
                        name="plaintesDetails"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-xl">
                            <FormControl><Checkbox checked={field.value?.includes(plainte)} onCheckedChange={(c) => c ? field.onChange([...field.value, plainte]) : field.onChange(field.value?.filter((v) => v !== plainte))} /></FormControl>
                            <FormLabel className="text-xs font-semibold cursor-pointer">{plainte}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    <div className="col-span-full mt-4">
                       <FormField control={form.control} name="plaintesAutre" render={({ field }) => (
                         <FormItem><FormLabel>Autres plaintes</FormLabel><FormControl><Textarea {...field} value={field.value || ""} className="rounded-xl" /></FormControl></FormItem>
                       )}/>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* RDV */}
          <TabsContent value="rdv">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
               <CardHeader className="bg-zinc-50/50 border-b border-zinc-100"><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500" /> Données de RDV</CardTitle></CardHeader>
               <CardContent className="pt-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="dateRdvPrevue" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>Date prévue</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal rounded-xl", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : "Sélectionner"}<Calendar className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start"><CalendarComponent mode="single" selected={field.value || undefined} onSelect={field.onChange} /></PopoverContent></Popover>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="rdvHonore" render={({ field }) => (
                      <FormItem><FormLabel>RDV Honoré ?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="Oui/Non" /></SelectTrigger></FormControl>
                      <SelectContent>{RDV_HONORE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                    )}/>
                  </div>
                  <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-wrap gap-8 items-center">
                      <FormField control={form.control} name="rappelFrequence" render={({ field }) => (
                        <FormItem className="flex-1 min-w-[200px]"><FormLabel className="text-xs">Fréquence</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl><SelectContent>{FREQUENCE_RAPPEL_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                      )}/>
                      <FormField control={form.control} name="rappelMode" render={({ field }) => (
                        <FormItem className="flex-1 min-w-[200px]"><FormLabel className="text-xs">Mode</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="bg-white"><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl><SelectContent>{MODE_RAPPEL_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                      )}/>
                  </div>
               </CardContent>
            </Card>
          </TabsContent>

          {/* TRAITEMENTS */}
          <TabsContent value="treatments">
             {["Acide Folique", "Hydroxyurée", "Antibioprophylaxie"].map((type, idx) => {
               const fn = idx === 0 ? "traitementAcideFolique" : idx === 1 ? "traitementHydroxyuree" : "traitementAntibioProphylaxie";
               return (
                 <Card key={type} className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden mb-4">
                    <CardHeader className="bg-indigo-50/20 py-3 border-b"><div className="flex items-center justify-between"><CardTitle className="text-xs font-bold">{type}</CardTitle><FormField control={form.control} name={`${fn}.active` as any} render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />} /></div></CardHeader>
                    {form.watch(`${fn}.active` as any) && (
                      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in zoom-in-95">
                         <FormField control={form.control} name={`${fn}.posologie` as any} render={({ field }) => <FormItem><FormLabel className="text-xs">Posologie</FormLabel><FormControl><Input {...field} value={field.value || ""} className="h-8" /></FormControl></FormItem>} />
                         <FormField control={form.control} name={`${fn}.regularite` as any} render={({ field }) => <FormItem><FormLabel className="text-xs">Régularité</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl><SelectContent>{REGULARITE_TRAITEMENT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>} />
                         <FormField control={form.control} name={`${fn}.conclusion` as any} render={({ field }) => <FormItem><FormLabel className="text-xs">Conclusion</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="h-8"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl><SelectContent>{CONCLUSION_TRAITEMENT_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select></FormItem>} />
                      </CardContent>
                    )}
                 </Card>
               );
             })}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-4 p-4 sticky bottom-4 z-10 bg-white border rounded-2xl shadow-lg">
            <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isPending}>Annuler</Button>
            <Button size="lg" className="rounded-xl px-10" type="submit" disabled={isPending}>
               {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</> : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>}
            </Button>
        </div>
      </form>
    </Form>
  );
}
