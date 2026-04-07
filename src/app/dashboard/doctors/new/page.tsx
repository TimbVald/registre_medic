import { DoctorForm } from "@/components/doctors/doctor-form";
import { Separator } from "@/components/ui/separator";

export default function NewDoctorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ajouter un Médecin</h3>
        <p className="text-sm text-muted-foreground">
          Créez un nouveau profil de médecin.
        </p>
      </div>
      <Separator />
      <DoctorForm />
    </div>
  );
}
