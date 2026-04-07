"use client";

import Link from "next/link";
import { Plus, Calendar as CalendarIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsList } from "@/components/appointments/appointments-list";
import { AppointmentsCalendar } from "@/components/appointments/appointments-calendar";

import { mockAppointments } from "@/lib/mock-data";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Rendez-vous</h2>
        <Link href="/dashboard/appointments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-0">
          <AppointmentsList appointments={mockAppointments} />
        </TabsContent>
        <TabsContent value="calendar" className="mt-0">
          <AppointmentsCalendar appointments={mockAppointments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
