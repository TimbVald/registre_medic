import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Edit, 
  FileText, 
  Pill, 
  Activity, 
  AlertCircle, 
  Plus, 
  Stethoscope, 
  Users,
  ArrowLeft,
  Baby,
  Dna,
  Heart
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPatientById } from "@/app/actions/patient.actions";
import { mockAppointments, mockPrescriptions } from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import { AppointmentsList } from "@/components/appointments/appointments-list";
import { notFound } from "next/navigation";

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
     notFound();
  }

  // Mocks for now as agreed
  const appointments = mockAppointments.filter((a) => a.patientId === id);
  const prescriptions = mockPrescriptions.filter((p) => p.patientId === id);

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-700">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link 
          href="/dashboard/patients" 
          className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour à la liste des patients
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="rounded-xl border-zinc-200">
            <Link href={`/dashboard/patients/${patient.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Modifier le profil
            </Link>
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20 bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href={`/dashboard/consultations/new?patientId=${patient.id}`}>
               <Stethoscope className="mr-2 h-4 w-4" /> Nouvelle Consultation
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="border-none shadow-sm ring-1 ring-zinc-200 overflow-hidden bg-gradient-to-br from-white to-zinc-50/30">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8">
            <Avatar className="h-28 w-28 ring-4 ring-white shadow-xl shadow-zinc-200/50">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.noms}`} />
              <AvatarFallback className="bg-zinc-100 text-zinc-400 text-2xl font-bold">
                {patient.noms[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-zinc-900">{patient.noms} {patient.prenoms}</h1>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1 text-xs">
                        {patient.numeroFiche}
                    </Badge>
                </div>
                <p className="text-zinc-500 font-medium">Patient enregistré le {format(new Date(patient.createdAt), "d MMMM yyyy", { locale: fr })}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                 <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Sexe</p>
                        <p className="text-sm font-semibold">{patient.sexe || "-"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Âge</p>
                        <p className="text-sm font-semibold">{patient.ageAnnees || 0} ans</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Phone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Contact</p>
                        <p className="text-sm font-semibold">{patient.telephone || "N/A"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Résidence</p>
                        <p className="text-sm font-semibold truncate max-w-[120px]">{patient.lieuResidence || "-"}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-zinc-100/50 p-1.5 rounded-2xl border border-zinc-200">
          <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="record" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Dossier Médical (DME)
          </TabsTrigger>
          <TabsTrigger value="consultations" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Consultations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Parental Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-zinc-200 bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                           <Baby className="h-4 w-4 text-blue-500" /> Parenté & Tuteurs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {patient.pereNom && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-zinc-400">Père / Tuteur</p>
                                <p className="text-sm font-semibold text-zinc-900">{patient.pereNom}</p>
                                <p className="text-xs text-muted-foreground">{patient.pereTelClassique}</p>
                            </div>
                        )}
                        {patient.mereNom && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-zinc-400">Mère / Tutrice</p>
                                <p className="text-sm font-semibold text-zinc-900">{patient.mereNom}</p>
                                <p className="text-xs text-muted-foreground">{patient.mereTelClassique}</p>
                            </div>
                        )}
                        {!patient.pereNom && !patient.mereNom && (
                            <p className="text-sm text-muted-foreground italic text-center py-4">Aucune information parentale.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-zinc-200 bg-white rounded-2xl overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                           <Heart className="h-4 w-4 text-red-500" /> Alertes & Allergies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100/50 text-amber-700">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="text-xs font-medium">Aucune allergie majeure signalée pour ce patient.</p>
                        </div>
                    </CardContent>
                </Card>
              </div>

              {/* Right Column: Timeline/Activity */}
              <div className="lg:col-span-2 space-y-6">
                 <Card className="border-none shadow-sm ring-1 ring-zinc-200 rounded-2xl bg-white overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 bg-zinc-50/50">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-500" /> Historique de Santé
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs">Voir tout</Button>
                    </CardHeader>
                    <CardContent className="pt-10 pb-8 px-10">
                        {/* Fake medical timeline for premium look */}
                        <div className="relative border-l-2 border-zinc-100 pl-8 space-y-10">
                            <div className="relative">
                                <span className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-white border-4 border-primary flex items-center justify-center ring-4 ring-primary/10 shadow-sm transition-all hover:scale-110"></span>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Aujourd'hui</p>
                                    <h4 className="text-sm font-bold text-zinc-900">Enregistrement initial du patient</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Dossier créé numériquement avec succès par le personnel de la clinique.</p>
                                </div>
                            </div>
                            <div className="relative opacity-50 grayscale select-none cursor-not-allowed">
                                <span className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-zinc-200 border-4 border-zinc-300"></span>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Étape Suivante</p>
                                    <h4 className="text-sm font-bold text-zinc-400">Première Consultation & Bilan Sanguin</h4>
                                    <p className="text-xs text-muted-foreground">En attente de la première visite médicale.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-none shadow-sm ring-1 ring-zinc-200 rounded-2xl bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                                <Dna className="h-4 w-4" /> Groupe Sanguin
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-zinc-900">{patient.pereGroupeSanguin || "Pas d'infos"}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 tracking-tighter">Basé sur les données familiales</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-zinc-200 rounded-2xl bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xs font-bold text-zinc-500 flex items-center gap-2 active:animate-pulse">
                                <Pill className="h-4 w-4" /> Traitements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-zinc-900">0</p>
                            <p className="text-[10px] text-muted-foreground mt-1 tracking-tighter">Aucune prescription active</p>
                        </CardContent>
                    </Card>
                 </div>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="record">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 rounded-3xl bg-white p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center">
                    <FileText className="h-10 w-10 text-zinc-200" />
                </div>
                <div>
                   <h3 className="text-lg font-bold">Dossier Médical Électronique (DME)</h3>
                   <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                     Le dossier médical complet, incluant l'historique chirurgical et personnel, pourra être renseigné lors de la première consultation.
                   </p>
                </div>
                <Button className="rounded-xl mt-4" variant="outline">
                    Compléter le DME
                </Button>
            </Card>
        </TabsContent>

        <TabsContent value="consultations">
             <Card className="border-none shadow-sm ring-1 ring-zinc-200 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-zinc-100 bg-white">
                    <div className="flex items-center justify-between">
                         <CardTitle className="text-sm font-bold">Dernières Consultations</CardTitle>
                         <Button size="sm" className="rounded-lg h-9" asChild>
                            <Link href={`/dashboard/consultations/new?patientId=${patient.id}`}>
                                <Plus className="mr-2 h-4 w-4" /> Nouveau rapport
                            </Link>
                         </Button>
                    </div>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center bg-zinc-50/50">
                    <p className="text-sm text-muted-foreground italic">Aucune consultation enregistrée pour le moment.</p>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
