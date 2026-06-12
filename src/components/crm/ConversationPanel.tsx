// frontend/src/components/crm/ConversationPanel.tsx
import { Bot, User } from 'lucide-react';

interface ConversationPanelProps {
  conversations: any[];
}

export default function ConversationPanel({ conversations }: ConversationPanelProps) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex-1 bg-[#12121a] rounded-r-2xl flex items-center justify-center p-8 border-y border-r border-white/5">
        <p className="text-gray-500">Select a conversation to view the transcript</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#12121a] rounded-r-2xl flex flex-col h-[600px] border-y border-r border-white/5">
      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
        <h3 className="font-semibold text-white">Live AI Transcript</h3>
        <p className="text-xs text-gray-500 font-mono mt-1">SID: {conversations[0]?.callSid}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {conversations.map((conv, idx) => (
          <div key={idx} className="space-y-4">
            {/* User Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                <p className="text-sm text-gray-200">{conv.userMessage}</p>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {new Date(conv.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* AI Message */}
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(124,58,237,0.3)]">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/10 border border-purple-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] shadow-lg">
                <p className="text-sm text-purple-100">{conv.aiResponse}</p>
                <span className="text-[10px] text-purple-400/60 mt-1 block text-right">
                  Priya AI • {new Date(conv.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
