"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  FileText,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const routes = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-zinc-600",
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
    href: "/dashboard/records",
    color: "text-secondary",
  },
  {
    label: "Rendez-vous",
    icon: Calendar,
    href: "/dashboard/appointments",
    color: "text-primary",
  },
  {
    label: "Consultations",
    icon: Stethoscope,
    href: "/dashboard/consultations",
    color: "text-primary",
  },
  {
    label: "Prescriptions",
    icon: Pill,
    href: "/dashboard/prescriptions",
    color: "text-secondary",
  },
  {
    label: "Traitements",
    icon: Activity,
    href: "/dashboard/treatments",
    color: "text-secondary",
  },
  {
    label: "Facturation",
    icon: CreditCard,
    href: "/dashboard/billing",
    color: "text-zinc-600",
  },
  {
    label: "Paramètres",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-zinc-500",
  },
];
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-sidebar/50 backdrop-blur-xl border-r border-sidebar-border shadow-sm overflow-y-auto no-scrollbar">
      <div className="px-6 py-8 flex-1">
        <Link href="/dashboard" className="flex items-center mb-10 group" onClick={onNavigate}>
          <div className="relative w-11 h-11 mr-3 transition-transform group-hover:rotate-3">
             <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md" />
             <div className="relative bg-card border border-border rounded-xl w-full h-full flex items-center justify-center overflow-hidden shadow-md">
                <Image src="/logo/logo.jpeg" alt="Logo" width={44} height={44} className="object-contain p-1" />
             </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">MediCare</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Fondation Chantal Biya</p>
          </div>
        </Link>
        <div className="space-y-1.5">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={onNavigate}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200 ease-in-out",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5 translate-x-1" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn(
                    "h-5 w-5 mr-3 transition-colors",
                    isActive ? route.color : "text-zinc-400 group-hover:text-zinc-600"
                  )} />
                  {route.label}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 mx-4 mb-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
        <p className="text-xs font-semibold text-primary mb-1">Besoin d'aide ?</p>
        <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">Accédez à notre centre de support ou contactez l'administrateur.</p>
        <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold border-primary/20 bg-white/50 hover:bg-white transition-colors">
          SUPPORT
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden mr-2 hover:bg-accent rounded-full transition-colors">
          <Menu className="h-6 w-6 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 border-r-0 sm:max-w-none bg-transparent shadow-none">
        <div className="sr-only">
          <SheetTitle>Menu de navigation</SheetTitle>
        </div>
        <Sidebar onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
