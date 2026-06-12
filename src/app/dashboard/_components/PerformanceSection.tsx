"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, AlertTriangle, TrendingUp, UserCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChartContainer from "@/components/charts/ChartContainer";
import AreaChartWrapper from "@/components/charts/AreaChartWrapper";
import BarChartWrapper from "@/components/charts/BarChartWrapper";
import InsightCard from "@/components/cards/InsightCard";
import GlassCard from "@/components/cards/GlassCard";
import { useCRMStore } from "@/store/crmStore";

export default function PerformanceSection() {
  const calls = useCRMStore((s) => s.calls ?? []);
  const customers = useCRMStore((s) => s.customers ?? []);

  // 1. Group actual database calls by month (Jan - Jul)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const areaData = months.map((month, idx) => {
    const count = calls.filter((c) => {
      const date = new Date(c.date);
      return !isNaN(date.getTime()) && date.getMonth() === idx;
    }).length;
    return { name: month, ai: count, manual: 0 };
  });

  // 2. Group actual database calls by day of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const barData = daysOfWeek.map((day, idx) => {
    const count = calls.filter((c) => {
      const date = new Date(c.date);
      if (isNaN(date.getTime())) return false;
      // GetDay() returns 0 for Sunday, 1 for Monday, etc. Map to index.
      const dayNum = date.getDay();
      const mappedIdx = dayNum === 0 ? 6 : dayNum - 1;
      return mappedIdx === idx;
    }).length;
    return { day, calls: count };
  });

  // 3. Dynamic insights from real customer statistics
  const hotLeadsAtRisk = customers.filter(
    (c) => c.status === "Hot" && (c.lastCalledDaysAgo === undefined || c.lastCalledDaysAgo >= 5)
  ).length;
  
  const warmLeadsCount = customers.filter((c) => c.status === "Warm").length;

  const insights = [
    {
      id: 1,
      icon: <AlertTriangle size={13} />,
      priority: "High",
      priorityVariant: "destructive" as const,
      title: `${hotLeadsAtRisk} hot leads pending outreach`,
      desc: "Hot exporters that haven't had an active discussion in 5+ days.",
      action: "Auto-schedule calls",
    },
    {
      id: 2,
      icon: <TrendingUp size={13} />,
      priority: "Medium",
      priorityVariant: "secondary" as const,
      title: "Outbound pipeline tracking active",
      desc: `Currently monitoring ${customers.length} exporter profiles from the database.`,
      action: "View reports",
    },
    {
      id: 3,
      icon: <UserCheck size={13} />,
      priority: "Info",
      priorityVariant: "outline" as const,
      title: `${warmLeadsCount} exporters ready for review`,
      desc: "Qualified warm exporters awaiting follow-up updates.",
      action: "Review leads",
    },
  ];

  // 4. Summary metrics calculated dynamically
  const totalCalls = calls.length;
  const aiHandled = calls.filter((c) => c.status === "Completed").length;
  const aiRate = totalCalls > 0 ? ((aiHandled / totalCalls) * 100).toFixed(1) + "%" : "0.0%";

  // Aggregate call durations
  const totalSeconds = calls.reduce((acc, c) => {
    const parts = String(c.duration || "").split(":");
    if (parts.length === 2) {
      return acc + parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    const num = parseInt(String(c.duration), 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
  
  const avgSeconds = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;
  const avgTime = `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60}s`;

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
            description="AI call metrics summary"
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
                  { label: "Total", value: String(totalCalls), color: "text-foreground" },
                  { label: "AI Handled", value: String(aiHandled), color: "text-chart-1" },
                  { label: "AI Rate", value: aiRate, color: "text-chart-2" },
                  { label: "Avg Time", value: avgTime, color: "text-foreground" },
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
