// frontend/src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import AISummaryCard from "@/components/crm/AISummaryCard";
import { Users, PhoneCall, Target, Clock, MessageSquare, RefreshCw, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ customers: 0, activeCalls: 0, completedCalls: 0, totalCalls: 0, conversion: 0, followups: 0 });
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [latestSummary, setLatestSummary] = useState("");
  
  const [pipeline, setPipeline] = useState({
    NEW: 0, ACTIVE: 0, INTERESTED: 0, 
    NOT_INTERESTED: 0, CALLBACK: 0
  });

  const cleanPreview = (text: string) => {
    if (!text) return '';
    const ascii = text.replace(/[^\x00-\x7F]/g, '').trim();
    return ascii.length > 5 ? ascii : 'AI responded to inquiry';
  };

  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response from:', url);
        return [];
      }
      return await res.json();
    } catch (e) {
      console.error('Fetch error:', url, e);
      return [];
    }
  };

  const fetchDashboardData = () => {
    Promise.all([
      safeFetch("http://localhost:8080/api/customers"),
      safeFetch("http://localhost:8080/api/calls").then(data => (Array.isArray(data) && data.length) ? data : safeFetch("http://localhost:8080/api/call/sessions")),
      safeFetch("http://localhost:8080/api/followups"),
      safeFetch("http://localhost:8080/api/conversations")
    ]).then(async ([customers, calls, followups, conversations]) => {
      const custArr = Array.isArray(customers) ? customers : [];
      const callsArr = Array.isArray(calls) ? calls : [];
      const fArr = Array.isArray(followups) ? followups : [];
      const convArr = Array.isArray(conversations) ? conversations : [];

      setStats({
        customers: custArr.length,
        totalCalls: callsArr.length,
        completedCalls: callsArr.filter((c: any) => c.status === "completed").length,
        activeCalls: callsArr.filter((c: any) => c.status === "in-progress" || c.status === "initiated").length,
        conversion: custArr.filter((c: any) => c.leadStatus === "INTERESTED" || c.leadStatus === "ACTIVE").length,
        followups: fArr.filter((f: any) => f.status === "PENDING").length
      });

      // Pipeline Calculation
      const counts = {
        NEW: 0, ACTIVE: 0, INTERESTED: 0,
        NOT_INTERESTED: 0, CALLBACK: 0
      };
      
      const customerMap: Record<string, any> = {};
      custArr.forEach((customer: any) => {
        customerMap[customer.id] = customer;
        const status = customer.leadStatus || 'NEW';
        if (counts[status as keyof typeof counts] !== undefined) {
          counts[status as keyof typeof counts]++;
        } else {
          counts['NEW']++;
        }
      });
      setPipeline(counts);

      // Process Conversations
      const safeConvs = convArr
        .filter((c: any) => {
          const msg = String(c?.userMessage ?? c?.message ?? "").replace(/[^\x00-\x7F]/g, "");
          return msg.trim().length > 0;
        })
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
        .map((c: any) => ({
          ...c,
          customerName: customerMap[c.customerId]?.name || 'Unknown Customer'
        }));
      setRecentConversations(safeConvs);
      
      const last5Calls = callsArr.slice(0, 5);
      const callsWithNames = last5Calls.map((call: any) => {
        if (!call.customerId) return { ...call, customerName: "Unknown Customer" };
        const cData = customerMap[call.customerId];
        return { ...call, customerName: cData?.name || "Unknown Customer" };
      });
      setRecentCalls(callsWithNames);

      const latestCustWithSummary = custArr.filter((c: any) => c.aiSummary).sort((a: any, b: any) => new Date(b.lastContacted).getTime() - new Date(a.lastContacted).getTime())[0];
      if (latestCustWithSummary) setLatestSummary(latestCustWithSummary.aiSummary);

    }).catch(console.error);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NEW': return 'badge-new';
      case 'ACTIVE': return 'badge-active';
      case 'INTERESTED': return 'badge-interested';
      case 'COMPLETED': return 'badge-completed';
      case 'FAILED': return 'badge-failed';
      case 'NO-ANSWER': return 'badge-failed';
      case 'CALLBACK': return 'badge-callback';
      case 'IN-PROGRESS': return 'badge-interested';
      default: return 'badge-unknown';
    }
  };

  const totalPipeline = Object.values(pipeline).reduce((a, b) => a + b, 0);
  const stages = [
    { key: 'NEW', label: 'New', color: '#94A3B8', count: pipeline.NEW },
    { key: 'ACTIVE', label: 'Active', color: '#10B981', count: pipeline.ACTIVE },
    { key: 'INTERESTED', label: 'Interested', color: '#F59E0B', count: pipeline.INTERESTED },
    { key: 'NOT_INTERESTED', label: 'Not Interested', color: '#EF4444', count: pipeline.NOT_INTERESTED },
    { key: 'CALLBACK', label: 'Callback', color: '#F87171', count: pipeline.CALLBACK },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 z-10 relative overflow-x-hidden max-w-full" style={{ backgroundColor: '#F8F9FC', minHeight: '100vh' }}>
      
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 style={{ color: '#111827', fontWeight: 700, fontSize: '1.75rem' }}>Dashboard</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '4px' }}>Monitor active speech streams and AI engine performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Total Customers</h3>
            <div className="p-2 rounded-lg bg-[#F5F3FF]">
              <Users className="w-5 h-5" style={{ color: '#7C3AED' }}/>
            </div>
          </div>
          <h2 style={{ color: '#111827', fontWeight: 700, fontSize: '2rem' }}>{stats.customers}</h2>
        </div>
        
        <div className="card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Total / Active Calls</h3>
            <div className="p-2 rounded-lg bg-[#ECFDF5]">
              <PhoneCall className="w-5 h-5" style={{ color: '#10B981' }}/>
            </div>
          </div>
          <h2 style={{ color: '#111827', fontWeight: 700, fontSize: '2rem' }}>{stats.totalCalls} <span className="text-gray-400 text-xl">/</span> {stats.activeCalls}</h2>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Converted Leads</h3>
            <div className="p-2 rounded-lg bg-[#EFF6FF]">
              <Target className="w-5 h-5" style={{ color: '#3B82F6' }}/>
            </div>
          </div>
          <h2 style={{ color: '#111827', fontWeight: 700, fontSize: '2rem' }}>{stats.conversion}</h2>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
          <div className="flex justify-between items-start mb-4">
            <h3 style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Followups Due</h3>
            <div className="p-2 rounded-lg bg-[#FEF2F2]">
              <Clock className="w-5 h-5" style={{ color: '#EF4444' }}/>
            </div>
          </div>
          <h2 style={{ color: '#111827', fontWeight: 700, fontSize: '2rem' }}>{stats.followups}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8 max-w-full">
          
          <div className="card" style={{ borderRadius: '20px' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ color: '#111827', fontWeight: 700, fontSize: '1.25rem' }}>Lead Pipeline</h2>
              <button 
                onClick={fetchDashboardData} 
                className="flex items-center gap-1.5 text-xs text-[#7C3AED] font-bold hover:bg-[#F5F3FF] px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#E0D4FC]"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
            
            {totalPipeline === 0 ? (
              <div className="text-center py-10 bg-[#F5F7FA] rounded-xl border border-dashed border-[#E4E7EC]">
                <p className="text-[#6B7280] font-medium">No customers yet. Add your first customer to see the pipeline.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  {stages.map(stage => {
                    const pct = totalPipeline > 0 ? Math.round((stage.count / totalPipeline) * 100) : 0;
                    return (
                      <div key={stage.key} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: stage.color }}></span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{stage.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-[#111827]">{stage.count}</p>
                        <p className="text-[11px] font-medium text-[#9CA3AF] mb-3">{stage.count === 1 ? '1 customer' : `${stage.count} customers`}</p>
                        <div className="w-full h-1.5 bg-[#F5F7FA] rounded-full overflow-hidden flex items-center shadow-inner">
                           <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, backgroundColor: stage.color }}></div>
                        </div>
                        <p className="text-[10px] font-semibold text-[#6B7280] mt-1.5 text-right">{pct}%</p>
                      </div>
                    )
                  })}
                </div>
                
                <div className="h-5 flex rounded-full overflow-hidden shadow-sm relative group bg-[#F5F7FA]">
                  {stages.map(stage => {
                    const pct = totalPipeline > 0 ? (stage.count / totalPipeline) * 100 : 0;
                    if (pct === 0) return null;
                    return (
                      <div 
                        key={stage.key} 
                        style={{ width: `${pct}%`, backgroundColor: stage.color }} 
                        className="h-full transition-all duration-500 hover:opacity-90 cursor-pointer border-r border-[#FFFFFF]/20 last:border-0"
                        title={`${stage.key}: ${stage.count} customer${stage.count !== 1 ? 's' : ''} (${Math.round(pct)}%)`}
                      ></div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="card flex flex-col" style={{ borderRadius: '20px' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ color: '#111827', fontWeight: 700, fontSize: '1.25rem' }}>Recent Conversations</h2>
              <button 
                onClick={() => router.push('/dashboard/conversations')}
                className="p-2 hover:bg-[#F5F7FA] rounded-lg transition-colors border border-transparent hover:border-[#E4E7EC]"
              >
                <MessageSquare className="w-5 h-5" style={{ color: '#9CA3AF' }} />
              </button>
            </div>
            
            <div className="space-y-1 flex-1">
              {recentConversations.map((conv, idx) => {
                const preview = String(conv?.userMessage ?? conv?.message ?? "").replace(/[^\x00-\x7F]/g, "").substring(0, 60);
                return (
                  <div 
                    key={idx} 
                    onClick={() => router.push(`/dashboard/conversations?customerId=${conv.customerId}`)}
                    style={{ cursor: 'pointer' }}
                    className="hover:bg-[#F5F7FA] transition-colors rounded-xl p-3 -mx-3 border border-transparent hover:border-[#E4E7EC] group"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-sm font-bold text-[#111827]">{conv.customerName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#9CA3AF]">
                          {new Date(conv.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 group-hover:text-[#7C3AED] transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#374151] truncate mb-1">"{preview}{conv.userMessage.length > 60 ? '...' : ''}"</p>
                    <p className="text-xs font-medium text-[#7C3AED] truncate">AI: {cleanPreview(conv.aiResponse)}...</p>
                  </div>
                );
              })}
              {recentConversations.length === 0 && <p className="text-sm font-medium text-center py-4" style={{ color: '#9CA3AF' }}>No recent conversations.</p>}
            </div>
            
            <button 
              onClick={() => router.push('/dashboard/conversations')}
              className="mt-4 text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors flex items-center justify-center gap-1.5 w-full pt-4 border-t border-[#E4E7EC]"
            >
              View All Conversations <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-8 max-w-full">
          <AISummaryCard summary={latestSummary} />

          <div className="card" style={{ borderRadius: '20px' }}>
            <h2 style={{ color: '#111827', fontWeight: 700, fontSize: '1.25rem', marginBottom: '20px' }}>Recent Calls</h2>
            <div className="space-y-3">
              {recentCalls.map((call, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-xl border border-[#E4E7EC] bg-[#FFFFFF] hover:bg-[#F5F7FA] transition-colors shadow-sm">
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#111827' }}>{call.customerName}</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: '#6B7280' }}>{new Date(call.startTime).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${getStatusBadge(call.status)}`}>
                    {call.status?.split(' |')[0] || 'UNKNOWN'}
                  </span>
                </div>
              ))}
              {recentCalls.length === 0 && <p className="text-sm font-medium text-center py-4" style={{ color: '#9CA3AF' }}>No calls yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}