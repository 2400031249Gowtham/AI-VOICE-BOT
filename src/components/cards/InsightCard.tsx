"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InsightCardProps {
  icon: React.ReactNode;
  priority: string;
  priorityVariant: "destructive" | "secondary" | "outline" | "default";
  title: string;
  desc: string;
  action: string;
  index: number;
}

export default function InsightCard({
  icon,
  priority,
  priorityVariant,
  title,
  desc,
  action,
  index,
}: InsightCardProps) {
  return (
    <motion.div
      className="p-3.5 rounded-xl bg-secondary/40 border border-border/60 hover:border-border hover:bg-secondary/60 transition-all duration-200"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <Badge variant={priorityVariant} className="text-[9px] h-[18px] mb-1.5">
            {priority}
          </Badge>
          <p className="text-[12px] font-medium text-foreground leading-snug">{title}</p>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{desc}</p>
          <button className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors group cursor-pointer">
            {action}
            <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
