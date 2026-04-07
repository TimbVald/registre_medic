import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, Euro, Activity, PlusCircle, UserPlus, FileText, ArrowUpRight } from "lucide-react";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PatientEvolutionChart, ConsultationsBarChart } from "@/components/dashboard/dashboard-charts";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const doctorName = session.user?.name || "Médecin";

  // Real data fetching from Drizzle
  const [patientsCount] = await db.select({ value: count() }).from(patients);
  const recentPatients = await db.query.patients.findMany({
    limit: 5,
    orderBy: [desc(patients.createdAt)],
  });

  // Mock stats for those not yet fully implemented in DB
  const stats = [
    {
      title: "Total Patients",
      value: patientsCount.value.toString(),
      description: "+2 depuis hier",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "RDV Aujourd'hui",
      value: "12",
      description: "3 consultations en attente",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Consultations",
      value: "154",
      description: "+18% ce mois",
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Chiffre d'affaires",
      value: "1.2M CFA",
      description: "Facturation mensuelle",
      icon: Euro,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour, {doctorName} 👋</h1>
          <p className="text-muted-foreground mt-1">
            Voici ce qui se passe dans votre clinique aujourd'hui.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/appointments">
              <Calendar className="mr-2 h-4 w-4" /> Calendrier
            </Link>
          </Button>
          <Button asChild className="shadow-md transition-all hover:shadow-lg">
            <Link href="/dashboard/patients/new">
              <UserPlus className="mr-2 h-4 w-4" /> Nouveau Patient
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow border-none shadow-sm ring-1 ring-zinc-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="text-emerald-500 font-medium mr-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {stat.description.split(' ')[0]}
                </span>
                {stat.description.split(' ').slice(1).join(' ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Charts Section */}
        <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-zinc-200">
          <CardHeader>
            <CardTitle>Aperçu de l'activité</CardTitle>
            <CardDescription>Évolution des patients et consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h4 className="text-sm font-medium mb-4 text-muted-foreground">Croissance annuelle des patients</h4>
              <PatientEvolutionChart />
            </div>
            <div className="pt-6 border-t font-medium">
              <h4 className="text-sm font-medium mb-4 text-muted-foreground">Volume de consultations hebdomadaire</h4>
              <ConsultationsBarChart />
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Patients Récents</CardTitle>
              <CardDescription>Les derniers dossiers créés</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/patients">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                    <Users className="h-10 w-10 text-zinc-300" />
                    <p className="text-sm text-muted-foreground">Aucun patient enregistré pour le moment.</p>
                    <Button variant="link" asChild>
                        <Link href="/dashboard/patients/new">Ajouter un patient</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center group cursor-pointer">
                    <Avatar className="h-10 w-10 shrink-0 border-2 border-white shadow-sm ring-1 ring-zinc-100">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.noms}`} />
                        <AvatarFallback className="bg-zinc-100 text-zinc-600">
                            {patient.noms[0]}{patient.prenoms?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1 min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-none truncate group-hover:text-primary transition-colors">
                        {patient.noms} {patient.prenoms}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                        Fiche: {patient.numeroFiche} • {new Date().getFullYear() - (patient.ageAnnees || 0)} ans
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                        <Link href={`/dashboard/patients/${patient.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    </div>
                ))}
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t">
                 <h4 className="text-sm font-semibold mb-4">Actions Rapides</h4>
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start h-auto py-3 px-4" asChild>
                        <Link href="/dashboard/consultations/new">
                            <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" />
                            <div className="flex flex-col items-start">
                                <span className="text-xs">Consultation</span>
                            </div>
                        </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-3 px-4" asChild>
                        <Link href="/dashboard/prescriptions/new">
                            <FileText className="mr-2 h-4 w-4 text-blue-500" />
                            <div className="flex flex-col items-start">
                                <span className="text-xs">Ordonnance</span>
                            </div>
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