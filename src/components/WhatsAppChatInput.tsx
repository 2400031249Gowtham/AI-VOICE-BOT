import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WhatsAppChatInputProps {
  onSend: (text: string) => Promise<void>;
}

const WhatsAppChatInputComponent = ({ onSend }: WhatsAppChatInputProps) => {
  const [inputText, setInputText] = useState("");

  const handleSend = async () => {
    if (!inputText.trim()) return;
    await onSend(inputText);
    setInputText("");
  };

  return (
    <div className="p-3.5 bg-white/40 border-t border-border/30 backdrop-blur-xs">
      <div className="flex gap-2">
        <Input 
          placeholder="Type WhatsApp message in Telugu / English..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 h-9.5 text-[11px] bg-white/80 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl text-foreground"
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        />
        <Button size="sm" className="h-9.5 text-xs px-4 rounded-xl shadow-xs bg-primary hover:opacity-95 text-white font-medium gap-1" onClick={handleSend}>
          <Send size={11} /> Send
        </Button>
      </div>
    </div>
  );
};

export default React.memo(WhatsAppChatInputComponent);
