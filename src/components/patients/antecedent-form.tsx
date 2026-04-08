"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  AntecedentFormValues, 
  antecedentSchema, 
  CIRCONSTANCES_OPTIONS, 
  COMPLICATIONS_AIGUES_OPTIONS, 
  COMPLICATIONS_CHRONIQUES_OPTIONS 
} from "@/lib/schemas/antecedent.schema";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { upsertAntecedents } from "@/app/actions/antecedent.actions";
import { Stethoscope, Users, Activity, History, ChevronRight, Save, Loader2 } from "lucide-react";

interface AntecedentFormProps {
  patientId: string;
  initialData?: any;
}

export function AntecedentForm({ patientId, initialData }: AntecedentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AntecedentFormValues>({
    resolver: zodResolver(antecedentSchema),
    defaultValues: initialData || {
      ageDecouverteAnnees: 0,
      ageDecouverteMois: 0,
      circonstancesDecouverte: [],
      typeDepistage: null,
      notionFamilleDrepanocytose: false,
      liensFamille: [],
      nbFreresSoeursDrepanocytaires: null,
      decesFamilleDrepanocytose: false,
      nbDecesFamille: null,
      complicationsAigues: [],
      complicationsChroniques: [],
    },
  });

  async function onSubmit(values: AntecedentFormValues) {
    startTransition(async () => {
      const result = await upsertAntecedents(patientId, values);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        router.push(`/dashboard/patients/${patientId}`);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-12">
        
        {/* SECTION 1: DÉCOUVERTE */}
        <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
            <CardTitle className="flex items-center gap-2 text-primary">
              <History className="h-5 w-5" />
              Découverte de la drépanocytose
            </CardTitle>
            <CardDescription>Informations sur le diagnostic initial du patient.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ageDecouverteAnnees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Âge de découverte (Années)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ageDecouverteMois"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Âge de découverte (Mois)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="typeDepistage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de dépistage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Anténatal">Anténatal</SelectItem>
                      <SelectItem value="Néonatal">Néonatal</SelectItem>
                      <SelectItem value="Post-natal">Post-natal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Circonstances de découverte</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {CIRCONSTANCES_OPTIONS.map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name="circonstancesDecouverte"
                    render={({ field }) => {
                      return (
                        <FormItem key={option} className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-xl hover:bg-zinc-50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option])
                                  : field.onChange(field.value?.filter((value) => value !== option));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-medium leading-none cursor-pointer">
                            {option}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: HISTOIRE FAMILIALE */}
        <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" />
              Histoire Familiale
            </CardTitle>
            <CardDescription>Antécédents de drépanocytose dans la famille.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div className="flex flex-col space-y-4 rounded-2xl bg-zinc-50 p-4">
                <FormField
                control={form.control}
                name="notionFamilleDrepanocytose"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Notion de drépanocytose dans la famille</FormLabel>
                        <FormDescription>Le patient a-t-il des membres de sa famille atteints ?</FormDescription>
                    </div>
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    </FormItem>
                )}
                />

                {form.watch("notionFamilleDrepanocytose") && (
                    <div className="space-y-4 py-2 border-t mt-4">
                        <FormLabel>Si oui, quels sont les liens ?</FormLabel>
                        <div className="flex flex-wrap gap-4">
                            {["Fratrie", "Famille paternelle", "Famille maternelle"].map((lien) => (
                                <FormField
                                    key={lien}
                                    control={form.control}
                                    name="liensFamille"
                                    render={({ field }) => (
                                        <FormItem key={lien} className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(lien as any)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...field.value, lien])
                                                    : field.onChange(field.value?.filter((v: any) => v !== lien));
                                                }}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal cursor-pointer">{lien}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nbFreresSoeursDrepanocytaires"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de frères/sœurs drépanocytaires</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["01", "02", "03", "04", "Plus"].map((v) => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-4">
                 <FormField
                    control={form.control}
                    name="decesFamilleDrepanocytose"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 border-zinc-200">
                            <div className="space-y-0.5">
                                <FormLabel>Décès de personnes drépanocytaires</FormLabel>
                            </div>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                 />
                 {form.watch("decesFamilleDrepanocytose") && (
                    <FormField
                        control={form.control}
                        name="nbDecesFamille"
                        render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-8">
                                <SelectValue placeholder="Nombre de décès" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {["01", "02", "03", "04", "Plus"].map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                 )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: COMPLICATIONS AIGUËS */}
        <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
          <CardHeader className="bg-rose-50/50 border-b border-rose-100">
            <CardTitle className="flex items-center gap-2 text-rose-700">
              <Activity className="h-5 w-5" />
              Antécédents de Complications Aiguës
            </CardTitle>
            <CardDescription>Cochez toutes les complications aiguës rencontrées par le patient.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {COMPLICATIONS_AIGUES_OPTIONS.map((option) => (
                <FormField
                  key={option}
                  control={form.control}
                  name="complicationsAigues"
                  render={({ field }) => (
                    <FormItem key={option} className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-xl hover:bg-rose-50/30 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option])
                              : field.onChange(field.value?.filter((v) => v !== option));
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-semibold leading-none cursor-pointer">
                        {option}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: COMPLICATIONS CHRONIQUES */}
        <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Stethoscope className="h-5 w-5" />
              Complications Chroniques
            </CardTitle>
            <CardDescription>Atteintes d'organes et complications à long terme.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPLICATIONS_CHRONIQUES_OPTIONS.map((option) => (
                <FormField
                  key={option}
                  control={form.control}
                  name="complicationsChroniques"
                  render={({ field }) => (
                    <FormItem key={option} className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-2xl hover:bg-amber-50/30 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option])
                              : field.onChange(field.value?.filter((v) => v !== option));
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-bold leading-none cursor-pointer">
                            {option}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FOOTER: ACTIONS */}
        <div className="flex items-center justify-end gap-4 p-4 bg-white/80 backdrop-blur-md sticky bottom-4 z-10 border rounded-2xl shadow-lg ring-1 ring-zinc-200">
            <Button variant="ghost" onClick={() => router.back()} disabled={isPending}>Annuler</Button>
            <Button size="lg" className="rounded-xl px-8" type="submit" disabled={isPending}>
               {isPending ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                 </>
               ) : (
                <>
                   <Save className="mr-2 h-4 w-4" /> Enregistrer les antécédents
                </>
               )}
            </Button>
        </div>

      </form>
    </Form>
  );
}
