"use client";

import { useState } from "react";
import { 
  MoreHorizontal, 
  FileText, 
  Eye, 
  Search, 
  Calendar, 
  User, 
  Stethoscope, 
  Activity, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ConsultationsListProps {
  consultations: any[];
  initialSearch?: string;
}

export function ConsultationsList({ consultations, initialSearch = "" }: ConsultationsListProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredConsultations = consultations.filter((consultation) => {
    const patientName = `${consultation.patient?.noms} ${consultation.patient?.prenoms}`.toLowerCase();
    const doctorName = `Dr. ${consultation.medecin?.nom} ${consultation.medecin?.prenom}`.toLowerCase();
    const complaints = (consultation.plaintesDetails || []).join(" ").toLowerCase();
    const otherComplaints = (consultation.plaintesAutre || "").toLowerCase();

    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      doctorName.includes(searchTerm.toLowerCase()) ||
      complaints.includes(searchTerm.toLowerCase()) ||
      otherComplaints.includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredConsultations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentConsultations = filteredConsultations.slice(startIndex, startIndex + itemsPerPage);

  const getInitials = (noms: string, prenoms: string | null) => {
    return `${noms[0]}${prenoms?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm ring-1 ring-zinc-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Rechercher par patient, médecin ou symptômes..."
            className="pl-12 h-12 bg-zinc-50/50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-base"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 px-4">
            <Activity className="h-4 w-4" />
            {filteredConsultations.length} Consultations
        </div>
      </div>

      {/* Grid of Consultations */}
      <div className="grid gap-4">
        {currentConsultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-zinc-200">
            <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-zinc-300" />
            </div>
            <p className="text-zinc-500 font-bold text-lg italic">Aucune consultation ne correspond à votre recherche.</p>
          </div>
        ) : (
          currentConsultations.map((consultation) => (
            <div 
              key={consultation.id} 
              className="group relative bg-white hover:bg-zinc-50 font-medium p-5 rounded-[2rem] shadow-sm ring-1 ring-zinc-100 hover:ring-primary/20 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                
                {/* Patient Info */}
                <div className="flex items-center gap-4 min-w-[250px]">
                  <Avatar className="h-14 w-14 shrink-0 rounded-2xl border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${consultation.patient?.noms}`} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 font-black">
                      {getInitials(consultation.patient?.noms || "P", consultation.patient?.prenoms)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-lg font-black text-zinc-900 group-hover:text-primary transition-colors truncate">
                      {consultation.patient?.noms} {consultation.patient?.prenoms}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-tighter mt-0.5">
                       <span>Fiche: {consultation.patient?.numeroFiche}</span>
                       <span className="h-1 w-1 rounded-full bg-zinc-300" />
                       <span>{consultation.patient?.ageAnnees} ans</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex items-center gap-3 px-4 lg:border-l border-zinc-100 min-w-[200px]">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Examinateur</span>
                    <span className="text-sm font-bold text-zinc-700">
                      Dr. {consultation.medecin?.nom || "Non spécifié"} {consultation.medecin?.prenom || ""}
                    </span>
                  </div>
                </div>

                {/* Clinical Details */}
                <div className="flex-1 lg:px-4 lg:border-l border-zinc-100">
                   <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="rounded-lg bg-emerald-50/50 border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 text-[10px]">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {consultation.etatGeneral || "Non spécifié"}
                      </Badge>
                      <Badge variant="outline" className="rounded-lg bg-indigo-50/50 border-indigo-100 text-indigo-700 font-bold px-2 py-0.5 text-[10px]">
                        <Activity className="h-3 w-3 mr-1" />
                        {consultation.temperature || "--"} °C
                      </Badge>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-zinc-500 line-clamp-1 italic font-medium">
                      <Stethoscope className="h-4 w-4 shrink-0 text-zinc-300" />
                      {consultation.plaintesDetails?.length > 0 
                        ? (consultation.plaintesDetails as string[]).join(", ")
                        : consultation.plaintesAutre || "Aucun symptôme signalé"
                      }
                   </div>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-6 min-w-[180px] lg:border-l border-zinc-100 lg:pl-6">
                   <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 text-zinc-900 font-black text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(new Date(consultation.dateConsultation), "d MMMM yyyy", { locale: fr })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                         <Clock className="h-3 w-3" />
                         {format(new Date(consultation.createdAt), "HH:mm")}
                      </div>
                   </div>

                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 transition-all">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[200px] border-none shadow-2xl ring-1 ring-zinc-100 animate-in fade-in zoom-in-95 duration-200">
                      <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest text-zinc-400 px-3 py-2">Consultation</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-primary/5 focus:text-primary cursor-pointer transition-colors group">
                        <Link href={`/dashboard/patients/${consultation.patientId}`} className="flex items-center justify-between w-full">
                           <div className="flex items-center">
                             <Eye className="mr-2 h-4 w-4" />
                             <span className="font-bold">Voir dossier</span>
                           </div>
                           <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer transition-colors group">
                        <Link href={`/dashboard/patients/${consultation.patientId}/consultations/new?type=${consultation.typeConsultation}`} className="flex items-center justify-between w-full">
                           <div className="flex items-center">
                             <FileText className="mr-2 h-4 w-4" />
                             <span className="font-bold">Modifier</span>
                           </div>
                           <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="rounded-xl px-3 py-2.5 focus:bg-blue-50 focus:text-blue-600 cursor-pointer transition-colors font-bold">
                        <ExternalLink className="mr-2 h-4 w-4 font-bold" />
                        Imprimer fiche
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm ring-1 ring-zinc-100">
          <Button
            variant="ghost"
            className="rounded-xl font-bold hover:bg-zinc-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <div className="text-zinc-400 font-bold text-sm tracking-widest uppercase">
            Page {currentPage} <span className="text-zinc-200 mx-1">/</span> {totalPages}
          </div>
          <Button
            variant="ghost"
             className="rounded-xl font-bold hover:bg-zinc-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}