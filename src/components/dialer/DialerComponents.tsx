"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCRMStore } from "@/store/crmStore";

export const CallStatusBadge = React.memo(() => {
  const status = useCRMStore(s => s.activeCall?.status ?? "idle");
  return (
    <Badge variant="outline" className="text-[8px] bg-secondary text-foreground">
      {status === "ringing" ? "Ringing..." : "Connected"}
    </Badge>
  );
});

export const AssistantCallStatusBadge = React.memo(() => {
  const status = useCRMStore(s => s.activeCall?.status ?? "idle");
  const isActive = status !== "idle";
  return (
    <Badge variant="outline" className={`text-[9px] px-2 h-5 gap-1 ${
      isActive ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" : "bg-secondary text-muted-foreground"
    }`}>
      {isActive ? "Trunk Busy" : "Trunk Idle"}
    </Badge>
  );
});

export const CallTimerDisplay = React.memo(() => {
  const status = useCRMStore(s => s.activeCall?.status ?? "idle");
  const isConnected = status === "connected";
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConnected) {
      timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [isConnected]);

  return (
    <div className="text-2xl font-black text-primary font-mono tracking-wider tabular-nums my-1.5 drop-shadow-[0_0_8px_rgba(120,119,255,0.2)]">
      {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
    </div>
  );
});

export const AssistantCallTimerDisplay = React.memo(() => {
  const status = useCRMStore(s => s.activeCall?.status ?? "idle");
  const isConnected = status === "connected";
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConnected) {
      timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [isConnected]);

  return (
    <span className="font-mono">
      {status !== "idle" ? `Duration: ${duration}s` : "Trunk: Channel 1 Idle"}
    </span>
  );
});

export const CallTranscript = React.memo(({ variant = "default" }: { variant?: "default" | "assistant" }) => {
  const status = useCRMStore(s => s.activeCall?.status ?? "idle");
  const customerName = useCRMStore(s => s.activeCall?.customerName ?? "");
  const isConnected = status === "connected";
  
  const [transcript, setTranscript] = useState<{ speaker: "bot" | "user"; text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever transcript grows
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    if (isConnected) {
      const timeline = [
        { delay: 1, speaker: "bot" as const, text: `నమస్కారం ${customerName}! Vox నుండి ప్రియ మాట్లాడుతున్నాను. మీ export license రిక్వెస్ట్ కి సహాయం చేయడానికి కాల్ చేశాను. How are you today?` },
        { delay: 5, speaker: "user" as const, text: "Hi Priya! I am good. అవునండి, నాకు APEDA/RoSCTL license rates గురించి కొంచెం చెప్పగలరా?" },
        { delay: 10, speaker: "bot" as const, text: "తప్పకుండా! APEDA setup ఫీజు ₹22,000, మరియు RoSCTL textile rebate setup ₹18,500 అవుతుంది. 10 to 12 working days లో వచ్చేస్తుంది. వాట్స్అప్ లో ఇన్వాయిస్ వివరాలు పంపించమంటారా?" },
        { delay: 16, speaker: "user" as const, text: "Okay, price is reasonable. కానీ మాకు audit పనులు జరుగుతున్నాయి. Can you call me back next week so we can finalise?" },
        { delay: 21, speaker: "bot" as const, text: "తప్పకుండా, మీ టాక్స్ ఆడిట్ (tax audit) పనులు పూర్తి అవ్వనివ్వండి. I will schedule a follow-up call. మీ ఈమెయిల్ కి అవసరమైన డాక్యుమెంట్స్ లిస్ట్ పంపించాను. ధన్యవాదాలు!" },
        { delay: 26, speaker: "user" as const, text: "Super Priya. ఈమెయిల్ చెక్ చేస్తాను. Thank you, మళ్ళీ మాట్లాడుదాం. ధన్యవాదాలు!" },
        { delay: 29, speaker: "bot" as const, text: "ధన్యవాదాలు, నమస్కారం! Have a great day!" }
      ];

      timeline.forEach((line) => {
        timers.push(setTimeout(() => {
          setTranscript(prev => {
            if (prev.some(t => t.text === line.text)) return prev;
            return [...prev, { speaker: line.speaker, text: line.text }];
          });
        }, line.delay * 1000));
      });
    } else {
      setTranscript([]);
    }

    return () => timers.forEach(clearTimeout);
  }, [isConnected, customerName]);

  if (variant === "assistant") {
    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-normal">
        {transcript.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-2.5 ${msg.speaker === "user" ? "flex-row-reverse text-right" : ""}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.speaker === "bot" 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(120,119,255,0.1)]" 
                : "bg-secondary border border-border"
            }`}>
              {msg.speaker === "bot" ? <Bot size={12} /> : <User size={12} />}
            </div>
            <div className={`max-w-[80%] p-2.5 rounded-2xl ${
              msg.speaker === "bot"
                ? "bg-primary/10 text-primary border border-primary/20 rounded-tl-sm text-left"
                : "bg-zinc-800 text-zinc-100 border border-zinc-700/50 rounded-tr-sm text-left"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isConnected && transcript.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-[10px] animate-pulse">
            Establishing secure audio stream to exporter...
          </div>
        )}
        <div ref={endRef} />
      </div>
    );
  }

  // ── Default variant: tall scrollable chat bubbles ──────────────────────────
  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-[240px] overflow-y-auto p-3.5 space-y-3 text-[12px] leading-relaxed"
    >
      {transcript.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot size={14} className="text-primary animate-pulse" />
          </div>
          <p className="text-[11px]">
            {isConnected ? "Speech synthesis loading..." : "Waiting for call to connect..."}
          </p>
        </div>
      ) : (
        transcript.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              line.speaker === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold mb-0.5 ${
              line.speaker === "bot"
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "bg-secondary border border-border text-muted-foreground"
            }`}>
              {line.speaker === "bot" ? "AI" : "EX"}
            </div>
            {/* Bubble */}
            <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
              line.speaker === "bot"
                ? "bg-primary text-primary-foreground rounded-bl-sm shadow-sm shadow-primary/20"
                : "bg-secondary/80 text-foreground border border-border/60 rounded-br-sm"
            }`}>
              {line.text}
            </div>
          </div>
        ))
      )}
      {/* Auto-scroll anchor */}
      <div ref={endRef} />
    </div>
  );
});

