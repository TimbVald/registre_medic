"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Activity, 
  Baby, 
  Calendar, 
  ClipboardList, 
  Dna, 
  FileText, 
  FlaskConical, 
  Heart, 
  History, 
  MapPin, 
  Phone, 
  Stethoscope, 
  User, 
  Users 
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface MedicalRecordReportProps {
  patient: any;
}

export function MedicalRecordReport({ patient }: MedicalRecordReportProps) {
  const today = new Date();

  return (
    <div className="bg-white text-zinc-950 p-0 md:p-8 max-w-4xl mx-auto print:p-0 print:max-w-none print:shadow-none">
      {/* BOUTON IMPRESSION (MASQUÉ AU PRINT) */}
      <div className="flex justify-end mb-6 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <FileText className="h-4 w-4" /> Lancer l'impression
        </button>
      </div>

      {/* DOCUMENT A4 */}
      <div className="border border-zinc-200 shadow-xl print:border-none print:shadow-none min-h-[29.7cm] flex flex-col p-[1.5cm] bg-white relative overflow-hidden">
        
        {/* EN-TÊTE OFFICIEL */}
        <div className="flex justify-between items-start border-b-2 border-primary/20 pb-8 mb-8">
          <div className="flex gap-4 items-center">
             <div className="h-16 w-16 relative bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
                <Image src="/logo/logo.jpeg" alt="Logo" fill className="object-contain p-1" />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 leading-none">MediCare</h1>
                <p className="text-[10px] uppercase font-bold text-primary tracking-[0.2em] mt-1">Fondation Chantal Biya</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">Unité de suivi des enfants drépanocytaires</p>
             </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-tighter">Dossier Médical Individuel</h2>
            <p className="text-sm font-bold text-primary mt-1">{patient.numeroFiche}</p>
            <p className="text-[10px] text-zinc-400 mt-1 italic">Généré le {format(today, "dd MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
          </div>
        </div>

        {/* CONTENU DU DOSSIER */}
        <div className="flex-1 space-y-10">
          
          {/* IDENTITÉ DU PATIENT */}
          <section className="bg-zinc-50/50 p-6 rounded-2xl border border-zinc-100 ring-1 ring-zinc-200/50">
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <User className="h-3 w-3" /> État Civil du Patient
             </h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="col-span-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Nom Complet</p>
                    <p className="text-lg font-black text-zinc-900">{patient.noms} {patient.prenoms || ""}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Sexe</p>
                    <p className="text-sm font-bold text-zinc-800">{patient.sexe || "-"}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Âge</p>
                    <p className="text-sm font-bold text-zinc-800">{patient.ageAnnees || 0} ans {patient.ageMois ? `(${patient.ageMois} m.)` : ""}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Né le</p>
                    <p className="text-sm font-bold text-zinc-800">{patient.dateNaissance ? format(new Date(patient.dateNaissance), "dd/MM/yyyy") : "-"}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Téléphone</p>
                    <p className="text-sm font-bold text-zinc-800">{patient.telephone || "-"}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Lieu de Résidence</p>
                    <p className="text-sm font-bold text-zinc-800 italic">{patient.lieuResidence || "-"}</p>
                </div>
             </div>
          </section>

          {/* PARENTALITÉ & FAMILLE */}
          <section>
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
                <Baby className="h-3 w-3" /> Environnement Familial
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Père / Tuteur</p>
                            <p className="text-sm font-bold text-zinc-800">{patient.pereNom || "Non renseigné"}</p>
                            <p className="text-[11px] text-zinc-500">{patient.pereTelClassique || ""}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5" />
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Mère / Tutrice</p>
                            <p className="text-sm font-bold text-zinc-800">{patient.mereNom || "Non renseignée"}</p>
                            <p className="text-[11px] text-zinc-500">{patient.mereTelClassique || ""}</p>
                        </div>
                    </div>
                </div>
             </div>
          </section>

          {/* ANTÉCÉDENTS MÉDICAUX (Si existants) */}
          {patient.antecedents?.[0] && (
            <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
                    <History className="h-3 w-3" /> Histoire Médicale & Complications
                </h3>
                <div className="pt-2 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Découverte</p>
                            <p className="text-sm font-bold text-zinc-800">À l'âge de {patient.antecedents[0].ageDecouverteAnnees || 0} ans</p>
                            <p className="text-[11px] text-zinc-500 italic">Circonstances : {patient.antecedents[0].circonstancesDecouverte?.join(", ") || "-"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Antécédents Familiaux</p>
                            <p className="text-sm font-bold text-zinc-800">
                                {patient.antecedents[0].notionFamilleDrepanocytose ? "Présence de cas dans la fratrie/famille" : "Aucun cas familial connu"}
                            </p>
                        </div>
                    </div>
                    {patient.antecedents[0].complicationsAigues?.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Complications Signalées</p>
                            <div className="flex flex-wrap gap-2">
                                {patient.antecedents[0].complicationsAigues.map((c: string) => (
                                    <Badge key={c} variant="outline" className="text-[10px] font-bold border-zinc-200 px-2 py-0.5 rounded-md uppercase tracking-tight">
                                        {c}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
          )}

          {/* BILAN BIOLOGIQUE */}
          {patient.examensParacliniques?.[0] && (
            <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
                    <FlaskConical className="h-3 w-3" /> Bilan Biologique Récent
                </h3>
                <div className="border border-zinc-100 rounded-xl overflow-hidden mt-2 shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                            <tr>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-zinc-400">Examen</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-zinc-400">Taux Base</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-zinc-400">Taux Récent</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase text-zinc-400">Interprétation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {patient.examensParacliniques[0].hemoRealise && (
                                <tr className="text-xs">
                                    <td className="px-4 py-3 font-bold">Hémoglobine</td>
                                    <td className="px-4 py-3 text-zinc-600">{patient.examensParacliniques[0].hemoTauxBase || "-"}</td>
                                    <td className="px-4 py-3 text-zinc-900 font-bold">{patient.examensParacliniques[0].hemoTauxRecent || "-"}</td>
                                    <td className="px-4 py-3 text-zinc-600 italic">{patient.examensParacliniques[0].hemoInterpretation || "-"}</td>
                                </tr>
                            )}
                            {patient.examensParacliniques[0].reticRealise && (
                                <tr className="text-xs">
                                    <td className="px-4 py-3 font-bold">Réticulocytes</td>
                                    <td className="px-4 py-3 text-zinc-600">{patient.examensParacliniques[0].reticTauxBase || "-"}</td>
                                    <td className="px-4 py-3 text-zinc-900 font-bold">{patient.examensParacliniques[0].reticTauxRecent || "-"}</td>
                                    <td className="px-4 py-3 text-zinc-600 italic">{patient.examensParacliniques[0].reticInterpretation || "-"}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
          )}

          {/* HISTORIQUE CONSULTATIONS */}
          {patient.consultationsExternes?.length > 0 && (
            <section className="print:break-before-page">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2 border-b border-zinc-100 pb-2">
                    <Stethoscope className="h-3 w-3" /> Historique des Consultations
                </h3>
                <div className="space-y-6 pt-2">
                    {patient.consultationsExternes.slice(0, 5).map((consultation: any) => (
                        <div key={consultation.id} className="border-l-2 border-primary/20 pl-4 py-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-zinc-900">
                                    {format(new Date(consultation.dateConsultation), "dd/MM/yyyy")}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">{consultation.typeConsultation}</span>
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                                <strong>Observations :</strong> {consultation.plaintesDetails?.join(", ") || "Pas de plaintes"} 
                                {consultation.plaintesAutre ? `. ${consultation.plaintesAutre}` : ""}
                            </p>
                        </div>
                    ))}
                    {patient.consultationsExternes.length > 5 && (
                        <p className="text-[10px] text-zinc-400 italic text-center pt-4">... et {patient.consultationsExternes.length - 5} autres consultations antérieures.</p>
                    )}
                </div>
            </section>
          )}

        </div>

        {/* PIED DE PAGE ET SIGNATURE */}
        <div className="mt-16 pt-8 border-t border-zinc-100 flex justify-between items-end">
          <div className="text-[10px] text-zinc-400 max-w-[50%] leading-relaxed">
            Ce document est un rapport médical officiel généré par le système MediCare pour le patient mentionné. 
            Il ne remplace pas une consultation médicale directe. En cas d'urgence, contactez immédiatement l'Unité de Suivi Spécialisé.
          </div>
          <div className="text-center">
            <div className="w-48 h-1 bg-zinc-100 mb-1 mx-auto" />
            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Cachet & Signature Médecin</p>
          </div>
        </div>

        {/* NUMÉROTATION */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-zinc-300 font-bold uppercase tracking-widest">
            MediCare Digital Record - Page 1
        </div>

      </div>
    </div>
  );
}
