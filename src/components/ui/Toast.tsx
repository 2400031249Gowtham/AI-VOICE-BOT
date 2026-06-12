// frontend/src/components/ui/Toast.tsx
"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('show-toast', { detail: { message, type } });
    window.dispatchEvent(event);
  }
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState<{ message: string, type: string, id: number }[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast = { message: e.detail.message, type: e.detail.type, id: Date.now() };
      setToasts(prev => [...prev, newToast]);
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 3000);
    };
    
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {toasts.map(toast => {
        let colors = { border: '#3B82F6', icon: <Info className="text-[#3B82F6] w-5 h-5" /> };
        if (toast.type === 'success') colors = { border: '#10B981', icon: <CheckCircle className="text-[#10B981] w-5 h-5" /> };
        if (toast.type === 'error') colors = { border: '#EF4444', icon: <XCircle className="text-[#EF4444] w-5 h-5" /> };
        if (toast.type === 'warning') colors = { border: '#F59E0B', icon: <AlertTriangle className="text-[#F59E0B] w-5 h-5" /> };

        return (
          <div key={toast.id} style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${colors.border}`,
            borderLeft: `6px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px',
            minWidth: '300px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <div className="flex items-center gap-3">
              {colors.icon}
              <span style={{ color: '#111827', fontWeight: 600, fontSize: '0.875rem' }}>{toast.message}</span>
            </div>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
