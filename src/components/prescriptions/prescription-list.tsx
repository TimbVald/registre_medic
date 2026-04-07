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
import { Prescription } from "@/types";

interface PrescriptionListProps {
  prescriptions: Prescription[];
}

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    prescription.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medications.some(m => m.medication.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher patient ou médicament..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Médecin</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Médicaments</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune prescription trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prescription.patient?.id}`} />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{prescription.patient?.firstName} {prescription.patient?.lastName}</span>
                        <span className="text-xs text-muted-foreground md:hidden">{format(new Date(prescription.date), "dd/MM/yyyy")}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>Dr</AvatarFallback>
                        </Avatar>
                        {prescription.doctor?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(prescription.date), "dd MMMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                        {prescription.medications.slice(0, 2).map((med, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-sm">
                                <Pill className="h-3 w-3 text-emerald-600" />
                                <span className="font-medium">{med.medication}</span>
                                <span className="text-muted-foreground text-xs">({med.dosage})</span>
                            </div>
                        ))}
                        {prescription.medications.length > 2 && (
                            <span className="text-xs text-muted-foreground">+ {prescription.medications.length - 2} autres</span>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prescription.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {prescription.status === 'ACTIVE' ? 'En cours' : prescription.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
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
