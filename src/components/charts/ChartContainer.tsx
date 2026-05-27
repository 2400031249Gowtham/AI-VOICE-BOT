"use client";

import { ReactNode } from "react";
import GlassCard from "@/components/cards/GlassCard";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartContainer({
  title,
  description,
  children,
  action,
}: ChartContainerProps) {
  return (
    <GlassCard className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground tracking-tight">{title}</h3>
          {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </GlassCard>
  );
}
