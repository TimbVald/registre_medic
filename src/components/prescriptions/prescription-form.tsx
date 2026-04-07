"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus, Trash2, Loader2, Pill } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockPatients, mockDoctors } from "@/lib/mock-data";

const prescriptionFormSchema = z.object({
  patientId: z.string().min(1, "Veuillez sélectionner un patient."),
  doctorId: z.string().min(1, "Veuillez sélectionner un médecin."),
  date: z.date({
    required_error: "La date est requise.",
  }),
  medications: z.array(z.object({
    medication: z.string().min(2, "Nom du médicament requis"),
    dosage: z.string().min(1, "Dosage requis"),
    frequency: z.string().min(1, "Fréquence requise"),
    duration: z.string().min(1, "Durée requise"),
    instructions: z.string().optional(),
  })).min(1, "Au moins un médicament doit être prescrit."),
  notes: z.string().optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;

export function PrescriptionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      date: new Date(),
      medications: [{ medication: "", dosage: "", frequency: "", duration: "", instructions: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "medications",
    control: form.control,
  });

  async function onSubmit(data: PrescriptionFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(data);
    toast.success("Prescription créée avec succès");
    setIsLoading(false);
    router.push("/dashboard/prescriptions");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
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
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médecin Prescripteur</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un médecin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de prescription</FormLabel>
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
                          format(field.value, "d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2 text-blue-900">
              <Pill className="h-5 w-5" />
              Médicaments
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ medication: "", dosage: "", frequency: "", duration: "", instructions: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un médicament
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg bg-slate-50 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name={`medications.${index}.medication`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Médicament</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Doliprane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`medications.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1000mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`medications.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Fréquence</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 3x/jour" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`medications.${index}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Durée</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 5 jours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4 flex gap-4">
                <FormField
                  control={form.control}
                  name={`medications.${index}.instructions`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Instructions (Optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: A prendre pendant les repas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes additionnelles</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes pour le patient ou le pharmacien..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer la prescription
          </Button>
        </div>
      </form>
    </Form>
  );
}
