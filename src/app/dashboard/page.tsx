import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Euro, Activity } from "lucide-react";
import { mockPatients, mockAppointments, mockInvoices, mockConsultations } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  // Calculate stats from mock data
  const totalPatients = mockPatients.length;
  const activePatients = mockPatients.filter(p => p.status === 'ACTIVE').length;
  
  const today = new Date();
  const appointmentsToday = mockAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.getDate() === today.getDate() && 
           aptDate.getMonth() === today.getMonth() && 
           aptDate.getFullYear() === today.getFullYear();
  }).length;
  
  const cancelledAppointments = mockAppointments.filter(apt => apt.status === 'CANCELLED').length;
  
  const totalRevenue = mockInvoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  const activeConsultations = mockConsultations.length; // Just a mock metric for now

  const recentAppointments = [...mockAppointments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              {activePatients} actifs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rendez-vous aujourd'hui
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">
              {cancelledAppointments} annulés au total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenu total
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-muted-foreground">
              Basé sur les factures payées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultations totales
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeConsultations}</div>
            <p className="text-xs text-muted-foreground">
              Depuis le début
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-50 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md">
              Graphique d'activité (placeholder)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Rendez-vous récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patient?.firstName}${apt.patient?.lastName}`} alt="Avatar" />
                    <AvatarFallback>{apt.patient?.firstName[0]}{apt.patient?.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {apt.patient?.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm shrink-0">
                    {new Date(apt.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}