// frontend/src/app/dashboard/call-analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CallAnalyticsPage() {
  const [dailyCalls, setDailyCalls] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [hourlyCalls, setHourlyCalls] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/analytics/calls-per-day").then(r=>r.json()).then(setDailyCalls);
    fetch("http://localhost:8080/api/analytics/call-outcomes").then(r=>r.json()).then(setOutcomes);
    fetch("http://localhost:8080/api/analytics/calls-by-hour").then(r=>r.json()).then(setHourlyCalls);
  }, []);

  const COLORS = ['#10b981', '#f43f5e', '#8b5cf6', '#6b7280'];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Call Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard title="Calls Per Day (Trend)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyCalls}>
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Call Outcomes">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomes} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {outcomes.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Calls By Hour of Day" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyCalls}>
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
