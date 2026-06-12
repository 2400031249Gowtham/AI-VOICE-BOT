// frontend/src/components/ui/GlassCard.tsx
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export default function GlassCard({ children, className = '', title, action }: GlassCardProps) {
  return (
    <div className={`bg-[#12121a] border border-white/5 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
