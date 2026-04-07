import { AppointmentForm } from "@/components/appointments/appointment-form";
import { Separator } from "@/components/ui/separator";

export default function NewAppointmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Nouveau Rendez-vous</h3>
        <p className="text-sm text-muted-foreground">
          Planifiez un nouveau rendez-vous pour un patient.
        </p>
      </div>
      <Separator />
      <AppointmentForm />
    </div>
  );
}
