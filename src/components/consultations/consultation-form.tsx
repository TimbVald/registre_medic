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
import { createConsultation, updateConsultation } from "@/app/actions/consultation.actions";
import { 
  Activity, 
  Calendar, 
  Pill, 
  Save, 
  Loader2, 
  ClipboardList,
  User
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  patientId: string;
  medecins: { numeroSerie: string, nom: string, prenom: string | null }[];
  initialData?: any;
  type?: "Systématique";
}

export function ConsultationForm({ patientId, medecins, initialData, type = "Systématique" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      dateConsultation: new Date(),
      medecinId: "",
      etatGeneral: null,
      plaintesExist: false,
      plaintesDetails: [],
      rappelReception: false,
      rappelRetour: false,
      traitementAcideFolique: { active: false, causesIrregularite: [] },
      traitementHydroxyuree: { active: false, causesIrregularite: [] },
      traitementAntibioProphylaxie: { active: false, causesIrregularite: [] },
      traitementHydratation: { active: false, causesIrregularite: [] },
      traitementAutres: { active: false, nom: "", causesIrregularite: [] },
      dateProchainRdv: null,
    },
  });

  // Pré-remplir le formulaire si des données initiales sont fournies
  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        dateConsultation: initialData.dateConsultation ? new Date(initialData.dateConsultation) : new Date(),
        dateRdvPrevue: initialData.dateRdvPrevue ? new Date(initialData.dateRdvPrevue) : null,
        dateProchainRdv: initialData.dateProchainRdv ? new Date(initialData.dateProchainRdv) : null,
      };
      form.reset(formattedData);
    }
  }, [initialData, form]);

  async function onSubmit(values: ConsultationFormValues) {
    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateConsultation(initialData.id, values);
      } else {
        result = await createConsultation(patientId, values);
      }
      
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        router.push(`/dashboard/patients/${patientId}`);
      } else {
        toast.error(result.message || "Une erreur est survenue");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header - Date & Medecin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50/50 p-6 rounded-3xl ring-1 ring-zinc-100 shadow-sm">
           <FormField
            control={form.control}
            name="medecinId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 mb-2 font-bold text-zinc-700">
                  <User className="h-4 w-4 text-primary" />
                  Médecin Examinateur
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-zinc-200 bg-white h-12">
                      <SelectValue placeholder="Sélectionnez le médecin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    {medecins.map((m) => (
                      <SelectItem key={m.numeroSerie} value={m.numeroSerie} className="rounded-lg">
                        Dr. {m.nom} {m.prenom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateConsultation"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2 mb-2 font-bold text-zinc-700">
                  <Calendar className="h-4 w-4 text-primary" />
                  Date de Consultation
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal rounded-xl border-zinc-200 bg-white h-12",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="rounded-2xl"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Tabs defaultValue="vitals" className="w-full space-y-6">
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <TabsList className="bg-zinc-100/50 p-1.5 rounded-2xl h-auto flex md:inline-flex min-w-full md:min-w-0 gap-2 border border-zinc-200/50">
              <TabsTrigger value="vitals" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md data-[state=active]:bg-white shrink-0 font-bold transition-all">
                <Activity className="h-4 w-4 mr-2" /> Paramètres Vitaux
              </TabsTrigger>
              <TabsTrigger value="complaints" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md data-[state=active]:bg-white shrink-0 font-bold transition-all">
                <ClipboardList className="h-4 w-4 mr-2" /> Plaintes
              </TabsTrigger>
              <TabsTrigger value="rdv" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md data-[state=active]:bg-white shrink-0 font-bold transition-all">
                <Calendar className="h-4 w-4 mr-2" /> Données RDV
              </TabsTrigger>
              <TabsTrigger value="treatments" className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-md data-[state=active]:bg-white shrink-0 font-bold transition-all">
                <Pill className="h-4 w-4 mr-2" /> Traitements Routine
              </TabsTrigger>
            </TabsList>
          </div>

          {/* PARAMÈTRES VITAUX */}
          <TabsContent value="vitals">
            <Card className="border-none shadow-sm ring-1 ring-zinc-100 overflow-hidden rounded-3xl">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-6">
                <CardTitle className="text-zinc-800 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-500" />
                  </div>
                  État Clinique & Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                    control={form.control}
                    name="etatGeneral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-zinc-600">État général</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                          <FormControl><SelectTrigger className="rounded-xl border-zinc-200 h-11"><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-xl">
                            {ETAT_GENERAL_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>)}
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
                        <FormLabel className="font-bold text-zinc-600">Température (°C)</FormLabel>
                        <FormControl><Input placeholder="37.5" {...field} value={field.value ?? ""} className="rounded-xl border-zinc-200 h-11" /></FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="poids"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-zinc-600">Poids (kg)</FormLabel>
                        <FormControl><Input placeholder="45.0" {...field} value={field.value ?? ""} className="rounded-xl border-zinc-200 h-11" /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {["fc", "fr", "pa", "sao2"].map((name: any) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs font-black text-zinc-400 tracking-widest">{name}</FormLabel>
                          <FormControl><Input placeholder="..." {...f} value={f.value ?? ""} className="rounded-xl border-zinc-200 h-11" /></FormControl>
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
            <Card className="border-none shadow-sm ring-1 ring-zinc-100 overflow-hidden rounded-3xl">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-6">
                <CardTitle className="flex items-center gap-3 text-zinc-800">
                  <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
                    <ClipboardList className="h-5 w-5 text-amber-500" />
                  </div>
                   Plaintes & Symptômes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-8 text-sm">
                <FormField
                  control={form.control}
                  name="plaintesExist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-zinc-100 p-6 bg-zinc-50/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-bold text-zinc-800">Présence de plaintes ?</FormLabel>
                        <FormDescription>Activer pour lister les symptômes actuels</FormDescription>
                      </div>
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6 rounded-lg" /></FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("plaintesExist") && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    {PLAINTES_CATEGORIES.map((plainte) => (
                      <FormField
                        key={plainte}
                        control={form.control}
                        name="plaintesDetails"
                        render={({ field }) => (
                          <FormItem className={cn(
                            "flex items-center space-x-3 space-y-0 p-4 border rounded-2xl transition-all",
                            field.value?.includes(plainte) ? "border-amber-200 bg-amber-50/30 ring-1 ring-amber-100" : "border-zinc-100 hover:bg-zinc-50"
                          )}>
                            <FormControl><Checkbox checked={field.value?.includes(plainte)} onCheckedChange={(c) => c ? field.onChange([...field.value, plainte]) : field.onChange(field.value?.filter((v) => v !== plainte))} className="rounded-lg" /></FormControl>
                            <FormLabel className="text-xs font-bold leading-tight cursor-pointer text-zinc-600">{plainte}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    <div className="col-span-full mt-6">
                       <FormField control={form.control} name="plaintesAutre" render={({ field }) => (
                         <FormItem>
                           <FormLabel className="font-bold text-zinc-600">Autres plaintes ou précisions</FormLabel>
                           <FormControl><Textarea {...field} value={field.value ?? ""} className="rounded-2xl border-zinc-200 min-h-[100px] bg-zinc-50/30" placeholder="Décrivez les autres symptômes..." /></FormControl></FormItem>
                       )}/>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* RDV */}
          <TabsContent value="rdv">
            <Card className="border-none shadow-sm ring-1 ring-zinc-100 overflow-hidden rounded-3xl">
               <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-6">
                 <CardTitle className="flex items-center gap-3 text-zinc-800">
                   <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-500" />
                   </div>
                   Suivi & Prochain RDV
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-zinc-50/30 rounded-3xl border border-zinc-100">
                    <FormField control={form.control} name="dateRdvPrevue" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel className="font-bold text-zinc-500">Date du RDV honoré</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal rounded-xl border-zinc-200 bg-white h-11", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "d MMMM yyyy", { locale: fr }) : "Sélectionner"}<Calendar className="ml-auto h-4 w-4 opacity-40" /></Button></FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-xl" align="start"><CalendarComponent mode="single" selected={field.value ?? undefined} onSelect={field.onChange} className="rounded-2xl" /></PopoverContent></Popover>
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="rdvHonore" render={({ field }) => (
                      <FormItem><FormLabel className="font-bold text-zinc-500">RDV Honoré ?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="rounded-xl border-zinc-200 bg-white h-11"><SelectValue placeholder="Oui/Non" /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-xl">{RDV_HONORE_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                    )}/>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Planification</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100 shadow-inner">
                        <FormField control={form.control} name="dateProchainRdv" render={({ field }) => (
                          <FormItem className="flex flex-col"><FormLabel className="font-extrabold text-indigo-700">DATE DU PROCHAIN RENDEZ-VOUS</FormLabel>
                            <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-bold rounded-xl border-indigo-200 bg-white h-12 text-indigo-900", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "d MMMM yyyy", { locale: fr }) : "Planifier une date"}<Calendar className="ml-auto h-4 w-4 opacity-60 text-indigo-600" /></Button></FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start"><CalendarComponent mode="single" selected={field.value ?? undefined} onSelect={field.onChange} disabled={(date) => date < new Date()} className="rounded-2xl" /></PopoverContent></Popover>
                          </FormItem>
                        )}/>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name="rappelFrequence" render={({ field }) => (
                              <FormItem><FormLabel className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Fréquence Rappel</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="bg-white border-indigo-200 rounded-xl h-12"><SelectValue placeholder="..." /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{FREQUENCE_RAPPEL_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                            )}/>
                            <FormField control={form.control} name="rappelMode" render={({ field }) => (
                              <FormItem><FormLabel className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Mode Rappel</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="bg-white border-indigo-200 rounded-xl h-12"><SelectValue placeholder="..." /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{MODE_RAPPEL_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>)}</SelectContent></Select></FormItem>
                            )}/>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </TabsContent>

          {/* TRAITEMENTS */}
          <TabsContent value="treatments" className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {["Acide Folique", "Hydroxyurée", "Antibioprophylaxie", "Hydratation", "Autres"].map((type, idx) => {
                 const fn = idx === 0 ? "traitementAcideFolique" : idx === 1 ? "traitementHydroxyuree" : idx === 2 ? "traitementAntibioProphylaxie" : idx === 3 ? "traitementHydratation" : "traitementAutres";
                 return (
                   <Card key={type} className={cn(
                     "border-none shadow-sm ring-1 transition-all duration-300 rounded-3xl overflow-hidden",
                     form.watch(`${fn}.active` as any) ? "ring-emerald-200 bg-emerald-50/10 shadow-emerald-500/5 shadow-lg" : "ring-zinc-100 bg-white"
                   )}>
                      <CardHeader className={cn(
                        "py-4 transition-colors",
                         form.watch(`${fn}.active` as any) ? "bg-emerald-50/50" : "bg-zinc-50/30"
                      )}>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-600">{type}</CardTitle>
                          <FormField control={form.control} name={`${fn}.active` as any} render={({ field }) => (
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6 rounded-lg" />
                          )} />
                        </div>
                      </CardHeader>
                      <div className={cn(
                        "grid transition-all duration-500",
                        form.watch(`${fn}.active` as any) ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
                      )}>
                        <CardContent className="pt-6 space-y-4">
                           {type === "Autres" && (
                             <FormField control={form.control} name={`${fn}.nom` as any} render={({ field }) => <FormItem><FormLabel className="text-[10px] font-bold text-zinc-400 uppercase">Nom du traitement</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="h-10 rounded-xl border-zinc-200" placeholder="Préciser..." /></FormControl></FormItem>} />
                           )}
                           <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name={`${fn}.posologie` as any} render={({ field }) => <FormItem><FormLabel className="text-[10px] font-bold text-zinc-400 uppercase">Posologie</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="h-10 rounded-xl border-zinc-200" /></FormControl></FormItem>} />
                             <FormField control={form.control} name={`${fn}.regularite` as any} render={({ field }) => <FormItem><FormLabel className="text-[10px] font-bold text-zinc-400 uppercase">Régularité</FormLabel><Select onValueChange={field.onChange} value={field.value || undefined}><FormControl><SelectTrigger className="h-10 rounded-xl border-zinc-200"><SelectValue placeholder="..." /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{REGULARITE_TRAITEMENT_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>)}</SelectContent></Select></FormItem>} />
                           </div>
                           <FormField control={form.control} name={`${fn}.conclusion` as any} render={({ field }) => <FormItem><FormLabel className="text-[10px] font-bold text-zinc-400 uppercase">Conclusion</FormLabel><Select onValueChange={field.onChange} value={field.value || undefined}><FormControl><SelectTrigger className="h-10 rounded-xl border-zinc-200"><SelectValue placeholder="..." /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{CONCLUSION_TRAITEMENT_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="rounded-lg">{opt}</SelectItem>)}</SelectContent></Select></FormItem>} />
                        </CardContent>
                      </div>
                   </Card>
                 );
               })}
             </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 p-5 sticky bottom-6 z-50 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-zinc-200/50">
            <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isPending} className="rounded-2xl hover:bg-zinc-100 font-bold px-6">
              Annuler
            </Button>
            <Button size="lg" className="rounded-2xl px-12 shadow-xl shadow-primary/30 h-14 font-black uppercase tracking-widest text-xs" type="submit" disabled={isPending}>
               {isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enregistrement...</> : <><Save className="mr-2 h-5 w-5" /> Enregistrer la session</>}
            </Button>
        </div>
      </form>
    </Form>
  );
}
