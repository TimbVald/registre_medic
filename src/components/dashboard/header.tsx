"use client";

import { MobileSidebar } from "@/components/dashboard/sidebar";
import { UserButton } from "@/components/dashboard/user-button";
import { ModeToggle } from "@/components/mode-toggle";

interface HeaderProps {
  user?: {
    name: string;
    email?: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <div className="flex items-center p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <MobileSidebar />
      <div className="flex w-full justify-end items-center gap-4">
        <ModeToggle />
        <UserButton user={user} />
      </div>
    </div>
  );
}
