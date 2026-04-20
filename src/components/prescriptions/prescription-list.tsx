"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Filter, Eye, Printer, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PrescriptionListProps {
  prescriptions: any[];
}

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    (prescription.patient?.noms?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (prescription.patient?.prenoms?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    prescription.medications.some((m: any) => m.medication.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher patient ou médicament..."
            className="pl-9 rounded-xl border-zinc-200 bg-zinc-50/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="rounded-xl border-zinc-200 h-10 px-4">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-100">
              <TableHead className="font-bold py-4">Patient</TableHead>
              <TableHead className="hidden md:table-cell font-bold py-4">Médecin</TableHead>
              <TableHead className="font-bold py-4">Date</TableHead>
              <TableHead className="font-bold py-4">Médicaments</TableHead>
              <TableHead className="font-bold py-4">Statut</TableHead>
              <TableHead className="text-right font-bold py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground italic">
                  Aucune prescription trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-1 ring-zinc-100 shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prescription.patient?.id}`} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">
                          {prescription.patient?.noms?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {prescription.patient?.noms} {prescription.patient?.prenoms}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground md:hidden">
                          {format(new Date(prescription.date), "dd/MM/yyyy")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                          Dr
                        </div>
                        <span className="text-sm font-medium">
                          {prescription.medecin?.nom} {prescription.medecin?.prenom}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium">
                      {format(new Date(prescription.date), "dd MMMM yyyy", { locale: fr })}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1.5">
                        {prescription.medications.slice(0, 2).map((med: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 group">
                                <div className="h-5 w-5 rounded-lg bg-emerald-50 flex items-center justify-center">
                                  <Pill className="h-3 w-3 text-emerald-600" />
                                </div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-sm font-bold text-zinc-700">{med.medication}</span>
                                  <span className="text-[10px] font-medium text-zinc-400">{med.dosage}</span>
                                </div>
                            </div>
                        ))}
                        {prescription.medications.length > 2 && (
                            <Badge variant="outline" className="w-fit text-[9px] font-bold py-0 h-4 border-zinc-200 text-zinc-500 bg-zinc-50">
                              + {prescription.medications.length - 2} AUTRES
                            </Badge>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter",
                        prescription.status === 'ACTIVE' && "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100",
                        prescription.status === 'COMPLETED' && "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100",
                        prescription.status === 'CANCELLED' && "bg-rose-50 text-rose-600 hover:bg-rose-50 border-rose-100"
                      )}
                      variant="outline"
                    >
                      {prescription.status === 'ACTIVE' ? 'En cours' : prescription.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-zinc-100 hover:text-indigo-600">
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-zinc-100 hover:text-emerald-600">
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
