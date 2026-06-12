// frontend/src/components/ui/StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  const getColors = (s: string) => {
    switch(s?.toUpperCase()) {
      case 'NEW': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'INTERESTED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'CALLBACK': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'FAILED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'IN-PROGRESS': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getColors(status)} uppercase tracking-wider`}>
      {status?.replace(/_/g, ' ') || 'UNKNOWN'}
    </span>
  );
}
