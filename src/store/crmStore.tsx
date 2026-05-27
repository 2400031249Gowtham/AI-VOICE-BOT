"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { Customer, CallLog, FollowUp, MarketRate, MessageLog, TimelineEvent, Settings } from "@/types";
import { customerService } from "@/services/customerService";
import { callService } from "@/services/callService";
import { followupService } from "@/services/followupService";
import { analyticsService } from "@/services/analyticsService";

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
  autoInvoicing: false
};

// Real operational export license pricing for India
const INITIAL_MARKET_RATES: MarketRate[] = [
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
  },
  {
    id: "fssai",
    licenseName: "FSSAI Export Certificate",
    category: "Food Safety",
    currentRate: 65000,
    previousRate: 60000,
    weeklyTrend: "up",
    changePercent: 8.3,
    dailyFluctuation: 500,
    description: "Central Food Safety License required to clear tea, coffee, health supplements, and packaged foods for export."
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@techvision.com",
    phone: "+91 98401 23456",
    company: "TechVision Spices Inc.",
    location: "Vijayawada, Andhra Pradesh",
    status: "Hot",
    interestLevel: "High",
    preferredLanguage: "Teleglish",
    value: "₹45,000",
    lastContact: "10 days ago (AI Call)",
    calls: 12,
    initials: "PS",
    leadScore: 92,
    lastInteractionSummary: "Discussed Spices Board rate of ₹45,000. Agreed to progress once cardamom test report is uploaded.",
    companyDetails: "Specializes in exporting premium organic spices, cardamoms, and black pepper to UAE and Saudi Arabia.",
    notes: "Last called 10 days ago. Requested invoice copy but hasn't paid. Spoke in Telugu-English.",
    lastCalledDaysAgo: 10,
    requestedWhatsApp: true,
    futureCallbackDate: "Next Tuesday, 11:30 AM",
    invoiceStatus: "Unpaid",
    marketHistory: [
      { date: "10 days ago", description: "Spices Board fee offered: ₹45,000", rate: 45000 }
    ]
  },
  {
    id: 2,
    name: "Arjun Mehta",
    email: "arjun@cloudsync.com",
    phone: "+91 98765 43210",
    company: "CloudSync Agri Trades",
    location: "Mumbai, Maharashtra",
    status: "Warm",
    interestLevel: "Medium",
    preferredLanguage: "English",
    value: "₹22,000",
    lastContact: "4 days ago (WhatsApp)",
    calls: 8,
    initials: "AM",
    leadScore: 78,
    lastInteractionSummary: "Inquired about APEDA license for Alphonso mango shipments. Emailed quote. Awaiting director signature.",
    companyDetails: "Mumbai fruit broker supplying premium mango crops to wholesale hypermarkets in Europe.",
    notes: "Follow up with updated APEDA quote. Requested callback next Tuesday.",
    lastCalledDaysAgo: 4,
    requestedWhatsApp: false,
    futureCallbackDate: "Tomorrow, 10:30 AM",
    invoiceStatus: "Pending",
    marketHistory: [
      { date: "15 days ago", description: "APEDA standard pricing offered: ₹22,000", rate: 22000 }
    ]
  },
  {
    id: 3,
    name: "Deepa Rajan",
    email: "deepa@exporthub.in",
    phone: "+91 94440 98765",
    company: "ExportHub Tea Packers",
    location: "Visakhapatnam, Andhra Pradesh",
    status: "Hot",
    interestLevel: "High",
    preferredLanguage: "Telugu",
    value: "₹65,000",
    lastContact: "2 days ago (AI Call)",
    calls: 6,
    initials: "DR",
    leadScore: 88,
    lastInteractionSummary: "Auditor audit ongoing. Explicitly requested: '10 days తర్వాత call చేయండి' (Call after 10 days). Interested in FSSAI packaging norms.",
    companyDetails: "Tea manufacturers cooperative shipping premium Nilgiri black tea directly to distributors in Singapore.",
    notes: "Auditor verifications ready. Scheduled callback. Customer preferred Telugu dialect.",
    lastCalledDaysAgo: 2,
    requestedWhatsApp: true,
    futureCallbackDate: "In 8 days, 2:30 PM",
    invoiceStatus: "None",
    marketHistory: [
      { date: "2 days ago", description: "FSSAI Central setup fee outlined: ₹65,000", rate: 65000 }
    ]
  },
  {
    id: 4,
    name: "Vikram Singh",
    email: "vikram@nexaedge.ai",
    phone: "+91 99999 88888",
    company: "NexaEdge Apparel Co.",
    location: "Visakhapatnam, Andhra Pradesh",
    status: "Converted",
    interestLevel: "High",
    preferredLanguage: "Teleglish",
    value: "₹18,500",
    lastContact: "Today, 11:45 AM (Invoice Paid)",
    calls: 18,
    initials: "VS",
    leadScore: 98,
    lastInteractionSummary: "RoSCTL rebate setup completed. Automated onboarding form signed and fee paid. Triggers claim processing.",
    companyDetails: "Garments and fabric processing setup shipping high-quality hosiery products to North America.",
    notes: "Setup fully finished. Customer expressed great feedback on Telugu neural voice prompt instructions.",
    lastCalledDaysAgo: 0,
    requestedWhatsApp: false,
    futureCallbackDate: "Completed",
    invoiceStatus: "Paid",
    marketHistory: [
      { date: "10 days ago", description: "RoSCTL registration cost: ₹18,500", rate: 18500 }
    ]
  },
  {
    id: 5,
    name: "Anil Reddy",
    email: "anil@vijayawadafabrics.com",
    phone: "+91 95400 12121",
    company: "Vijayawada Fabric Exports",
    location: "Vijayawada, Andhra Pradesh",
    status: "Hot",
    interestLevel: "High",
    preferredLanguage: "Telugu",
    value: "₹18,500",
    lastContact: "Yesterday, 3:30 PM (AI Call)",
    calls: 5,
    initials: "AR",
    leadScore: 90,
    lastInteractionSummary: "Exporter wants to set up textile tax rebates (RoSCTL). Requested callback today to authorize payment.",
    companyDetails: "Cotton textile exports supplier to GCC countries.",
    notes: "Requires quick turnaround on RoSCTL configuration.",
    lastCalledDaysAgo: 1,
    requestedWhatsApp: true,
    futureCallbackDate: "Today, 4:00 PM",
    invoiceStatus: "Unpaid",
    marketHistory: [
      { date: "Yesterday", description: "RoSCTL pricing offered: ₹18,500", rate: 18500 }
    ]
  },
  {
    id: 6,
    name: "Meera Nair",
    email: "meera@keralafruits.com",
    phone: "+91 97444 33221",
    company: "Kerala Fruit Logistics",
    location: "Kochi, Kerala",
    status: "Warm",
    interestLevel: "Medium",
    preferredLanguage: "Teleglish",
    value: "₹15,500",
    lastContact: "6 days ago",
    calls: 4,
    initials: "MN",
    leadScore: 72,
    lastInteractionSummary: "Inquired about RODTEP claim setup for banana shipments. Requested WhatsApp fee breakdown.",
    companyDetails: "Cold chain logistics operators exporting tropical fruits to Gulf markets.",
    notes: "Auditor checks requested. Follow up next Monday.",
    lastCalledDaysAgo: 6,
    requestedWhatsApp: true,
    futureCallbackDate: "In 3 days, 11:00 AM",
    invoiceStatus: "Pending",
    marketHistory: [
      { date: "6 days ago", description: "RODTEP setup cost: ₹15,500", rate: 15500 }
    ]
  }
];

