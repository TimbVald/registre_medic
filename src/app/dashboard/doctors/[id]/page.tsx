"use client";

import { useParams } from "next/navigation";
import { 
  Calendar, 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  User, 
  Award, 
  Stethoscope 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Doctor } from "@/types";

// Mock data
const doctor: Doctor = {
  id: "1",
  name: "Dr. Sophie Martin",
  specialization: "Généraliste",
  email: "sophie.martin@clinique.com",
  phone: "01 23 45 67 89",
  schedule: [
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 3, startTime: "09:00", endTime: "12:00" },
    { dayOfWeek: 4, startTime: "14:00", endTime: "19:00" },
    { dayOfWeek: 5, startTime: "09:00", endTime: "16:00" },
  ],
};

const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default function DoctorDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // In a real app, fetch doctor by id
  // const doctor = await getDoctor(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} />
          <AvatarFallback>{doctor.name[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{doctor.name}</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              <Stethoscope className="mr-1 h-3 w-3" />
              {doctor.specialization}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Award className="mr-1 h-3 w-3" />
              15 ans d'expérience
            </Badge>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="outline">Modifier le profil</Button>
          <Button>Voir les rendez-vous</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations de contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Cabinet 302, 3ème étage</span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Horaires de consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctor.schedule.map((slot, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <span className="font-medium">{days[slot.dayOfWeek]}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {slot.startTime} - {slot.endTime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Stats placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">124</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Consultations</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">4.9</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Note moyenne</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Ponctualité</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Nouveaux patients</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
