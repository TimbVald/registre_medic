import { PrescriptionForm } from "../../../../components/prescriptions/prescription-form";
import { Separator } from "@/components/ui/separator";

export default function NewPrescriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-blue-900">Nouvelle Prescription</h3>
        <p className="text-sm text-muted-foreground">
          Remplissez le formulaire ci-dessous pour créer une nouvelle prescription.
        </p>
      </div>
      <Separator />
      <PrescriptionForm />
    </div>
  );
}
