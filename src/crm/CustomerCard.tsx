"use client";

import React from "react";
import { Customer } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PhoneCall, MessageCircle, CalendarClock, Mail, ArrowRight, TrendingUp } from "lucide-react";
import LeadScoreBadge from "@/components/shared/LeadScoreBadge";

interface CustomerCardProps {
  customer: Customer;
  onCall: (id: string) => void;
  onWhatsApp: (id: string) => void;
  onSchedule: (id: string) => void;
  onView: (id: string) => void;
  onEmail: (id: string) => void;
}

const interestColors: Record<string, string> = {
  High: "text-chart-2 bg-chart-2/10 border-chart-2/20",
  Medium: "text-chart-4 bg-chart-4/10 border-chart-4/20",
  Low: "text-muted-foreground bg-secondary/50 border-border"
};

export const CustomerCard = React.memo(function CustomerCard({
  customer,
  onCall,
  onWhatsApp,
  onSchedule,
  onView,
  onEmail
}: CustomerCardProps) {
  return (
    <div className="p-4 rounded-xl glass border border-border/50 flex flex-col justify-between hover:border-primary/30 transition-all card-hover text-left">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                {customer.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="text-xs font-bold truncate">{customer.name}</h3>
              <p className="text-[9px] text-muted-foreground truncate">{customer.company}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <LeadScoreBadge status={customer.status} className="scale-90 origin-right px-1.5 py-0 h-4" />
            <Badge variant="outline" className={`text-[8px] px-1 py-0 h-3.5 ${interestColors[customer.interestLevel]}`}>
              {customer.interestLevel} Interest
            </Badge>
          </div>
        </div>

        {/* Exporter Details Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 my-2.5 pt-2.5 border-t border-border/20 text-[10px]">
          <div>
            <span className="text-muted-foreground block uppercase font-semibold text-[8px]">License Type</span>
            <span className="font-semibold text-primary block truncate mt-0.5">{customer.licenseType || "RODTEP"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block uppercase font-semibold text-[8px]">Availability</span>
            <span className={`font-medium block truncate mt-0.5 ${customer.availabilityStatus === "Available" ? "text-emerald-400" : "text-zinc-400"}`}>
              {customer.availabilityStatus || "Unavailable"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block uppercase font-semibold text-[8px]">Last Discussed Rate</span>
            <span className="font-semibold text-foreground block mt-0.5">{customer.lastRateDiscussed ? `₹${customer.lastRateDiscussed.toLocaleString("en-IN")}` : "None"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block uppercase font-semibold text-[8px]">Next Follow-up</span>
            <span className="font-medium text-foreground block truncate mt-0.5">{customer.nextFollowupDate ? new Date(customer.nextFollowupDate).toLocaleDateString("en-IN") : "Not Scheduled"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block uppercase font-semibold text-[8px]">WhatsApp Coordinated</span>
            <span className="font-medium text-foreground block mt-0.5">{customer.whatsappSent ? "Sent ✅" : "Pending ⏳"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block uppercase font-semibold text-[8px]">Lead Score</span>
            <span className="font-black text-chart-4 block mt-0.5">{customer.leadScore || 0}/100</span>
          </div>
        </div>

        {/* Last convo summary excerpt */}
        <div className="mb-2">
          <p className="text-[10px] text-muted-foreground italic line-clamp-2 h-7 leading-relaxed">
            {`"${customer.lastInteractionSummary}"`}
          </p>
        </div>

        {/* Pricing history notes */}
        {customer.marketHistory && customer.marketHistory.length > 0 && (
          <div className="mb-3.5 p-1.5 rounded-lg bg-secondary/35 border border-border/40 text-[9px] flex items-center gap-1">
            <TrendingUp size={10} className="text-primary flex-shrink-0" />
            <span className="text-muted-foreground truncate">
              Discussed: <strong className="text-foreground">{customer.marketHistory[0].description}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-1 mt-1 pt-2.5 border-t border-border/20">
        <div className="flex gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="w-6.5 h-6.5 text-chart-2 hover:bg-chart-2/10 hover:text-chart-2"
            onClick={() => onCall(customer.id)}
            title="Start Telugu AI Call"
          >
            <PhoneCall size={11} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="w-6.5 h-6.5 text-chart-4 hover:bg-chart-4/10 hover:text-chart-4"
            onClick={() => onWhatsApp(customer.id)}
            title="Coordinate WhatsApp"
          >
            <MessageCircle size={11} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="w-6.5 h-6.5 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => onSchedule(customer.id)}
            title="Schedule Callback"
          >
            <CalendarClock size={11} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="w-6.5 h-6.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            onClick={() => onEmail(customer.id)}
            title="Dispatch Invoice Email"
          >
            <Mail size={11} />
          </Button>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="h-6 px-2 text-[9px] gap-0.5 border-primary/20 hover:border-primary/50 text-primary hover:text-primary"
          onClick={() => onView(customer.id)}
        >
          Exporter Hub <ArrowRight size={8} />
        </Button>
      </div>
    </div>
  );
});
