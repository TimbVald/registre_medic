import PatientForm from "@/components/patients/patient-form";
import { Separator } from "@/components/ui/separator";
import { Patient } from "@/types";

// Mock data fetch (same as in details page)
async function getPatient(id: string): Promise<Patient | null> {
  // Simulate API call
  if (id === "1") {
    return {
      id: "1",
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@email.com",
      phone: "06 12 34 56 78",
      address: "123 Rue de la Paix, Paris",
      dateOfBirth: "1985-04-12",
      gender: "FEMALE",
      lastVisit: "2024-01-15",
      status: "ACTIVE",
      medicalHistory: ["Allergie aux arachides", "Asthme léger", "Opération appendicite (2010)"],
    };
  }
  return null;
}

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatient(id);

  if (!patient) {
    return <div>Patient non trouvé</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Modifier le Patient</h3>
        <p className="text-sm text-muted-foreground">
          Mettez à jour les informations du patient.
        </p>
      </div>
      <Separator />
      <PatientForm initialData={patient} />
    </div>
  );
}
