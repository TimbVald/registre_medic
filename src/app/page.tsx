import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Activity, Users, Calendar, Heart, Sun, Sparkles, Anchor, LifeBuoy, Phone, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import { DynamicHope } from "@/components/landing/dynamic-hope";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section - Plus apaisante avec la palette officielle */}
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-accent via-white to-emerald-50/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border border-primary/10 bg-accent px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>L'excellence médicale au service de l'humain</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 leading-[1.1]">
                    Gérer la santé avec <span className="text-primary italic">bienveillance</span>
                  </h1>
                  <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed font-medium">
                    Une plateforme moderne aux couleurs de l'espoir pour accompagner chaque patient vers son rétablissement.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-lg transition-all hover:scale-105 active:scale-95">
                      Accès Professionnel
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/doc/guide_drepanocytose.pdf" target="_blank">
                    <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-slate-200 text-lg hover:bg-slate-50 transition-all hover:border-secondary hover:text-secondary">
                      <FileText className="mr-2 h-5 w-5" />
                      Guide Clinique (PDF)
                    </Button>
                  </Link>
                  <Link href="#hope">
                    <Button variant="ghost" size="lg" className="h-14 px-8 rounded-2xl text-slate-600 hover:text-primary transition-all">
                      Messages d'espoir
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary shadow-sm shadow-secondary" />
                    <span>Sécurité maximale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary" />
                    <span>Données protégées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-400" />
                    <span>Support humain 24/7</span>
                  </div>
                </div>
              </div>
              <div className="relative group animate-in fade-in zoom-in duration-1000">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-2xl bg-white">
                   <Image
                    alt="Soin et attention"
                    className="aspect-[4/3] object-cover object-center w-full transition-transform duration-700 group-hover:scale-105"
                    src="/images/hero.png"
                    width={800}
                    height={600}
                    priority
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl border border-slate-100 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suivi en temps réel</p>
                        <p className="text-sm font-bold text-slate-900">Plus de 2 500 patients suivis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hope Section - Dynamique maintenant */}
        <section id="hope" className="w-full py-24 bg-white relative">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center text-primary mb-2">
                <Heart className="h-6 w-6 fill-primary" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">Messages de courage & d'espoir</h2>
              <div className="h-1.5 w-24 bg-primary rounded-full" />
              <p className="max-w-[800px] text-slate-600 text-lg font-medium leading-relaxed">
                Parce que la santé mentale et le moral sont les piliers de la guérison physique, nous partageons ces mots pour vous fortifier.
              </p>
            </div>
            
            {/* Utilisation du composant dynamique */}
            <div className="flex justify-center">
              <DynamicHope />
            </div>
          </div>
        </section>

        {/* Quote Section - Palette Rose FCB */}
        <section className="w-full py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-[100px]" />
            <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary blur-[100px]" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-primary/10 animate-pulse">
                <Heart className="h-10 w-10 text-primary fill-primary" />
              </div>
              <blockquote className="max-w-[900px]">
                <p className="text-2xl md:text-4xl font-serif italic leading-snug">
                  "Là où il y a de l'amour pour l'art de la médecine, il y a aussi de l'amour pour l'humanité."
                </p>
                <footer className="mt-8 flex flex-col items-center gap-2">
                  <div className="h-px w-12 bg-primary/50" />
                  <span className="text-slate-400 font-medium tracking-[0.2em] uppercase text-sm italic">
                    — Hippocrate
                  </span>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Features Section - Stylisée aux couleurs officielles */}
        <section id="features" className="w-full py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
                    Une technologie au service du <span className="text-secondary">soin patient</span>
                  </h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    Nous avons conçu une interface qui réduit la charge mentale du praticien pour qu'il puisse se consacrer pleinement à l'écoute et au traitement.
                  </p>
                </div>
                <div className="space-y-6 pt-4">
                  {[
                    { title: "Dossiers Médicaux Intelligents", desc: "Un accès instantané à l'historique complet pour des décisions éclairées.", icon: Users, color: "bg-primary" },
                    { title: "Planification Intuitive", desc: "Optimisez votre temps et celui de vos patients avec notre calendrier dynamique.", icon: Calendar, color: "bg-secondary" },
                    { title: "Analyses de Santé", desc: "Suivez l'évolution des patients avec des graphiques et indicateurs précis.", icon: Activity, color: "bg-amber-500" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                      <div className={cn(
                        "mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110",
                        item.color
                      )}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 relative">
                <div className="absolute inset-0 bg-primary/5 rounded-[3rem] blur-3xl -z-10 translate-y-10" />
                <div className="space-y-6 mt-12">
                  <div className="aspect-square rounded-[2.5rem] bg-white p-3 shadow-xl border border-slate-100 group overflow-hidden">
                    <Image src="/images/dashboard.png" alt="Médical" width={400} height={400} className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="aspect-[4/5] rounded-[2.5rem] bg-secondary p-8 flex flex-col justify-end text-white shadow-xl shadow-secondary/20 group hover:-translate-y-2 transition-transform">
                    <LifeBuoy className="h-12 w-12 mb-6 opacity-80 group-hover:rotate-12 transition-transform" />
                    <h4 className="text-2xl font-bold">Assistance Totale</h4>
                    <p className="text-emerald-50/80 text-sm mt-2">Accompagnement humain et support technique continu.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="aspect-[4/5] rounded-[2.5rem] bg-primary p-8 flex flex-col justify-end text-white shadow-xl shadow-primary/20 group hover:-translate-y-2 transition-transform">
                    <Anchor className="h-12 w-12 mb-6 opacity-80 group-hover:rotate-12 transition-transform" />
                    <h4 className="text-2xl font-bold font-heading">Ancré dans le Réel</h4>
                    <p className="text-rose-50/80 text-sm mt-2">Des outils adaptés aux réalités du terrain médical.</p>
                  </div>
                  <div className="aspect-square rounded-[2.5rem] bg-white p-3 shadow-xl border border-slate-100 group overflow-hidden">
                    <Image src="/images/empathy.png" alt="Clinique" width={400} height={400} className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Reassurance and Hope */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-6">
                <div className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-bold tracking-widest uppercase">FAQ</div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900 leading-tight">Accompagnement & <span className="text-primary">Questions</span></h2>
                <div className="h-1.5 w-24 bg-secondary rounded-full mx-auto" />
              </div>
              <div className="grid gap-8">
                {[
                  {
                    q: "Comment puis-je garder espoir pendant mon traitement ?",
                    a: "L'espoir se cultive au quotidien. Nous encourageons nos patients à célébrer chaque petite victoire, à rester entourés de leurs proches et à faire confiance à notre équipe dévouée.",
                    icon: Heart
                  },
                  {
                    q: "Quel soutien proposez-vous aux familles ?",
                    a: "Nous croyons que la guérison est un effort collectif. Nous offrons des espaces d'écoute pour les familles et des conseils pour mieux accompagner leurs proches.",
                    icon: Users
                  },
                  {
                    q: "La technologie remplace-t-elle l'écoute humaine ?",
                    a: "Absolument pas. Chez MediCare, la technologie est un outil pour libérer du temps à nos médecins pour l'écoute et l'empathie.",
                    icon: Sparkles
                  }
                ].map((item, i) => (
                  <div key={i} className="group p-6 md:p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                    <h4 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <span className="flex-1">{item.q}</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed pl-6 md:pl-16 italic text-base md:text-lg border-l-2 border-primary/20">
                      "{item.a}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Palette Officielle */}
        <section id="contact" className="w-full py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 bg-primary text-white space-y-8 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                  
                  <div className="space-y-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Parlons de votre santé</h2>
                    <p className="text-rose-50 text-base md:text-lg font-medium opacity-90">
                      Notre équipe est à votre écoute pour toute question. N'attendez pas pour prendre soin de vous.
                    </p>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-5 group">
                      <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                        <Phone className="h-6 w-6 md:h-7 md:w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] md:text-sm text-rose-100 font-bold uppercase tracking-wider">Téléphone</p>
                        <p className="text-lg md:text-2xl font-bold truncate">+243 812 345 678</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 group">
                      <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-300">
                        <MapPin className="h-6 w-6 md:h-7 md:w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] md:text-sm text-rose-100 font-bold uppercase tracking-wider">Adresse</p>
                        <p className="text-base md:text-xl font-bold leading-snug">123 Avenue de l'Espoir, Kinshasa</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-12 space-y-8">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 tracking-wide">Nom complet</label>
                      <input className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="Votre nom" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 tracking-wide">Email</label>
                      <input className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" placeholder="votre@email.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 tracking-wide">Message</label>
                      <textarea className="w-full h-32 p-5 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                    </div>
                  </div>
                  <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Envoyer mon message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-accent text-primary mb-4 animate-bounce">
                <Activity className="h-10 w-10" />
              </div>
              <h2 className="text-4xl font-extrabold tracking-tighter sm:text-6xl text-slate-900 leading-[1.1]">
                Prêt à transformer votre <span className="text-primary italic">pratique médicale</span> ?
              </h2>
              <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                Rejoignez les professionnels qui choisissent l'excellence technologique et la bienveillance humaine.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-16 px-10 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-xl font-bold shadow-2xl shadow-slate-200 transition-all hover:scale-105">
                    Créer mon compte
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-16 px-10 rounded-[1.5rem] border-slate-200 text-xl font-bold hover:bg-slate-50 transition-all hover:border-secondary hover:text-secondary">
                    Me connecter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-16 border-t border-slate-100 bg-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">MediCare</span>
          </div>
          <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">
            © 2026 MediCare. Dédié à la vie et à l'espoir.
          </p>
          <div className="flex gap-10 text-sm font-bold text-slate-500">
            <Link href="#" className="hover:text-primary transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
