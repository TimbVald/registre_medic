"use client";

import { useState, useTransition } from "react";
import { loginPatient } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

export default function PatientLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginPatient(formData);
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
          <div className="p-2 rounded-full bg-blue-500/10">
            <User className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-xl">Espace Patient</CardTitle>
            <CardDescription>Vérifiez votre identité pour accéder à votre dossier</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="noms">Nom(s)</Label>
            <Input id="noms" name="noms" placeholder="Votre nom de famille" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prenoms">Prénom(s)</Label>
            <Input id="prenoms" name="prenoms" placeholder="Votre prénom" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance</Label>
            <Input id="dateNaissance" name="dateNaissance" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input id="telephone" name="telephone" type="tel" placeholder="+237..." required />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vérification...</>
            ) : (
              "Accéder à mon dossier"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
