"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, AlertTriangle, TrendingUp, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChartContainer from "@/components/charts/ChartContainer";
import AreaChartWrapper from "@/components/charts/AreaChartWrapper";
import BarChartWrapper from "@/components/charts/BarChartWrapper";
import InsightCard from "@/components/cards/InsightCard";
import GlassCard from "@/components/cards/GlassCard";

const areaData = [
  { name: "Jan", ai: 120, manual: 80 },
  { name: "Feb", ai: 180, manual: 75 },
  { name: "Mar", ai: 160, manual: 70 },
  { name: "Apr", ai: 240, manual: 65 },
  { name: "May", ai: 280, manual: 60 },
  { name: "Jun", ai: 320, manual: 55 },
  { name: "Jul", ai: 350, manual: 50 },
];

const barData = [
  { day: "Mon", calls: 65 },
  { day: "Tue", calls: 82 },
  { day: "Wed", calls: 73 },
  { day: "Thu", calls: 95 },
  { day: "Fri", calls: 88 },
  { day: "Sat", calls: 42 },
  { day: "Sun", calls: 35 },
];

const insights = [
  {
    id: 1,
    icon: <AlertTriangle size={13} />,
    priority: "High",
    priorityVariant: "destructive" as const,
    title: "3 deals at risk of going cold",
    desc: "Acme, DataFlow, and Quantum haven't been contacted in 5+ days.",
    action: "Auto-schedule calls",
  },
  {
    id: 2,
    icon: <TrendingUp size={13} />,
    priority: "Medium",
    priorityVariant: "secondary" as const,
    title: "Pipeline velocity up 23%",
    desc: "AI outreach converting 2.4× faster than manual calls this month.",
    action: "View report",
  },
  {
    id: 3,
    icon: <UserCheck size={13} />,
    priority: "Info",
    priorityVariant: "outline" as const,
    title: "12 leads ready for qualification",
    desc: "High engagement scoring — ready for human handoff.",
    action: "Review leads",
  },
];

export default function PerformanceSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Chart Column */}
      <div className="xl:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <ChartContainer
            title="Performance Overview"
            description="AI vs manual call trends"
            action={
              <Button variant="ghost" size="xs" className="text-muted-foreground gap-1">
                Details <ArrowUpRight size={11} />
              </Button>
            }
          >
            <div className="space-y-6">
              {/* Area Chart Section */}
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-chart-1" />
                    <span className="text-[11px] text-muted-foreground">AI Calls</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-chart-2" />
                    <span className="text-[11px] text-muted-foreground">Manual</span>
                  </div>
                </div>

                <AreaChartWrapper
                  data={areaData}
                  xAxisKey="name"
                  series={[
                    { key: "ai", name: "AI", stroke: "hsl(234 89% 74%)", fillGradient: "areaAi" },
                    { key: "manual", name: "Manual", stroke: "hsl(173 80% 50%)", fillGradient: "areaManual" },
                  ]}
                />
              </div>

              {/* Bar Chart Section */}
              <div>
                <p className="text-[12px] font-medium text-muted-foreground mb-3">Daily Calls — This Week</p>
                <BarChartWrapper
                  data={barData}
                  xAxisKey="day"
                  dataKey="calls"
                  name="Calls"
                  fill="hsl(234 89% 74%)"
                />
              </div>

              {/* Summary Indicators */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border">
                {[
                  { label: "Total", value: "480", color: "text-foreground" },
                  { label: "AI Handled", value: "349", color: "text-chart-1" },
                  { label: "AI Rate", value: "72.7%", color: "text-chart-2" },
                  { label: "Avg Time", value: "3m 42s", color: "text-foreground" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ChartContainer>
        </motion.div>
      </div>

      {/* AI Insights Column */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles size={15} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-foreground tracking-tight">AI Insights</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Powered by VoxAI</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {insights.map((insight, i) => (
                <InsightCard
                  key={insight.id}
                  icon={insight.icon}
                  priority={insight.priority}
                  priorityVariant={insight.priorityVariant}
                  title={insight.title}
                  desc={insight.desc}
                  action={insight.action}
                  index={i}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
