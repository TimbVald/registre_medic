import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Activity, Users, Calendar, Heart, Sun, Sparkles, Anchor, LifeBuoy, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";

export default function LandingPage() {
  const hopeMessages = [
    {
      icon: Sun,
      title: "Chaque aube est une promesse",
      text: "Le chemin de la guérison commence par un seul pas rempli d'espoir. Nous sommes là pour vous accompagner.",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      icon: Heart,
      title: "Votre force est immense",
      text: "La résilience humaine est le plus puissant des remèdes. Gardez la foi en votre capacité de rétablissement.",
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      icon: Sparkles,
      title: "La science au service de la vie",
      text: "Derrière chaque diagnostic, il y a une solution. Notre expertise est dédiée à votre mieux-être quotidien.",
      color: "text-blue-500",
      bg: "bg-blue-50"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section - Plus apaisante */}
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-blue-50/50 via-white to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-sm font-medium text-blue-600 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    <span>L'excellence médicale au service de l'humain</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 leading-[1.1]">
                    Gérer la santé avec <span className="text-blue-600 italic">bienveillance</span>
                  </h1>
                  <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed font-medium">
                    Plus qu'un logiciel de gestion, un partenaire dédié à l'accompagnement de vos patients vers la guérison et le bien-être.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 text-lg transition-all hover:scale-105 active:scale-95">
                      Accès Professionnel
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#hope">
                    <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-slate-200 text-lg hover:bg-slate-50">
                      Messages d'espoir
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Sécurité maximale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Données protégées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Support humain 24/7</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-rose-100 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <Image
                  alt="Soin et attention"
                  className="relative mx-auto aspect-[4/3] overflow-hidden rounded-[2rem] object-cover object-center w-full shadow-2xl border-4 border-white"
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  width={800}
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hope Section - Nouvelle section demandée */}
        <section id="hope" className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">Mots d'espoir pour nos patients</h2>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
              <p className="max-w-[800px] text-slate-600 text-lg italic">
                "La guérison est une question de temps, mais c'est aussi parfois une question d'opportunité et de courage."
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {hopeMessages.map((msg, idx) => (
                <div key={idx} className="group relative p-8 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${msg.bg} ${msg.color} group-hover:scale-110 transition-transform`}>
                    <msg.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{msg.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section - Inspirante */}
        <section className="w-full py-20 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-500 blur-[100px]" />
            <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-rose-500 blur-[100px]" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <Heart className="h-12 w-12 text-rose-500 fill-rose-500 animate-pulse" />
              <blockquote className="max-w-[900px]">
                <p className="text-2xl md:text-4xl font-serif italic leading-snug">
                  "Là où il y a de l'amour pour l'art de la médecine, il y a aussi de l'amour pour l'humanité."
                </p>
                <footer className="mt-6 text-slate-400 font-medium tracking-widest uppercase text-sm">
                  — Hippocrate
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Features Section - Gardée mais stylisée */}
        <section id="features" className="w-full py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
                  Une technologie de pointe pour un suivi exemplaire
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  Nous simplifions la gestion complexe pour vous permettre de vous concentrer sur l'essentiel : la santé de vos patients.
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    { title: "Dossiers Médicaux Intelligents", desc: "Un accès instantané à l'historique complet pour des décisions éclairées.", icon: Users },
                    { title: "Planification Intuitive", desc: "Optimisez votre temps et celui de vos patients avec notre calendrier dynamique.", icon: Calendar },
                    { title: "Analyses de Santé", desc: "Suivez l'évolution des patients avec des graphiques et indicateurs précis.", icon: Activity }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-12">
                  <div className="aspect-square rounded-[2rem] bg-white p-2 shadow-xl border border-slate-100">
                    <Image src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Médical" width={400} height={400} className="w-full h-full object-cover rounded-[1.5rem]" />
                  </div>
                  <div className="aspect-[4/5] rounded-[2rem] bg-blue-600 p-8 flex flex-col justify-end text-white shadow-xl shadow-blue-200">
                    <LifeBuoy className="h-10 w-10 mb-4" />
                    <h4 className="text-xl font-bold">Assistance Totale</h4>
                    <p className="text-blue-100 text-sm">Nous sommes à vos côtés à chaque étape.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-[2rem] bg-rose-500 p-8 flex flex-col justify-end text-white shadow-xl shadow-rose-200">
                    <Anchor className="h-10 w-10 mb-4" />
                    <h4 className="text-xl font-bold">Ancré dans le Réel</h4>
                    <p className="text-rose-100 text-sm">Des solutions concrètes pour le quotidien.</p>
                  </div>
                  <div className="aspect-square rounded-[2rem] bg-white p-2 shadow-xl border border-slate-100">
                    <Image src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Clinique" width={400} height={400} className="w-full h-full object-cover rounded-[1.5rem]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Reassurance and Hope */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">Questions fréquentes & Accompagnement</h2>
                <p className="text-lg text-slate-600">Nous sommes là pour éclairer votre chemin vers la santé.</p>
              </div>
              <div className="grid gap-6">
                {[
                  {
                    q: "Comment puis-je garder espoir pendant mon traitement ?",
                    a: "L'espoir se cultive au quotidien. Nous encourageons nos patients à célébrer chaque petite victoire, à rester entourés de leurs proches et à faire confiance à notre équipe dévouée qui met tout en œuvre pour leur rétablissement."
                  },
                  {
                    q: "Quel soutien proposez-vous aux familles ?",
                    a: "Nous croyons que la guérison est un effort collectif. Nous offrons des espaces d'écoute pour les familles et des conseils pour mieux accompagner leurs proches tout au long du parcours de soins."
                  },
                  {
                    q: "La technologie remplace-t-elle l'écoute humaine ?",
                    a: "Absolument pas. Chez MediCare, la technologie est un outil pour libérer du temps à nos médecins. Ce temps gagné est réinvesti dans ce qui compte le plus : l'écoute, l'empathie et la compréhension de chaque patient."
                  }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">?</div>
                      {item.q}
                    </h4>
                    <p className="text-slate-600 leading-relaxed pl-11 italic">
                      "{item.a}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden border border-slate-100">
              <div className="grid md:grid-cols-2">
                <div className="p-12 bg-blue-600 text-white space-y-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Parlons de votre santé</h2>
                    <p className="text-blue-100 text-lg">
                      Notre équipe est à votre écoute pour toute question. N'attendez pas pour prendre soin de vous.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-200">Téléphone</p>
                        <p className="text-xl font-bold">+243 812 345 678</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-200">Adresse</p>
                        <p className="text-xl font-bold">123 Avenue de l'Espoir, Kinshasa</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-12 space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nom complet</label>
                      <input className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Votre nom" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email</label>
                      <input className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="votre@email.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Message</label>
                      <textarea className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                    </div>
                  </div>
                  <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]">
                    Envoyer mon message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                Prêt à transformer votre <span className="text-blue-600 italic">pratique médicale</span> ?
              </h2>
              <p className="text-xl text-slate-600 font-medium">
                Rejoignez les professionnels qui choisissent l'excellence et l'humanité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-lg shadow-xl shadow-slate-200 transition-all hover:scale-105">
                    Créer mon compte
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl border-slate-200 text-lg hover:bg-slate-50">
                    Me connecter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 border-t border-slate-100 bg-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MediCare</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © 2026 MediCare. Dédié à la vie et à l'espoir.
          </p>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-blue-600 transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
