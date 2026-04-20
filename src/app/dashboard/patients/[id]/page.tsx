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
  Clock3,
  Printer,
  BedDouble,
  Droplets
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPatientById } from "@/app/actions/patient.actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PrescriptionList } from "@/components/prescriptions/prescription-list";
import { notFound, redirect } from "next/navigation";
import { HospitalisationList } from "@/components/hospitalisations/hospitalisation-list";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { AntecedentHistory } from "@/components/patients/antecedent-history";
import { ExamenParacliniqueView } from "@/components/patients/examen-paraclinique-view";
import { HealthTimeline } from "@/components/patients/health-timeline";
import { EvolutionCharts } from "@/components/patients/evolution-charts";
import { FlaskConical as FlaskIcon } from "lucide-react";

export default async function PatientDetailsPage({ params }: { params: any }) {
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

  if (isPatient && session?.user?.id !== id) {
    redirect(`/dashboard/patients/${session.user.id}`);
  }

  // Relations réelles
  const consultations = (patient as any).consultationsExternes || [];
  const prescriptions = (patient as any).prescriptions || [];
  const examens = (patient as any).examensParacliniques || [];
  const antecedents = (patient as any).antecedents || [];
  const hospitalisations = (patient as any).hospitalisations || [];

  // Calcul des RDV futurs à partir des consultations
  const upcomingAppointments = consultations
    .filter((c: any) => c.dateProchainRdv && new Date(c.dateProchainRdv) >= new Date())
    .sort((a: any, b: any) => new Date(a.dateProchainRdv).getTime() - new Date(b.dateProchainRdv).getTime());

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
            <Button variant="outline" asChild className="rounded-2xl border-zinc-200 flex-1 sm:flex-none shadow-sm">
              <Link href={`/dashboard/patients/${patient.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Modifier le profil
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild className="rounded-2xl shadow-sm border-zinc-200 bg-white hover:bg-zinc-50 flex-1 sm:flex-none">
            <Link href={`/dashboard/patients/${patient.id}/dossier`} target="_blank">
               <Printer className="mr-2 h-4 w-4" /> Rapport Médical
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="border-none shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-100 overflow-hidden bg-white rounded-[2.5rem]">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 md:p-12">
            <div className="relative">
                <Avatar className="h-28 w-28 md:h-32 md:w-32 ring-8 ring-zinc-50 shadow-inner">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.noms}`} />
                <AvatarFallback className="bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-600 text-3xl font-black">
                    {patient.noms[0]}
                </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 h-8 w-8 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight">{patient.noms} {patient.prenoms}</h1>
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-black px-4 py-1.5 text-[10px] uppercase tracking-widest rounded-full">
                        {patient.numeroFiche}
                    </Badge>
                </div>
                <p className="text-zinc-400 font-bold flex items-center justify-center md:justify-start gap-2 text-sm uppercase tracking-tighter">
                   <Clock3 className="h-4 w-4" />
                   Suivi depuis le {format(new Date(patient.createdAt), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                 <div className="flex items-center gap-3 bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100/50 transition-all hover:bg-white hover:shadow-md">
                    <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Sexe</p>
                        <p className="text-sm font-black text-zinc-800">{patient.sexe || "-"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100/50 transition-all hover:bg-white hover:shadow-md">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Âge</p>
                        <p className="text-sm font-black text-zinc-800">{patient.ageAnnees || 0} ans</p>
                    </div>
                 </div>
                  <div className="flex items-center gap-3 bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100/50 transition-all hover:bg-white hover:shadow-md">
                    <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Gr. Sanguin</p>
                        <p className="text-sm font-black text-zinc-800">{patient.groupeSanguin || "Inconnu"}</p>
                    </div>
                  </div>
                 <div className="flex items-center gap-3 bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100/50 transition-all hover:bg-white hover:shadow-md">
                    <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Phone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-wider">Contact</p>
                        <p className="text-sm font-black text-zinc-800">{patient.telephone || "N/A"}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <div className="overflow-x-auto pb-1 no-scrollbar">
          <TabsList className="bg-zinc-100/50 p-2 rounded-3xl border border-zinc-200/50 w-fit min-w-full sm:min-w-0 shadow-sm">
            <TabsTrigger value="overview" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest transition-all">
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="record" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest transition-all">
              Dossier Externe
            </TabsTrigger>
            <TabsTrigger value="antecedents" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest transition-all">
              Antécédents
            </TabsTrigger>
            <TabsTrigger value="exams" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest transition-all">
              Bilan
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest transition-all">
              Ordonnances
            </TabsTrigger>
            <TabsTrigger value="appointments" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest transition-all">
              RDV
            </TabsTrigger>
            <TabsTrigger value="evolution" className="rounded-2xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest transition-all">
              Évolution
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ÉVOLUTION CLINIQUE */}
        <TabsContent value="evolution" className="space-y-6">
             <div className="px-2 mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <History className="h-5 w-5 text-indigo-500" /> Profil d'Évolution Médicale
                </h3>
             </div>
             <EvolutionCharts 
                consultations={consultations} 
                examens={examens} 
             />
        </TabsContent>

        {/* VUE D'ENSEMBLE */}
        <TabsContent value="overview" className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Quick Info */}
              <div className="lg:col-span-1 space-y-8">
                <Card className="border-none shadow-sm ring-1 ring-zinc-100 bg-white rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-6">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                           <Baby className="h-4 w-4 text-blue-500" /> Parenté & Tuteurs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {patient.pereNom && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-zinc-300 tracking-widest">Père / Tuteur</p>
                                <p className="text-base font-bold text-zinc-800">{patient.pereNom}</p>
                                <p className="text-xs font-medium text-zinc-400">{patient.pereTelClassique}</p>
                            </div>
                        )}
                        {patient.mereNom && (
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-black text-zinc-300 tracking-widest">Mère / Tutrice</p>
                                <p className="text-base font-bold text-zinc-800">{patient.mereNom}</p>
                                <p className="text-xs font-medium text-zinc-400">{patient.mereTelClassique}</p>
                            </div>
                        )}
                        {!patient.pereNom && !patient.mereNom && (
                            <p className="text-sm text-zinc-400 italic text-center py-4">Aucune information parentale.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                  <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2rem] bg-white p-6">
                      <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                              <Pill className="h-6 w-6 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-black text-zinc-900">{prescriptions.length}</p>
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Ordonnances Actives</p>
                          </div>
                      </div>
                  </Card>
                   <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2rem] bg-white p-6">
                      <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                              <Heart className="h-6 w-6 text-rose-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-black text-zinc-900">{consultations.length}</p>
                            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Suivis Cliniques</p>
                          </div>
                      </div>
                  </Card>
                </div>
              </div>

              {/* Center/Right Column: Health Timeline */}
              <div className="lg:col-span-2 space-y-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-4 px-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    Ligne du temps - Activités Réelles
                 </h3>
                 <HealthTimeline 
                    patientId={patient.id} 
                    consultations={consultations} 
                    prescriptions={prescriptions} 
                    examens={examens} 
                 />
              </div>
           </div>
        </TabsContent>

        {/* DOSSIER EXTERNE */}
        <TabsContent value="record" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-emerald-500/30 transition-all">
                    <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Stethoscope className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-zinc-800">Consultation</h3>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">Suivi périodique</p>
                    </div>
                    <Button className="rounded-2xl w-full h-12 shadow-lg shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-700 font-bold" asChild>
                        <Link href={`/dashboard/patients/${patient.id}/consultations/new?type=Systématique`}>
                            <Plus className="h-4 w-4 mr-2" /> Nouveau
                        </Link>
                    </Button>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-blue-500/30 transition-all">
                    <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Pill className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-zinc-800">Ordonnance</h3>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">Nouveau traitement</p>
                    </div>
                    <Button className="rounded-2xl w-full h-12 shadow-lg shadow-blue-500/10 bg-blue-600 hover:bg-blue-700 font-bold" asChild>
                        <Link href={`/dashboard/prescriptions/new?patientId=${patient.id}`}>
                            <Plus className="h-4 w-4 mr-2" /> Prescrire
                        </Link>
                    </Button>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-amber-500/30 transition-all">
                    <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <History className="h-8 w-8 text-amber-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-zinc-800">Antécédents</h3>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">Mise à jour</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl w-full h-12 border-amber-200 text-amber-700 hover:bg-amber-50 font-bold" asChild>
                        <Link href={`/dashboard/patients/${patient.id}/antecedents/new`}>
                            <Plus className="h-4 w-4 mr-2" /> Éditer
                        </Link>
                    </Button>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white p-8 text-center flex flex-col items-center justify-center gap-6 group hover:ring-indigo-500/30 transition-all">
                    <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FlaskIcon className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-zinc-800">Bilan (Exams)</h3>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">Dossier paraclinique</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl w-full h-12 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold" asChild>
                        <Link href={`/dashboard/patients/${patient.id}/examens`}>
                            <FlaskIcon className="h-4 w-4 mr-2" /> Voir bilan
                        </Link>
                    </Button>
                </Card>
            </div>

            <Card className="border-none shadow-md ring-1 ring-zinc-100 rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <BedDouble className="h-5 w-5 text-indigo-500" /> Hospitalisations (Historique)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <HospitalisationList 
                      hospitalisations={hospitalisations} 
                      patientId={patient.id} 
                    />
                </CardContent>
            </Card>
        </TabsContent>

        {/* ANTÉCÉDENTS */}
        <TabsContent value="antecedents">
            <AntecedentHistory 
              patientId={patient.id} 
              antecedents={antecedents.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} 
            />
        </TabsContent>

        {/* BILAN EXAMENS */}
        <TabsContent value="exams">
            <ExamenParacliniqueView 
              patientId={patient.id} 
              examens={examens.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} 
            />
        </TabsContent>

        {/* ORDONNANCES RÉELLES */}
        <TabsContent value="prescriptions">
             <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Pill className="h-5 w-5 text-blue-500" /> Ordonnances du patient
                    </h3>
                    <Button variant="link" className="text-primary font-bold" asChild>
                        <Link href={`/dashboard/prescriptions/new?patientId=${patient.id}`}>Nouvelle ordonnance</Link>
                    </Button>
                </div>
                <PrescriptionList prescriptions={prescriptions} />
             </div>
        </TabsContent>

        {/* RDV RÉELS (Calculés) */}
        <TabsContent value="appointments">
             <Card className="border-none shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-100 rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 p-8">
                    <div className="flex items-center justify-between">
                         <div>
                            <CardTitle className="text-lg font-black text-zinc-800 flex items-center gap-2">
                                <Calendar className="h-6 w-6 text-primary" />
                                Prochaines Échéances
                            </CardTitle>
                            <CardDescription className="text-xs font-medium text-zinc-400 mt-1">Planifiées lors des précédentes consultations.</CardDescription>
                         </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {upcomingAppointments.length > 0 ? (
                        <div className="divide-y divide-zinc-100">
                            {upcomingAppointments.map((consultation: any) => (
                                <div key={consultation.id} className="p-8 hover:bg-zinc-50 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-start gap-6">
                                            <div className="h-16 w-16 rounded-[2rem] bg-primary/5 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">{format(new Date(consultation.dateProchainRdv!), "MMM", { locale: fr })}</span>
                                                    <span className="text-2xl font-black">{format(new Date(consultation.dateProchainRdv!), "dd")}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-xl font-black text-zinc-900 group-hover:text-primary transition-colors">
                                                        Rendez-vous de suivi
                                                    </h4>
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                                                        PLANIFIÉ
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                                        <Clock3 className="h-4 w-4" />
                                                        <span>{format(new Date(consultation.dateProchainRdv!), "EEEE d MMMM yyyy", { locale: fr })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                                        <Bell className="h-4 w-4" />
                                                        <span>Rappel: {consultation.rappelMode || "SMS"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Button variant="outline" className="rounded-2xl h-12 px-6 border-zinc-200 font-bold" asChild>
                                            <Link href={`/dashboard/patients/${patient.id}/consultations/new?type=${consultation.typeConsultation}`}>
                                                Modifier la session
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center space-y-6">
                            <div className="h-20 w-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto ring-1 ring-zinc-100">
                                <Calendar className="h-10 w-10 text-zinc-200" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-zinc-400 italic">Aucun rendez-vous futur planifié.</p>
                                <p className="text-sm text-zinc-300 font-bold uppercase tracking-widest">Planifiez-en un lors de la prochaine consultation.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
