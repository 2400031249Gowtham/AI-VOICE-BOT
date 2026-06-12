"use client";

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo, useRef, ReactNode } from "react";
import { Customer, CallLog, FollowUp, MarketRate, MessageLog, TimelineEvent, Settings } from "@/types";
import { customerService } from "@/services/customerService";
import { callService } from "@/services/callService";
import { followupService } from "@/services/followupService";
import { analyticsService } from "@/services/analyticsService";
import { activityService } from "@/services/activityService";
import { API_BASE } from "@/lib/config";

// Default operational settings
const DEFAULT_SETTINGS: Settings = {
  twilioSid: "AC7281092837",
  twilioToken: "••••••••••••••••••••••••",
  twilioNumber: "+1 (501) 555-0199",
  openaiKey: "sk-proj-••••••••••••••••••••••••",
  elevenLabsKey: "el-••••••••••••••••••••••••",
  voiceId: "21m00Tcm4TlvDq8ikWAM", // Priya neural ID
  personality: "Professional, polite, speaks in mixed Telugu + English (Teleglish) with high empathy. Focuses on exporter license assistance.",
  teluguAccentWeight: 0.85,
  followUpDelayDays: 10,
  rateThresholdAlerts: true,
  autoInvoicing: false,
  tamilMode: false,
  memoryEngine: "Advanced Contextual Memory",
  emotionalResponse: "Empathetic/Helpful",
  exportKeywords: "RO, RODTEP, RoSCTL, DGFT, license, RCMC, export rebate",
  whatsappAutoSend: true,
  emailAutoSend: false,
  callbackScheduler: true,
  industryMode: "Export Licensing"
};

// Real operational export license pricing for India
const INITIAL_MARKET_RATES: MarketRate[] = [
  {
    id: "ro",
    licenseName: "RO Scheme License Registration",
    category: "Export License",
    currentRate: 24500,
    previousRate: 25000,
    weeklyTrend: "down",
    changePercent: -2.0,
    dailyFluctuation: -100,
    description: "Reconciliation Office licensing for customs and duty compliance."
  },
  {
    id: "rodtep",
    licenseName: "RODTEP Scheme Registration",
    category: "Rebate Claim",
    currentRate: 15500,
    previousRate: 15000,
    weeklyTrend: "up",
    changePercent: 3.3,
    dailyFluctuation: 150,
    description: "Rebate of Duties and Taxes on Exported Products. Essential for claiming duty credits on steel, tech, and chemicals."
  },
  {
    id: "rosctl",
    licenseName: "RoSCTL Licensing Setup",
    category: "Rebate Claim",
    currentRate: 18500,
    previousRate: 18500,
    weeklyTrend: "stable",
    changePercent: 0,
    dailyFluctuation: 0,
    description: "Rebate of State and Central Taxes and Levies. Specially mandated for textile, apparel, and garments shipping."
  },
  {
    id: "dt",
    licenseName: "Duty Drawback Setup",
    category: "Duty Incentive",
    currentRate: 12000,
    previousRate: 11500,
    weeklyTrend: "up",
    changePercent: 4.3,
    dailyFluctuation: 200,
    description: "Customs duty drawback tracking and application support for eligible exporters."
  },
  {
    id: "tp",
    licenseName: "Transit Permit (Export Permit)",
    category: "Export Clearance",
    currentRate: 8500,
    previousRate: 8000,
    weeklyTrend: "up",
    changePercent: 6.2,
    dailyFluctuation: 100,
    description: "Required for inter-state transit and port customs clearance."
  },
  {
    id: "spices",
    licenseName: "Spices Board CRES Setup",
    category: "Commodity Board",
    currentRate: 45000,
    previousRate: 42000,
    weeklyTrend: "up",
    changePercent: 7.1,
    dailyFluctuation: 400,
    description: "Certificate of Registration as Exporter of Spices. Mandatory for exporting cardamom, chilli, ginger, and turmeric."
  },
  {
    id: "apeda",
    licenseName: "APEDA Registration (RCMC)",
    category: "Agricultural Products",
    currentRate: 22000,
    previousRate: 23500,
    weeklyTrend: "down",
    changePercent: -6.3,
    dailyFluctuation: -300,
    description: "Required for export of scheduled agricultural products like mangoes, rice, onions, and floriculture."
  },
  {
    id: "iec",
    licenseName: "IEC DGFT Registration",
    category: "General Registry",
    currentRate: 2500,
    previousRate: 2500,
    weeklyTrend: "stable",
    changePercent: 0,
    dailyFluctuation: 0,
    description: "Importer Exporter Code issued by DGFT. The absolute foundation for any global trade operations in India."
  }
];

