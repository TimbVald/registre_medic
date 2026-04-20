"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity, Scale, Thermometer, Droplets } from "lucide-react";

interface EvolutionChartsProps {
  consultations: any[];
  examens: any[];
}

export function EvolutionCharts({ consultations, examens }: EvolutionChartsProps) {
  // Préparation des données pour le Poids et la Température
  const vitalsData = useMemo(() => {
    return consultations
      .filter((c) => c.poids || c.temperature)
      .map((c) => ({
        date: format(new Date(c.dateConsultation), "dd/MM/yy"),
        fullDate: format(new Date(c.dateConsultation), "d MMMM yyyy", { locale: fr }),
        poids: c.poids ? parseFloat(c.poids.replace(",", ".")) : null,
        temp: c.temperature ? parseFloat(c.temperature.replace(",", ".")) : null,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
        return dateA - dateB;
      });
  }, [consultations]);

  // Préparation des données pour l'Hémoglobine
  const hbData = useMemo(() => {
    return examens
      .filter((e) => e.hemoTauxRecent)
      .map((e) => ({
        date: format(new Date(e.createdAt), "dd/MM/yy"),
        fullDate: format(new Date(e.createdAt), "d MMMM yyyy", { locale: fr }),
        hb: parseFloat(e.hemoTauxRecent.replace(",", ".")),
      }))
      .sort((a, b) => {
         const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
         const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
         return dateA - dateB;
      });
  }, [examens]);

  const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 ring-1 ring-black/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{payload[0].payload.fullDate}</p>
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
             <span className="text-sm font-black text-zinc-900">
               {payload[0].value} {unit}
             </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique du Poids */}
        <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/5">
          <CardHeader className="p-8 pb-0">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Scale className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                   <CardTitle className="text-xl font-black text-zinc-900 tracking-tight">Courbe de Poids</CardTitle>
                   <CardDescription className="text-xs font-medium text-zinc-400">Évolution de la masse corporelle (kg)</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 pt-10 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vitalsData}>
                <defs>
                  <linearGradient id="colorPoids" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip unit="kg" />} />
                <Area 
                  type="monotone" 
                  dataKey="poids" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorPoids)" 
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique de la Température */}
        <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[2.5rem] bg-white overflow-hidden transition-all hover:shadow-xl hover:shadow-rose-500/5">
          <CardHeader className="p-8 pb-0">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <Thermometer className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                   <CardTitle className="text-xl font-black text-zinc-900 tracking-tight">Température</CardTitle>
                   <CardDescription className="text-xs font-medium text-zinc-400">Suivi thermique (°C)</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 pt-10 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dx={-10}
                  domain={[35, 42]}
                />
                <Tooltip content={<CustomTooltip unit="°C" />} />
                <Line 
                   type="monotone" 
                   dataKey="temp" 
                   stroke="#f43f5e" 
                   strokeWidth={4}
                   dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                   activeDot={{ r: 8, strokeWidth: 0, fill: '#f43f5e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de l'Hémoglobine (Pleine largeur) */}
      <Card className="border-none shadow-sm ring-1 ring-zinc-100 rounded-[3rem] bg-white overflow-hidden transition-all hover:shadow-xl hover:shadow-emerald-500/5">
        <CardHeader className="p-10 pb-0">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Droplets className="h-7 w-7 text-emerald-500" />
                </div>
                <div>
                   <CardTitle className="text-2xl font-black text-zinc-900 tracking-tight">Taux d'Hémoglobine</CardTitle>
                   <CardDescription className="text-sm font-medium text-zinc-400">Évolution de la numération sanguine (g/dL)</CardDescription>
                </div>
             </div>
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Dernier relevé</span>
                <span className="text-3xl font-black text-emerald-600">
                  {hbData[hbData.length - 1]?.hb || "--"} <span className="text-sm">g/dL</span>
                </span>
             </div>
           </div>
        </CardHeader>
        <CardContent className="p-10 pt-12 h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hbData}>
              <defs>
                <linearGradient id="colorHb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                dx={-15}
                domain={[0, 18]}
              />
              <Tooltip content={<CustomTooltip unit="g/dL" />} />
              <Area 
                type="stepAfter" 
                dataKey="hb" 
                stroke="#10b981" 
                strokeWidth={5}
                fillOpacity={1} 
                fill="url(#colorHb)" 
                activeDot={{ r: 10, strokeWidth: 0, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
