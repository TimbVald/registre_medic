"use client";

import { useState } from "react";
import { MoreHorizontal, CheckCircle, XCircle, Search, Calendar, Clock, User, FileText } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Appointment } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AppointmentsListProps {
  appointments: Appointment[];
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "En attente", variant: "secondary" },
  CONFIRMED: { label: "Confirmé", variant: "default" },
  CANCELLED: { label: "Annulé", variant: "destructive" },
  COMPLETED: { label: "Terminé", variant: "outline" },
};

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un rendez-vous..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Médecin</TableHead>
              <TableHead>Date & Heure</TableHead>
              <TableHead className="hidden lg:table-cell">Durée</TableHead>
              <TableHead className="hidden lg:table-cell">Motif</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucun rendez-vous trouvé.
                </TableCell>
              </TableRow>
            ) : (
              currentAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.patient?.id}`} />
                        <AvatarFallback>{getInitials(`${appointment.patient?.firstName} ${appointment.patient?.lastName}`)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{appointment.patient?.firstName} {appointment.patient?.lastName}</span>
                        <span className="text-xs text-muted-foreground md:hidden">{format(new Date(appointment.date), "dd/MM HH:mm")}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{appointment.doctor?.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{format(new Date(appointment.date), "dd MMMM yyyy", { locale: fr })}</span>
                      <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(appointment.date), "HH:mm")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{appointment.duration} min</TableCell>
                  <TableCell className="hidden lg:table-cell">{appointment.reason}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[appointment.status].variant}>
                      {statusMap[appointment.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Confirmer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4 text-red-600" />
                          Annuler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
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