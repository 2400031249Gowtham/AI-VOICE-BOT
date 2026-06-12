// frontend/src/components/crm/AISummaryCard.tsx
import { Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface AISummaryCardProps {
  summary: string;
}

export default function AISummaryCard({ summary }: AISummaryCardProps) {
  let displaySummary = summary || "";
  
  if (displaySummary === "{}" || displaySummary.trim() === "") {
    displaySummary = "No executive insights available yet";
  } else {
    try {
      const parsed = JSON.parse(displaySummary);
      if (Object.keys(parsed).length === 0) {
        displaySummary = "No executive insights available yet";
      } else if (parsed.summary || parsed.text || parsed.message) {
        displaySummary = parsed.summary || parsed.text || parsed.message;
      }
    } catch (e) {
      // It's a normal string, keep it
    }
  }

  return (
    <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/50 to-transparent">
      <div className="absolute -top-3 -right-3 w-16 h-16 bg-purple-500/20 blur-xl rounded-full"></div>
      <div className="bg-[#12121a] rounded-2xl p-6 h-full relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">AI Executive Summary</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          {displaySummary}
        </p>
      </div>
    </div>
  );
}
