"use client";

import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Consultation } from "@/types";

import { mockConsultations } from "@/lib/mock-data";
import { ConsultationsList } from "@/components/consultations/consultations-list";

export default function ConsultationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Consultations</h2>
        <Link href="/dashboard/consultations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Consultation
          </Button>
        </Link>
      </div>

      <ConsultationsList consultations={mockConsultations} />
    </div>
  );
}
