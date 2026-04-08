import PatientLoginForm from "@/components/auth/patient-login-form";
import MedecinLoginForm from "@/components/auth/medecin-login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="h-20 w-20 rounded-2xl bg-zinc-50 flex items-center justify-center p-2 shadow-sm ring-1 ring-zinc-100">
           <Image src="/logo/logo.jpeg" alt="Logo" width={80} height={80} className="object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sélectionnez votre profil pour accéder à votre espace
          </p>
        </div>
      </div>

      <Tabs defaultValue="medecin" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="medecin">Médecin</TabsTrigger>
          <TabsTrigger value="patient">Patient</TabsTrigger>
        </TabsList>

        <TabsContent value="medecin">
          <MedecinLoginForm />
        </TabsContent>

        <TabsContent value="patient">
          <PatientLoginForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
