"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PatientSearch() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative group w-full sm:max-w-md">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
        {isPending ? (
          <Loader2 className="animate-spin text-primary h-4 w-4" />
        ) : (
          <Search className="text-zinc-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
        )}
      </div>
      <Input
        type="text"
        placeholder="Rechercher par nom, fiche ou téléphone..."
        className="pl-10 h-11 bg-white border-zinc-200 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl shadow-sm transition-all"
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {search && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleSearch("")}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-zinc-100/50 rounded-lg"
          >
              <X className="h-4 w-4 text-zinc-400" />
          </Button>
      )}
    </div>
  );
}
