"use client";

import { MobileSidebar } from "@/components/dashboard/sidebar";
import { UserButton } from "@/components/dashboard/user-button";
import { ModeToggle } from "@/components/mode-toggle";

interface User {
  id: string;
  role: "PATIENT" | "MEDECIN";
  name: string;
}

interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <div className="flex items-center p-4 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm transition-all">
      <MobileSidebar user={user} />
      <div className="flex w-full justify-end items-center gap-4">
        <UserButton user={user} />
      </div>
    </div>
  );
}
