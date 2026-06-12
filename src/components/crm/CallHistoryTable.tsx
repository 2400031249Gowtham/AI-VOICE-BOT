// frontend/src/components/crm/CallHistoryTable.tsx
import StatusBadge from '../ui/StatusBadge';
import { PlayCircle } from 'lucide-react';

interface CallHistoryTableProps {
  calls: any[];
}

export default function CallHistoryTable({ calls }: CallHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/5">
          <tr>
            <th className="px-6 py-4 font-medium">Date & Time</th>
            <th className="px-6 py-4 font-medium">Customer ID</th>
            <th className="px-6 py-4 font-medium">Call SID</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Recording</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => {
            const hasRecording = call.status.includes('Recording:');
            const recordingUrl = hasRecording ? call.status.split('Recording: ')[1]?.trim() : null;
            const displayStatus = hasRecording ? call.status.split(' |')[0] : call.status;

            return (
              <tr key={call.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {new Date(call.startTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium text-white">
                  {call.customerId}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  {call.callSid}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={displayStatus} />
                </td>
                <td className="px-6 py-4 text-right">
                  {recordingUrl ? (
                    <a 
                      href={recordingUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-xs font-medium bg-purple-500/10 px-3 py-1.5 rounded-lg transition-colors border border-purple-500/20"
                    >
                      <PlayCircle className="w-4 h-4" /> Listen
                    </a>
                  ) : (
                    <span className="text-gray-600 text-xs italic">No recording</span>
                  )}
                </td>
              </tr>
            );
          })}
          {calls.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No calls found in the history.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
