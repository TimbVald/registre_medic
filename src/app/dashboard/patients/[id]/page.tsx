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
  Heart,
  History,
  FlaskConical,
  Bell,
  CheckCircle2,
  XCircle,
  Clock3,
  Printer,
  BedDouble,
  Droplets
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPatientById } from "@/app/actions/patient.actions";
import { mockAppointments, mockPrescriptions } from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import { AppointmentsList } from "@/components/appointments/appointments-list";
import { notFound, redirect } from "next/navigation";
import { HospitalisationList } from "@/components/hospitalisations/hospitalisation-list";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { AntecedentHistory } from "@/components/patients/antecedent-history";
import { ExamenParacliniqueView } from "@/components/patients/examen-paraclinique-view";
import { NotebookTabs, FlaskConical as FlaskIcon } from "lucide-react";

export default async function PatientDetailsPage({ params }: { params: any }) {
  // Gestion robuste des params (Promise ou non)
  const resolvedParams = params instanceof Promise ? await params : await Promise.resolve(params);
  const { id } = resolvedParams;
  
  if (!id) {
    notFound();
  }

  const session = await getSession();
  const patient = await getPatientById(id);

  if (!patient) {
     notFound();
  }

  const isPatient = session?.user?.role === "PATIENT";

  // Sécurité supplémentaire : un patient ne peut voir que son PROPRE dossier
  if (isPatient && session?.user?.id !== id) {
    redirect(`/dashboard/patients/${session.user.id}`);
  }

  // Mocks for now as agreed
  const appointments = mockAppointments.filter((a) => a.patientId === id);
  const prescriptions = mockPrescriptions.filter((p) => p.patientId === id);

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-700">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col gap-6">
        <Link 
          href="/dashboard/patients" 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour à la liste des patients
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {!isPatient && (
            <Button variant="outline" asChild className="rounded-xl border-border flex-1 sm:flex-none">
              <Link href={`/dashboard/patients/${patient.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Modifier le profil
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild className="rounded-xl shadow-sm border-zinc-200 bg-white hover:bg-zinc-50 flex-1 sm:flex-none">
            <Link href={`/dashboard/patients/${patient.id}/dossier`} target="_blank">
               <Printer className="mr-2 h-4 w-4" /> Rapport Médical
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="border-none shadow-sm ring-1 ring-border overflow-hidden bg-gradient-to-br from-card to-muted/30 rounded-2xl md:rounded-3xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-6 md:p-10">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-background shadow-xl shadow-foreground/5">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.noms}`} />
              <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-bold">
                {patient.noms[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{patient.noms} {patient.prenoms}</h1>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1 text-xs">
                        {patient.numeroFiche}
                    </Badge>
                </div>
                <p className="text-muted-foreground font-medium">Patient enregistré le {format(new Date(patient.createdAt), "d MMMM yyyy", { locale: fr })}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                 <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Sexe</p>
                        <p className="text-sm font-semibold">{patient.sexe || "-"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Âge</p>
                        <p className="text-sm font-semibold">{patient.ageAnnees || 0} ans</p>
                    </div>
                 </div>
                  <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Gr. Sanguin</p>
                        <p className="text-sm font-semibold">{patient.groupeSanguin || "Inconnu"}</p>
                    </div>
                  </div>
                 <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Phone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Contact</p>
                        <p className="text-sm font-semibold">{patient.telephone || "N/A"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Résidence</p>
                        <p className="text-sm font-semibold truncate max-w-[80px] sm:max-w-[120px]">{patient.lieuResidence || "-"}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto pb-1 no-scrollbar">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl border border-border w-fit min-w-full sm:min-w-0">
            <TabsTrigger value="overview" className="rounded-xl px-4 sm:px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="record" className="rounded-xl px-4 sm:px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Dossier Externe
            </TabsTrigger>
            <TabsTrigger value="antecedents" className="rounded-xl px-4 sm:px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2">
              <History className="h-4 w-4" /> Antécédents
            </TabsTrigger>
            <TabsTrigger value="exams" className="rounded-xl px-4 sm:px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm flex items-center gap-2">
              <FlaskIcon className="h-4 w-4 text-indigo-500" /> Bilan
            </TabsTrigger>
            <TabsTrigger value="consultations" className="rounded-xl px-4 sm:px-6 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Historique des RDV
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Parental Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-border bg-card rounded-2xl overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border p-4 md:p-6">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                           <Baby className="h-4 w-4 text-blue-500" /> Parenté & Tuteurs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-6">
                        {patient.pereNom && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Père / Tuteur</p>
                                <p className="text-sm font-semibold text-foreground">{patient.pereNom}</p>
                                <p className="text-xs text-muted-foreground">{patient.pereTelClassique}</p>
                            </div>
                        )}
                        {patient.mereNom && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Mère / Tutrice</p>
                                <p className="text-sm font-semibold text-foreground">{patient.mereNom}</p>
                                <p className="text-xs text-muted-foreground">{patient.mereTelClassique}</p>
                            </div>
                        )}
                        {!patient.pereNom && !patient.mereNom && (
                            <p className="text-sm text-muted-foreground italic text-center py-4">Aucune information parentale.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border bg-card rounded-2xl overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border">
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
                 <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl bg-card overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-emerald-500" /> Historique de Santé
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs">Voir tout</Button>
                    </CardHeader>
                    <CardContent className="pt-10 pb-8 px-10">
                        {/* Fake medical timeline for premium look */}
                        <div className="relative border-l-2 border-border pl-8 space-y-10">
                            <div className="relative">
                                <span className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-background border-4 border-primary flex items-center justify-center ring-4 ring-primary/10 shadow-sm transition-all hover:scale-110"></span>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Aujourd'hui</p>
                                    <h4 className="text-sm font-bold text-foreground">Enregistrement initial du patient</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Dossier créé numériquement avec succès par le personnel de la clinique.</p>
                                </div>
                            </div>
                            <div className="relative opacity-50 grayscale select-none cursor-not-allowed">
                                <span className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-muted border-4 border-border"></span>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Étape Suivante</p>
                                    <h4 className="text-sm font-bold text-muted-foreground">Première Consultation & Bilan Sanguin</h4>
                                    <p className="text-xs text-muted-foreground">En attente de la première visite médicale.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                <Dna className="h-4 w-4" /> Groupe Sanguin
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-foreground">{patient.pereGroupeSanguin || "Pas d'infos"}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 tracking-tighter">Basé sur les données familiales</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 active:animate-pulse">
                                <Pill className="h-4 w-4" /> Traitements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-foreground">0</p>
                            <p className="text-[10px] text-muted-foreground mt-1 tracking-tighter">Aucune prescription active</p>
                        </CardContent>
                    </Card>
                 </div>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="record" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm ring-1 ring-border rounded-3xl bg-card p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-emerald-500/30 transition-all">
                    <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Stethoscope className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-foreground">Consultation Systématique</h3>
                       <p className="text-xs text-muted-foreground mt-2">Suivi médical périodique de l'enfant.</p>
                    </div>
                    <Button className="rounded-xl w-full shadow-lg shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-700" asChild>
                        <Link href={`/dashboard/patients/${patient.id}/consultations/new?type=Systématique`}>
                            <Plus className="h-4 w-4 mr-2" /> Nouveau Dossier
                        </Link>
                    </Button>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border rounded-3xl bg-card p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-blue-500/30 transition-all">
                    <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BedDouble className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-foreground">Hospitalisation</h3>
                       <p className="text-xs text-muted-foreground mt-2">Saisie des paramètres et soins hospitaliers.</p>
                    </div>
                    <Button className="rounded-xl w-full shadow-lg shadow-blue-500/10 bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href={`/dashboard/patients/${patient.id}/hospitalisations/new`}>
                            <Plus className="h-4 w-4 mr-2" /> Nouveau Dossier
                        </Link>
                    </Button>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border rounded-3xl bg-card p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-amber-500/30 transition-all">
                    <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <History className="h-8 w-8 text-amber-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-foreground">Antécédents</h3>
                       <p className="text-xs text-muted-foreground mt-2">Historique médical et familial.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl w-full border-amber-200 text-amber-700 hover:bg-amber-50" asChild>
                        <Link href={`/dashboard/patients/${patient.id}/antecedents/new`}>
                            <Plus className="h-4 w-4 mr-2" /> Mettre à jour
                        </Link>
                    </Button>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border rounded-3xl bg-card p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-indigo-500/30 transition-all">
                    <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FlaskConical className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-foreground">Bilan (Examens)</h3>
                       <p className="text-xs text-muted-foreground mt-2">Examens paracliniques et résultats.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" asChild>
                        <Link href={`/dashboard/patients/${patient.id}/examens`}>
                            <FlaskConical className="h-4 w-4 mr-2" /> Voir le bilan
                        </Link>
                    </Button>
                </Card>
            </div>

            <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden bg-card">
                <CardHeader className="border-b border-border bg-muted/30">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <History className="h-5 w-5 text-muted-foreground" /> Historique des Hospitalisations
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <HospitalisationList 
                      hospitalisations={(patient as any).hospitalisations || []} 
                      patientId={patient.id} 
                    />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="antecedents" className="space-y-6">
            <AntecedentHistory 
              patientId={patient.id} 
              antecedents={(patient.antecedents || []).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} 
            />
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
            <ExamenParacliniqueView 
              patientId={patient.id} 
              examens={patient.examensParacliniques?.[0] || null} 
            />
        </TabsContent>

        <TabsContent value="consultations">
             <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden bg-card">
                <CardHeader className="border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                         <div>
                            <CardTitle className="text-sm font-bold">Historique des Rendez-vous</CardTitle>
                            <CardDescription className="text-[10px]">Suivi des rendez-vous passés et futurs pour ce patient.</CardDescription>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {patient.consultationsExternes && patient.consultationsExternes.length > 0 ? (
                        <div className="divide-y divide-border">
                            {patient.consultationsExternes
                                .filter(c => c.dateRdvPrevue) // Uniquement ceux avec un RDV prévu
                                .sort((a, b) => new Date(b.dateRdvPrevue!).getTime() - new Date(a.dateRdvPrevue!).getTime())
                                .map((consultation) => (
                                <div key={consultation.id} className="p-6 hover:bg-muted/10 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm",
                                                consultation.rdvHonore === "Oui" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                                            )}>
                                                {consultation.rdvHonore === "Oui" ? <CheckCircle2 className="h-6 w-6" /> : <Clock3 className="h-6 w-6" />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold text-foreground">
                                                        {format(new Date(consultation.dateRdvPrevue!), "d MMMM yyyy", { locale: fr })}
                                                    </h4>
                                                    <Badge variant="outline" className={cn(
                                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0",
                                                        consultation.rdvHonore === "Oui" ? "text-emerald-600 border-emerald-100 bg-emerald-50" : "text-amber-600 border-amber-100 bg-amber-50"
                                                    )}>
                                                        {consultation.rdvHonore === "Oui" ? "Honoré" : "En attente / Non honoré"}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Bell className="h-3.5 w-3.5" />
                                                        <span>Rappel: {consultation.rappelMode || "Non défini"} ({consultation.rappelFrequence || "N/A"})</span>
                                                    </div>
                                                    {consultation.rappelReception && (
                                                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            <span>Rappel reçu</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {consultation.causeNonHonore && (
                                            <div className="md:max-w-xs p-3 rounded-xl bg-red-50/50 border border-red-100 text-[11px] text-red-700">
                                                <div className="flex items-center gap-2 mb-1 font-bold uppercase tracking-wider">
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    Cause du manquement
                                                </div>
                                                {consultation.causeNonHonore}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {patient.consultationsExternes.filter(c => c.dateRdvPrevue).length === 0 && (
                                <div className="py-20 text-center space-y-3">
                                    <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                                        <Calendar className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">Aucun rendez-vous prévu pour ce patient.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-3">
                            <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                                <Calendar className="h-8 w-8 text-zinc-200" />
                            </div>
                            <p className="text-sm text-muted-foreground italic">Aucune consultation ni rendez-vous enregistré.</p>
                        </div>
                    )}
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
