"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Calendar as CalendarIcon, AlertCircle, LayoutList, Phone, FileText, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"LIST" | "CALENDAR">("LIST");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayEvents, setDayEvents] = useState<any[]>([]);

  const getUniqueKey = (item: any, index: number) =>
    item._id ||
    item.id ||
    `${item.customerId}-${item.dueDate}-${index}`;

  const fetchFollowups = () => {
    fetch("http://localhost:8080/api/followups")
      .then(res => res.json())
      .then(data => {
        console.log("API Followups", data);
        setFollowups(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const handleCall = async (customerId: string, phone: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/call/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, phone })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      if (response.ok) {
        alert("Call Initiated Successfully");
      } else {
        alert("Call failed.\nReason: " + (data.message || "Unknown error"));
      }
    } catch (e) {
      alert("Error initiating call");
    }
  };

  const handleComplete = (customerId: string) => {
    fetch(`http://localhost:8080/api/followups/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId })
    }).then(() => {
      fetchFollowups();
      setSelectedDay(null); // Close modal on complete
    });
  };

  const handleReschedule = (customerId: string) => {
    const newDate = prompt("Enter new date (YYYY-MM-DDTHH:mm:ss):", new Date().toISOString().slice(0,19));
    if (newDate) {
      fetch(`http://localhost:8080/api/followups/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, dueDate: newDate })
      }).then(() => {
        fetchFollowups();
        setSelectedDay(null); // Close modal on reschedule
      });
    }
  };

  const [activeFilter, setActiveFilter] = useState<"ALL" | "TODAY" | "WEEK" | "COMPLETED" | "OVERDUE">("ALL");

  const total = followups.length;
  const completedList = followups.filter(f => String(f.status || "").toUpperCase() === "COMPLETED");
  const pendingList = followups.filter(f => String(f.status || "").toUpperCase() === "PENDING" && f.dueDate);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const overdueCount = pendingList.filter(f => new Date(f.dueDate) < today).length;
  const todayCount = pendingList.filter(f => {
    const d = new Date(f.dueDate);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  
  const weekCount = pendingList.filter(f => {
    const d = new Date(f.dueDate);
    return d >= today && d <= endOfWeek;
  }).length;

  let displayList = pendingList;
  if (activeFilter === "COMPLETED") displayList = completedList;
  else if (activeFilter === "OVERDUE") displayList = pendingList.filter(f => new Date(f.dueDate) < today);
  else if (activeFilter === "TODAY") displayList = pendingList.filter(f => {
    const d = new Date(f.dueDate);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  else if (activeFilter === "WEEK") displayList = pendingList.filter(f => {
    const d = new Date(f.dueDate);
    return d >= today && d <= endOfWeek;
  });

  // Generate mapped events for full calendar spec as requested
  const events = followups
    .filter(f => {
      if (!f.dueDate) {
        console.warn("Followup missing dueDate", f);
        return false;
      }
      return true;
    })
    .map(f => ({
      id: f._id || f.id || f.customerId,
      title: f.customerName || f.customerId,
      start: new Date(f.dueDate),
      end: new Date(f.dueDate),
      resource: f
    }));
  
  useEffect(() => {
    console.log("API Followups", followups);
    console.log("Pending Followups", pendingList);
    console.log("Calendar Events", events);
  }, [followups, pendingList, events]);

  const getLeadColor = (status: string) => {
    if (!status) return "border-gray-200 bg-white";
    const s = status.toUpperCase();
    if (s.includes("HOT")) return "border-red-400 bg-red-50";
    if (s.includes("WARM")) return "border-yellow-400 bg-yellow-50";
    if (s.includes("COLD")) return "border-emerald-400 bg-emerald-50";
    return "border-gray-200 bg-white";
  };

  // Calendar Logic
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const blanks = Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} className="p-2 border border-gray-100 bg-gray-50/50 min-h-[100px]" />);
  
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEventsForDate = events.filter(e => {
      const ed = e.start;
      return ed.getFullYear() === currentDate.getFullYear() && 
             ed.getMonth() === currentDate.getMonth() && 
             ed.getDate() === day;
    });
    
    return (
      <div 
        key={`day-${day}`} 
        className="p-2 border border-gray-100 min-h-[100px] flex flex-col gap-1 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => {
          setSelectedDay(dateStr);
          setDayEvents(dayEventsForDate);
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-gray-500">{day}</span>
          {dayEventsForDate.length > 0 && <span className="bg-[#7C3AED] text-white text-[10px] px-1.5 rounded-full shadow-sm">{dayEventsForDate.length}</span>}
        </div>
        {dayEventsForDate.slice(0, 3).map((e, index) => (
          <div key={getUniqueKey(e.resource, index)} className={`p-1.5 rounded text-[11px] font-semibold border truncate shadow-sm ${getLeadColor(e.resource.leadStatus)}`} title={`${e.title} - ${e.resource.phone}`}>
             {e.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {e.title}
          </div>
        ))}
        {dayEventsForDate.length > 3 && (
           <div className="text-[10px] text-gray-400 font-bold px-1">+ {dayEventsForDate.length - 3} more</div>
        )}
      </div>
    );
  });

  return (
    <div className="p-6 md:p-8 z-10 relative overflow-x-hidden max-w-7xl mx-auto" suppressHydrationWarning>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-[#7C3AED]" />
            Follow-up Calendar
          </h1>
          <p className="text-gray-500 mt-2 text-[15px]">Manage and schedule your customer interactions.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
           <button onClick={() => setViewMode("LIST")} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'LIST' ? 'bg-white shadow text-[#7C3AED]' : 'text-gray-500'}`}>List View</button>
           <button onClick={() => setViewMode("CALENDAR")} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'CALENDAR' ? 'bg-white shadow text-[#7C3AED]' : 'text-gray-500'}`}>Calendar View</button>
        </div>
      </div>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={() => { setActiveFilter("TODAY"); setViewMode("LIST"); }}
          className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition-colors ${activeFilter === "TODAY" ? "border-[#7C3AED] ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><LayoutList className="w-5 h-5" /></div>
            <h3 className="text-gray-500 text-sm font-semibold">Today</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{todayCount}</p>
        </div>
        <div 
          onClick={() => { setActiveFilter("WEEK"); setViewMode("LIST"); }}
          className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition-colors ${activeFilter === "WEEK" ? "border-[#7C3AED] ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-5 h-5" /></div>
            <h3 className="text-gray-500 text-sm font-semibold">This Week</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{weekCount}</p>
        </div>
        <div 
          onClick={() => { setActiveFilter("COMPLETED"); setViewMode("LIST"); }}
          className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition-colors ${activeFilter === "COMPLETED" ? "border-[#7C3AED] ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
            <h3 className="text-gray-500 text-sm font-semibold">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedList.length}</p>
        </div>
        <div 
          onClick={() => { setActiveFilter("OVERDUE"); setViewMode("LIST"); }}
          className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition-colors ${activeFilter === "OVERDUE" ? "border-[#7C3AED] ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
            <h3 className="text-gray-500 text-sm font-semibold">Overdue</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
        </div>
      </div>

      {viewMode === "CALENDAR" ? (
         <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900">
               {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
             </h2>
             <div className="flex gap-2">
               <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 bg-gray-50 rounded border hover:bg-gray-100"><ChevronLeft className="w-5 h-5"/></button>
               <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-gray-50 rounded border hover:bg-gray-100 text-sm font-bold">Today</button>
               <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 bg-gray-50 rounded border hover:bg-gray-100"><ChevronRight className="w-5 h-5"/></button>
             </div>
           </div>
           <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
               <div key={d} className="bg-gray-50 py-2 text-center text-xs font-bold text-gray-500 uppercase">{d}</div>
             ))}
             {blanks}
             {days}
           </div>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.length > 0 ? displayList.map((f, index) => (
            <div key={getUniqueKey(f, index)} className={`bg-white border rounded-xl p-5 shadow-sm relative overflow-hidden ${getLeadColor(f.leadStatus)}`}>
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <h3 className="font-bold text-gray-900 text-lg">{f.customerName}</h3>
                   <p className="text-sm text-gray-500 font-mono">{f.phone}</p>
                 </div>
                 <span className="px-2 py-1 bg-white/50 rounded text-xs font-bold shadow-sm uppercase">{f.leadStatus || 'NEW'}</span>
               </div>
               
               <div className="space-y-2 mb-4">
                 <div className="flex items-center gap-2 text-sm text-gray-700">
                   <Clock className="w-4 h-4 text-gray-400" />
                   <span className="font-semibold">{new Date(f.dueDate).toLocaleString()}</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-700">
                   <FileText className="w-4 h-4 text-gray-400" />
                   <span>{f.licenseType || 'Unknown License'} - Qty: {f.quantity || 'N/A'}</span>
                 </div>
                 {f.sentiment && (
                   <div className="text-xs font-bold text-gray-500">Sentiment: <span className="text-gray-800">{f.sentiment}</span></div>
                 )}
               </div>
               
               <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100/50">
                 <button onClick={() => handleCall(f.customerId, f.phone)} className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2 rounded-lg text-xs font-bold shadow-sm flex items-center justify-center gap-1">
                   <Phone className="w-3 h-3" /> Call
                 </button>
                 <button onClick={() => handleReschedule(f.customerId)} className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold shadow-sm">
                   Reschedule
                 </button>
                 <button onClick={() => handleComplete(f.customerId)} className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold shadow-sm">
                   Complete
                 </button>
               </div>
            </div>
          )) : (
            <div className="col-span-full bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center shadow-sm min-h-[300px]">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No pending follow-ups</h3>
              <p className="text-gray-500 text-[14px]">You're all caught up!</p>
            </div>
          )}
        </div>
      )}

      {/* Day Click Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedDay(null)}>
          <div 
            className="bg-white w-full max-w-lg overflow-hidden flex flex-col rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Follow-ups for {selectedDay}</h3>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-200" onClick={() => setSelectedDay(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {dayEvents.length > 0 ? dayEvents.map((e, index) => (
                <div key={`modal-${getUniqueKey(e.resource, index)}`} className={`p-4 border rounded-xl ${getLeadColor(e.resource.leadStatus)}`}>
                   <div className="flex justify-between items-center mb-2">
                     <h4 className="font-bold text-gray-900">{e.title}</h4>
                     <span className="px-2 py-1 bg-white/60 rounded text-xs font-bold shadow-sm">{e.resource.status}</span>
                   </div>
                   <div className="text-sm text-gray-600 space-y-1 mb-3">
                     <p><span className="font-semibold">Time:</span> {e.start.toLocaleTimeString()}</p>
                     <p><span className="font-semibold">Phone:</span> {e.resource.phone}</p>
                     {e.resource.notes && <p><span className="font-semibold">Notes:</span> {e.resource.notes}</p>}
                     {e.resource.quantity && <p><span className="font-semibold">Context:</span> {e.resource.quantity} {e.resource.licenseType}</p>}
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => handleCall(e.resource.customerId, e.resource.phone)} className="flex-1 bg-[#7C3AED] text-white py-1.5 rounded-lg text-sm font-bold flex justify-center items-center gap-1 shadow-sm"><Phone className="w-4 h-4"/> Call Now</button>
                     <button onClick={() => handleComplete(e.resource.customerId)} className="flex-1 bg-white border text-gray-700 py-1.5 rounded-lg text-sm font-bold shadow-sm">Mark Complete</button>
                   </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4">No follow-ups for this day.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