export interface ActiveCallState {
  customerId: string;
  customerName: string;
  phone: string;
  status: "ringing" | "connected" | "completed" | "failed";
  duration: number;
  transcript: { speaker: "bot" | "user"; text: string }[];
}

const EMPTY_STATS = {
  totalCalls: 0,
  activeLeads: 0,
  aiConversations: 0,
  followupsToday: 0,
  callsChange: "0%",
  leadsChange: "0%",
  conversationsChange: "0%",
  followupsChange: "0 pending",
  callSuccessRate: "0.0%",
  aiVoiceStatus: "Online",
  voiceQueue: "0 calls",
  marketTrendSummary: "Live tracking active. Go to Market rates to update pricing parameters for Spices, Textile and Agri commodities."
};

const EMPTY_CHARTS = {
  performanceOverview: [],
  weeklyCalls: [],
  sentimentData: [],
  leadConversion: []
};

interface CRMContextType {
  customers: Customer[];
  calls: CallLog[];
  followups: FollowUp[];
  activities: any[];
  marketRates: MarketRate[];
  settings: Settings;
  stats: any;
  charts: any;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  activeCall: ActiveCallState | null;
  currentUser: { email: string; name: string; company?: string } | null;
  onboardingCompleted: boolean;

  fetchData: () => Promise<void>;
  addCustomer: (customer: Partial<Customer>) => Promise<Customer | undefined>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<Customer | undefined>;
  deleteCustomer: (id: string) => Promise<void>;
  triggerOutboundCall: (customerId: string) => Promise<void>;
  terminateCall: () => void;
  sendWhatsApp: (customerId: string, content: string) => Promise<void>;
  sendEmail: (customerId: string, subject: string, content: string) => Promise<void>;
  updateFollowupStatus: (id: string, status: "Pending" | "Scheduled" | "Completed" | "Missed") => Promise<void>;
  addFollowup: (followup: Partial<FollowUp>) => Promise<FollowUp | undefined>;
  updateMarketRate: (id: string, currentRate: number) => Promise<void>;
  saveSettings: (settings: Settings) => void;
  login: (user: { email: string; name: string; company?: string }) => void;
  logout: () => void;
  setOnboardingCompleted: (val: boolean) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; company?: string } | null>(null);
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(true);
  
  // Safe Array Defaults
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [marketRates, setMarketRates] = useState<MarketRate[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  
  const [stats, setStats] = useState<any>(EMPTY_STATS);
  const [charts, setCharts] = useState<any>(EMPTY_CHARTS);
  
  const [loading, setLoading] = useState<Record<string, boolean>>({ global: true });
  const [error, setError] = useState<Record<string, string | null>>({});
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);

  const [mounted, setMounted] = useState(false);

  // Stats aggregator
  const getRealStats = (currentCustomers: Customer[], currentFollowups: FollowUp[], currentCalls: CallLog[]) => {
    const totalCalls = (currentCalls || []).length;
    const activeLeads = (currentCustomers || []).filter(c => c.status === "Hot" || c.status === "Warm").length;
    const aiConversations = totalCalls;
    const followupsToday = (currentFollowups || []).filter(f => f.status === "Pending").length;
    return {
      ...EMPTY_STATS,
      totalCalls,
      activeLeads,
      aiConversations,
      followupsToday,
      callsChange: totalCalls > 0 ? "+100%" : "0%",
      leadsChange: activeLeads > 0 ? "+100%" : "0%",
      conversationsChange: aiConversations > 0 ? "+100%" : "0%",
      followupsChange: `${followupsToday} pending`,
      callSuccessRate: totalCalls > 0 ? "100%" : "0.0%",
    };
  };

  // Initialization & Auth
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("voxai_auth_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          
          const email = parsedUser.email;
          const storedSettings = localStorage.getItem(`voxai_${email}_settings`);
          if (storedSettings) setSettings(JSON.parse(storedSettings));
          
          // Load market rates from DB instead of localStorage
          
          const storedOnboarded = localStorage.getItem(`voxai_${email}_onboarded`);
          setOnboardingCompletedState(storedOnboarded === "true");
        } catch {
          console.warn("Failed to parse user data from localStorage");
        }
      } else if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/login";
      }
    }
  }, []);

  const login = useCallback((user: { email: string; name: string; company?: string }) => {
    setCurrentUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("voxai_auth_user", JSON.stringify(user));
      const email = user.email;
      
      const storedSettings = localStorage.getItem(`voxai_${email}_settings`);
      setSettings(storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS);
      
      // Market rates will be loaded dynamically from DB
      
      const storedOnboarded = localStorage.getItem(`voxai_${email}_onboarded`);
      setOnboardingCompletedState(storedOnboarded === "true");
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("voxai_current_user");
      window.location.href = "/login";
    }
    setCurrentUser(null);
  }, []);

  const setOnboardingCompleted = useCallback((val: boolean) => {
    setOnboardingCompletedState(val);
    if (typeof window !== "undefined") {
      // Read currentUser from state at call time via functional pattern
      setCurrentUser((cur) => {
        if (cur) {
          localStorage.setItem(`voxai_${cur.email}_onboarded`, val ? "true" : "false");
        }
        return cur; // don't mutate
      });
    }
  }, []);

  const saveSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("voxai_auth_user");
      const emailKey = u ? JSON.parse(u).email : "default";
      localStorage.setItem(`voxai_${emailKey}_settings`, JSON.stringify(newSettings));
    }
  }, []);

  // Main Data Fetch — wrapped in useCallback so consumer components get a stable reference
  const fetchData = useCallback(async () => {
    console.log("[CRMStore] fetchData start", { mounted, customersLength: customers.length });
    setLoading((prev) => ({ ...prev, global: true }));
    setError((prev) => ({ ...prev, global: null }));
    
    try {
      const [custData, callsData, statsData, chartsData, activitiesData, followupsData, ratesData] = await Promise.all([
        customerService.getAllCustomers().catch(() => []),
        callService.getAll().catch(() => []),
        analyticsService.getStats().catch(() => EMPTY_STATS),
        analyticsService.getCharts().catch(() => EMPTY_CHARTS),
        activityService.getRecentActivities().catch(() => []),
        followupService.getAll().catch(() => []),
        fetch(API_BASE + "/api/market-rates").then(res => res.json()).catch(() => []),
      ]);

      const safeCustData = Array.isArray(custData) ? custData : [];
      const mappedCusts = safeCustData.map((c: any) => ({
        ...c,
        id: String(c.id || c._id || ""),
        name: c.customerName || c.name || "Unknown",
        status: c.leadScore || "Warm",
        interestLevel: c.leadScore === "Hot" ? "High" : c.leadScore === "Warm" ? "Medium" : c.leadScore === "Cold" ? "Low" : "Medium",
        preferredLanguage: c.preferredLanguage || "Teleglish",
        value: c.value || "0",
        lastContact: c.lastContact || "Never",
        calls: c.calls ? Number(c.calls) : 0,
        lastInteractionSummary: c.lastInteractionSummary || "",
        aiSummary: c.aiSummary || "",
        location: c.location || "Unknown City",
        leadScore: c.leadScore === "Hot" ? 95 : c.leadScore === "Warm" ? 75 : c.leadScore === "Cold" ? 30 : c.leadScore === "Future Prospect" ? 50 : 60,
        initials: (c.customerName || c.name || "U").substring(0, 2).toUpperCase(),
        licenseType: c.licenseType || (c.company?.toLowerCase().includes("textile") ? "RoSCTL" : c.company?.toLowerCase().includes("spice") ? "Spices Board" : "RODTEP"),
        availabilityStatus: c.availabilityStatus || (c.leadScore === "Hot" ? "Available" : "Unavailable"),
        lastRateDiscussed: c.lastRateDiscussed ? Number(c.lastRateDiscussed) : 15500,
        nextFollowupDate: c.nextFollowupDate || null,
        whatsappSent: c.whatsappSent !== undefined ? !!c.whatsappSent : false
      }));

      const safeCalls = Array.isArray(callsData) ? callsData : [];
      const mappedCalls = safeCalls.map((c: any) => ({
        ...c,
        id: String(c.id || c._id || ""),
        customerId: String(c.customerId || ""),
        customerName: c.customerName || "Unknown Customer",
        company: c.company || "Unknown Company",
        initials: (c.customerName || "U").substring(0, 2).toUpperCase(),
        sentiment: (c.sentiment || "Neutral") as any,
        summary: c.summary || c.aiResponse || "No summary generated for this call.",
        duration: String(c.duration || "0:00"),
        date: c.date ? new Date(c.date).toLocaleDateString() : new Date().toLocaleDateString(),
        status: (c.status || "Completed") as any
      }));

      const safeFollowups = Array.isArray(followupsData) ? followupsData : [];
      const mappedFollowups = safeFollowups.map((f: any) => ({
        ...f,
        id: String(f.id || f._id || ""),
        customerId: String(f.customerId || ""),
        status: f.status || "Pending",
        priority: f.priority || "Medium",
        type: f.type || "Call",
        initials: f.initials || (f.customerName || "U").substring(0, 2).toUpperCase()
      }));

      console.log("[CRMStore] fetchData success", {
        customerCount: mappedCusts.length,
        followupCount: mappedFollowups.length,
        callCount: mappedCalls.length,
      });
      setCustomers(mappedCusts);
      setFollowups(mappedFollowups);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setCalls(mappedCalls);
      setMarketRates(Array.isArray(ratesData) ? ratesData : []);
      setStats(getRealStats(mappedCusts, mappedFollowups, mappedCalls));
      setCharts(chartsData || EMPTY_CHARTS);
      
    } catch (err) {
      console.error("Failed to load global data", err);
      setError((prev) => ({ ...prev, global: "Failed to load CRM data" }));
    } finally {
      setLoading((prev) => ({ ...prev, global: false }));
    }
  }, []);

  // Initial Fetch Effect
  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted, fetchData]);

  // CRUD Operations
  const addCustomer = useCallback(async (customer: Partial<Customer>) => {
    setLoading((prev) => ({ ...prev, customers: true }));
    try {
      const res = await customerService.createCustomer(customer as any);
      await fetchData();
      return res;
    } catch (e) {
      console.error("Add customer error:", e);
    } finally {
      setLoading((prev) => ({ ...prev, customers: false }));
    }
  }, [fetchData]);

  const updateCustomer = useCallback(async (id: string, customerDetails: Partial<Customer>) => {
    try {
      const res = await customerService.updateCustomer(id, customerDetails as any);
      await fetchData();
      return res;
    } catch (e) {
      console.error("Update customer error:", e);
    }
  }, [fetchData]);

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      await customerService.deleteCustomer(id);
      await fetchData();
    } catch (e) {
      console.error("Delete customer error:", e);
    }
  }, [fetchData]);

  const updateFollowupStatus = useCallback(async (id: string, status: "Pending" | "Scheduled" | "Completed" | "Missed") => {
    try {
      await followupService.updateStatus(id, status);
      await fetchData();
    } catch (e) {
      console.error("Update followup error:", e);
    }
  }, [fetchData]);

  const addFollowup = useCallback(async (followup: Partial<FollowUp>) => {
    try {
      const res = await followupService.create(followup);
      await fetchData();
      return res;
    } catch(e) {
      console.error("Add followup error:", e);
    }
  }, [fetchData]);

  const updateMarketRate = useCallback(async (id: string, currentRate: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/market-rates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentRate })
      });
      if (!response.ok) throw new Error("Failed to update market rate");
      await fetchData();
    } catch (e) {
      console.error("Update market rate error:", e);
    }
  }, [fetchData]);

  const sendWhatsApp = useCallback(async (customerId: string, content: string) => {
    try {
      await customerService.updateCustomer(customerId, { lastContact: "Today (WhatsApp)", requestedWhatsApp: true } as any);
      
      await fetch(API_BASE + "/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId,
          channel: "whatsapp",
          sender: "AI",
          text: content
        })
      });
      
      await fetchData();
    } catch (e) {
      console.error("Send WhatsApp error:", e);
    }
  }, [fetchData]);

  const sendEmail = useCallback(async (customerId: string, subject: string, content: string) => {
    try {
      await customerService.updateCustomer(customerId, { lastContact: "Today (Email)" } as any);
      
      await fetch(API_BASE + "/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId,
          channel: "email",
          sender: "AI",
          text: `Subject: ${subject}\n\n${content}`
        })
      });
      
      await fetchData();
    } catch (e) {
      console.error("Send Email error:", e);
    }
  }, [fetchData]);

  // Use refs for values that triggerOutboundCall needs but shouldn't
  // trigger useCallback re-creation when they change.
  const customersRef = useRef(customers);
  customersRef.current = customers;
  const callsRef = useRef(calls);
  callsRef.current = calls;
  const followupsRef = useRef(followups);
  followupsRef.current = followups;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const triggerOutboundCall = useCallback(async (customerId: string) => {
    const cust = customersRef.current.find((c) => c.id === customerId);
    if (!cust) return;

    const initialCall: ActiveCallState = {
      customerId,
      customerName: cust.name,
      phone: cust.phone,
      status: "ringing",
      duration: 0,
      transcript: []
    };

    setActiveCall(initialCall);

    try {
      const savedCall = await callService.makeCall(customerId, cust.phone, settingsRef.current);
      const mappedCall = {
        id: String(savedCall.id || savedCall._id || Date.now()),
        customerId: String(savedCall.customerId || customerId),
        customerName: savedCall.customerName || cust.name,
        company: savedCall.company || cust.company,
        initials: (savedCall.customerName || cust.name || "U").substring(0, 2).toUpperCase(),
        sentiment: (savedCall.sentiment || "Neutral") as any,
        summary: savedCall.summary || savedCall.aiResponse || "AI outbound call initiated.",
        duration: String(savedCall.duration || "0:00"),
        date: savedCall.date ? new Date(savedCall.date).toLocaleDateString() : new Date().toLocaleDateString(),
        status: (savedCall.status || savedCall.callStatus || "Completed") as any,
        transcript: savedCall.transcript || []
      };

      setCalls((prevCalls) => {
        const nextCalls = [mappedCall, ...prevCalls];
        // Update stats inline with functional state setter
        setStats(getRealStats(customersRef.current, followupsRef.current, nextCalls));
        return nextCalls;
      });
    } catch (e) {
      console.error("Call session start error:", e);
    }

    setTimeout(() => {
      setActiveCall((prev) => {
        if (!prev || prev.customerId !== customerId) return prev;
        return { ...prev, status: "connected" };
      });
    }, 2000);
  }, []);

  const terminateCall = useCallback(async () => {
    setActiveCall((prev) => {
      if (!prev) return prev;
      return null;
    });
    setTimeout(() => {
      fetchData();
    }, 500);
  }, [fetchData]);

  useEffect(() => {
    // Timer and transcript simulation removed. They are now handled locally in dialer components.
  }, [activeCall?.status]);

  // Memoize the context value so consumers only re-render when the data
  // they actually use changes — not when unrelated provider state updates.
  const contextValue = useMemo(() => ({
    customers,
    calls,
    followups,
    activities,
    marketRates,
    settings,
    stats,
    charts,
    loading,
    error,
    activeCall,
    currentUser,
    onboardingCompleted,

    fetchData,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    triggerOutboundCall,
    terminateCall,
    sendWhatsApp,
    sendEmail,
    updateFollowupStatus,
    addFollowup,
    updateMarketRate,
    saveSettings,
    login,
    logout,
    setOnboardingCompleted
  }), [
    customers, calls, followups, activities, marketRates, settings,
    stats, charts, loading, error, activeCall, currentUser, onboardingCompleted,
    fetchData, addCustomer, updateCustomer, deleteCustomer,
    triggerOutboundCall, terminateCall, sendWhatsApp, sendEmail,
    updateFollowupStatus, addFollowup, updateMarketRate, saveSettings,
    login, logout, setOnboardingCompleted
  ]);

  return (
    <CRMContext.Provider value={contextValue}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRMStore = <T = CRMContextType,>(selector?: (state: CRMContextType) => T): T => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error("useCRMStore must be used within a CRMProvider");
  }
  return selector ? selector(context) : context as unknown as T;
};
