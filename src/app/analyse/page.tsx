"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, FileCheck, CalendarCheck, Filter, Activity, RefreshCw } from "lucide-react";

import { rawData } from "./realData";

const COLORS = ["#0ea5e9", "#f43f5e", "#8b5cf6", "#10b981", "#f59e0b"];

export default function AnalysePage() {
  // Filtres
  const [selectedSexe, setSelectedSexe] = useState<string[]>(["Masculin", "Féminin"]);
  const [selectedType, setSelectedType] = useState<string[]>(["SS", "SC", "S-β-thal"]);
  const [selectedAge, setSelectedAge] = useState<string[]>(["0–4 ans", "5–9 ans", "10–14 ans", "15+ ans"]);

  // Options pour les filtres
  const optionsSexe = ["Masculin", "Féminin"];
  const optionsType = ["SS", "SC", "S-β-thal"];
  const optionsAge = ["0–4 ans", "5–9 ans", "10–14 ans", "15+ ans"];

  const toggleFilter = (setFilter: React.Dispatch<React.SetStateAction<string[]>>, filter: string[], option: string) => {
    if (filter.includes(option)) {
      setFilter(filter.filter((item) => item !== option));
    } else {
      setFilter([...filter, option]);
    }
  };

  // Filtrage des données
  const filteredData = useMemo(() => {
    // On base le filtrage sur les caractéristiques "stables" des patients (qu'on prend à la période 1)
    const basePatients = rawData.filter((d) => d.PERIODE === 1);
    const validPatientIds = basePatients
      .filter((p) => selectedSexe.includes(p.SEXE_lbl) && selectedType.includes(p.TYPE_lbl) && selectedAge.includes(String(p.AGE_GROUPE)))
      .map((p) => p.patient_id);

    return rawData.filter((d) => validPatientIds.includes(d.patient_id));
  }, [selectedSexe, selectedType, selectedAge]);

  // Calculs des KPIs
  const kpis = useMemo(() => {
    const patientsUniques = new Set(filteredData.map((d) => d.patient_id)).size;

    const dataAvant = filteredData.filter((d) => d.PERIODE === 1);
    const dataApres = filteredData.filter((d) => d.PERIODE === 2);

    const dossiersCompletsAvant = dataAvant.filter((d) => d.DOSSIER_COMPLET === 1).length;
    const dossiersCompletsApres = dataApres.filter((d) => d.DOSSIER_COMPLET === 1).length;
    
    const rdvHonores = dataApres.filter((d) => d.RDV_HONORE === 1).length;
    const rdvTotal = dataApres.filter((d) => d.RDV_HONORE !== null).length;

    return {
      patients: patientsUniques,
      completudeAvant: patientsUniques > 0 ? ((dossiersCompletsAvant / patientsUniques) * 100).toFixed(1) : "0.0",
      completudeApres: patientsUniques > 0 ? ((dossiersCompletsApres / patientsUniques) * 100).toFixed(1) : "0.0",
      rdvHonores: rdvTotal > 0 ? ((rdvHonores / rdvTotal) * 100).toFixed(1) : "0.0",
    };
  }, [filteredData]);

  // Données pour le Graphique à barres groupées : Observance et Vaccins
  const barChartData = useMemo(() => {
    const dataAvant = filteredData.filter((d) => d.PERIODE === 1);
    const dataApres = filteredData.filter((d) => d.PERIODE === 2);
    const totalAvant = dataAvant.length || 1;
    const totalApres = dataApres.length || 1;

    return [
      {
        name: "Observance Acide Folique",
        Avant: (dataAvant.filter((d) => d.AF_PRISE === 1).length / totalAvant) * 100,
        Après: (dataApres.filter((d) => d.AF_PRISE === 1).length / totalApres) * 100,
      },
      {
        name: "Complétude Vaccin PEV",
        Avant: (dataAvant.filter((d) => d.VACC_PEV === 1).length / totalAvant) * 100,
        Après: (dataApres.filter((d) => d.VACC_PEV === 1).length / totalApres) * 100,
      },
    ];
  }, [filteredData]);

  // Données pour le Graphique Évolution (ComposedChart) : CVO et Hospitalisations
  const composedChartData = useMemo(() => {
    const dataAvant = filteredData.filter((d) => d.PERIODE === 1);
    const dataApres = filteredData.filter((d) => d.PERIODE === 2);
    
    const mean = (arr: any[], key: string) => arr.length ? arr.reduce((acc, val) => acc + (val[key] || 0), 0) / arr.length : 0;

    return [
      {
        name: "Période 1 (Avant)",
        CVO: mean(dataAvant, "NB_CVO"),
        Hospitalisations: mean(dataAvant, "NB_HOSPIT"),
      },
      {
        name: "Période 2 (Après)",
        CVO: mean(dataApres, "NB_CVO"),
        Hospitalisations: mean(dataApres, "NB_HOSPIT"),
      },
    ];
  }, [filteredData]);

  // Données pour le Graphique en Anneau (PieChart) : Difficultés Sociales
  const pieChartData = useMemo(() => {
    const dataAvant = filteredData.filter((d) => d.PERIODE === 1);
    
    const dCols = [
      { key: "D_PAUVRETE", label: "Pauvreté" },
      { key: "D_DISTANCE", label: "Distance" },
      { key: "D_PARENT_SEUL", label: "Parent Seul" },
      { key: "D_SEPARES", label: "Parents Séparés" },
      { key: "D_SOUTIEN", label: "Manque de Soutien" },
      { key: "D_FAM_NB", label: "Famille Nombreuse" },
      { key: "D_CROYANCES", label: "Croyances" },
      { key: "D_MED_TRAD", label: "Méd. Traditionnelle" },
    ];

    const results = dCols.map(col => {
      const count = dataAvant.filter(d => {
        const val = d[col.key as keyof typeof d];
        return val === 1 || val === 1.0;
      }).length;
      return { name: col.label, value: count };
    });

    return results.filter(item => item.value > 0).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Sidebar / Filtres */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-6 flex flex-col gap-8 overflow-y-auto z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-sky-500" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-500">
            Analyse CME
          </h1>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-sm uppercase">
            <Filter className="w-4 h-4" />
            <h3>Sexe</h3>
          </div>
          <div className="flex flex-col gap-2">
            {optionsSexe.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 transition-colors"
                  checked={selectedSexe.includes(opt)}
                  onChange={() => toggleFilter(setSelectedSexe, selectedSexe, opt)}
                />
                <span className="text-sm group-hover:text-sky-600 transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-sm uppercase">
            <Filter className="w-4 h-4" />
            <h3>Type de Drépanocytose</h3>
          </div>
          <div className="flex flex-col gap-2">
            {optionsType.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500 transition-colors"
                  checked={selectedType.includes(opt)}
                  onChange={() => toggleFilter(setSelectedType, selectedType, opt)}
                />
                <span className="text-sm group-hover:text-indigo-600 transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400 font-semibold tracking-wider text-sm uppercase">
            <Filter className="w-4 h-4" />
            <h3>Tranche d'Âge</h3>
          </div>
          <div className="flex flex-col gap-2">
            {optionsAge.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 transition-colors"
                  checked={selectedAge.includes(opt)}
                  onChange={() => toggleFilter(setSelectedAge, selectedAge, opt)}
                />
                <span className="text-sm group-hover:text-emerald-600 transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tableau de bord d'impact</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Exploration visuelle de l'impact du registre électronique (Avant vs Après).
            </p>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patients filtrés</p>
            <h3 className="text-3xl font-bold mt-1">{kpis.patients}</h3>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dossiers complets (Avant)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold">{kpis.completudeAvant}%</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dossiers complets (Après)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-emerald-500">{kpis.completudeApres}%</h3>
              <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-500/10">
                +{Number(kpis.completudeApres) - Number(kpis.completudeAvant)}%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">RDV Honorés (Après)</p>
            <h3 className="text-3xl font-bold mt-1">{kpis.rdvHonores}%</h3>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Bar Chart */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
            <h3 className="text-lg font-bold mb-6">Prévention et Observance (% de réussite)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Avant" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="Après" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Composed Chart */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
            <h3 className="text-lg font-bold mb-6">Moyenne CVO & Hospitalisations</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={composedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="CVO" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line type="monotone" dataKey="Hospitalisations" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>

        {/* Pie Chart en bas */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 lg:w-1/2">
          <h3 className="text-lg font-bold mb-6">Répartition des difficultés sociales (Avant)</h3>
          <div className="h-64 flex items-center justify-center">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 italic">Aucune donnée pour les filtres sélectionnés</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
