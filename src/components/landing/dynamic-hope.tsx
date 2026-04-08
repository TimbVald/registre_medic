"use client";

import { useState, useEffect } from "react";
import { Heart, Sun, Sparkles, Star, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

const messages = [
  {
    icon: Sun,
    title: "Chaque aube est une promesse",
    text: "Le chemin de la guérison commence par un seul pas rempli d'espoir. Nous sommes là pour vous accompagner.",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100"
  },
  {
    icon: Heart,
    title: "Votre force est immense",
    text: "La résilience humaine est le plus puissant des remèdes. Gardez la foi en votre capacité de rétablissement.",
    color: "text-primary", // Rose FCB
    bg: "bg-accent", // Light Rose
    border: "border-primary/10"
  },
  {
    icon: Sparkles,
    title: "La science au service de la vie",
    text: "Derrière chaque diagnostic, il y a une solution. Notre expertise est dédiée à votre mieux-être quotidien.",
    color: "text-secondary", // Vert Santé
    bg: "bg-emerald-50",
    border: "border-secondary/10"
  },
  {
    icon: Star,
    title: "La lumière après l'ombre",
    text: "Même les nuits les plus sombres finissent par laisser place au soleil. Gardez espoir, vous n'êtes pas seul.",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    icon: CloudSun,
    title: "Un nouveau départ",
    text: "Chaque jour est une nouvelle opportunité de se sentir mieux. Nous mettons tout en œuvre pour votre santé.",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100"
  }
];

export function DynamicHope() {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setIsExiting(false);
      }, 500); // Temps de sortie
    }, 6000); // Change toutes les 6 secondes

    return () => clearInterval(timer);
  }, []);

  const msg = messages[index];
  const Icon = msg.icon;

  return (
    <div className="relative w-full max-w-lg mx-auto h-[220px] md:h-[180px]">
      <div 
        className={cn(
          "absolute inset-0 p-8 rounded-[2rem] border bg-white shadow-xl transition-all duration-500 flex flex-col items-center text-center justify-center",
          msg.border,
          isExiting ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
        )}
      >
        <div className={cn(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-700",
          msg.bg,
          msg.color,
          !isExiting && "scale-110"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{msg.title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
          {msg.text}
        </p>
      </div>
    </div>
  );
}
