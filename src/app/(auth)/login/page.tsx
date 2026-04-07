import PatientLoginForm from "@/components/auth/patient-login-form";
import MedecinLoginForm from "@/components/auth/medecin-login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Connexion
        </h1>
        <p className="text-sm text-muted-foreground">
          Sélectionnez votre profil pour vous connecter
        </p>
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
