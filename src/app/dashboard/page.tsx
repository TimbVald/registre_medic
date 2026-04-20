import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, Euro, Activity, PlusCircle, UserPlus, FileText, ArrowUpRight, TrendingUp } from "lucide-react";
import { db } from "@/db";
import { patients, consultationsExternes, prescriptions } from "@/db/schema";
import { count, desc, eq, and, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PatientEvolutionChart, ConsultationsBarChart } from "@/components/dashboard/dashboard-charts";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const doctorName = session.user?.name || "Médecin";

  // --- Real Data Fetching ---
  const today = new Date().toISOString().split('T')[0];

  const [[patientsCount], [consultationsCount], [activePrescriptionsCount], recentPatients] = await Promise.all([
    db.select({ value: count() }).from(patients),
    db.select({ value: count() }).from(consultationsExternes),
    db.select({ value: count() }).from(prescriptions).where(eq(prescriptions.status, "ACTIVE")),
    db.query.patients.findMany({
      limit: 5,
      orderBy: [desc(patients.createdAt)],
    })
  ]);

  // Statistique simulée pour les RDV car la table RDV n'est pas encore implémentée (mais on peut compter les consultations du jour)
  const [consultationsToday] = await db.select({ value: count() })
    .from(consultationsExternes)
    .where(eq(consultationsExternes.dateConsultation, today));

  const stats = [
    {
      title: "Total Patients",
      value: patientsCount.value.toString(),
      description: "Inscrits en base",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+2",
    },
    {
      title: "Activités du Jour",
      value: consultationsToday.value.toString(),
      description: "Consultations aujourd'hui",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "Stable",
    },
    {
      title: "Consultations Total",
      value: consultationsCount.value.toString(),
      description: "Historique complet",
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+18%",
    },
    {
      title: "Ordonnances Actives",
      value: activePrescriptionsCount.value.toString(),
      description: "Suivis en cours",
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "Nouveau",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
            Bonjour, {doctorName} 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Voici les indicateurs clés de votre clinique pour aujourd'hui.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl border-zinc-200">
            <Link href="/dashboard/appointments">
              <Calendar className="mr-2 h-4 w-4" /> Calendrier
            </Link>
          </Button>
          <Button asChild className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
            <Link href="/dashboard/patients/new">
              <UserPlus className="mr-2 h-4 w-4" /> Nouveau Patient
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-sm ring-1 ring-zinc-100 rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-500">{stat.title}</CardTitle>
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-zinc-900">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
                <p className="text-xs font-medium text-zinc-400">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Charts Section */}
        <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-zinc-100 rounded-3xl overflow-hidden p-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Aperçu de l'activité</CardTitle>
            <CardDescription className="font-medium">Évolution des patients et consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 pt-4">
            <div className="p-4 bg-zinc-50/50 rounded-2xl ring-1 ring-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-zinc-400 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Croissance annuelle des patients
              </h4>
              <PatientEvolutionChart />
            </div>
            <div className="p-4 bg-zinc-50/50 rounded-2xl ring-1 ring-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-zinc-400 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Volume de consultations hebdomadaire
              </h4>
              <ConsultationsBarChart />
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-zinc-100 rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-zinc-50/50 pb-6 border-b border-zinc-100">
            <div>
              <CardTitle className="text-xl font-bold text-zinc-900">Derniers Patients</CardTitle>
              <CardDescription className="font-medium">Nouveaux dossiers créés</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Link href="/dashboard/patients">Tout voir</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {recentPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                    <div className="p-4 bg-zinc-50 rounded-full">
                      <Users className="h-8 w-8 text-zinc-200" />
                    </div>
                    <p className="text-sm font-medium text-zinc-400">Aucun patient enregistré pour le moment.</p>
                    <Button variant="outline" asChild className="rounded-xl border-zinc-200">
                        <Link href="/dashboard/patients/new">Ajouter un patient</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center group cursor-pointer p-2 rounded-2xl hover:bg-zinc-50 transition-colors">
                    <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm ring-1 ring-zinc-100">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.noms}`} />
                        <AvatarFallback className="bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-600 font-bold">
                            {patient.noms[0]}{patient.prenoms?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1 min-w-0">
                        <p className="text-base font-bold leading-none truncate text-zinc-800 group-hover:text-blue-600 transition-colors">
                        {patient.noms} {patient.prenoms}
                        </p>
                        <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-tighter">
                        Fiche: {patient.numeroFiche} • {patient.ageAnnees || 0} ans
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 hover:text-blue-600" asChild>
                        <Link href={`/dashboard/patients/${patient.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    </div>
                ))}
                </div>
            )}
            
            <div className="mt-10 pt-8 border-t border-zinc-100">
                 <h4 className="text-xs font-black uppercase tracking-widest mb-6 text-zinc-400">Accès Rapide</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-center flex-col h-auto py-5 px-4 rounded-2xl border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50 group transition-all" asChild>
                        <Link href="/dashboard/consultations/new">
                            <PlusCircle className="h-6 w-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-zinc-600">Consultation</span>
                        </Link>
                    </Button>
                    <Button variant="outline" className="justify-center flex-col h-auto py-5 px-4 rounded-2xl border-zinc-100 hover:border-blue-200 hover:bg-blue-50 group transition-all" asChild>
                        <Link href="/dashboard/prescriptions/new">
                            <FileText className="h-6 w-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-zinc-600">Ordonnance</span>
                        </Link>
                    </Button>
                 </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}