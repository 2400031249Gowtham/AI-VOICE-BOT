"use client";

import { motion } from "framer-motion";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  index: number;
}

export default function ActivityItem({
  icon,
  title,
  desc,
  time,
  index,
}: ActivityItemProps) {
  return (
    <motion.div
      className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-accent/50 transition-colors"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.06, duration: 0.3 }}
    >
      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-foreground font-medium leading-snug">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{desc}</p>
      </div>
      <span className="text-[10px] text-muted-foreground flex-shrink-0 pt-0.5 font-medium">{time}</span>
    </motion.div>
  );
}
