"use client";

import { useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { deletePatient } from "@/app/actions/patient.actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PatientTableProps {
  patients: any[];
}

export function PatientTable({ patients }: PatientTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    startTransition(async () => {
      const result = await deletePatient(id);
      if (result.success) {
        toast.success(`Patient ${name} supprimé.`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[80px]">Patient</TableHead>
              <TableHead>Nom Complet</TableHead>
              <TableHead className="hidden sm:table-cell">N° Fiche</TableHead>
              <TableHead className="hidden md:table-cell">Sexe</TableHead>
              <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
              <TableHead className="hidden xl:table-cell">Enregistré le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium">
                  Aucun patient trouvé.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id} className="group hover:bg-muted/10 transition-colors">
                  <TableCell>
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.noms}`} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {patient.noms[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                        {patient.noms} {patient.prenoms}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider sm:hidden">
                        {patient.numeroFiche}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-medium text-muted-foreground">{patient.numeroFiche}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className={patient.sexe === "Masculin" ? "border-blue-500/20 text-blue-500 bg-blue-500/10" : "border-rose-500/20 text-rose-500 bg-rose-500/10"}>
                      {patient.sexe}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground font-medium">
                    {patient.telephone || "-"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-muted-foreground/70 italic">
                    {new Date(patient.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/dashboard/patients/${patient.id}`}>
                            <Eye className="mr-2 h-4 w-4 text-blue-500" /> Voir dossier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/dashboard/patients/${patient.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4 text-muted-foreground" /> Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 font-semibold">
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer le dossier de <strong>{patient.noms} {patient.prenoms}</strong> ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(patient.id, `${patient.noms} ${patient.prenoms}`)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
