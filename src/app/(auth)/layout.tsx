import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Authentification - MediCare",
  description: "Connectez-vous à votre espace MediCare",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8 z-50 text-white lg:text-zinc-900"
        )}
      >
        S'inscrire
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 z-0">
          <Image
            src="/fond/fond.jpeg"
            alt="Background"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-8 w-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
             <Image src="/logo/logo.jpeg" alt="Logo" width={32} height={32} />
          </div>
          MediCare Pro
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-xl font-light leading-relaxed">
              &ldquo;L'excellence clinique au service de la vie. Une gestion simplifiée pour un suivi patient optimal.&rdquo;
            </p>
            <footer className="flex items-center gap-2">
                <div className="h-0.5 w-8 bg-primary"></div>
                <span className="text-sm font-medium">Clinique de l'Espoir</span>
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 md:p-8 relative bg-white min-h-screen flex items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] py-10">
          {children}
        </div>
      </div>
    </div>
  )
}
