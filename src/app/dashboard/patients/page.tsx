"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { mockPatients } from "@/lib/mock-data";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter patients based on search term
  const filteredPatients = mockPatients.filter((patient) =>
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
            <p className="text-muted-foreground mt-1">Gérez vos patients et leurs dossiers médicaux.</p>
        </div>
        <Link href="/dashboard/patients/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Patient
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 bg-background p-1 rounded-lg">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-md shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Avatar</TableHead>
              <TableHead>Nom complet</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
              <TableHead className="hidden lg:table-cell">Dernière visite</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPatients.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Aucun patient trouvé.
                    </TableCell>
                </TableRow>
            ) : (
                currentPatients.map((patient) => (
                <TableRow key={patient.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.firstName} ${patient.lastName}`} alt={`${patient.firstName} ${patient.lastName}`} />
                            <AvatarFallback>{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{patient.firstName} {patient.lastName}</span>
                        <span className="text-xs text-muted-foreground md:hidden">{patient.email}</span>
                    </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{patient.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">{patient.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                        {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('fr-FR') : '-'}
                    </TableCell>
                    <TableCell>
                    <Badge variant={patient.status === "ACTIVE" ? "default" : "secondary"}>
                        {patient.status === "ACTIVE" ? "Actif" : "Inactif"}
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
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir dossier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages || 1}
        </div>
        <div className="space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
            >
                Suivant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
      </div>
    </div>
  );
}
