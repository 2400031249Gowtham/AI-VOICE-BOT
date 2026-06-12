"use client";

import React, { useState } from "react";
import { MessageLog, Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, FileText, CalendarRange, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatPanelProps {
  customer: Customer;
  messages: MessageLog[];
  onSendMessage: (text: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  customer,
  messages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const loadTemplate = (type: "invoice" | "checklist" | "callback") => {
    if (type === "invoice") {
      setInputText(`నమస్కారం ${customer.name}, మీ ఎగుమతి లైసెన్స్ ఫీజు వివరాలు: Spices Board setup - ₹45,000. దయచేసి క్రింది లింక్ ద్వారా చెల్లించండి: vxa.in/pay/7812`);
    } else if (type === "checklist") {
      setInputText(`నమస్కారం, లైసెన్స్‌కు కావలసిన PAN, GST మరియు కంపెనీ రిజిస్ట్రేషన్ సర్టిఫికేట్‌లను (company registry docs) ఈ వాట్స్అప్ నంబర్‌కు పంపించగలరు. ధన్యవాదాలు!`);
    } else {
      setInputText(`నమస్కారం, మీ కోరిక మేరకు, మీ టాక్స్ ఆడిట్ (tax audit) పూర్తయిన తర్వాత వచ్చే వారం కాల్ చేస్తాము. ఆల్ ది బెస్ట్!`);
    }
  };

  return (
    <div className="flex flex-col justify-between h-[360px] text-left">
      
      {/* Scrollable messages history container */}
      <div className="flex-1 bg-secondary/15 rounded-xl border border-border p-3.5 space-y-3 overflow-y-auto max-h-[220px]">
        {messages.map((msg) => {
          const isSent = msg.status === "Sent" || msg.status === "Delivered" || msg.status === "Read";
          return (
            <div 
              key={msg.id}
              className={`flex flex-col gap-1 text-[11px] p-2.5 rounded-xl max-w-[85%] border ${
                isSent 
                  ? "ml-auto bg-primary/10 border-primary/20 text-foreground" 
                  : "bg-secondary/40 border-border text-foreground/80"
              }`}
            >
              <div className="flex justify-between items-center text-[8px] font-bold text-muted-foreground gap-3">
                <span className="uppercase">{msg.type}</span>
                <div className="flex items-center gap-1">
                  <span>{msg.timestamp}</span>
                  <span>•</span>
                  <span className={msg.status === "Read" ? "text-chart-2" : "text-chart-4"}>{msg.status}</span>
                </div>
              </div>
              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center text-center text-muted-foreground text-[10px] py-8">
            No active WhatsApp coordination logs. Use the templates below to send files or invoice links.
          </div>
        )}
      </div>

      {/* Input controls and quick actions */}
      <div className="pt-3 space-y-2.5">
        <div className="flex gap-2">
          <Input 
            placeholder="Type a Teleglish or Telugu message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="flex-1 h-8.5 text-xs bg-secondary/40 border-border focus:border-primary/50 text-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="sm" className="h-8.5 text-xs gap-1.5 px-3" onClick={handleSend}>
            <Send size={11} /> Send
          </Button>
        </div>

        {/* Message Templates */}
        <div className="flex gap-1.5 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6.5 text-[8.5px] gap-1 border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => loadTemplate("invoice")}
          >
            <FileText size={10} /> Billing Link
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6.5 text-[8.5px] gap-1 border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => loadTemplate("checklist")}
          >
            <CheckCircle2 size={10} /> Document Checklist
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6.5 text-[8.5px] gap-1 border-primary/20 text-primary hover:bg-primary/5"
            onClick={() => loadTemplate("callback")}
          >
            <CalendarRange size={10} /> Confirm Callback
          </Button>
        </div>
      </div>

    </div>
  );
};
