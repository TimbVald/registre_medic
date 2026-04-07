"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ClipboardList,
  CreditCard,
  Settings,
  Menu,
  Pill,
  Activity,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const routes = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-primary",
  },
  {
    label: "Patients",
    icon: Users,
    href: "/dashboard/patients",
    color: "text-primary",
  },
  {
    label: "Dossiers Médicaux",
    icon: FileText,
    href: "/dashboard/records", // New route
    color: "text-emerald-500",
  },
  {
    label: "Prescriptions",
    icon: Pill,
    href: "/dashboard/prescriptions", // New route
    color: "text-emerald-500",
  },
  {
    label: "Suivi Traitements",
    icon: Activity,
    href: "/dashboard/treatments", // New route
    color: "text-emerald-500",
  },
  {
    label: "Rendez-vous",
    icon: Calendar,
    href: "/dashboard/appointments",
    color: "text-primary",
  },
  {
    label: "Médecins",
    icon: Stethoscope,
    href: "/dashboard/doctors",
    color: "text-primary",
  },
  {
    label: "Facturation",
    icon: CreditCard,
    href: "/dashboard/billing",
    color: "text-primary",
  },
  {
    label: "Paramètres",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-muted-foreground",
  },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14" onClick={onNavigate}>
          <div className="relative w-8 h-8 mr-4">
             {/* Logo placeholder */}
             <div className="bg-sidebar-primary rounded-full w-full h-full flex items-center justify-center text-sidebar-primary-foreground font-bold">C</div>
          </div>
          <h1 className="text-2xl font-bold">Clinique</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onNavigate}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition",
                pathname === route.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-sidebar w-72 border-r border-sidebar-border">
        <div className="sr-only">
          <SheetTitle>Menu de navigation</SheetTitle>
        </div>
        <div className="h-full">
            <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
