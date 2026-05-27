"use client";

import { motion } from "framer-motion";
import { useCrm } from "@/hooks/useCrm";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { Download, Calendar as CalendarIcon, TrendingUp, Users, PhoneCall, Bot, Sparkles, Scale } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { Button } from "@/components/ui/button";

const COLORS = ["hsl(173 80% 50%)", "hsl(43 96% 56%)", "hsl(0 84% 60%)"];

export default function AnalyticsPage() {
  const { calls, customers, followups, charts, loading } = useCrm();

  const getSentimentChartData = () => {
    if (charts.sentimentData) return charts.sentimentData;
    
    // Fallback compilation from active calls in store
    const positiveCount = calls.filter(c => c.sentiment === "Positive").length;
    const neutralCount = calls.filter(c => c.sentiment === "Neutral").length;
    const negativeCount = calls.filter(c => c.sentiment === "Negative").length;
    const total = positiveCount + neutralCount + negativeCount || 1;
    
    return [
      { name: "Positive", value: Math.round((positiveCount / total) * 100), fill: "hsl(173 80% 50%)" },
      { name: "Neutral", value: Math.round((neutralCount / total) * 100), fill: "hsl(43 96% 56%)" },
      { name: "Negative", value: Math.round((negativeCount / total) * 100), fill: "hsl(0 84% 60%)" }
    ];
  };

  const sentimentData = getSentimentChartData();

  if (loading.global) {
    return (
      <PageContainer>
        <div className="space-y-6 animate-pulse">
          <div className="h-14 bg-secondary/30 rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-secondary/30 rounded-xl" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  const kpis = [
    { title: "Total AI Calls", value: calls.length.toString(), change: "+14.2%", icon: PhoneCall, color: "text-chart-1" },
    { title: "Active Exporter Leads", value: customers.length.toString(), change: "+23.1%", icon: Users, color: "text-chart-2" },
    { title: "Avg AI Call Duration", value: "4m 12s", change: "-12s", icon: Bot, color: "text-chart-3" },
    { title: "Active Campaigns", value: "4", change: "+1", icon: TrendingUp, color: "text-chart-4" },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">System Performance & Analytics</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Track call campaign statistics, exporter sentiments, and license acquisition conversions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <CalendarIcon size={14} /> Last 30 Days
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground glow-blue" onClick={() => alert("Export report generated successfully.")}>
            <Download size={14} /> Export Report
          </Button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <GlassCard className="p-5 flex flex-col h-full card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-secondary/50 border border-border ${kpi.color}`}>
                  <kpi.icon size={16} />
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-chart-2/10 text-chart-2">
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{kpi.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.title}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Call Volume area chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <GlassCard className="p-6 h-full flex flex-col">
            <div className="mb-6">
              <h3 className="text-sm font-bold flex items-center gap-1.5"><Sparkles size={14} className="text-primary"/> AI Conversation Streams</h3>
              <p className="text-xs text-muted-foreground">Distribution of outgoing phone trunks vs successful document conversions.</p>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.performanceOverview || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(234 89% 74%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(234 89% 74%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(173 80% 50%)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="hsl(173 80% 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 14%)" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(240 5% 50%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(240 5% 50%)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(240 6% 6%)', borderColor: 'hsl(240 4% 14%)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(0 0% 95%)' }}
                  />
                  <Area type="monotone" dataKey="ai" stroke="hsl(234 89% 74%)" fillOpacity={1} fill="url(#colorCalls)" strokeWidth={2} />
                  <Area type="monotone" dataKey="manual" stroke="hsl(173 80% 50%)" fillOpacity={1} fill="url(#colorAI)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sentiment Pie chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <GlassCard className="p-6 h-full flex flex-col">
            <div className="mb-2">
              <h3 className="text-sm font-bold flex items-center gap-1.5"><Bot size={15} className="text-primary"/> Exporter Sentiment Distribution</h3>
              <p className="text-xs text-muted-foreground">Emotion indexing extracted from Telugu speech analysis.</p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry: any, index: number) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(240 6% 6%)', borderColor: 'hsl(240 4% 14%)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(0 0% 95%)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {sentimentData.map((item: any, idx: number) => (
                <div key={item.name} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[10px] text-muted-foreground uppercase">{item.name}</span>
                  </div>
                  <p className="text-xs font-bold">{item.value}%</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <GlassCard className="p-6 h-[300px] flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-bold">Exporter Conversion Trends</h3>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.leadConversion || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 14%)" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(240 5% 50%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(240 5% 50%)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(240 6% 6%)', borderColor: 'hsl(240 4% 14%)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="hsl(173 80% 50%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(173 80% 50%)", strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <GlassCard className="p-6 h-[300px] flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5"><Scale size={15} className="text-primary"/> Top Performing Campaigns</h3>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              {[
                { name: "Spice Board Coir Campaign", conv: "54%", calls: 1450 },
                { name: "APEDA Mango Exporters Desk", conv: "38%", calls: 890 },
                { name: "Guntur Chilli Packers Outreach", conv: "48%", calls: 1200 },
                { name: "General IEC Setup Leads", conv: "65%", calls: 540 },
              ].map((camp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors">
                  <div>
                    <p className="text-xs font-semibold">{camp.name}</p>
                    <p className="text-[9px] text-muted-foreground">{camp.calls} automated calls completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-chart-2">{camp.conv}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Conv. Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageContainer>
  );
}
