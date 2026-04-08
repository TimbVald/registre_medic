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
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <Link className="flex items-center justify-center gap-2 font-bold text-xl" href="#">
        <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center p-1 border">
           <Image src="/logo/logo.jpeg" alt="Logo" width={32} height={32} className="object-contain" />
        </div>
        <span>MediCare</span>
      </Link>
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4 flex items-center" href="#features">
          Fonctionnalités
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 flex items-center" href="#testimonials">
          Témoignages
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 flex items-center" href="#pricing">
          Tarifs
        </Link>
      </nav>
      <div className="ml-4 hidden md:flex gap-2 items-center">
        <ModeToggle />
        <Link href="/login">
          <Button variant="ghost" size="sm">Se connecter</Button>
        </Link>
        <Link href="/register">
          <Button size="sm">S&rsquo;inscrire</Button>
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
