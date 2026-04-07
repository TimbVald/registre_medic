import Link from "next/link";
import { FileText, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockPatients } from "@/lib/mock-data";

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-900">Dossiers Médicaux</h2>
        <p className="text-muted-foreground mt-1">
          Consultez et gérez les dossiers médicaux électroniques (DME) des patients.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un dossier..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPatients.slice(0, 9).map((patient) => (
          <Link key={patient.id} href={`/dashboard/patients/${patient.id}`}>
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-600">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} />
                  <AvatarFallback>{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-medium">{patient.firstName} {patient.lastName}</CardTitle>
                  <p className="text-xs text-muted-foreground">ID: {patient.id.toUpperCase()}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span>Dossier complet • {patient.medicalHistory?.length || 0} entrées</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
