"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2, Printer } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data
const patients = [
  { id: "1", name: "Sophie Martin" },
  { id: "2", name: "Thomas Dubois" },
  { id: "3", name: "Julie Bernard" },
];

const doctors = [
  { id: "1", name: "Dr. Martin (Généraliste)" },
  { id: "2", name: "Dr. Dubois (Kinésithérapeute)" },
  { id: "3", name: "Dr. Bernard (Dentiste)" },
];

const consultationFormSchema = z.object({
  patientId: z.string({
    required_error: "Veuillez sélectionner un patient.",
  }),
  doctorId: z.string({
    required_error: "Veuillez sélectionner un médecin.",
  }),
  symptoms: z.string().min(5, "Veuillez décrire les symptômes."),
  diagnosis: z.string().min(5, "Veuillez établir un diagnostic."),
  prescription: z.array(
    z.object({
      medication: z.string().min(2, "Nom du médicament requis"),
      dosage: z.string().min(1, "Dosage requis"),
      instructions: z.string().optional(),
    })
  ).optional(),
  notes: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export function ConsultationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      symptoms: "",
      diagnosis: "",
      notes: "",
      prescription: [{ medication: "", dosage: "", instructions: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prescription",
  });

  async function onSubmit(data: ConsultationFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    toast.success("Consultation enregistrée avec succès");
    setIsLoading(false);
    router.push("/dashboard"); // Redirect to dashboard or consultation list
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
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
                <FormLabel>Médecin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un médecin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
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
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symptômes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez les symptômes du patient..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnostic</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Établissez le diagnostic..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base">Prescription</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ medication: "", dosage: "", instructions: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un médicament
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-md bg-muted/20">
              <FormField
                control={form.control}
                name={`prescription.${index}.medication`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Médicament</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du médicament" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`prescription.${index}.dosage`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Dosage</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 500mg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`prescription.${index}.instructions`}
                render={({ field }) => (
                  <FormItem className="flex-[2]">
                    <FormLabel className="text-xs">Instructions</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2 fois par jour après le repas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8 text-destructive hover:text-destructive/90"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes privées</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes réservées au personnel médical..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer la consultation
          </Button>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer l'ordonnance
          </Button>
        </div>
      </form>
    </Form>
  );
}
