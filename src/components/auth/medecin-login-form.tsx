"use client";

import { useState, useTransition } from "react";
import { loginMedecin } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Stethoscope } from "lucide-react";

export default function MedecinLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginMedecin(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-emerald-100">
            <Stethoscope className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Espace Médecin</CardTitle>
            <CardDescription>Connectez-vous avec votre numéro de série</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numeroSerie">Numéro de série</Label>
            <Input id="numeroSerie" name="numeroSerie" placeholder="MED-2026-001" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motDePasse">Mot de passe</Label>
            <Input id="motDePasse" name="motDePasse" type="password" placeholder="••••••••" required />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...</>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
