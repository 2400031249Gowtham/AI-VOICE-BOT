// frontend/src/components/crm/CustomerCard.tsx
import Link from 'next/link';
import StatusBadge from '../ui/StatusBadge';
import { Phone, Building } from 'lucide-react';

interface CustomerCardProps {
  customer: any;
  onCall: (id: string) => void;
}

export default function CustomerCard({ customer, onCall }: CustomerCardProps) {
  const initials = customer.name ? customer.name.substring(0,2).toUpperCase() : '??';
  
  return (
    <div className="bg-[#12121a] border border-white/5 rounded-xl p-5 hover:border-purple-500/30 transition-all hover:shadow-lg group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
            {initials}
          </div>
          <div>
            <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">{customer.name}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Building className="w-3 h-3" /> {customer.company}
            </p>
          </div>
        </div>
        <StatusBadge status={customer.leadStatus} />
      </div>
      
      <div className="mb-5 space-y-2">
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" /> {customer.phone}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">Lead Score</span>
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-violet-400" 
              style={{ width: `${customer.leadScore || 0}%` }}
            />
          </div>
          <span className="text-xs text-purple-400 font-medium">{customer.leadScore || 0}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => onCall(customer.id)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" /> Call Now
        </button>
        <Link 
          href={`/dashboard/customers/${customer.id}`}
          className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium py-2 rounded-lg transition-colors text-center border border-white/5"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
