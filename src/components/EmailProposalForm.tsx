import React, { useState } from "react";
import { Mail, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailProposalFormProps {
  onSend: (subject: string, content: string) => Promise<void>;
  mode?: "minimal" | "full";
}

const EmailProposalFormComponent = ({ onSend, mode = "full" }: EmailProposalFormProps) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const handleSend = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) return;
    await onSend(emailSubject, emailContent);
    setEmailSubject("");
    setEmailContent("");
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {mode === "minimal" && (
        <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
          <Mail size={13} className="text-primary" /> Send Email Proposal
        </h4>
      )}
      <div className="space-y-2">
        <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Email Subject</label>
        <Input 
          placeholder="Invoice details for your export license"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="h-8.5 text-[11px] bg-secondary/40 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl"
        />
      </div>
      <div className="space-y-2 flex-1">
        <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Email Content</label>
        <textarea 
          placeholder="Type email body details..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className={`w-full text-[11px] bg-secondary/40 border border-border/40 rounded-xl p-2.5 resize-none focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all ${mode === "full" ? "h-[240px]" : "h-20"}`}
        />
      </div>
      
      {mode === "full" ? (
        <div className="flex items-center justify-between gap-3">
          <Button size="sm" className="h-9 text-xs" onClick={handleSend}>
            <Mail size={12} /> Send Email
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => { setEmailSubject(""); setEmailContent(""); }}>
            Clear
          </Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" className="w-full h-8 text-[10px] rounded-xl gap-1 bg-secondary text-foreground hover:bg-secondary/75" onClick={handleSend}>
          <SendHorizontal size={10} /> Dispatch Proposal
        </Button>
      )}
    </div>
  );
};

export default React.memo(EmailProposalFormComponent);
