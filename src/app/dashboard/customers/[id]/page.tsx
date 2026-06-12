// frontend/src/app/dashboard/customers/[id]/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { PhoneCall, Calendar, Mail, Building, MapPin, Clock, FileText, Play, Download, ChevronDown, ChevronRight, User, Bot, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import AISummaryCard from "@/components/crm/AISummaryCard";

export default function CustomerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<any>(null);
  const [calls, setCalls] = useState<any[]>([]);
  
  const [expandedCallSid, setExpandedCallSid] = useState<string | null>(null);
  const [callTranscripts, setCallTranscripts] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!id) return;

    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Non-JSON response from:', url);
          return null;
        }
        return await res.json();
      } catch (e) {
        console.error(e);
        return null;
      }
    };
    
    safeFetch(`http://localhost:8080/api/customers/${id}`).then(setCustomer);
      
    safeFetch("http://localhost:8080/api/calls")
      .then(data => {
        if(data && Array.isArray(data) && data.length > 0) {
           setCalls(data.filter((c:any) => c.customerId === id).sort((a:any,b:any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
        } else {
           safeFetch("http://localhost:8080/api/call/sessions").then(d => {
              if(d && Array.isArray(d)) setCalls(d.filter((c:any) => c.customerId === id).sort((a:any,b:any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
           });
        }
      });

  }, [id]);

  const toggleCall = async (callSid: string) => {
    if (expandedCallSid === callSid) {
      setExpandedCallSid(null)
      return
    }
    if (callTranscripts[callSid]) {
      setExpandedCallSid(callSid)
      return
    }
    try {
      const res = await fetch(
        'http://localhost:8080/api/conversations?callSid=' + callSid
      )
      if (res.ok) {
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        if (Array.isArray(data)) {
          data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        }
        setCallTranscripts(prev => ({
          ...prev,
          [callSid]: Array.isArray(data) ? data : []
        }))
      }
    } catch {
      setCallTranscripts(prev => ({ ...prev, [callSid]: [] }))
    }
    setExpandedCallSid(callSid)
  }

  const downloadRecording = (callSid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a')
    link.href = 'http://localhost:8080/api/conversations/' 
                 + callSid + '/recording/download'
    link.download = 'recording-' + callSid + '.mp3'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadTranscript = (callSid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open('http://localhost:8080/api/conversations/transcript/' + callSid, '_blank');
  }

  const handleCallNow = async (customerId: string, phone: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/call/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customerId, phone: phone })
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }
      if (response.ok) {
        alert('Call initiated successfully! Phone: ' + phone);
      } else {
        alert("Call failed.\nReason: " + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error initiating call: ' + error);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "-";
    const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    if (diff < 0) return "-";
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return m + ':' + s.toString().padStart(2, '0');
  };

  const formatDateStr = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }) + ' at ' + d.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  if (!customer) return <div className="p-8 flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" /></div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Customer Intelligence</h1>
          <p className="text-sm text-[#6B7280] mt-1">Detailed analysis and interaction history</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-semibold badge-${customer.leadStatus?.toLowerCase()}`}>
          {customer.leadStatus}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN - 40% */}
        <div className="lg:w-[40%] space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#F5F3FF] border-2 border-[#E0D4FC] flex items-center justify-center text-[#7C3AED] text-2xl font-bold shrink-0">
                {getInitials(customer.name)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#111827]">{customer.name}</h2>
                <p className="text-[#6B7280] font-medium flex items-center gap-1.5 mt-1">
                  <Building className="w-4 h-4" /> {customer.company}
                </p>
              </div>
            </div>
            
            <div className="space-y-4 border-t border-[#E4E7EC] pt-6 mb-6">
              <div className="flex items-center gap-3 text-[#374151]">
                <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center shrink-0"><PhoneCall className="w-4 h-4 text-[#7C3AED]" /></div>
                <span className="font-medium">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-[#374151]">
                <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-[#7C3AED]" /></div>
                <span className="font-medium">{customer.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-[#374151]">
                <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-[#7C3AED]" /></div>
                <span className="font-medium">{customer.address || 'Chennai, India'}</span>
              </div>
            </div>

            <div className="bg-[#F5F7FA] rounded-xl p-4 mb-6 border border-[#E4E7EC]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[#6B7280]">Lead Score</span>
                <span className="text-sm font-bold text-[#10B981]">{customer.leadScore || 85}/100</span>
              </div>
              <div className="h-2.5 bg-[#E4E7EC] rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${customer.leadScore || 85}%` }}></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleCallNow(customer.id, customer.phone)} className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                Call Now
              </button>
              <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                Schedule
              </button>
            </div>
          </div>

          <AISummaryCard summary={customer.aiSummary || "No AI summary generated yet for this customer."} />
        </div>

        {/* RIGHT COLUMN - 60% */}
        <div className="lg:w-[60%] space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#9CA3AF]" />
                <h3 className="text-lg font-bold text-[#111827]">Recent Call History</h3>
              </div>
              <button 
                onClick={() => window.open(`http://localhost:8080/api/conversations/transcript/customer/${id}`)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 h-8 px-3 rounded-lg shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" /> Download All
              </button>
            </div>
            
            {/* Call Timeline List */}
            <div className="p-4 md:p-6 space-y-4 bg-[#F8F9FC]">
              {calls.map((call) => (
                <div key={call.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  
                  {/* CLICKABLE HEADER ROW */}
                  <div
                    onClick={() => toggleCall(call.callSid)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors select-none gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        📞 Call on {formatDateStr(call.startTime)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        SID: {call.callSid ? call.callSid.substring(0, 12) + '...' : 'N/A'} • Duration: {calculateDuration(call.startTime, call.endTime)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => downloadRecording(call.callSid, e)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-500 text-green-600 text-sm font-medium hover:bg-green-50"
                      >
                        Recording ⬇
                      </button>
                      <button
                        onClick={(e) => downloadTranscript(call.callSid, e)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-500 text-purple-600 text-sm font-medium hover:bg-purple-50"
                      >
                        Transcript 📄
                      </button>
                      <span className="text-gray-400 p-1 ml-1 flex items-center justify-center">
                        {expandedCallSid === call.callSid ? <ChevronDown className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 rotate-180" />}
                      </span>
                    </div>
                  </div>
                  
                  {/* EXPANDABLE TRANSCRIPT SECTION */}
                  {expandedCallSid === call.callSid && (
                    <div className="p-6 border-t border-gray-100 bg-white">
                      {(callTranscripts[call.callSid] || []).length === 0 ? (
                        <div className="text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                          No transcript available for this call.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(callTranscripts[call.callSid] || []).map((conv, idx) => {
                            const isAI = conv.sender?.toUpperCase() === 'AI' || !conv.userMessage;
                            const time = new Date(conv.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                            const customerName = customer?.name || 'Customer';
                            const initial = customerName.charAt(0).toUpperCase();

                            // The backend format might vary (userMessage/aiResponse vs text/sender)
                            const text = conv.text || (isAI ? conv.aiResponse : conv.userMessage);
                            let textStr = String(text ?? "");
                            
                            // JSON Pollution Fix
                            if (textStr.trim().startsWith('{') && textStr.trim().endsWith('}')) {
                                try {
                                    JSON.parse(textStr);
                                    // It's pure JSON, don't render it
                                    return null;
                                } catch (e) {}
                            }

                            if (!textStr || !textStr.replace(/[^\x00-\x7F]/g, '').trim()) return null;

                            // Customer messages LEFT (grey), AI RIGHT (purple)
                            if (isAI) {
                              return (
                                <div key={idx} className="flex justify-end mb-4">
                                  <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-5">
                                      P
                                    </div>
                                    <div className="flex flex-col items-end">
                                      <p className="text-xs text-gray-400 text-right mb-1">
                                        Priya AI • {time}
                                      </p>
                                      <div className="bg-[#7C3AED] text-white border border-transparent rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl px-4 py-3 shadow-sm w-full">
                                        <p className="text-sm break-words whitespace-pre-wrap">{textStr.replace(/[^\x00-\x7F]/g, '')}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div key={idx} className="flex justify-start mb-4">
                                  <div className="max-w-[80%] flex flex-col items-start">
                                    <p className="text-xs text-gray-400 mb-1">
                                      {customerName} • {time}
                                    </p>
                                    <div className="bg-gray-100 text-gray-800 rounded-tr-2xl rounded-br-2xl rounded-tl-2xl px-4 py-3 shadow-sm w-full border border-gray-200">
                                      <p className="text-sm break-words whitespace-pre-wrap">{textStr.replace(/[^\x00-\x7F]/g, '')}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {calls.length === 0 && (
                <div className="text-center p-8 border border-dashed border-[#E4E7EC] rounded-xl bg-white">
                  <p className="text-[#9CA3AF] font-medium text-sm">No call history recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
