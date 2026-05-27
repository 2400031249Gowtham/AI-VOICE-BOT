"use client";

import React from "react";
import { Customer } from "@/types";
import { Clock, Calendar, CheckSquare, RefreshCw, Star, Info, MessageSquare, AlertCircle } from "lucide-react";

interface MemoryTimelineProps {
  customer: Customer;
  timelineEvents: any[];
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  customer,
  timelineEvents
}) => {
  // Synthesize relationship memory alerts
  const memoryAlerts = [];
  if (customer.lastCalledDaysAgo && customer.lastCalledDaysAgo >= 7 && customer.status !== "Converted") {
    memoryAlerts.push({
      type: "warning",
      text: `Last called ${customer.lastCalledDaysAgo} days ago - at risk of going cold.`
    });
  }
  if (customer.invoiceStatus === "Unpaid") {
    memoryAlerts.push({
      type: "info",
      text: "Market rate fee ₹45,000 discussed. Invoice pending payment."
    });
  }
  if (customer.notes && (customer.notes.includes("tappakunda") || customer.notes.includes("తప్పకుండా"))) {
    memoryAlerts.push({
      type: "fact",
      text: "Fact: Requested callback after audit. Preferred language: Telugu."
    });
  }

  return (
    <div className="space-y-4 text-left">
      {/* Continuity Highlights / Memory alerts */}
      {memoryAlerts.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">AI Relationship Memories</h4>
          <div className="space-y-1">
            {memoryAlerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-lg border text-[10px] flex items-start gap-1.5 leading-normal ${
                  alert.type === "warning" ? "bg-destructive/5 border-destructive/20 text-destructive" :
                  alert.type === "info" ? "bg-primary/5 border-primary/20 text-primary" :
                  "bg-chart-2/5 border-chart-2/20 text-chart-2"
                }`}
              >
                <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                <span>{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main timeline listing */}
      <div className="space-y-3">
        <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
          <Clock size={12} /> Contact Log Timeline
        </h4>
        
        <div className="relative pl-4 border-l border-border/60 ml-2 space-y-4">
          
          {/* Active callback note */}
          {customer.futureCallbackDate && customer.futureCallbackDate !== "Completed" && (
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-chart-4 border-2 border-background" />
              <div>
                <span className="text-[10px] font-bold text-chart-4 flex items-center gap-1">
                  <Calendar size={9} /> Callback Agreed: {customer.futureCallbackDate}
                </span>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  AI automatically scheduled. Callback triggers Telugu voice assistant trunk.
                </p>
              </div>
            </div>
          )}

          {/* Render timeline events */}
          {timelineEvents.map((evt) => {
            const isCall = evt.type === "call";
            const isWhatsApp = evt.type === "whatsapp";
            return (
              <div key={evt.id} className="relative">
                <span className={`absolute -left-[20px] top-1.5 w-2 h-2 rounded-full border border-background ${
                  isCall ? "bg-chart-1" : isWhatsApp ? "bg-chart-2" : "bg-primary"
                }`} />
                <div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-bold text-foreground">{evt.description}</span>
                    <span className="text-[8px] text-muted-foreground">{evt.date}</span>
                  </div>
                  {evt.details && <p className="text-[9px] text-muted-foreground mt-0.5 leading-normal">{evt.details}</p>}
                </div>
              </div>
            );
          })}
          
          {/* Static seed item for history */}
          <div className="relative">
            <span className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-secondary border border-background" />
            <div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground">Exporter capturing registry</span>
                <span className="text-[8px] text-muted-foreground">15 days ago</span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                Exporter record initialized in VoxAI database via central lead import.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
