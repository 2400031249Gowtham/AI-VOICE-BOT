import { cn } from "@/lib/utils";

interface LeadScoreBadgeProps {
  status: string;
  className?: string;
}

export default function LeadScoreBadge({ status, className }: LeadScoreBadgeProps) {
  const normalizedStatus = status.trim();

  let styles = "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
  let dotColor = "bg-zinc-400";
  let label = normalizedStatus;

  if (normalizedStatus === "Hot" || normalizedStatus.toLowerCase() === "hot") {
    styles = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    dotColor = "bg-rose-500";
    label = "Hot 🔴";
  } else if (normalizedStatus === "Warm" || normalizedStatus.toLowerCase() === "warm") {
    styles = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    dotColor = "bg-amber-500";
    label = "Warm 🟡";
  } else if (normalizedStatus === "Cold" || normalizedStatus.toLowerCase() === "cold") {
    styles = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    dotColor = "bg-blue-500";
    label = "Cold 🔵";
  } else if (
    normalizedStatus === "Future Prospect" ||
    normalizedStatus.toLowerCase() === "future prospect" ||
    normalizedStatus.toLowerCase() === "future"
  ) {
    styles = "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    dotColor = "bg-slate-400";
    label = "Future ⚪";
  } else if (normalizedStatus === "Converted" || normalizedStatus.toLowerCase() === "converted") {
    styles = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    dotColor = "bg-emerald-500";
    label = "Converted 🟢";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none",
        styles,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColor)} />
      <span>{label}</span>
    </span>
  );
}