const CallPulseRing = () => {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 my-3 mx-auto">
      {/* Ring 3 */}
      <motion.div
        className="absolute w-full h-full rounded-full bg-primary/5 border border-primary/10"
        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      {/* Ring 2 */}
      <motion.div
        className="absolute w-full h-full rounded-full bg-primary/10 border border-primary/20"
        animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
      />
      {/* Ring 1 */}
      <motion.div
        className="absolute w-full h-full rounded-full bg-primary/15 border border-primary/30"
        animate={{ scale: [1, 1.2], opacity: [0.9, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.2, ease: "easeOut" }}
      />
      {/* Center avatar/phone icon */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg border border-primary-foreground/15 shadow-primary/25">
        <Bot size={18} className="animate-pulse" />
      </div>
    </div>
  );
};

export const DialerModal = React.memo(() => {
  const activeCall = useCRMStore(s => s.activeCall);
  const terminateCall = useCRMStore(s => s.terminateCall);
  const customers = useCRMStore(s => s.customers);

  if (!activeCall) return null;

  const activeCustomer = customers.find(c => c.id === activeCall.customerId);
  const companyName = activeCustomer?.company || "Export License Prospect";
  const isConnected = activeCall.status === "connected";

  return (
    <div className="flex flex-col h-full bg-secondary/10 rounded-xl border border-primary/20 overflow-hidden">

      {/* ── Compact header: name + status + timer ── */}
      <div className="flex-shrink-0 p-3.5 bg-primary/8 border-b border-primary/15 flex items-center gap-3">
        {/* Icon */}
        <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-primary" />
        </div>
        {/* Name + company */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate leading-tight">{activeCall.customerName}</p>
          <p className="text-[10px] text-muted-foreground truncate">{companyName}</p>
        </div>
        {/* Timer + status badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <CallTimerDisplay />
          <CallStatusBadge />
        </div>
      </div>

      {/* ── Trunk active bar ── */}
      <div className="flex-shrink-0 px-3.5 py-1.5 bg-secondary/20 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Twilio Trunk Active</span>
        </div>
        {/* Live waveform — only when connected */}
        {isConnected && (
          <div className="h-4 flex items-center gap-0.5 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-primary/60 rounded-full"
                animate={{ height: [3, 12, 3] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: (i % 5) * 0.1, ease: "easeInOut" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── TRANSCRIPT — flex-1: fills ALL remaining height ── */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="px-3.5 py-1.5 flex-shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Live Conversation Transcript</span>
        </div>
        <CallTranscript />
      </div>

      {/* ── Hang Up — fixed at bottom ── */}
      <div className="flex-shrink-0 p-3 border-t border-border/40 bg-secondary/20">
        <Button
          variant="destructive"
          className="w-full h-9 text-xs font-semibold gap-2 rounded-xl"
          onClick={terminateCall}
        >
          Hang Up Call
        </Button>
      </div>
    </div>
  );
});

export const AssistantDialer = React.memo(() => {
  const activeCall = useCRMStore(s => s.activeCall);

  if (!activeCall) return null;

  return (
    <>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot size={14} className="text-primary" />
          </div>
          <div>
            <h3 className="text-xs font-bold">Active speech monitoring</h3>
            <p className="text-[9px] text-muted-foreground">Monitor Twilio speech synthesis stream in real-time</p>
          </div>
        </div>
        
        <AssistantCallStatusBadge />
      </div>

      <CallTranscript variant="assistant" />

      <div className="p-3 bg-secondary/15 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">Audio stream output: Priya Neural Voice</span>
        <AssistantCallTimerDisplay />
      </div>
    </>
  );
});
