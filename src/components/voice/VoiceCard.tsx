// frontend/src/components/voice/VoiceCard.tsx
import { Play, Volume2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function VoiceCard() {
  return (
    <GlassCard title="Voice Profile Settings" action={<Volume2 className="w-5 h-5 text-purple-400" />}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Selected Voice Persona</label>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Priya - Hanexis Executive</p>
              <p className="text-xs text-purple-400 mt-1 font-mono">ID: YOq2y2Up4RgXP2HyXjE5</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <Play className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Speaking Speed</span>
            <span className="text-purple-400">1.0x</span>
          </div>
          <input type="range" min="0.5" max="2.0" step="0.1" defaultValue="1.0" className="w-full accent-purple-500" />
        </div>
      </div>
    </GlassCard>
  );
}
