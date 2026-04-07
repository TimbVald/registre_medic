"use client";

import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Appointment } from "@/types";
import { cn } from "@/lib/utils";

interface AppointmentsCalendarProps {
  appointments: Appointment[];
}

export function AppointmentsCalendar({ appointments }: AppointmentsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: fr });
  const endDate = endOfWeek(monthEnd, { locale: fr });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appt) => isSameDay(new Date(appt.date), day));
  };

  const selectedDayAppointments = getAppointmentsForDay(selectedDate);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CONFIRMED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
  };
  
  const statusLabels: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmé",
    CANCELLED: "Annulé",
    COMPLETED: "Terminé",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={today}>
              Aujourd&rsquo;hui
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border shadow-sm">
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
            <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground py-3">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "bg-background min-h-25 p-2 transition-all cursor-pointer hover:bg-muted/50 relative",
                  !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                  isSelected && "ring-2 ring-primary ring-inset z-10",
                  isToday && !isSelected && "bg-blue-50/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                      isToday && "bg-primary text-primary-foreground",
                      !isToday && isSelected && "bg-primary/10 text-primary"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayAppointments.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                      {dayAppointments.length}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 mt-1">
                  {dayAppointments.slice(0, 3).map((appt) => (
                    <div 
                      key={appt.id} 
                      className={cn(
                        "text-[10px] truncate px-1.5 py-0.5 rounded border",
                        statusColors[appt.status] || "bg-gray-100"
                      )}
                    >
                      {format(new Date(appt.date), "HH:mm")} - {appt.patient?.lastName}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-[10px] text-muted-foreground text-center">
                      + {dayAppointments.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>Aucun rendez-vous pour cette date.</p>
                <Button variant="link" className="mt-2 h-auto p-0">Planifier un rendez-vous</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDayAppointments
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((appt) => (
                  <div key={appt.id} className="flex flex-col space-y-2 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(appt.date), "HH:mm")}
                        <span className="text-muted-foreground">-</span>
                        {format(new Date(new Date(appt.date).getTime() + appt.duration * 60000), "HH:mm")}
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] font-normal", statusColors[appt.status])}>
                        {statusLabels[appt.status]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appt.patient?.id}`} />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{appt.patient?.firstName} {appt.patient?.lastName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{appt.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t mt-2">
                      <User className="h-3 w-3" />
                      Dr. {appt.doctor?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}