"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const patientData = [
  { name: "Jan", total: 45 },
  { name: "Fév", total: 52 },
  { name: "Mar", total: 61 },
  { name: "Avr", total: 67 },
  { name: "Mai", total: 85 },
  { name: "Juin", total: 103 },
  { name: "Juil", total: 124 },
];

const consultationData = [
  { name: "Lun", total: 12 },
  { name: "Mar", total: 18 },
  { name: "Mer", total: 15 },
  { name: "Jeu", total: 22 },
  { name: "Ven", total: 14 },
  { name: "Sam", total: 8 },
  { name: "Dim", total: 2 },
];

export function PatientEvolutionChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={patientData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "8px" }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConsultationsBarChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={consultationData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "8px" }}
          />
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            barSize={30}
          >
            {consultationData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 3 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.3)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
