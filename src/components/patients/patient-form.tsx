"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

import { patientSchema, PatientFormValues } from "@/lib/schemas/patient.schema";
import { createPatient } from "@/app/actions/patient.actions";

export default function PatientForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData ? {
      noms: initialData.noms || "",
      prenoms: initialData.prenoms || "",
      ageMois: initialData.ageMois || 0,
      ageAnnees: initialData.ageAnnees || 0,
      lieuNaissance: initialData.lieuNaissance || "",
      lieuResidence: initialData.lieuResidence || "",
      scolarise: initialData.scolarise || false,
      personnesVivantsAvec: initialData.personnesVivantsAvec || "",
      email: initialData.email || "",
      telephone: initialData.telephone || "",
      pereNom: initialData.pereNom || "",
      mereNom: initialData.mereNom || "",
      // Add more fields if necessary...
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

  function onSubmit(data: PatientFormValues) {
    startTransition(async () => {
      const result = await createPatient(data);
      if (result.success) {
        toast.success(`Patient enregistré avec succès. Fiche: ${result.numeroFiche}`);
        router.push("/dashboard/patients"); // Ou la page d'affichage du patient
      } else {
        toast.error(result.error || "Une erreur est survenue.");
        if (result.details) {
            console.error(result.details);
        }
      }
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-card rounded-2xl shadow-sm border border-border">
      <div className="mb-8 border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground">Nouveau Patient</h2>
        <p className="text-sm text-muted-foreground">
          Veuillez remplir les informations pour la création d'une nouvelle fiche. Le numéro sera généré automatiquement.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="identification" className="w-full">
            <div className="overflow-x-auto pb-1 no-scrollbar">
              <TabsList className="flex w-full min-w-max mb-6 h-auto p-1.5 bg-muted/50 rounded-xl gap-1">
                <TabsTrigger value="identification" className="py-2.5 px-6 rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm">Patient</TabsTrigger>
                <TabsTrigger value="pere" className="py-2.5 px-6 rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm">Père/Tuteur</TabsTrigger>
                <TabsTrigger value="mere" className="py-2.5 px-6 rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm">Mère/Tutrice</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="identification" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="noms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Noms *</FormLabel>
                      <FormControl>
                        <Input placeholder="Noms de famille" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prenoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénoms</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénoms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+237..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="exemple@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateNaissance"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de naissance *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="lieuNaissance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu de Naissance</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville/Hôpital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ageMois"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Mois)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Mois"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ageAnnees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Années)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Années"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sexe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexe *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculin">Masculin</SelectItem>
                          <SelectItem value="Féminin">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="typeResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de résidence</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Urbain">Urbain</SelectItem>
                          <SelectItem value="Péri-urbain">Péri-urbain</SelectItem>
                          <SelectItem value="Rural">Rural</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="lieuResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse de résidence</FormLabel>
                      <FormControl>
                        <Input placeholder="Quartier, Ville..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <FormField
                    control={form.control}
                    name="scolarise"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border p-4 bg-muted/20">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-foreground font-semibold">Scolarisé(e)</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                  control={form.control}
                  name="personnesVivantsAvec"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vit avec (Parents/Tuteurs...)</FormLabel>
                      <FormControl>
                        <Input placeholder="Père, Mère, Tuteur..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="pere" className="space-y-6">
              {/* Informations du Père */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pereNom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du Père/Tuteur</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom complet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pereEtat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>État</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Vivant", "Décédé", "Invalide", "Abandon"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                   <FormField control={form.control} name="pereTelClassique" render={({ field }) => (
                      <FormItem><FormLabel>Téléphone Class.</FormLabel><FormControl><Input placeholder="+237..." {...field} /></FormControl><FormMessage /></FormItem>
                   )}/>
                   <FormField control={form.control} name="pereTelWhatsapp" render={({ field }) => (
                      <FormItem><FormLabel>Téléphone WhatsApp</FormLabel><FormControl><Input placeholder="+237..." {...field} /></FormControl><FormMessage /></FormItem>
                   )}/>
                </div>

                 <FormField control={form.control} name="pereAge" render={({ field }) => (
                      <FormItem><FormLabel>Âge (Années)</FormLabel><FormControl><Input type="number" placeholder="40" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>
                )}/>

                <FormField
                  control={form.control}
                  name="pereNiveauScolaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau Scolaire</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                           {["Non scolarisé", "Primaire", "Secondaire", "Universitaire", "Post-universitaire"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="pereProfession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["Secteur public", "Secteur privé formel", "Indépendant formel", "Secteur informel", "Travail précaire", "Sans emploi"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="pereRevenus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenus Mensuels</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["<1x SMIC (<36.000)", "1-2x SMIC (36.000-72.000)", "2-5x SMIC (72.000-180.000)", "5-10x SMIC (180.000-360.000)", "10-15xSMIC (360.000-540.000)", "15-20xSMIC (540.000-720.000)", "20-25xSMIC (720.000-900.000)", ">25xSMIC"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pereSituationMatrimoniale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situation matrimoniale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                           {["Célibataire", "Marié Monogame", "Marié Polyandre", "Marié Polygame", "Veuf", "Divorcé", "Séparation de corps"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="pereReligion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["Christianisme", "Islam", "Animisme", "Témoin de Jehova", "Inconnue"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField control={form.control} name="pereGroupeSanguin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Groupe Sanguin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["A+", "B+", "AB+", "A-", "B-", "AB-", "O+", "O-"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}/>
                   <FormField control={form.control} name="pereElectrophorese" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Électrophorèse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["AA", "AS", "SS"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}/>
              </div>
            </TabsContent>

            <TabsContent value="mere" className="space-y-6">
               {/* Informations de la Mère */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mereNom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la Mère/Tutrice</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom complet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mereEtat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>État</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Vivant", "Décédé", "Invalide", "Abandon"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                   <FormField control={form.control} name="mereTelClassique" render={({ field }) => (
                      <FormItem><FormLabel>Téléphone Class.</FormLabel><FormControl><Input placeholder="+237..." {...field} /></FormControl><FormMessage /></FormItem>
                   )}/>
                   <FormField control={form.control} name="mereTelWhatsapp" render={({ field }) => (
                      <FormItem><FormLabel>Téléphone WhatsApp</FormLabel><FormControl><Input placeholder="+237..." {...field} /></FormControl><FormMessage /></FormItem>
                   )}/>
                </div>

                 <FormField control={form.control} name="mereAge" render={({ field }) => (
                      <FormItem><FormLabel>Âge (Années)</FormLabel><FormControl><Input type="number" placeholder="40" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>
                )}/>

                <FormField
                  control={form.control}
                  name="mereNiveauScolaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau Scolaire</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                           {["Non scolarisé", "Primaire", "Secondaire", "Universitaire", "Post-universitaire"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="mereProfession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["Secteur public", "Secteur privé formel", "Indépendant formel", "Secteur informel", "Travail précaire", "Sans emploi"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="mereRevenus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenus Mensuels</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                           {["<1x SMIC (<36.000)", "1-2x SMIC (36.000-72.000)", "2-5x SMIC (72.000-180.000)", "5-10x SMIC (180.000-360.000)", "10-15xSMIC (360.000-540.000)", "15-20xSMIC (540.000-720.000)", "20-25xSMIC (720.000-900.000)", ">25xSMIC"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mereSituationMatrimoniale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situation matrimoniale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                           {["Célibataire", "Marié Monogame", "Marié Polyandre", "Marié Polygame", "Veuf", "Divorcé", "Séparation de corps"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="mereReligion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["Christianisme", "Islam", "Animisme", "Témoin de Jehova", "Inconnue"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="mereGroupeSanguin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Groupe Sanguin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["A+", "B+", "AB+", "A-", "B-", "AB-", "O+", "O-"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}/>
                   <FormField control={form.control} name="mereElectrophorese" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Électrophorèse</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["AA", "AS", "SS"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}/>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-6 border-t border-border flex justify-end items-center gap-4 sticky bottom-4 z-10 bg-background/80 backdrop-blur-md p-4 rounded-2xl shadow-lg ring-1 ring-border mt-8">
            <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isPending} className="rounded-xl">Annuler</Button>
            <Button type="submit" size="lg" disabled={isPending} className="rounded-xl px-10 shadow-md shadow-primary/20">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer le Patient"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
