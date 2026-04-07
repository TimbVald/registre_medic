"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockDoctors } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = mockDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Médecins</h2>
            <p className="text-muted-foreground mt-1">Gérez l&apos;équipe médicale et leurs plannings.</p>
        </div>
        <Link href="/dashboard/doctors/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Médecin
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 bg-background p-1 rounded-lg">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou spécialité..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} alt={doctor.name} />
                  <AvatarFallback>{doctor.avatar}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-base font-semibold">{doctor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem>Gérer le planning</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="mt-4 space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                <span className="truncate">{doctor.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                {doctor.phone}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CalendarDays className="mr-1 h-3 w-3" /> Lun - Ven
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Clock className="mr-1 h-3 w-3" /> 09:00 - 17:00
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button variant="outline" className="w-full text-xs">Voir le planning</Button>
            </CardFooter>
          </Card>
        ))}
        {filteredDoctors.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
                Aucun médecin trouvé.
            </div>
        )}
      </div>
    </div>
  );
}
