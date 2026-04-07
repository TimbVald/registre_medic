import PatientForm from "@/components/patients/patient-form";

export const metadata = {
  title: "Nouveau Patient | Clinique",
  description: "Enregistrement d'un nouveau patient",
};

export default function NewPatientPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">
          Ajouter un nouveau patient à la base de données de la clinique.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <PatientForm />
      </div>
    </div>
  );
}
