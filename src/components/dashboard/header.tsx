"use client";

import { MobileSidebar } from "@/components/dashboard/sidebar";
import { UserButton } from "@/components/dashboard/user-button";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <div className="flex items-center p-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <MobileSidebar />
      <div className="flex w-full justify-end items-center gap-4">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}
