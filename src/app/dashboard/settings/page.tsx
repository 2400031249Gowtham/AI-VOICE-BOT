"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCrm } from "@/hooks/useCrm";
import { 
  User, Bell, Shield, Key, Mic, Globe, Cpu, CreditCard, 
  Save, Phone, CheckCircle2, Sliders, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tabs = [
  { id: "voice", label: "AI Voice Personality", icon: Mic },
  { id: "integrations", label: "Integrations & API", icon: Cpu },
  { id: "workspace", label: "Workspace Environment", icon: Globe },
  { id: "profile", label: "User Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing Plans", icon: CreditCard },
  { id: "security", label: "Portal Security", icon: Shield },
];

export default function SettingsPage() {
  const { settings, saveSettings, workspaceMode, setWorkspaceMode } = useCrm();
  const [activeTab, setActiveTab] = useState("voice");

  // Local form states synced with store on load
  const [twilioSid, setTwilioSid] = useState(settings.twilioSid);
  const [twilioToken, setTwilioToken] = useState(settings.twilioToken);
  const [twilioNumber, setTwilioNumber] = useState(settings.twilioNumber);
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey);
  const [elevenLabsKey, setElevenLabsKey] = useState(settings.elevenLabsKey);
  const [voiceId, setVoiceId] = useState(settings.voiceId);
  const [personality, setPersonality] = useState(settings.personality);
  const [teluguAccentWeight, setTeluguAccentWeight] = useState(settings.teluguAccentWeight);
  const [followUpDelayDays, setFollowUpDelayDays] = useState(settings.followUpDelayDays);
  const [rateThresholdAlerts, setRateThresholdAlerts] = useState(settings.rateThresholdAlerts ?? true);
  const [autoInvoicing, setAutoInvoicing] = useState(settings.autoInvoicing ?? false);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setTwilioSid(settings.twilioSid);
    setTwilioToken(settings.twilioToken);
    setTwilioNumber(settings.twilioNumber);
    setOpenaiKey(settings.openaiKey);
    setElevenLabsKey(settings.elevenLabsKey);
    setVoiceId(settings.voiceId);
    setPersonality(settings.personality);
    setTeluguAccentWeight(settings.teluguAccentWeight);
    setFollowUpDelayDays(settings.followUpDelayDays);
    setRateThresholdAlerts(settings.rateThresholdAlerts ?? true);
    setAutoInvoicing(settings.autoInvoicing ?? false);
  }, [settings]);

  const handleSave = () => {
    saveSettings({
      twilioSid,
      twilioToken,
      twilioNumber,
      openaiKey,
      elevenLabsKey,
      voiceId,
      personality,
      teluguAccentWeight,
      followUpDelayDays,
      rateThresholdAlerts,
      autoInvoicing
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <PageContainer>
      {/* Save Success Notification */}
      {showToast && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50 glass px-4 py-3 rounded-xl border border-primary/30 text-xs text-foreground flex items-center gap-2 shadow-[0_0_20px_hsl(234_89%_74%/0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <CheckCircle2 size={16} className="text-chart-2" />
          <span>Settings saved and synchronized with AI outbound trunks.</span>
        </motion.div>
      )}

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Configure API credentials, Twilio numbers, and Telugu voice personality presets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Navigation Tabs */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <tab.icon size={15} className={isActive ? "text-primary" : "text-muted-foreground"} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </GlassCard>
        </motion.div>

        {/* Settings Tab Content */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {/* TAB 1: AI VOICE PERSONALITY */}
          {activeTab === "voice" && (
            <GlassCard className="p-6">
              <div className="mb-6 border-b border-border/50 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">AI Voice & Personality presets</h2>
                  <p className="text-xs text-muted-foreground">Customize language dialects, speaking styles and automated callback rules.</p>
                </div>
                <Button className="gap-1.5 text-xs h-8.5" onClick={handleSave}>
                  <Save size={13} /> Save Voice Presets
                </Button>
              </div>

              <div className="space-y-6">
                {/* Voice Selection */}
                <div>
                  <h3 className="text-xs font-bold mb-3 flex items-center gap-2 text-primary uppercase tracking-wider">
                    <Mic size={14} /> Voice Model Selection
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "21m00Tcm4TlvDq8ikWAM", name: "Priya (Telugu - Neural)", desc: "Formal tone, fluent Vijayawada professional dialect." },
                      { id: "AZnzlk1XvdvUeBnXmlld", name: "Karthik (Telugu - Neural)", desc: "Guntur agribusiness tone, energetic." },
                      { id: "EXAVITQu4vr4xnSDXIFr", name: "Sarah (English - Neural)", desc: "Corporate style, standard US accents." },
                    ].map((item) => {
                      const isSelected = voiceId === item.id;
                      return (
                        <div 
                          key={item.id} 
                          onClick={() => setVoiceId(item.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-border/50 bg-secondary/30 hover:border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold">{item.name}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-normal">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Behavioral settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
                    <Sliders size={14} /> Dialect & Timing Config
                  </h3>
                  
                  {/* Slider Accent weight */}
                  <div className="p-4 bg-secondary/30 border border-border/50 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <Label className="font-semibold">Telugu Code-Switch Bias (Teleglish vs Pure Telugu)</Label>
                      <span className="text-primary font-mono">{(teluguAccentWeight * 100).toFixed(0)}% Telugu</span>
                    </div>
                    <input 
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={teluguAccentWeight}
                      onChange={(e) => setTeluguAccentWeight(parseFloat(e.target.value))}
                      className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Higher weight biases conversational outputs to Telugu expressions. Lower values incorporate more technical English vocabulary (e.g., invoice details, license rules).
                    </p>
                  </div>

                  {/* Delay config */}
                  <div className="p-4 bg-secondary/30 border border-border/50 rounded-xl flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-semibold">Auto-followup schedule default delay</Label>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Configure default calendar delay in days when callback is booked.</p>
                    </div>
                    <select 
                      value={followUpDelayDays} 
                      onChange={(e) => setFollowUpDelayDays(parseInt(e.target.value) || 10)}
                      className="bg-secondary/60 border border-border rounded-xl text-xs p-1.5 outline-none"
                    >
                      <option value="5">5 days</option>
                      <option value="10">10 days</option>
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>

                  {/* Market Rate fluctuation alerts toggle */}
                  <div className="p-4 bg-secondary/30 border border-border/50 rounded-xl flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-semibold">Rate Fluctuation Alerts</Label>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Notify AI operator when export license market rates change over 5%.</p>
                    </div>
                    <Switch checked={rateThresholdAlerts} onCheckedChange={setRateThresholdAlerts} />
                  </div>

                  {/* Auto invoicing toggle */}
                  <div className="p-4 bg-secondary/30 border border-border/50 rounded-xl flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-semibold">Automatic WhatsApp Invoicing</Label>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Auto-dispatch payment links on WhatsApp upon successful voice negotiations.</p>
                    </div>
                    <Switch checked={autoInvoicing} onCheckedChange={setAutoInvoicing} />
                  </div>

                  {/* Personality prompt */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">AI Personality & Core Prompts Instruction</Label>
                    <textarea 
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      className="w-full bg-secondary/30 border border-border text-xs p-3 rounded-xl h-24 resize-none focus:outline-none focus:border-primary/50 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* TAB: WORKSPACE ENVIRONMENT */}
          {activeTab === "workspace" && (
            <GlassCard className="p-6">
              <div className="mb-6 border-b border-border/50 pb-4 text-left">
                <h2 className="text-base font-bold">Workspace Environment</h2>
                <p className="text-xs text-muted-foreground">Manage your active production environment and configure preloaded data settings.</p>
              </div>

              <div className="space-y-6 text-left">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Globe size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        Current Mode: {workspaceMode === "demo" ? "Explore Demo Workspace" : "Create Your Own Workspace"}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Configure the preloaded dataset for agricultural spice and tea export licenses.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/40 border border-border/40 text-xs leading-relaxed text-muted-foreground">
                    {workspaceMode === "demo" ? (
                      <span>
                        <strong>Demo Workspace:</strong> Your interface is pre-populated with realistic exporter client records (e.g. <em>Anil Reddy</em>, <em>Priya Sharma</em>), follow-up timelines, simulated Telugu voice outbound dial logs, and active communication histories. This allows you to explore the system capabilities right away.
                      </span>
                    ) : (
                      <span>
                        <strong>Real Workspace:</strong> Your database starts with an empty slate. Preloaded demo profiles are removed, letting you manually input new exporter leads, manage direct callbacks, and build customized AI voice templates from scratch.
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    {workspaceMode === "demo" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8.5 border-destructive/20 hover:border-destructive text-destructive hover:bg-destructive/5"
                        onClick={() => {
                          if (window.confirm("Switch to Real User Workspace? This will purge all current preloaded demo data and give you a clean slate. Your custom inputs will start from scratch.")) {
                            setWorkspaceMode("real");
                          }
                        }}
                      >
                        Switch to Real Workspace
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="text-xs h-8.5"
                        onClick={() => {
                          if (window.confirm("Load Demo Workspace? This will delete all of your current custom exporter data and load the preconfigured agricultural export-license demo database.")) {
                            setWorkspaceMode("demo");
                          }
                        }}
                      >
                        Explore Demo Workspace
                      </Button>
                    )}
                  </div>
                </div>

                {/* Reset button */}
                <div className="p-4 rounded-xl border border-dashed border-border/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Factory Reset Workspace Data</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                      Reset all browser settings, purge local caches, and clear custom exporter lists to reboot your CRM.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="text-xs h-8.5" 
                    onClick={() => {
                      if (window.confirm("Factory reset? This deletes all your local storage configurations, API credentials, calls history, and exporter profiles permanently. This action cannot be undone.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    Reset Workspace
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* TAB 2: INTEGRATIONS & API */}
          {activeTab === "integrations" && (
            <GlassCard className="p-6">
              <div className="mb-6 border-b border-border/50 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">API Integration Credentials</h2>
                  <p className="text-xs text-muted-foreground">Setup Twilio telecom settings and LLM keys for automated calling trunks.</p>
                </div>
                <Button className="gap-1.5 text-xs h-8.5" onClick={handleSave}>
                  <Save size={13} /> Save Credentials
                </Button>
              </div>

              <div className="space-y-4 max-w-xl">
                
                {/* Twilio configurations */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-chart-2" />
                    <div>
                      <h3 className="text-xs font-bold">Twilio Telecom settings</h3>
                      <p className="text-[9px] text-muted-foreground">Used to dispatch outbound calls and secure active trunks.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[10px] text-muted-foreground mb-1 block">Account SID</Label>
                      <Input type="text" value={twilioSid} onChange={(e) => setTwilioSid(e.target.value)} className="bg-secondary/50 text-xs h-8.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Auth Token</Label>
                        <Input type="password" value={twilioToken} onChange={(e) => setTwilioToken(e.target.value)} className="bg-secondary/50 text-xs h-8.5" />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground mb-1 block">Twilio Phone Number</Label>
                        <Input type="text" value={twilioNumber} onChange={(e) => setTwilioNumber(e.target.value)} className="bg-secondary/50 text-xs h-8.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* OpenAI configurations */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Cpu size={16} className="text-primary" />
                    <div>
                      <h3 className="text-xs font-bold">OpenAI GPT Settings</h3>
                      <p className="text-[9px] text-muted-foreground">Powers conversational logic and sentiment indexing.</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1 block">Secret API Key</Label>
                    <Input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} className="bg-secondary/50 text-xs h-8.5" />
                  </div>
                </div>

                {/* Elevenlabs configurations */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Mic size={16} className="text-chart-3" />
                    <div>
                      <h3 className="text-xs font-bold">ElevenLabs Settings</h3>
                      <p className="text-[9px] text-muted-foreground">Generates neural voice audio for client dialogues.</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground mb-1 block">Speech Synthesis API Key</Label>
                    <Input type="password" value={elevenLabsKey} onChange={(e) => setElevenLabsKey(e.target.value)} className="bg-secondary/50 text-xs h-8.5" />
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Fallbacks */}
          {["profile", "notifications", "billing", "security"].includes(activeTab) && (
            <GlassCard className="p-12 flex flex-col items-center justify-center text-center">
              <Shield size={36} className="text-muted-foreground mb-3 opacity-20" />
              <h2 className="text-xs font-bold mb-1">Module Coming Soon</h2>
              <p className="text-[11px] text-muted-foreground">Account and security controls are being integrated under active workspace packages.</p>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </PageContainer>
  );
}
