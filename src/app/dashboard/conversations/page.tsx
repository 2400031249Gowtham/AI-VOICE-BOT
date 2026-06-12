// frontend/src/app/dashboard/conversations/page.tsx
"use client";

import { useEffect, useState, Suspense, useMemo, useRef } from "react";
import { Search, PhoneCall, ChevronDown, ChevronUp, Download, FileText, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type Customer = {
  id: string;
  name: string;
  phone: string;
  company?: string;
  [key: string]: any;
};

type CallData = {
  id: string;
  callSid: string;
  customerId: string;
  startTime: string;
  endTime?: string;
  status?: string;
  recordingUrl?: string;
  duration?: string;
};

type ChatMessage = {
  role: string;
  text: string;
  timestamp: string;
};

type Conversation = {
  id: string;
  callSid: string;
  customerId: string;
  phone?: string;
  customerName?: string;
  transcript?: ChatMessage[];
  createdAt: string;
  recordingUrl?: string;
};

function ConversationsContent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [customers, setCustomers] = useState<Record<string, Customer>>({});
  const [calls, setCalls] = useState<Record<string, CallData>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "TODAY" | "THIS_WEEK" | "BY_CUSTOMER">("ALL");

  const [expandedCustomers, setExpandedCustomers] = useState<Record<string, boolean>>({});
  
  const [modalCallSid, setModalCallSid] = useState<string | null>(null);
  const [loadingTranscripts, setLoadingTranscripts] = useState<Record<string, boolean>>({});
  const [sessionTranscripts, setSessionTranscripts] = useState<Record<string, Conversation[]>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return null;
      }
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const [custData, convData, callsData, sessionsData] = await Promise.all([
        safeFetch("http://localhost:8080/api/customers"),
        safeFetch("http://localhost:8080/api/conversations"),
        safeFetch("http://localhost:8080/api/calls"),
        safeFetch("http://localhost:8080/api/call/sessions")
      ]);

      const custMap: Record<string, Customer> = {};
      if (Array.isArray(custData)) {
        custData.forEach((c: Customer) => {
          custMap[c.id] = c;
        });
      }

      const callMap: Record<string, CallData> = {};
      const allCalls = Array.isArray(callsData) && callsData.length > 0 ? callsData : (Array.isArray(sessionsData) ? sessionsData : []);
      allCalls.forEach((c: CallData) => {
        if (c.callSid) {
          callMap[c.callSid] = c;
        }
      });

      const convs = Array.isArray(convData) ? convData : [];
      convs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setCustomers(custMap);
      setCalls(callMap);
      setConversations(convs);
      setIsDataLoaded(true);
    };

    loadData();
  }, []);

  const openModal = async (callSid: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setModalCallSid(callSid);
    
    if (!sessionTranscripts[callSid]) {
      setLoadingTranscripts(prev => ({ ...prev, [callSid]: true }));
      const data = await safeFetch(`http://localhost:8080/api/conversations?callSid=${callSid}`);
      if (Array.isArray(data)) {
        data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setSessionTranscripts(prev => ({ ...prev, [callSid]: data }));
      } else {
        setSessionTranscripts(prev => ({ ...prev, [callSid]: [] }));
      }
      setLoadingTranscripts(prev => ({ ...prev, [callSid]: false }));
    }
  };

  const closeModal = () => setModalCallSid(null);

  useEffect(() => {
    if (modalCallSid && !loadingTranscripts[modalCallSid]) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessionTranscripts, modalCallSid, loadingTranscripts]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return null;
    const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    if (diff <= 0) return null;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const downloadRecording = (callSid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = 'http://localhost:8080/api/conversations/' + callSid + '/recording/download';
    link.download = 'recording-' + callSid + '.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleCustomer = (customerId: string) => {
    setExpandedCustomers(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  const groupedData = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const filteredConvs = conversations.filter(conv => {
      const convDate = new Date(conv.createdAt);
      if (filterTab === "TODAY" && convDate.toLocaleDateString() !== todayStr) return false;
      if (filterTab === "THIS_WEEK" && convDate < oneWeekAgo) return false;

      const custName = customers[conv.customerId]?.name?.toLowerCase() || "";
      const hasMatchInTranscript = conv.transcript?.some(m => m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (searchQuery && !custName.includes(searchQuery.toLowerCase()) && !hasMatchInTranscript) {
        return false;
      }
      return true;
    });

    // Group by customerId
    const group: Record<string, Conversation[]> = {};

    filteredConvs.forEach(conv => {
      const custId = conv.customerId || "unknown";
      if (!group[custId]) group[custId] = [];
      group[custId].push(conv);
    });

    const result = Object.entries(group).map(([custId, sessionsMap]) => {
      const sessionsArray = sessionsMap.map((conv) => {
        const sid = conv.callSid || "unknown_session";
        const callDetails = calls[sid];
        const startTime = callDetails?.startTime || conv.createdAt || new Date().toISOString();
        
        let recordingUrl = conv.recordingUrl || callDetails?.recordingUrl;
        if (!recordingUrl && callDetails?.status?.includes('| Recording: ')) {
          recordingUrl = callDetails.status.split('| Recording: ')[1];
        }

        return {
          callSid: sid,
          messages: conv.transcript || [],
          latestTime: new Date(conv.createdAt || 0).getTime(),
          startTime: startTime,
          duration: calculateDuration(callDetails?.startTime, callDetails?.endTime),
          recordingUrl: recordingUrl
        };
      });

      sessionsArray.sort((a, b) => b.latestTime - a.latestTime);
      const overallLatestTime = sessionsArray.length > 0 ? sessionsArray[0].latestTime : 0;

      return {
        customerId: custId,
        customer: customers[custId],
        sessions: sessionsArray,
        totalCalls: sessionsArray.length,
        latestTime: overallLatestTime
      };
    });

    result.sort((a, b) => b.latestTime - a.latestTime);

    if (result.length > 0 && Object.keys(expandedCustomers).length === 0) {
      setExpandedCustomers({ [result[0].customerId]: true });
    }

    return result;

  }, [conversations, customers, calls, filterTab, searchQuery, expandedCustomers]);

  const modalCall = useMemo(() => {
    if (!modalCallSid) return null;
    // Find the session data across all customers in groupedData
    for (const group of groupedData) {
      const session = group.sessions.find(s => s.callSid === modalCallSid);
      if (session) {
        return {
          ...session,
          customerName: group.customer?.name || "Unknown Customer",
          customerPhone: group.customer?.phone || "Unknown Phone"
        };
      }
    }
    return null;
  }, [modalCallSid, groupedData]);

  if (!isDataLoaded) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 pb-20 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
          <p className="text-sm text-gray-500 mt-1">Review call transcripts grouped by customer and session</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search messages or names..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        {["ALL", "TODAY", "THIS_WEEK", "BY_CUSTOMER"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterTab === tab 
                ? 'bg-[#7C3AED] text-white shadow-sm' 
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {groupedData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#F5F3FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <PhoneCall className="w-8 h-8 text-[#7C3AED]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No conversations yet.</h3>
            <p className="text-gray-500">Make your first call to get started and see transcripts here.</p>
          </div>
        ) : (
          groupedData.map((group) => {
            const customerName = group.customer?.name || "Unknown Customer";
            const customerPhone = group.customer?.phone || "No phone";
            const initials = getInitials(customerName);
            const isExpanded = !!expandedCustomers[group.customerId];

            return (
              <div key={group.customerId} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div 
                  onClick={() => toggleCustomer(group.customerId)}
                  className="p-4 md:p-5 flex items-center justify-between bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#F5F3FF] border border-[#E0D4FC] flex items-center justify-center text-[#7C3AED] font-bold shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{customerName}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 font-medium">{customerPhone}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                          {group.totalCalls} call{group.totalCalls !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 md:p-6 space-y-4">
                    {group.sessions.map((session) => {
                      const sessionDate = new Date(session.startTime);
                      const formattedDate = sessionDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                      const formattedTime = sessionDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

                      return (
                        <div key={session.callSid} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <div 
                            onClick={(e) => openModal(session.callSid, e)}
                            className="bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                  📞 Call on {formattedDate} at {formattedTime}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  SID: {session.callSid ? session.callSid.substring(0, 8) : 'N/A'}... {session.duration && `• Duration: ${session.duration}`}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => downloadRecording(session.callSid, e)}
                                className="text-xs font-medium text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-green-500 whitespace-nowrap"
                              >
                                Recording ⬇
                              </button>
                              <button 
                                onClick={(e) => openModal(session.callSid, e)}
                                className="text-xs font-medium text-purple-600 hover:bg-purple-50 bg-white border border-purple-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap"
                              >
                                Transcript 📄
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* TRANSCRIPT POPUP MODAL */}
      {modalCall && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden relative" 
            onClick={e => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full hover:bg-gray-100 z-50"
              onClick={closeModal}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col items-start bg-gray-50 sticky top-0 z-20 pr-16 shrink-0">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                Call Detail
              </h3>
              <p className="text-sm text-gray-700 mt-1 font-medium">
                {modalCall.customerName} • {modalCall.customerPhone || "Unknown Phone"}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date(modalCall.startTime).toLocaleDateString()} {new Date(modalCall.startTime).toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                SID: {modalCall.callSid ? modalCall.callSid.substring(0, 12) : 'N/A'}... {modalCall.duration && `• Duration: ${modalCall.duration}`}
              </p>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Reference Audio Player */}
              {modalCall.recordingUrl && (
                <div className="px-6 py-4 border-b border-gray-100 bg-[#FAFAFA] shrink-0 sticky top-0 z-10">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Reference Audio</span>
                  <audio controls src={`/api/conversations/${modalCall.callSid}/recording/download`} className="w-full h-10" />
                </div>
              )}

              {/* Scrollable Transcript */}
              <div className="p-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Chat Transcript</span>
                {loadingTranscripts[modalCall.callSid] ? (
                  <div className="text-center py-10 text-sm text-gray-500 flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
                    Loading transcript...
                  </div>
                ) : (sessionTranscripts[modalCall.callSid] || []).length === 0 ? (
                  <div className="text-center py-10 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    No transcript available for this call.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(sessionTranscripts[modalCall.callSid] && sessionTranscripts[modalCall.callSid].length > 0 && sessionTranscripts[modalCall.callSid][0].transcript || []).map((msg: any, idx: number) => {
                      if (msg.isToolMessage) return null;
                      
                      let safeMsg = String(msg?.text ?? msg?.userMessage ?? "").replace(/[^\x00-\x7F]/g, "").trim();

                      if (safeMsg.startsWith('{') && safeMsg.endsWith('}')) {
                          try {
                              JSON.parse(safeMsg);
                              return null;
                          } catch (e) {}
                      }
                      const isUser = msg.role === 'user';
                      const msgTime = new Date(msg.timestamp || new Date()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

                      if (!safeMsg) return null;

                      return (
                        <div key={idx} className="space-y-[20px]">
                          {!isUser && (
                            <div className="flex justify-end mb-[12px] w-full">
                              <div className="flex gap-3 max-w-[70%] flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-5 shadow-sm">
                                  P
                                </div>
                                <div className="flex flex-col items-end w-full">
                                  <p className="text-xs text-gray-500 mb-1 font-medium">
                                    Priya AI
                                  </p>
                                  <div className="bg-gradient-to-r from-purple-600 to-[#7C3AED] text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl px-4 py-3 shadow-sm w-full">
                                    <p className="text-sm break-words whitespace-pre-wrap">
                                      {safeMsg}
                                    </p>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {msgTime}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {isUser && (
                            <div className="flex justify-start mb-[12px] w-full">
                              <div className="flex gap-3 max-w-[70%]">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0 mt-5">
                                  {modalCall.customerName ? modalCall.customerName.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <div className="flex flex-col items-start w-full">
                                  <p className="text-xs text-gray-500 mb-1 font-medium">
                                    {modalCall.customerName || "Customer"}
                                  </p>
                                  <div className="bg-[#F3F4F6] text-gray-900 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3 shadow-sm w-full border border-gray-200">
                                    <p className="text-sm break-words whitespace-pre-wrap">{safeMsg}</p>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {msgTime}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-24 bg-gray-200 rounded-2xl"></div>
      </div>
    }>
      <ConversationsContent />
    </Suspense>
  );
}
