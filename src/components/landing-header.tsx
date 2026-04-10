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
    <header className="px-4 md:px-6 lg:px-8 h-20 flex items-center border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <Link className="flex items-center justify-center gap-3 font-bold text-2xl group" href="/">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
           <Activity className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="tracking-tight text-foreground font-black">MediCare</span>
      </Link>
      <nav className="ml-auto hidden md:flex gap-8">
        <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#hope">
          Espoir
        </Link>
        <Link className="text-sm font-bold text-muted-foreground hover:text-secondary transition-colors" href="#features">
          Services
        </Link>
        <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#contact">
          Contact
        </Link>
      </nav>
      <div className="ml-8 hidden md:flex gap-3 items-center">
        <Link href="/login">
          <Button variant="ghost" className="font-bold text-muted-foreground hover:text-primary rounded-xl">Connexion</Button>
        </Link>
        <Link href="/register">
          <Button className="bg-foreground text-background hover:bg-foreground/90 px-6 rounded-xl font-bold shadow-xl shadow-foreground/5 transition-all hover:scale-105 active:scale-95">S'inscrire</Button>
        </Link>
      </div>
      <div className="ml-auto md:hidden flex items-center gap-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-0 bg-white p-0">
            <div className="flex flex-col gap-8 p-8 mt-12">
              <div className="flex flex-col gap-4">
                <Link 
                  className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center gap-3" 
                  href="#hope"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Espoir
                </Link>
                <Link 
                  className="text-lg font-bold text-foreground hover:text-secondary transition-colors flex items-center gap-3" 
                  href="#features"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  Services
                </Link>
                <Link 
                  className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center gap-3" 
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Contact
                </Link>
              </div>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold">Se connecter</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 rounded-xl font-bold bg-foreground text-background shadow-lg">S&rsquo;inscrire</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
