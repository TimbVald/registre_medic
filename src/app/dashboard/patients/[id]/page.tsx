import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, MapPin, Phone, Edit, FileText, Pill, Activity, AlertCircle, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { mockPatients, mockAppointments, mockPrescriptions } from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import { AppointmentsList } from "@/components/appointments/appointments-list";

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = mockPatients.find((p) => p.id === id);
  const appointments = mockAppointments.filter((a) => a.patientId === id);
  const prescriptions = mockPrescriptions.filter((p) => p.patientId === id);

  if (!patient) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <h2 className="text-xl font-semibold text-blue-900">Patient non trouvé</h2>
            <Link href="/dashboard/patients">
                <Button variant="outline">Retour à la liste</Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-background shadow-md">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} />
            <AvatarFallback>{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{patient.firstName} {patient.lastName}</h2>
            <div className="flex flex-wrap items-center text-muted-foreground mt-1 gap-2">
              <Badge variant={patient.status === "ACTIVE" ? "default" : "secondary"} className="bg-emerald-600 hover:bg-emerald-700 dark:text-white">
                {patient.status === "ACTIVE" ? "Dossier Actif" : "Inactif"}
              </Badge>
              <span className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Né(e) le {new Date(patient.dateOfBirth).toLocaleDateString()}
              </span>
              <span className="text-sm">•</span>
              <span className="text-sm">{patient.gender === 'MALE' ? 'Homme' : patient.gender === 'FEMALE' ? 'Femme' : 'Autre'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Link href={`/dashboard/patients/${patient.id}/edit`} className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                </Button>
            </Link>
            <Button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700">
                <Calendar className="mr-2 h-4 w-4" />
                Rendez-vous
            </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted p-1">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="medical-record">Dossier Médical (DME)</TabsTrigger>
            <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-md font-medium text-foreground">Coordonnées</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="h-4 w-4" />
                            </div>
                            <span className="truncate">{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Phone className="h-4 w-4" />
                            </div>
                            <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <span>{patient.address}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-md font-medium text-foreground flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-600" />
                            Dernière activité
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="font-medium">Dernière visite</p>
                                    <p className="text-sm text-muted-foreground">
                                        {patient.lastVisit ? format(new Date(patient.lastVisit), "d MMMM yyyy", { locale: fr }) : "Aucune visite"}
                                    </p>
                                </div>
                                <Button variant="ghost" size="sm">Voir le rapport</Button>
                            </div>
                            <div>
                                <p className="font-medium mb-2">Traitements en cours</p>
                                <div className="flex flex-wrap gap-2">
                                    {prescriptions.filter(p => p.status === 'ACTIVE').length > 0 ? (
                                        prescriptions.filter(p => p.status === 'ACTIVE').map(p => (
                                            p.medications.map((m, idx) => (
                                                <Badge key={`${p.id}-${idx}`} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    {m.medication}
                                                </Badge>
                                            ))
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Aucun traitement actif</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-md font-medium text-amber-700 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Allergies & Alertes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patient.medicalHistory && patient.medicalHistory.some(h => h.toLowerCase().includes("allergie")) ? (
                            <ul className="space-y-2">
                                {patient.medicalHistory.filter(h => h.toLowerCase().includes("allergie")).map((allergy, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-amber-900 bg-amber-50 p-2 rounded">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        {allergy}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">Aucune allergie connue signalée.</p>
                        )}
                    </CardContent>
                 </Card>

                 <Card className="shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-md font-medium text-primary flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Notes médicales récentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground italic">
                            "Patient stable. Poursuite du traitement actuel recommandée. Prochain contrôle dans 3 mois."
                        </p>
                        <div className="mt-2 text-xs text-right text-muted-foreground">
                            - Dr. House, le 15/02/2024
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </TabsContent>
        
        <TabsContent value="medical-record" className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Historique Médical (DME)</CardTitle>
                        <Button size="sm" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une entrée
                        </Button>
                    </div>
                    <CardDescription>
                        Historique complet des pathologies et interventions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                        <div className="relative border-l border-border ml-4 space-y-8 py-4">
                            {patient.medicalHistory.map((item, index) => (
                                <div key={index} className="relative pl-8">
                                    <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary/20 border-2 border-background ring-2 ring-primary"></span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">{item}</span>
                                        <span className="text-xs text-muted-foreground">Date inconnue (importé)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Dossier médical vide.
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
            <Card>
                <CardHeader>
                    <CardTitle className="text-foreground">Historique des Rendez-vous</CardTitle>
                </CardHeader>
                <CardContent>
                    <AppointmentsList appointments={appointments} />
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="prescriptions">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground">Prescriptions</CardTitle>
                        <Link href="/dashboard/prescriptions/new">
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Nouvelle Prescription
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <PrescriptionList prescriptions={prescriptions} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
