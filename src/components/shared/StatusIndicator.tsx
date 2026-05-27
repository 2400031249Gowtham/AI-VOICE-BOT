import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════
   StatusIndicator — Pulsing dot + label
   Used for "Online", "Live", "Active" status badges
   across Sidebar, ActivityFeed, etc.
   ═══════════════════════════════════════════════════════ */

interface StatusIndicatorProps {
  label: string;
  color?: "teal" | "primary" | "amber" | "rose";
  size?: "sm" | "md";
  className?: string;
}

const colorMap = {
  teal: {
    dot: "bg-chart-2",
    text: "text-chart-2",
  },
  primary: {
    dot: "bg-primary",
    text: "text-primary",
  },
  amber: {
    dot: "bg-chart-4",
    text: "text-chart-4",
  },
  rose: {
    dot: "bg-chart-5",
    text: "text-chart-5",
  },
};

const sizeMap = {
  sm: { dot: "w-1.5 h-1.5", text: "text-[9px]" },
  md: { dot: "w-2 h-2", text: "text-[10px]" },
};

export default function StatusIndicator({
  label,
  color = "teal",
  size = "sm",
  className,
}: StatusIndicatorProps) {
  const c = colorMap[color];
  const s = sizeMap[size];

  return (
    <span className={cn("flex items-center gap-1", className)}>
      <span className={cn("rounded-full animate-pulse", c.dot, s.dot)} />
      <span className={cn("font-semibold uppercase", c.text, s.text)}>
        {label}
      </span>
    </span>
  );
}
