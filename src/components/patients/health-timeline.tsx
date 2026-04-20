"use client";

import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  History, 
  Activity,
  User,
  Clock,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineEvent {
  id: string;
  type: "CONSULTATION" | "PRESCRIPTION" | "EXAM" | "ANTECEDENT";
  date: Date;
  title: string;
  description: string;
  doctor?: string;
  status?: string;
  link?: string;
  details?: string[];
}

interface HealthTimelineProps {
  patientId: string;
  consultations: any[];
  prescriptions: any[];
  examens: any[];
}

export function HealthTimeline({ patientId, consultations, prescriptions, examens }: HealthTimelineProps) {
  // Fusionner et trier tous les événements par date décroissante
  const events: TimelineEvent[] = [
    ...consultations.map(c => ({
      id: c.id,
      type: "CONSULTATION" as const,
      date: new Date(c.dateConsultation),
      title: "Consultation Systématique",
      description: c.plaintesDetails?.length > 0 ? (c.plaintesDetails as string[]).join(", ") : (c.plaintesAutre || "Examen de routine"),
      doctor: c.medecin ? `Dr. ${c.medecin.nom}` : "Médecin",
      link: `/dashboard/patients/${patientId}/consultations/new?type=${c.typeConsultation}`
    })),
    ...prescriptions.map(p => ({
      id: p.id,
      type: "PRESCRIPTION" as const,
      date: new Date(p.date),
      title: "Nouvelle Ordonnance",
      description: (p.medications as any[])?.map(m => m.name).join(", ") || "Médicaments",
      doctor: p.medecin ? `Dr. ${p.medecin.nom}` : "Médecin",
      status: p.status,
      link: `/dashboard/prescriptions`
    })),
    ...examens.map(e => ({
      id: e.id,
      type: "EXAM" as const,
      date: new Date(e.createdAt),
      title: "Bilan Paraclinique",
      description: `Mise à jour des examens (Hb: ${e.hemoTauxRecent || "N/A"})`,
      link: `/dashboard/patients/${patientId}/examens`
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-50/50 rounded-[2.5rem] border border-dashed border-zinc-200">
        <div className="h-16 w-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-4">
            <History className="h-8 w-8 text-zinc-300" />
        </div>
        <p className="text-zinc-500 font-bold text-lg italic">Aucune activité enregistrée pour le moment.</p>
      </div>
    );
  }

  const getEventStyle = (type: string) => {
    switch (type) {
      case "CONSULTATION": return { icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-50", ring: "ring-emerald-100" };
      case "PRESCRIPTION": return { icon: Pill, color: "text-blue-500", bg: "bg-blue-50", ring: "ring-blue-100" };
      case "EXAM": return { icon: FlaskConical, color: "text-indigo-500", bg: "bg-indigo-50", ring: "ring-indigo-100" };
      default: return { icon: Activity, color: "text-zinc-500", bg: "bg-zinc-50", ring: "ring-zinc-100" };
    }
  };

  return (
    <div className="relative pl-8 md:pl-12 space-y-12 before:absolute before:left-4 md:before:left-6 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-zinc-200 before:to-transparent">
      {events.map((event, index) => {
        const style = getEventStyle(event.type);
        const Icon = style.icon;

        return (
          <div key={`${event.type}-${event.id}`} className="relative animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
            {/* Point on Timeline */}
            <span className={cn(
               "absolute -left-[41px] md:-left-[53px] top-1 h-8 w-8 md:h-10 md:w-10 rounded-[12px] flex items-center justify-center ring-4 shadow-md transition-all group-hover:scale-110 z-10",
               style.bg, style.ring, "bg-white"
            )}>
              <Icon className={cn("h-4 w-4 md:h-5 md:w-5", style.color)} />
            </span>

            {/* Event Card */}
            <div className="group relative bg-white hover:bg-zinc-50 p-6 rounded-[2rem] shadow-sm ring-1 ring-zinc-100 transition-all duration-300">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("rounded-lg border-none font-black text-[10px] uppercase tracking-widest px-2 py-0.5", style.bg, style.color)}>
                        {event.type}
                    </Badge>
                    <div className="flex items-center text-xs font-bold text-zinc-400">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {format(event.date, "d MMMM yyyy", { locale: fr })}
                    </div>
                  </div>
                  {event.status && (
                    <Badge className={cn(
                        "rounded-full text-[10px] font-bold px-3",
                        event.status === "ACTIVE" ? "bg-emerald-500" : "bg-zinc-400"
                    )}>
                        {event.status}
                    </Badge>
                  )}
               </div>

               <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <h4 className="text-xl font-black text-zinc-900 group-hover:text-primary transition-colors">{event.title}</h4>
                    <p className="text-sm font-medium text-zinc-500 leading-relaxed italic">{event.description}</p>
                    
                    {event.doctor && (
                        <div className="flex items-center gap-2 mt-4 p-2 px-3 bg-zinc-50 rounded-xl w-fit">
                            <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center ring-1 ring-zinc-200">
                                <User className="h-3.5 w-3.5 text-zinc-400" />
                            </div>
                            <span className="text-xs font-black text-zinc-600 tracking-tight uppercase">{event.doctor}</span>
                        </div>
                    )}
                  </div>

                  {event.link && (
                    <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold group/btn self-end md:self-center">
                        <Link href={event.link} className="flex items-center">
                            Détails
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                  )}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
