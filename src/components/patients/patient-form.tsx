"use client";

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInYears, differenceInMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CalendarIcon, 
  Loader2, 
  User, 
  Baby, 
  Users, 
  Droplets, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  Dna,
  Heart,
  GraduationCap,
  Briefcase,
  Wallet,
  Church,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
  patientSchema,
  PatientFormValues,
} from "@/lib/schemas/patient.schema";
import { createPatient, updatePatient } from "@/app/actions/patient.actions";

interface PatientFormProps {
  initialData?: any;
}

export default function PatientForm({ initialData }: PatientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!initialData;

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData ? {
      ...initialData,
      dateNaissance: initialData.dateNaissance ? new Date(initialData.dateNaissance) : undefined,
    } : {
      noms: "",
      prenoms: "",
      ageMois: 0,
      ageAnnees: 0,
      lieuNaissance: "",
      lieuResidence: "",
      scolarise: false,
      personnesVivantsAvec: "",
      pereNom: "",
      mereNom: "",
    },
  });

  const dateNaissance = form.watch("dateNaissance");

  // Calcul automatique de l'âge
  useEffect(() => {
    if (dateNaissance) {
      const today = new Date();
      const birthDate = new Date(dateNaissance);
      
      const years = differenceInYears(today, birthDate);
      const months = differenceInMonths(today, birthDate) % 12;
      
      form.setValue("ageAnnees", years, { shouldValidate: true });
      form.setValue("ageMois", months, { shouldValidate: true });
    }
  }, [dateNaissance, form]);

  function onSubmit(data: PatientFormValues) {
    startTransition(async () => {
      let result;
      if (isEditing) {
        result = await updatePatient(initialData.id, data);
      } else {
        result = await createPatient(data);
      }

      if (result.success) {
        toast.success(result.message || (isEditing ? "Patient mis à jour" : "Patient créé"));
        router.refresh();
        router.push(isEditing ? `/dashboard/patients/${initialData.id}` : "/dashboard/patients");
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <Tabs defaultValue="identity" className="w-full space-y-8">
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <TabsList className="bg-zinc-100/50 p-1.5 rounded-2xl h-auto flex md:inline-flex min-w-full md:min-w-0 gap-2 border border-zinc-200/50">
              <TabsTrigger value="identity" className="rounded-xl px-8 py-3 data-[state=active]:shadow-md data-[state=active]:bg-white shrink-0 font-black uppercase text-[10px] tracking-widest transition-all">
                <User className="h-4 w-4 mr-2" /> Identification
              </TabsTrigger>
              <TabsTrigger value="parents" className="rounded-xl px-8 py-3 data-[state=active]:shadow-md data-[state=active]:bg-white shrink-0 font-black uppercase text-[10px] tracking-widest transition-all">
                <Users className="h-4 w-4 mr-2" /> Parenté & Tuteurs
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-xl px-8 py-3 data-[state=active]:shadow-md data-[state=active]:bg-white shrink-0 font-black uppercase text-[10px] tracking-widest transition-all">
                <GraduationCap className="h-4 w-4 mr-2" /> Social & Scolarité
              </TabsTrigger>
            </TabsList>
          </div>

          {/* IDENTIFICATION DU PATIENT */}
          <TabsContent value="identity" className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white overflow-hidden">
               <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-8">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Baby className="h-5 w-5" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-black text-zinc-900 tracking-tight">Informations de base</CardTitle>
                        <CardDescription className="text-xs font-medium text-zinc-400 mt-1 italic">Détails personnels et coordonnées directes</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 pt-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="noms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-zinc-600">Noms <span className="text-rose-500">*</span></FormLabel>
                          <FormControl><Input placeholder="EX: NDONGO" {...field} value={field.value ?? ""} className="rounded-xl border-zinc-200 h-12 uppercase font-bold" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prenoms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-zinc-600">Prénoms</FormLabel>
                          <FormControl><Input placeholder="EX: Jean Paul" {...field} value={field.value ?? ""} className="rounded-xl border-zinc-200 h-12 font-bold" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <FormField
                      control={form.control}
                      name="dateNaissance"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-bold text-zinc-600">Date de naissance <span className="text-rose-500">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-bold rounded-xl border-zinc-200 h-12 bg-zinc-50/10", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "d MMMM yyyy", { locale: fr }) : <span>Sélectionner</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                              <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus className="rounded-2xl" />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ageAnnees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-zinc-600">Âge (Années)</FormLabel>
                          <FormControl><Input type="number" readOnly className="rounded-xl border-zinc-200 h-12 bg-zinc-50/50 font-black text-primary" {...field} value={field.value ?? undefined} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sexe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-zinc-600">Sexe <span className="text-rose-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                            <FormControl><SelectTrigger className="rounded-xl border-zinc-200 h-12"><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Masculin">Masculin</SelectItem>
                              <SelectItem value="Féminin">Féminin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-bold text-zinc-600"><Phone className="h-4 w-4 text-primary" /> Téléphone</FormLabel>
                          <FormControl><Input placeholder="+237..." {...field} value={field.value ?? ""} className="rounded-xl border-zinc-200 h-12" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-bold text-zinc-600"><Mail className="h-4 w-4 text-primary" /> Email</FormLabel>
                          <FormControl><Input placeholder="exemple@mail.com" {...field} value={field.value ?? ""} className="rounded-xl border-zinc-200 h-12" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="lieuNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-zinc-600">Lieu de Naissance</FormLabel>
                          <FormControl><Input placeholder="Ville, Hôpital..." {...field} value={field.value ?? ""} className="rounded-xl border-zinc-200 h-12" /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="groupeSanguin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 font-bold text-zinc-600"><Droplets className="h-4 w-4 text-rose-500" /> Groupe Sanguin</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                            <FormControl><SelectTrigger className="rounded-xl border-zinc-200 h-12 font-black"><SelectValue placeholder="Inconnu" /></SelectTrigger></FormControl>
                            <SelectContent className="rounded-xl">{["A+", "B+", "AB+", "A-", "B-", "AB-", "O+", "O-"].map(v => <SelectItem key={v} value={v} className="font-bold">{v}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
               </CardContent>
            </Card>
          </TabsContent>

          {/* PARENTÉ & TUTEURS */}
          <TabsContent value="parents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PÈRE / TUTEUR */}
                <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-8">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <User className="h-5 w-5" />
                         </div>
                         <CardTitle className="text-xl font-black text-zinc-900">Père / Tuteur</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-10 space-y-6">
                    <FormField control={form.control} name="pereNom" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-zinc-500">Nom Complet</FormLabel><FormControl><Input placeholder="Nom du père" {...field} value={field.value ?? ""} className="rounded-xl h-11 border-zinc-200" /></FormControl></FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="pereTelClassique" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Tél. Classique</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="rounded-xl h-10 border-zinc-200" /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="pereTelWhatsapp" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Tél. WhatsApp</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="rounded-xl h-10 border-zinc-200" /></FormControl></FormItem>
                        )}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="pereProfession" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Profession</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="..." /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{["Secteur public", "Secteur privé formel", "Indépendant formel", "Secteur informel", "Travail précaire", "Sans emploi"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></FormItem>
                         )}/>
                         <FormField control={form.control} name="pereElectrophorese" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Électrophorèse</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="h-11 rounded-xl font-bold"><SelectValue placeholder="--" /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{["AA", "AS", "SS"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></FormItem>
                         )}/>
                    </div>
                  </CardContent>
                </Card>

                {/* MÈRE / TUTRUCE */}
                <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-rose-50/10 border-b border-rose-100/50 p-8">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                            <Heart className="h-5 w-5" />
                         </div>
                         <CardTitle className="text-xl font-black text-zinc-900">Mère / Tutrice</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-10 space-y-6">
                    <FormField control={form.control} name="mereNom" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold text-zinc-500">Nom Complet</FormLabel><FormControl><Input placeholder="Nom de la mère" {...field} value={field.value ?? ""} className="rounded-xl h-11 border-zinc-200" /></FormControl></FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="mereTelClassique" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Tél. Classique</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="rounded-xl h-10 border-zinc-200" /></FormControl></FormItem>
                        )}/>
                        <FormField control={form.control} name="mereTelWhatsapp" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Tél. WhatsApp</FormLabel><FormControl><Input {...field} value={field.value ?? ""} className="rounded-xl h-10 border-zinc-200" /></FormControl></FormItem>
                        )}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="mereProfession" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Profession</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="..." /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{["Secteur public", "Secteur privé formel", "Indépendant formel", "Secteur informel", "Travail précaire", "Sans emploi"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></FormItem>
                         )}/>
                         <FormField control={form.control} name="mereElectrophorese" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs font-bold text-zinc-400 uppercase">Électrophorèse</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="h-11 rounded-xl font-bold"><SelectValue placeholder="--" /></SelectTrigger></FormControl><SelectContent className="rounded-xl">{["AA", "AS", "SS"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></FormItem>
                         )}/>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>

          {/* SOCIAL & SCOLARITÉ */}
          <TabsContent value="social" className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white overflow-hidden">
               <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-8">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <MapPin className="h-5 w-5" />
                     </div>
                     <CardTitle className="text-xl font-black text-zinc-900">Cadre de Vie & Scolarité</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-8 pt-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="typeResidence" render={({ field }) => (
                      <FormItem><FormLabel className="font-bold text-zinc-600">Type de résidence</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || undefined}><FormControl><SelectTrigger className="h-12 rounded-xl border-zinc-200"><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl><SelectContent className="rounded-xl"><SelectItem value="Urbain">Urbain</SelectItem><SelectItem value="Péri-urbain">Péri-urbain</SelectItem><SelectItem value="Rural">Rural</SelectItem></SelectContent></Select></FormItem>
                    )}/>
                    <FormField control={form.control} name="lieuResidence" render={({ field }) => (
                      <FormItem><FormLabel className="font-bold text-zinc-600">Adresse / Quartier</FormLabel><FormControl><Input placeholder="Quartier, Ville..." {...field} value={field.value ?? ""} className="h-12 rounded-xl border-zinc-200" /></FormControl></FormItem>
                    )}/>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-50/50 p-6 rounded-3xl ring-1 ring-zinc-100">
                     <FormField
                        control={form.control}
                        name="scolarise"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-4 space-y-0">
                            <FormControl><Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} className="h-6 w-6 rounded-lg" /></FormControl>
                            <div className="space-y-1">
                                <FormLabel className="text-base font-black text-zinc-800 cursor-pointer">Enfant Scolarisé ?</FormLabel>
                                <p className="text-xs text-zinc-400 font-medium italic">Cochez si l'enfant fréquente actuellement</p>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="personnesVivantsAvec" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-black uppercase text-zinc-400 tracking-widest">Vit avec :</FormLabel><FormControl><Input placeholder="Parents, Tuteurs..." {...field} value={field.value ?? ""} className="h-11 rounded-xl bg-white border-zinc-200" /></FormControl></FormItem>
                      )}/>
                  </div>
               </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 p-5 sticky bottom-6 z-50 bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-zinc-200/50">
            <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isPending} className="rounded-2xl hover:bg-zinc-100 font-bold px-8">
              Annuler
            </Button>
            <Button size="lg" className="rounded-2xl px-12 shadow-xl shadow-primary/30 h-14 font-black uppercase tracking-widest text-xs" type="submit" disabled={isPending}>
               {isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enregistrement...</> : <><Save className="mr-2 h-5 w-5" /> {isEditing ? "Mettre à jour le profil" : "Enregistrer le Patient"}</>}
            </Button>
        </div>
      </form>
    </Form>
  );
}