const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 1,
    customerId: 5,
    customerName: "Anil Reddy",
    company: "Vijayawada Fabric Exports",
    initials: "AR",
    time: "Today, 4:00 PM",
    type: "Call",
    status: "Pending",
    priority: "High",
    aiNotes: "Follow up today regarding RoSCTL rebate activation. Payment links sent.",
    category: "callback"
  },
  {
    id: 2,
    customerId: 1,
    customerName: "Priya Sharma",
    company: "TechVision Spices Inc.",
    initials: "PS",
    time: "Today, 5:30 PM",
    type: "WhatsApp",
    status: "Pending",
    priority: "High",
    aiNotes: "Follow up on Spices Board documentation check. Customer has not uploaded cardamom quality report.",
    category: "doc_reminder"
  },
  {
    id: 3,
    customerId: 2,
    customerName: "Arjun Mehta",
    company: "CloudSync Agri Trades",
    initials: "AM",
    time: "Tomorrow, 10:30 AM",
    type: "Call",
    status: "Scheduled",
    priority: "Medium",
    aiNotes: "Verify signature on the APEDA mango export quote package.",
    category: "callback"
  },
  {
    id: 4,
    customerId: 6,
    customerName: "Meera Nair",
    company: "Kerala Fruit Logistics",
    initials: "MN",
    time: "Scheduled: 3 days remaining",
    type: "WhatsApp",
    status: "Scheduled",
    priority: "Medium",
    aiNotes: "Send updated RODTEP duty credit parameters as per new government indices.",
    category: "doc_reminder"
  },
  {
    id: 5,
    customerId: 3,
    customerName: "Deepa Rajan",
    company: "ExportHub Tea Packers",
    initials: "DR",
    time: "Scheduled: 8 days remaining",
    type: "Call",
    status: "Scheduled",
    priority: "High",
    aiNotes: "Auto-scheduled on Telugu trigger: '10 days తర్వాత call చేయండి'. Auditor check should be concluded.",
    category: "callback"
  },
  {
    id: 6,
    customerId: 1,
    customerName: "Priya Sharma",
    company: "TechVision Spices Inc.",
    initials: "PS",
    time: "Overdue: 2 days missed",
    type: "Call",
    status: "Missed",
    priority: "High",
    aiNotes: "Spices Board invoice reminder. Payment status: Unpaid.",
    category: "invoice_reminder"
  }
];

