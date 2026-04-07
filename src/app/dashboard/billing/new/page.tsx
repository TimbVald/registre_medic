import { InvoiceForm } from "@/components/billing/invoice-form";
import { Separator } from "@/components/ui/separator";

export default function NewInvoicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Nouvelle Facture</h3>
        <p className="text-sm text-muted-foreground">
          Créez une nouvelle facture pour un patient.
        </p>
      </div>
      <Separator />
      <InvoiceForm />
    </div>
  );
}
