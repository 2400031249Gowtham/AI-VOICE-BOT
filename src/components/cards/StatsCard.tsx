"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import GlassCard from "./GlassCard";
import SparklineChart from "@/components/charts/SparklineChart";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  chartColor: string;
  sparkData: { v: number }[];
  index?: number;
}

export default function StatsCard({
  title,
  value,
  change,
  trend,
  icon,
  chartColor,
  sparkData,
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
    >
      <GlassCard className="pt-4 pb-0 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              trend === "up"
                ? "text-chart-2 bg-chart-2/10"
                : "text-destructive bg-destructive/10"
            }`}
          >
            {trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change}
          </div>
        </div>

        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <p className="text-[26px] font-bold text-foreground mt-0.5 tracking-tight leading-none">
          {value}
        </p>

        <SparklineChart data={sparkData} color={chartColor} index={index} />
      </GlassCard>
    </motion.div>
  );
}
