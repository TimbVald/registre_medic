"use client";

import Link from "next/link";
import { Plus, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockInvoices } from "@/lib/mock-data";
import { BillingList } from "@/components/billing/billing-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  const totalRevenue = mockInvoices
    .filter(i => i.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingAmount = mockInvoices
    .filter(i => i.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const overdueCount = mockInvoices.filter(i => i.status === 'OVERDUE').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
                Facturation Sécurisée
            </h2>
            <p className="text-muted-foreground mt-1">
                Gérez vos factures et paiements en toute conformité.
            </p>
        </div>
        <Link href="/dashboard/billing/new">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Facture
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenu Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-muted-foreground">Encaissé à ce jour</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Attente</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendingAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-muted-foreground">Factures émises non payées</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retards</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{overdueCount} factures</div>
            <p className="text-xs text-muted-foreground">Nécessitent une relance</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-1">
        <BillingList invoices={mockInvoices} />
      </div>
    </div>
  );
}
