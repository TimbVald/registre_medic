import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Activity, Users, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-linear-to-b from-background to-muted/50 dark:from-background dark:to-muted/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-bold tracking-tighter leading-none text-[clamp(2rem,5vw,3.75rem)] text-foreground">
                    Gestion clinique moderne et simplifiée
                  </h1>
                  <p className="max-w-150 text-muted-foreground md:text-xl">
                    Une plateforme tout-en-un pour gérer vos patients, rendez-vous, facturation et bien plus encore. Conçue pour les professionnels de santé.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Commencer maintenant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg">
                      En savoir plus
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Sécurisé</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Conforme RGPD</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Support 24/7</span>
                  </div>
                </div>
              </div>
              <Image
                alt="Dashboard Preview"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center w-full lg:order-last shadow-xl border"
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                width={600}
                height={400}
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Fonctionnalités
                </div>
                <h2 className="font-bold tracking-tighter text-[clamp(1.875rem,4vw,3rem)] text-foreground">Tout ce dont vous avez besoin</h2>
                <p className="max-w-225 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Optimisez votre flux de travail avec nos outils puissants et intuitifs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Gestion des Patients</h3>
                  <p className="text-muted-foreground">
                    Dossiers médicaux complets, historique des consultations et suivi personnalisé.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Rendez-vous Intelligents</h3>
                  <p className="text-muted-foreground">
                    Calendrier interactif, rappels automatiques et prise de rendez-vous en ligne.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Facturation & Rapports</h3>
                  <p className="text-muted-foreground">
                    Générez des factures, suivez les paiements et analysez vos performances.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Sécurité Maximale</h3>
                  <p className="text-muted-foreground">
                    Vos données sont chiffrées et protégées selon les normes de santé les plus strictes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Tableau de Bord</h3>
                  <p className="text-muted-foreground">
                    Une vue d&rsquo;ensemble de votre activité en temps réel pour prendre les bonnes décisions.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Multi-utilisateurs</h3>
                  <p className="text-muted-foreground">
                    Gérez les accès pour les médecins, secrétaires et administrateurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="font-bold tracking-tighter text-[clamp(1.875rem,4vw,3rem)] text-foreground">
                  Prêt à transformer votre clinique ?
                </h2>
                <p className="mx-auto max-w-175 text-muted-foreground md:text-xl">
                  Rejoignez des centaines de professionnels de santé qui font confiance à MediCare.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Commencer l&rsquo;essai gratuit
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contacter l&rsquo;équipe
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">© 2024 MediCare Inc. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Conditions d&rsquo;utilisation
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  );
}
