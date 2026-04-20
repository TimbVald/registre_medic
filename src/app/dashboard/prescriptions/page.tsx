import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getPrescriptions } from "@/app/actions/prescription.actions";

export default async function PrescriptionsPage() {
  const prescriptions = await getPrescriptions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Prescriptions</h2>
          <p className="text-muted-foreground mt-1">Gérez les prescriptions médicales de vos patients.</p>
        </div>
        <Link href="/dashboard/prescriptions/new">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Prescription
          </Button>
        </Link>
      </div>

      <PrescriptionList prescriptions={prescriptions as any} />
    </div>
  );
}