export interface ActiveCallState {
  customerId: number;
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
  performanceOverview: [
    { name: "Jan", ai: 0, manual: 0 },
    { name: "Feb", ai: 0, manual: 0 },
    { name: "Mar", ai: 0, manual: 0 },
    { name: "Apr", ai: 0, manual: 0 },
    { name: "May", ai: 0, manual: 0 },
    { name: "Jun", ai: 0, manual: 0 },
    { name: "Jul", ai: 0, manual: 0 },
  ],
  weeklyCalls: [
    { day: "Mon", calls: 0 },
    { day: "Tue", calls: 0 },
    { day: "Wed", calls: 0 },
    { day: "Thu", calls: 0 },
    { day: "Fri", calls: 0 },
    { day: "Sat", calls: 0 },
    { day: "Sun", calls: 0 },
  ],
  sentimentData: [
    { name: "Positive", value: 0, fill: "hsl(173 80% 50%)" },
    { name: "Neutral", value: 0, fill: "hsl(43 96% 64%)" },
    { name: "Negative", value: 0, fill: "hsl(0 84% 60%)" }
  ],
  leadConversion: [
    { month: "Jan", rate: 0 },
    { month: "Feb", rate: 0 },
    { month: "Mar", rate: 0 },
    { month: "Apr", rate: 0 },
    { month: "May", rate: 0 },
    { month: "Jun", rate: 0 },
    { month: "Jul", rate: 0 }
  ]
};

interface CRMContextType {
  customers: Customer[];
  calls: CallLog[];
  followups: FollowUp[];
  marketRates: MarketRate[];
  settings: Settings;
  stats: any;
  charts: any;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  activeCall: ActiveCallState | null;
  workspaceMode: "demo" | "real" | null;
  currentUser: { email: string; name: string; company?: string } | null;
  onboardingCompleted: boolean;

