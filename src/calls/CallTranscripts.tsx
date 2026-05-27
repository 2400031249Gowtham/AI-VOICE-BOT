"use client";

import React, { useState } from "react";
import { CallLog } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Clock, Calendar, CheckSquare, Play, Pause, AlertCircle, Info, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallTranscriptsProps {
  call: CallLog;
}

const sentimentColors: Record<string, string> = {
  Positive: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Neutral: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Negative: "bg-destructive/10 text-destructive border-destructive/20",
};

export const CallTranscripts: React.FC<CallTranscriptsProps> = ({ call }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-4 text-left flex flex-col h-full">
      {/* Playback Controls widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-secondary/30 border border-border/50 gap-4">
        <div>
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Acquisition Call Recording</span>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-semibold">
            <span>{call.duration}</span>
            <span>•</span>
            <span>{call.date}</span>
          </div>
        </div>

        {/* Mock progress scrubber */}
        <div className="flex items-center gap-2.5 bg-secondary/50 p-1 rounded-lg border border-border flex-1 max-w-[280px]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </Button>
          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden relative">
            {isPlaying && (
              <div className="absolute left-0 top-0 h-full w-full bg-primary rounded-full animate-progress-glow" style={{ animationDuration: "12s" }} />
            )}
            {!isPlaying && <div className="absolute left-0 top-0 h-full w-[25%] bg-primary/50 rounded-full" />}
          </div>
          <span className="text-[9px] font-mono text-muted-foreground min-w-[28px]">
            {isPlaying ? "0:12" : "0:00"}
          </span>
        </div>
      </div>

      {/* Call Summary and lead classification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-3.5 rounded-xl bg-primary/5 border border-primary/15">
          <h4 className="text-[10px] text-primary uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Info size={11}/> AI Call Summary</h4>
          <p className="text-xs text-foreground/80 leading-relaxed">{call.summary}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50 space-y-2">
          <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Lead Analysis</h4>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Classification:</span>
            <Badge variant="outline" className={`text-[9px] ${sentimentColors[call.sentiment]}`}>{call.sentiment}</Badge>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Interest Score:</span>
            <span className="font-semibold text-chart-2">High (85)</span>
          </div>
        </div>
      </div>

      {/* Dialog script list */}
      <div className="space-y-3 flex-1 overflow-hidden">
        <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
          <MessageSquare size={12} /> Exporter Dialect Transcript (Mixed Telugu)
        </h4>
        
        <div className="space-y-4 max-h-[190px] overflow-y-auto pr-1">
          {call.transcript.map((line, idx) => (
            <div key={idx} className={`flex items-start gap-2.5 ${line.speaker === "user" ? "flex-row-reverse text-right" : ""}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-semibold ${
                line.speaker === "bot" ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary border border-border"
              }`}>
                {line.speaker === "bot" ? <Bot size={10} /> : <User size={10} />}
              </div>
              <div className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                line.speaker === "bot"
                  ? "bg-secondary/40 border border-border/50 rounded-tl-none"
                  : "bg-primary text-primary-foreground rounded-tr-none"
              }`}>
                {line.text}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
