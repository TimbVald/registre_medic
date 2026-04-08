import Link from "next/link";
import { Search, Calendar, User, FileText, Stethoscope, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getConsultations } from "@/app/actions/patient.actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default async function MedicalRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const consultations = await getConsultations(query);

  const getInitials = (noms: string, prenoms: string) => {
    return `${prenoms?.[0] || ""}${noms?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-900">Dossiers Médicaux</h2>
          <p className="text-muted-foreground mt-1">
            Historique complet de toutes les consultations effectuées à la clinique.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="query"
            defaultValue={query}
            placeholder="Rechercher par patient ou plainte..."
            className="pl-8"
          />
        </form>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow>
                <TableHead className="font-bold text-zinc-700">Patient</TableHead>
                <TableHead className="font-bold text-zinc-700 hidden sm:table-cell">Date</TableHead>
                <TableHead className="font-bold text-zinc-700 hidden md:table-cell">Plaintes</TableHead>
                <TableHead className="font-bold text-zinc-700 hidden lg:table-cell">État Général</TableHead>
                <TableHead className="font-bold text-zinc-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Aucune consultation trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                consultations.map((consultation) => (
                  <TableRow key={consultation.id} className="hover:bg-zinc-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${consultation.patient?.noms}`} />
                          <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">
                            {getInitials(consultation.patient?.noms || "", consultation.patient?.prenoms || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-zinc-900 truncate max-w-[120px] sm:max-w-none">{consultation.patient?.prenoms} {consultation.patient?.noms}</span>
                          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{consultation.patient?.numeroFiche}</span>
                          <span className="text-[10px] text-zinc-400 sm:hidden">
                            {format(new Date(consultation.dateConsultation), "d MMM yyyy", { locale: fr })}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        {format(new Date(consultation.dateConsultation), "d MMMM yyyy", { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {consultation.plaintesDetails && Array.isArray(consultation.plaintesDetails) ? (
                          consultation.plaintesDetails.slice(0, 2).map((plainte, i) => (
                            <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] font-bold">
                              {plainte}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground italic">Aucune plainte</span>
                        )}
                        {consultation.plaintesDetails && Array.isArray(consultation.plaintesDetails) && consultation.plaintesDetails.length > 2 && (
                          <span className="text-[10px] text-zinc-400 font-medium">+{consultation.plaintesDetails.length - 2}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          consultation.etatGeneral === "Satisfaisant" 
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50/50" 
                            : "text-amber-600 border-amber-200 bg-amber-50/50"
                        )}
                      >
                        {consultation.etatGeneral}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild className="rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
                        <Link href={`/dashboard/patients/${consultation.patientId}`}>
                          <span className="hidden sm:inline">Dossier</span> <ArrowRight className="sm:ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
