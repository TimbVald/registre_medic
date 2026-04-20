import { PrescriptionForm } from "../../../../components/prescriptions/prescription-form";
import { Separator } from "@/components/ui/separator";
import { getPatientsList } from "@/app/actions/patient.actions";
import { getMedecins } from "@/app/actions/auth.actions";

export default async function NewPrescriptionPage() {
  const [patients, medecins] = await Promise.all([
    getPatientsList(),
    getMedecins()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-blue-900">Nouvelle Prescription</h3>
        <p className="text-sm text-muted-foreground">
          Remplissez le formulaire ci-dessous pour créer une nouvelle prescription.
        </p>
      </div>
      <Separator />
      <PrescriptionForm patients={patients} medecins={medecins} />
    </div>
  );
}
