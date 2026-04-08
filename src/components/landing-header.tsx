"use client";

import Link from "next/link";
import { Activity, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";

import Image from "next/image";

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="px-4 lg:px-6 h-20 flex items-center border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <Link className="flex items-center justify-center gap-3 font-bold text-2xl group" href="/">
        <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
           <Activity className="h-6 w-6 text-white" />
        </div>
        <span className="tracking-tight text-slate-900">MediCare</span>
      </Link>
      <nav className="ml-auto hidden md:flex gap-8">
        <Link className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors" href="#hope">
          Espoir
        </Link>
        <Link className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors" href="#features">
          Services
        </Link>
        <Link className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors" href="#contact">
          Contact
        </Link>
      </nav>
      <div className="ml-8 hidden md:flex gap-3 items-center">
        <Link href="/login">
          <Button variant="ghost" className="font-semibold text-slate-600 hover:text-blue-600 rounded-xl">Connexion</Button>
        </Link>
        <Link href="/register">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-xl font-semibold shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95">S'inscrire</Button>
        </Link>
      </div>
      <div className="ml-auto md:hidden flex items-center gap-2">
        <ModeToggle />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              <Link 
                className="text-lg font-medium hover:text-primary transition-colors" 
                href="#features"
                onClick={() => setIsOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link 
                className="text-lg font-medium hover:text-primary transition-colors" 
                href="#testimonials"
                onClick={() => setIsOpen(false)}
              >
                Témoignages
              </Link>
              <Link 
                className="text-lg font-medium hover:text-primary transition-colors" 
                href="#pricing"
                onClick={() => setIsOpen(false)}
              >
                Tarifs
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Se connecter</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">S&rsquo;inscrire</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
