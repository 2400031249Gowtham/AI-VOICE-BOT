"use client";

import { motion } from "framer-motion";
import { useCRMStore } from "@/store/crmStore";
import { PhoneCall, Calendar, Clock, Bell, RefreshCw, AlertTriangle } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CallbackQueuePage() {
  const followups = useCRMStore(s => s.followups);
  const triggerOutboundCall = useCRMStore(s => s.triggerOutboundCall);
  const updateFollowupStatus = useCRMStore(s => s.updateFollowupStatus);
  const customers = useCRMStore(s => s.customers);

  // Active callbacks (Pending/Missed/Scheduled)
  const activeCallbacks = followups.filter(f => f.status !== "Completed");

  const handleToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    await updateFollowupStatus(id, nextStatus);
  };

  return (
    <PageContainer>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Callback Queue</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Review exporter follow-up schedules, check countdown times, and launch outbound calls.
          </p>
        </div>
      </motion.div>

      {/* Grid of Callback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {activeCallbacks.map((task) => {
          const cust = customers.find(c => c.id === task.customerId);
          const licenseType = cust?.licenseType || "RODTEP";
          const callbackDate = cust?.nextFollowupDate || task.time;
          
          let countdown = "In 3 days";
          if (callbackDate.toLowerCase().includes("today")) countdown = "Today ⚡";
          else if (callbackDate.toLowerCase().includes("overdue") || task.status === "Missed") countdown = "Overdue 🔴";
          else if (callbackDate.toLowerCase().includes("tomorrow")) countdown = "Tomorrow ⏳";
          else if (callbackDate.toLowerCase().includes("day")) countdown = callbackDate;

          return (
            <GlassCard key={task.id} className="p-4 border-l-4 border-l-primary flex flex-col justify-between text-left relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-xs text-foreground truncate max-w-[150px]">{task.customerName}</h4>
                    <p className="text-[9px] text-muted-foreground truncate max-w-[150px]">{task.company}</p>
                  </div>
                  <Badge variant="outline" className={`text-[8px] h-4.5 px-1.5 ${
                    countdown.includes("Overdue") ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    {countdown}
                  </Badge>
                </div>
                
                <div className="space-y-1.5 my-3 text-[10px] bg-secondary/25 p-2.5 rounded-lg border border-border/20">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Type:</span>
                    <span className="font-semibold text-primary">{licenseType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Callback Date:</span>
                    <span className="font-medium text-foreground">{callbackDate}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic mt-2 border-t border-border/10 pt-2 line-clamp-2">
                    "{task.aiNotes}"
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/15 mt-2">
                <Button 
                  size="sm" 
                  className="h-6.5 text-[9px] gap-1 px-3 shadow-sm shadow-primary/10"
                  onClick={() => triggerOutboundCall(task.customerId)}
                >
                  <PhoneCall size={10} /> Call Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-6.5 text-[9px] px-2.5 border-border hover:bg-secondary text-foreground"
                  onClick={() => handleToggle(task.id, task.status)}
                >
                  Mark Done
                </Button>
              </div>
            </GlassCard>
          );
        })}

        {activeCallbacks.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center">
            <Bell size={32} className="text-primary mb-3 opacity-50" />
            <span className="font-bold text-foreground mb-1">Callback Queue Empty</span>
            <span className="max-w-xs text-muted-foreground leading-normal">
              No pending callbacks scheduled in the queue. Standing by.
            </span>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
