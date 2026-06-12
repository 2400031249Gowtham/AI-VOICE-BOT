// frontend/src/components/voice/LanguageCard.tsx
import GlassCard from '../ui/GlassCard';
import { Globe } from 'lucide-react';

export default function LanguageCard() {
  const languages = [
    { name: "Tamil + English", desc: "Mixed professional dialect", selected: true },
    { name: "English Only", desc: "Standard global accent", selected: false },
    { name: "Hindi + English", desc: "North Indian market", selected: false }
  ];

  return (
    <GlassCard title="Language & Dialect" action={<Globe className="w-5 h-5 text-blue-400" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {languages.map((lang, idx) => (
          <div 
            key={idx} 
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              lang.selected 
                ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold ${lang.selected ? 'text-white' : 'text-gray-300'}`}>{lang.name}</h4>
              {lang.selected && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
            </div>
            <p className="text-xs text-gray-500">{lang.desc}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
