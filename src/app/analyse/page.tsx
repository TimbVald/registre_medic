"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area
} from "recharts";
import { Activity, Users, Home, AlertTriangle, Syringe, Pill, ChartBar, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { outputsData } from "./outputsData";

const COLORS = ["#0ea5e9", "#f43f5e", "#8b5cf6", "#10b981", "#f59e0b", "#f97316", "#14b8a6", "#6366f1"];

// Helper pour parser les pourcentages "25 (61.0%)" -> 61.0
const parseStatPct = (stat: string) => {
  const match = stat.match(/\(([\d.]+)%\)/);
  return match ? parseFloat(match[1]) : 0;
};

// Helper pour parser les valeurs exactes "25 (61.0%)" -> 25
const parseStatVal = (stat: string) => {
  const match = stat.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Helper pour parser "26.8%" -> 26.8
const parsePct = (val: string | null) => {
  if (!val) return 0;
  const match = val.match(/([\d.]+)%/);
  return match ? parseFloat(match[1]) : 0;
};

export default function AnalysePage() {
  const [activeTab, setActiveTab] = useState<"descriptif" | "bivarie" | "multivarie">("descriptif");

  // ---- Données Descriptives ----
  const descriptif = outputsData.descriptif;
  
  const sexeData = useMemo(() => descriptif.filter(d => d.variable === "SEXE").map(d => ({
    name: String(d.modalite) === "1" ? "Masculin" : "Féminin",
    value: parseStatVal(String(d.statistique))
  })), [descriptif]);

  const residenceData = useMemo(() => descriptif.filter(d => d.variable === "RESIDENCE").map(d => ({
    name: String(d.modalite) === "1" ? "Urbaine" : "Rurale", // Exemple d'interprétation
    value: parseStatVal(String(d.statistique))
  })), [descriptif]);

  const diffSociales = useMemo(() => descriptif.filter(d => d.variable === "Difficultés sociales").map(d => ({
    name: String(d.modalite).replace("D_", "").replace("_", " "),
    value: parseStatVal(String(d.statistique))
  })).sort((a, b) => b.value - a.value), [descriptif]);

  const complications = useMemo(() => descriptif.filter(d => d.variable === "Complications" && !String(d.modalite).startsWith("CC_") && !String(d.modalite).startsWith("INF_") && !String(d.modalite).startsWith("CVO_")).map(d => ({
    name: String(d.modalite).replace("C_", ""),
    value: parseStatVal(String(d.statistique))
  })).sort((a, b) => b.value - a.value).slice(0, 6), [descriptif]);

  // ---- Données Bivariées (Avant / Après) ----
  const bivarie = outputsData.bivarie;
  
  const barChartBivarie = useMemo(() => bivarie
    .filter(d => d.avant && d.apres && d.avant !== "NA" && d.apres !== "NA" && d.avant !== "[]")
    .map(d => ({
      name: d.indicateur.replace(" (1=Oui)", "").replace("_ANT", ""),
      Avant: parsePct(d.avant as string),
      Après: parsePct(d.apres as string),
      isSignificant: d.p_value_float && d.p_value_float < 0.05
    })).sort((a, b) => b.Après - a.Après), [bivarie]);

  // ---- Données Multivariées ----
  const multivarie = outputsData.multivarie;
  const multiData = useMemo(() => multivarie
    .filter(d => d.ORa_float !== null && d.ORa_float < 100 && d.variable !== "Intercept" && d.variable !== "period") // Filter outliers
    .map(d => ({
      name: d.variable.replace("C(", "").replace(")[T.", " ").replace("]", ""),
      Outcome: d.outcome,
      OR: d.ORa_float,
      RR: d.RRa_float,
    })).sort((a, b) => (b.OR || b.RR || 0) - (a.OR || a.RR || 0)).slice(0, 10), [multivarie]);


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
      
      {/* Barre latérale de Navigation */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-6 flex flex-col gap-6 shadow-sm z-10">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-8 h-8 text-indigo-500" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Analyse Avancée
          </h1>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("descriptif")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "descriptif" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
          >
            <PieChartIcon className="w-5 h-5" />
            Descriptif
          </button>
          
          <button 
            onClick={() => setActiveTab("bivarie")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "bivarie" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
          >
            <ChartBar className="w-5 h-5" />
            Bivarié (Avant/Après)
          </button>
          
          <button 
            onClick={() => setActiveTab("multivarie")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "multivarie" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
          >
            <TrendingUp className="w-5 h-5" />
            Modèles Multivariés
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* ONGLET DESCRIPTIF */}
        {activeTab === "descriptif" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Caractéristiques de la population</h2>
              <p className="text-gray-500 dark:text-gray-400">Analyse descriptive de la cohorte étudiée.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Sexe */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-indigo-500 w-5 h-5" />
                  <h3 className="text-lg font-bold">Répartition par Sexe</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sexeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                        {sexeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Résidence */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-6">
                  <Home className="text-emerald-500 w-5 h-5" />
                  <h3 className="text-lg font-bold">Lieu de Résidence</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={residenceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                        {residenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Complications */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="text-rose-500 w-5 h-5" />
                  <h3 className="text-lg font-bold">Principales Complications Cliniques</h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complications} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={100} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Difficultés Sociales */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-amber-500 w-5 h-5" />
                  <h3 className="text-lg font-bold">Difficultés Sociales (N)</h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diffSociales} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={120} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET BIVARIÉ */}
        {activeTab === "bivarie" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-emerald-600 dark:text-emerald-500">Comparaison Avant / Après</h2>
              <p className="text-gray-500 dark:text-gray-400">Évolution des indicateurs suite à l'introduction du registre (Tests de McNemar).</p>
            </header>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Syringe className="text-emerald-500 w-5 h-5" />
                <h3 className="text-lg font-bold">Taux de couverture vaccinale et observance (%)</h3>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartBivarie} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} angle={-45} textAnchor="end" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                    <Bar dataKey="Avant" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Après" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-sm text-emerald-800 dark:text-emerald-200">
                <strong>Note :</strong> Les indicateurs tels que la vaccination (PEV, TYPHIM) et la prise d'antibiotiques montrent des améliorations significatives (p-value &lt; 0.05).
              </div>
            </div>
          </div>
        )}

        {/* ONGLET MULTIVARIÉ */}
        {activeTab === "multivarie" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-rose-600 dark:text-rose-500">Modèles Multivariés</h2>
              <p className="text-gray-500 dark:text-gray-400">Facteurs influençant l'observance et le nombre d'hospitalisations (Odds Ratios / Risques Relatifs).</p>
            </header>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Pill className="text-rose-500 w-5 h-5" />
                <h3 className="text-lg font-bold">Principaux Facteurs de Risque (OR / RR)</h3>
              </div>
              
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart layout="vertical" data={multiData} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="OR" fill="#f43f5e" barSize={15} radius={[0, 4, 4, 0]} name="Odds Ratio (ORa)" />
                    <Bar dataKey="RR" fill="#8b5cf6" barSize={15} radius={[0, 4, 4, 0]} name="Risque Relatif (RRa)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
