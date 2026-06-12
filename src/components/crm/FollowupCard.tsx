import { Calendar, Phone, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FollowupCardProps {
  followup: any;
  onCall: (customerId: string) => void;
  onComplete: (id: string) => void;
}

export default function FollowupCard({ followup, onCall, onComplete }: FollowupCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (p: string) => {
    switch(p?.toUpperCase()) {
      case 'HIGH': return 'text-red-700 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'LOW': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const dueDate = new Date(followup.dueDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  const isOverdue = dueDate < today;

  const displayTitle = followup.customerName 
    ? followup.customerName 
    : `Lead #${followup.customerId?.substring(0, 4).toUpperCase() || 'NEW'}`;

  // Summary expansion logic
  const fullNotes = followup.notes || 'No summary provided.';
  const notesLines = fullNotes.split('\n');
  const showReadMore = notesLines.length > 3 || fullNotes.length > 120;
  const shortNotes = showReadMore && !expanded 
    ? (notesLines.slice(0, 3).join('\n').substring(0, 120) + '...') 
    : fullNotes;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-[24px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full focus-within:ring-2 focus-within:ring-purple-500/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-900 font-bold text-[18px]">{displayTitle}</h3>
          <p className="text-[12px] text-gray-500 font-medium mt-1">
            Call SID: {followup.callSid ? followup.callSid.substring(0, 12) + '...' : 'N/A'}
          </p>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getPriorityColor(followup.priority)} uppercase tracking-wider shrink-0 ml-2`}>
          {followup.priority || 'NORMAL'}
        </span>
      </div>
      
      <div className={`flex items-center gap-2 mb-4 text-[13px] font-medium px-3 py-2 rounded-lg border ${isOverdue ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-700 border-gray-100'}`}>
        {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
        <span>Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        {isOverdue && <span className="ml-auto text-[10px] uppercase font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Overdue</span>}
      </div>

      <div className="flex-1 mb-5">
        <p className="text-[14px] text-gray-600 whitespace-pre-wrap leading-relaxed">
          {shortNotes}
        </p>
        {showReadMore && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-[#7C3AED] text-[13px] font-semibold mt-2 hover:text-[#6D28D9] flex items-center gap-1 focus:outline-none focus:underline"
          >
            {expanded ? (
              <>Show Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Read More <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>
      
      <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
        <button 
          onClick={() => onComplete(followup.id)}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-[14px] font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <CheckCircle className="w-4 h-4" /> Mark Done
        </button>
        <button 
          onClick={() => onCall(followup.customerId)}
          className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[14px] font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
        >
          <Phone className="w-4 h-4" /> Call Now
        </button>
      </div>
    </div>
  );
}
