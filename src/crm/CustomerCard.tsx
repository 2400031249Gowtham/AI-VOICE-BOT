"use client";

import React from "react";
import { Customer } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PhoneCall, MessageCircle, CalendarClock, Mail, ArrowRight, TrendingUp } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onCall: (id: number) => void;
  onWhatsApp: (id: number) => void;
  onSchedule: (id: number) => void;
  onView: (id: number) => void;
  onEmail: (id: number) => void;
}

const statusColors: Record<string, string> = {
  Hot: "bg-destructive/10 text-destructive border-destructive/20",
  Warm: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Cold: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Converted: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Future Prospect": "bg-primary/10 text-primary border-primary/20",
};

const interestColors: Record<string, string> = {
  High: "text-chart-2 bg-chart-2/10 border-chart-2/20",
  Medium: "text-chart-4 bg-chart-4/10 border-chart-4/20",
  Low: "text-muted-foreground bg-secondary/50 border-border"
};

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onCall,
  onWhatsApp,
  onSchedule,
  onView,
  onEmail
}) => {
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
            <Badge variant="outline" className={`text-[8px] px-1.5 py-0 h-4 ${statusColors[customer.status]}`}>
              {customer.status}
            </Badge>
            <Badge variant="outline" className={`text-[8px] px-1 py-0 h-3.5 ${interestColors[customer.interestLevel]}`}>
              {customer.interestLevel} Interest
            </Badge>
          </div>
        </div>

        {/* Call Info / Callback */}
        <div className="grid grid-cols-2 gap-2 my-2.5 pt-2 border-t border-border/20 text-[9px]">
          <div>
            <span className="text-muted-foreground block uppercase font-semibold">Callback Date</span>
            <span className="font-medium text-foreground block truncate mt-0.5">{customer.futureCallbackDate || "Unscheduled"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block uppercase font-semibold">Last Interaction</span>
            <span className="font-medium text-foreground block truncate mt-0.5">{customer.lastContact}</span>
          </div>
        </div>

        {/* Last convo summary excerpt */}
        <div className="mb-2">
          <p className="text-[10px] text-muted-foreground italic line-clamp-2 h-7 leading-relaxed">
            "{customer.lastInteractionSummary}"
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
};
