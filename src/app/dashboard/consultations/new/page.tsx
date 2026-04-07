import { ConsultationForm } from "@/components/consultations/consultation-form";
import { Separator } from "@/components/ui/separator";

export default function NewConsultationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Nouvelle Consultation</h3>
        <p className="text-sm text-muted-foreground">
          Enregistrez les détails de la consultation et générez une ordonnance.
        </p>
      </div>
      <Separator />
      <ConsultationForm />
    </div>
  );
}