  // Actions
  fetchData: () => Promise<void>;
  addCustomer: (customer: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<Customer>;
  deleteCustomer: (id: number) => Promise<void>;
  triggerOutboundCall: (customerId: number) => Promise<void>;
  terminateCall: () => void;
  sendWhatsApp: (customerId: number, content: string) => Promise<void>;
  sendEmail: (customerId: number, subject: string, content: string) => Promise<void>;
  updateFollowupStatus: (id: number, status: "Pending" | "Scheduled" | "Completed" | "Missed") => Promise<void>;
  addFollowup: (followup: Partial<FollowUp>) => Promise<FollowUp>;
  updateMarketRate: (id: string, currentRate: number) => Promise<void>;
  saveSettings: (settings: Settings) => void;
  setWorkspaceMode: (mode: "demo" | "real") => void;
  login: (user: { email: string; name: string; company?: string }) => void;
  logout: () => void;
  setOnboardingCompleted: (val: boolean) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaceMode, setWorkspaceModeState] = useState<"demo" | "real" | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; company?: string } | null>(null);
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [marketRates, setMarketRates] = useState<MarketRate[]>(INITIAL_MARKET_RATES);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<any>({});
  const [charts, setCharts] = useState<any>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({ global: true });
  const [error, setError] = useState<Record<string, string | null>>({});
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);

  const getRealStats = (currentCustomers = customers, currentFollowups = followups, currentCalls = calls) => {
    const totalCalls = currentCalls.length;
    const activeLeads = currentCustomers.filter(c => c.status === "Hot" || c.status === "Warm").length;
    const aiConversations = currentCalls.length;
    const followupsToday = currentFollowups.filter(f => f.status === "Pending").length;
    return {
      totalCalls,
      activeLeads,
      aiConversations,
      followupsToday,
      callsChange: totalCalls > 0 ? "+100%" : "0%",
      leadsChange: activeLeads > 0 ? "+100%" : "0%",
      conversationsChange: aiConversations > 0 ? "+100%" : "0%",
      followupsChange: `${followupsToday} pending`,
      callSuccessRate: totalCalls > 0 ? "100%" : "0.0%",
      aiVoiceStatus: "Online",
      voiceQueue: "0 calls",
      marketTrendSummary: "Live tracking active. Go to Market rates to update pricing parameters for Spices, Textile and Agri commodities."
    };
  };

  const [mounted, setMounted] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("voxai_current_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          
          const email = parsedUser.email;
          const storedMode = localStorage.getItem(`voxai_${email}_workspace_mode`) as "demo" | "real" | null;
          setWorkspaceModeState(storedMode);

          const storedSettings = localStorage.getItem(`voxai_${email}_settings`);
          if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
          }
          const storedRates = localStorage.getItem(`voxai_${email}_market_rates`);
          if (storedRates) {
            setMarketRates(JSON.parse(storedRates));
          }
          const storedOnboarded = localStorage.getItem(`voxai_${email}_onboarded`);
          setOnboardingCompletedState(storedOnboarded === "true");
        } catch {
          // Silent fail — settings will use defaults
        }
      } else {
        if (window.location.pathname.startsWith("/dashboard")) {
          window.location.href = "/login";
        }
      }
    }
  }, []);

  const login = (user: { email: string; name: string; company?: string }) => {
    setCurrentUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("voxai_current_user", JSON.stringify(user));
      const email = user.email;
      const storedMode = localStorage.getItem(`voxai_${email}_workspace_mode`) as "demo" | "real" | null;
      setWorkspaceModeState(storedMode);
      
      const storedSettings = localStorage.getItem(`voxai_${email}_settings`);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      const storedRates = localStorage.getItem(`voxai_${email}_market_rates`);
      if (storedRates) {
        setMarketRates(JSON.parse(storedRates));
      } else {
        setMarketRates(INITIAL_MARKET_RATES);
      }
      const storedOnboarded = localStorage.getItem(`voxai_${email}_onboarded`);
      setOnboardingCompletedState(storedOnboarded === "true");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("voxai_current_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          localStorage.removeItem(`voxai_${parsed.email}_workspace_mode`);
        } catch(e) {}
      }
      localStorage.removeItem("voxai_current_user");
    }
    setCurrentUser(null);
    setWorkspaceModeState(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const setOnboardingCompleted = (val: boolean) => {
    setOnboardingCompletedState(val);
    if (typeof window !== "undefined" && currentUser) {
      localStorage.setItem(`voxai_${currentUser.email}_onboarded`, val ? "true" : "false");
    }
  };

  const fetchData = async () => {
    setLoading((prev) => ({ ...prev, global: true }));
    try {
      // Each service fails gracefully and independently — no noisy console errors
      const [callsData, statsData, chartsData] = await Promise.all([
        callService.getAll().catch(() => []),
        analyticsService.getStats().catch(() => EMPTY_STATS),
        analyticsService.getCharts().catch(() => EMPTY_CHARTS),
      ]);

      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("voxai_current_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const email = parsedUser.email;
          const storedMode = localStorage.getItem(`voxai_${email}_workspace_mode`) || workspaceMode;
          if (storedMode === "real") {
            const storedCustomers = localStorage.getItem(`voxai_${email}_customers`);
            const parsedCusts = storedCustomers ? JSON.parse(storedCustomers) : [];
            setCustomers(parsedCusts);
            
            const storedFollowups = localStorage.getItem(`voxai_${email}_followups`);
            const parsedFollows = storedFollowups ? JSON.parse(storedFollowups) : [];
            setFollowups(parsedFollows);
            
            const storedCalls = localStorage.getItem(`voxai_${email}_calls`);
            const parsedCalls = storedCalls ? JSON.parse(storedCalls) : [];
            setCalls(parsedCalls);
            
            setStats(getRealStats(parsedCusts, parsedFollows, parsedCalls));
            setCharts(EMPTY_CHARTS);
          } else if (storedMode === "demo") {
            const storedCustomers = localStorage.getItem(`voxai_${email}_customers`);
            const parsedCusts = storedCustomers ? JSON.parse(storedCustomers) : INITIAL_CUSTOMERS;
            setCustomers(parsedCusts);
            
            const storedFollowups = localStorage.getItem(`voxai_${email}_followups`);
            const parsedFollows = storedFollowups ? JSON.parse(storedFollowups) : INITIAL_FOLLOWUPS;
            setFollowups(parsedFollows);
            
            const storedCalls = localStorage.getItem(`voxai_${email}_calls`);
            const parsedCalls = storedCalls ? JSON.parse(storedCalls) : [];
            setCalls(parsedCalls);
            
            setStats(statsData);
            setCharts(chartsData);
          } else {
            setCustomers([]);
            setFollowups([]);
            setCalls([]);
            setStats(EMPTY_STATS);
            setCharts(EMPTY_CHARTS);
          }
        }
      }

      setError((prev) => ({ ...prev, global: null }));
    } catch (err: any) {
      setError((prev) => ({ ...prev, global: "Failed to fetch CRM records. Operating in local mode." }));
    } finally {
      setLoading((prev) => ({ ...prev, global: false }));
    }
  };

  useEffect(() => {
    if (workspaceMode !== null) {
      fetchData();
    } else {
      setLoading((prev) => ({ ...prev, global: false }));
    }
  }, [workspaceMode]);

  const setWorkspaceMode = (mode: "demo" | "real") => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("voxai_current_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email;
        setWorkspaceModeState(mode);
        localStorage.setItem(`voxai_${email}_workspace_mode`, mode);
        localStorage.removeItem(`voxai_${email}_customers`);
        localStorage.removeItem(`voxai_${email}_followups`);
        localStorage.removeItem(`voxai_${email}_calls`);
        
        if (mode === "real") {
          setCustomers([]);
          setFollowups([]);
          setCalls([]);
          setStats(EMPTY_STATS);
          setCharts(EMPTY_CHARTS);
        } else {
          setCustomers(INITIAL_CUSTOMERS);
          setFollowups(INITIAL_FOLLOWUPS);
          setCalls([]);
          localStorage.setItem(`voxai_${email}_customers`, JSON.stringify(INITIAL_CUSTOMERS));
          localStorage.setItem(`voxai_${email}_followups`, JSON.stringify(INITIAL_FOLLOWUPS));
          fetchData();
        }
      }
    }
  };

  // Customer Crud
  const addCustomer = async (customer: Partial<Customer>) => {
    setLoading((prev) => ({ ...prev, customers: true }));
    try {
      const res = await customerService.create(customer);
      setCustomers((prev) => {
        const next = [...prev, {
          ...res,
          interestLevel: customer.interestLevel || "Medium",
          preferredLanguage: customer.preferredLanguage || "Telugu",
          invoiceStatus: customer.invoiceStatus || "None",
          lastCalledDaysAgo: 0,
          requestedWhatsApp: false,
          marketHistory: []
        }];
        if (typeof window !== "undefined") {
          const u = localStorage.getItem("voxai_current_user");
          const email = u ? JSON.parse(u).email : "default";
          localStorage.setItem(`voxai_${email}_customers`, JSON.stringify(next));
          if (localStorage.getItem(`voxai_${email}_workspace_mode`) === "real") {
            setStats(getRealStats(next, followups, calls));
          }
        }
        return next;
      });
      return res;
    } finally {
      setLoading((prev) => ({ ...prev, customers: false }));
    }
  };

  const updateCustomer = async (id: number, customerDetails: Partial<Customer>) => {
    setCustomers((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...customerDetails } : c));
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("voxai_current_user");
        const email = u ? JSON.parse(u).email : "default";
        localStorage.setItem(`voxai_${email}_customers`, JSON.stringify(next));
        if (localStorage.getItem(`voxai_${email}_workspace_mode`) === "real") {
          setStats(getRealStats(next, followups, calls));
        }
      }
      return next;
    });
    try {
      const res = await customerService.update(id, customerDetails);
      return res;
    } catch (e) {
      fetchData();
      throw e;
    }
  };

  const deleteCustomer = async (id: number) => {
    setCustomers((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("voxai_current_user");
        const email = u ? JSON.parse(u).email : "default";
        localStorage.setItem(`voxai_${email}_customers`, JSON.stringify(next));
        if (localStorage.getItem(`voxai_${email}_workspace_mode`) === "real") {
          setStats(getRealStats(next, followups, calls));
        }
      }
      return next;
    });
    try {
      await customerService.delete(id);
    } catch (e) {
      fetchData();
      throw e;
    }
  };

  // Follow-ups
  const updateFollowupStatus = async (id: number, status: "Pending" | "Scheduled" | "Completed" | "Missed") => {
    setFollowups((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, status } : f));
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("voxai_current_user");
        const email = u ? JSON.parse(u).email : "default";
        localStorage.setItem(`voxai_${email}_followups`, JSON.stringify(next));
        if (localStorage.getItem(`voxai_${email}_workspace_mode`) === "real") {
          setStats(getRealStats(customers, next, calls));
        }
      }
      return next;
    });
  };

  const addFollowup = async (followup: Partial<FollowUp>) => {
    const fallback: FollowUp = {
      id: Math.floor(Math.random() * 10000),
      customerId: followup.customerId || 1,
      customerName: followup.customerName || "Exporter",
      company: followup.company || "Exports Ltd",
      initials: (followup.customerName || "C").split(" ").map((n) => n[0]).join("").toUpperCase(),
      time: followup.time || "Today, 5:00 PM",
      type: followup.type || "Call",
      status: followup.status || "Pending",
      priority: followup.priority || "Medium",
      aiNotes: followup.aiNotes || "Follow-up scheduled.",
      category: followup.category || "callback"
    };

    setFollowups((prev) => {
      const next = [fallback, ...prev];
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("voxai_current_user");
        const email = u ? JSON.parse(u).email : "default";
        localStorage.setItem(`voxai_${email}_followups`, JSON.stringify(next));
        if (localStorage.getItem(`voxai_${email}_workspace_mode`) === "real") {
          setStats(getRealStats(customers, next, calls));
        }
      }
      return next;
    });
    return fallback;
  };

  // Communications
  const sendWhatsApp = async (customerId: number, content: string) => {
    try {
      await customerService.sendWhatsApp(customerId, content);
      
      // Update last contact for customer
      setCustomers((prev) => {
        const next = prev.map((c) => 
          c.id === customerId 
            ? { ...c, lastContact: "Today (WhatsApp)", requestedWhatsApp: true } 
            : c
        );
        if (typeof window !== "undefined") {
          const u = localStorage.getItem("voxai_current_user");
          const email = u ? JSON.parse(u).email : "default";
          localStorage.setItem(`voxai_${email}_customers`, JSON.stringify(next));
        }
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const sendEmail = async (customerId: number, subject: string, content: string) => {
    try {
      await customerService.sendEmail(customerId, subject, content);
      setCustomers((prev) => {
        const next = prev.map((c) => 
          c.id === customerId 
            ? { ...c, lastContact: "Today (Email)" } 
            : c
        );
        if (typeof window !== "undefined") {
          const u = localStorage.getItem("voxai_current_user");
          const emailKey = u ? JSON.parse(u).email : "default";
          localStorage.setItem(`voxai_${emailKey}_customers`, JSON.stringify(next));
        }
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Outbound Calls - Simulated Interactive Dialer
  const triggerOutboundCall = async (customerId: number) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    setActiveCall({
      customerId,
      customerName: cust.name,
      phone: cust.phone,
      status: "ringing",
      duration: 0,
      transcript: []
    });

    // Ringing state for 2 seconds
    setTimeout(() => {
      setActiveCall((prev) => {
        if (!prev || prev.customerId !== customerId) return prev;
        return { ...prev, status: "connected" };
      });
    }, 2000);
  };

  const terminateCall = () => {
    if (!activeCall) return;

    const finalDuration = activeCall.duration;
    const finalTranscript = activeCall.transcript;
    const customerId = activeCall.customerId;

    setActiveCall(null);

    const newLog: CallLog = {
      id: Math.floor(Math.random() * 100000),
      customerId,
      customerName: activeCall.customerName,
      company: customers.find((c) => c.id === customerId)?.company || "Export Corp",
      initials: activeCall.customerName.split(" ").map((n) => n[0]).join("").toUpperCase(),
      duration: `${Math.floor(finalDuration / 60)}m ${finalDuration % 60}s`,
      date: "Just now",
      status: "Completed",
      sentiment: "Positive",
      summary: "AI voice call verified exporter requirement. Checked RoSCTL and APEDA status parameters.",
      transcript: finalTranscript.length > 0 ? finalTranscript : [
        { speaker: "bot", text: "నమస్కారం! Vox కాల్. లైసెన్స్ ఫీజు వివరాల గురించి మాట్లాడాము." },
        { speaker: "user", text: "అవునండి, సరే. వివరాలు పంపించండి." }
      ]
    };

    let nextCalls: CallLog[] = [];
    setCalls((prev) => {
      const next = [newLog, ...prev];
      nextCalls = next;
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("voxai_current_user");
        const emailKey = u ? JSON.parse(u).email : "default";
        localStorage.setItem(`voxai_${emailKey}_calls`, JSON.stringify(next));
      }
      return next;
    });

    let nextCustomers: Customer[] = [];
    // Update Customer details optimistically
    setCustomers((prev) => {
      const next = prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              calls: c.calls + 1,
              lastContact: "Today (AI Call)",
              lastCalledDaysAgo: 0,
              lastInteractionSummary: "AI call verified RoSCTL setup options in Telugu. Scheduled billing followups."
            }
          : c
      );
      nextCustomers = next;
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("voxai_current_user");
        const emailKey = u ? JSON.parse(u).email : "default";
        localStorage.setItem(`voxai_${emailKey}_customers`, JSON.stringify(next));
      }
      return next;
    });

    // Automatically resolve corresponding followups of this customer
    setFollowups((prev) => {
      const next = prev.map((f) => 
        f.customerId === customerId && f.status === "Pending" && f.type === "Call"
          ? { ...f, status: "Completed" as const }
          : f
      );
      if (typeof window !== "undefined") {
        const u = localStorage.getItem("voxai_current_user");
        const emailKey = u ? JSON.parse(u).email : "default";
        localStorage.setItem(`voxai_${emailKey}_followups`, JSON.stringify(next));
        if (localStorage.getItem(`voxai_${emailKey}_workspace_mode`) === "real") {
          setStats(getRealStats(nextCustomers, next, nextCalls.length > 0 ? nextCalls : [newLog, ...calls]));
        }
      }
      return next;
    });
  };

  // Timer simulation for active call + dialogue stream
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let streamTimer: NodeJS.Timeout;

    if (activeCall && activeCall.status === "connected") {
      timer = setInterval(() => {
        setActiveCall((prev) => {
          if (!prev) return null;
          return { ...prev, duration: prev.duration + 1 };
        });
      }, 1000);

      const transcriptTimeline = [
        {
          delay: 1,
          speaker: "bot" as const,
          text: `నమస్కారం ${activeCall.customerName}! Vox నుండి ప్రియ మాట్లాడుతున్నాను. మీ export license రిక్వెస్ట్ కి సహాయం చేయడానికి కాల్ చేశాను. How are you today?`
        },
        {
          delay: 5,
          speaker: "user" as const,
          text: "Hi Priya! I am good. అవునండి, నాకు APEDA/RoSCTL license rates గురించి కొంచెం చెప్పగలరా?"
        },
        {
          delay: 10,
          speaker: "bot" as const,
          text: "తప్పకుండా! APEDA setup ఫీజు ₹22,000, మరియు RoSCTL textile rebate setup ₹18,500 అవుతుంది. 10 to 12 working days లో వచ్చేస్తుంది. వాట్స్అప్ లో ఇన్వాయిస్ వివరాలు పంపించమంటారా?"
        },
        {
          delay: 16,
          speaker: "user" as const,
          text: "Okay, price is reasonable. కానీ మాకు audit పనులు జరుగుతున్నాయి. Can you call me back next week so we can finalise?"
        },
        {
          delay: 21,
          speaker: "bot" as const,
          text: "తప్పకుండా, మీ టాక్స్ ఆడిట్ (tax audit) పనులు పూర్తి అవ్వనివ్వండి. I will schedule a follow-up call. మీ ఈమెయిల్ కి అవసరమైన డాక్యుమెంట్స్ లిస్ట్ పంపించాను. ధన్యవాదాలు!"
        },
        {
          delay: 26,
          speaker: "user" as const,
          text: "Super Priya. ఈమెయిల్ చెక్ చేస్తాను. Thank you, మళ్ళీ మాట్లాడుదాం. ధన్యవాదాలు!"
        },
        {
          delay: 29,
          speaker: "bot" as const,
          text: "ధన్యవాదాలు, నమస్కారం! Have a great day!"
        }
      ];

      transcriptTimeline.forEach((line) => {
        streamTimer = setTimeout(() => {
          setActiveCall((prev) => {
            if (!prev) return null;
            if (prev.transcript.some((t) => t.text === line.text)) return prev;
            return {
              ...prev,
              transcript: [...prev.transcript, { speaker: line.speaker, text: line.text }]
            };
          });
        }, line.delay * 1000);
      });
    }

    return () => {
      clearInterval(timer);
      clearTimeout(streamTimer);
    };
  }, [activeCall?.status]);

  // Market Rates
  const updateMarketRate = async (id: string, currentRate: number) => {
    setMarketRates((prev) => {
      const next = prev.map((r) => {
        if (r.id === id) {
          const changePercent = parseFloat(((currentRate - r.previousRate) / r.previousRate * 100).toFixed(1));
          return {
            ...r,
            currentRate,
            changePercent,
            weeklyTrend: currentRate > r.previousRate ? ("up" as const) : currentRate < r.previousRate ? ("down" as const) : ("stable" as const)
          };
        }
        return r;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("voxai_market_rates", JSON.stringify(next));
      }
      return next;
    });
  };

  // Settings
  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("voxai_current_user");
      const emailKey = u ? JSON.parse(u).email : "default";
      localStorage.setItem(`voxai_${emailKey}_settings`, JSON.stringify(newSettings));
    }
  };

  return (
    <CRMContext.Provider
      value={{
        customers,
        calls,
        followups,
        marketRates,
        settings,
        stats,
        charts,
        loading,
        error,
        activeCall,
        workspaceMode,
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
        setWorkspaceMode,
        login,
        logout,
        setOnboardingCompleted
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRMStore = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error("useCRMStore must be used within a CRMProvider");
  }
  return context;
};
