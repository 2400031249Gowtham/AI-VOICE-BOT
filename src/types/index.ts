export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  status: "Hot" | "Warm" | "Cold" | "Future Prospect" | "Converted";
  interestLevel: "High" | "Medium" | "Low";
  preferredLanguage: "Telugu" | "English" | "Teleglish";
  value: string;
  lastContact: string;
  calls: number;
  initials: string;
  leadScore: number;
  lastInteractionSummary: string;
  aiSummary?: string;
  companyDetails?: string;
  notes?: string;
  lastCalledDaysAgo?: number;
  requestedWhatsApp?: boolean;
  futureCallbackDate?: string;
  invoiceStatus?: "Paid" | "Unpaid" | "Pending" | "None";
  marketHistory?: { date: string; description: string; rate: number }[];
  licenseType?: string;
  availabilityStatus?: string;
  lastRateDiscussed?: number;
  nextFollowupDate?: string;
  whatsappSent?: boolean;
}

export interface TimelineEvent {
  id: string;
  customerId: string;
  type: "call" | "whatsapp" | "email" | "note";
  date: string;
  description: string;
  details?: string;
  sentiment?: "Positive" | "Neutral" | "Negative";
}

export interface CallLog {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  initials: string;
  duration: string;
  date: string;
  status: "Completed" | "No Answer" | "Busy" | "Voicemail";
  sentiment: "Positive" | "Neutral" | "Negative";
  summary: string;
  transcript: string | { speaker: "bot" | "user" | "AI" | "Customer"; text: string; time?: string | Date }[];
  leadClassification?: string;
  interestLevel?: "High" | "Medium" | "Low";
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  initials: string;
  time: string;
  type: "Call" | "Email" | "WhatsApp";
  status: "Pending" | "Scheduled" | "Completed" | "Missed";
  priority: "High" | "Medium" | "Low";
  aiNotes: string;
  category?: "callback" | "invoice_reminder" | "doc_reminder";
}

export interface MarketRate {
  id: string;
  licenseName: string;
  category: string;
  currentRate: number;
  previousRate: number;
  weeklyTrend: "up" | "down" | "stable";
  changePercent: number;
  description: string;
  dailyFluctuation?: number;
}

export interface MessageLog {
  id: string;
  customerId: string;
  type: "whatsapp" | "email";
  content: string;
  timestamp: string;
  status: "Sent" | "Delivered" | "Read" | "Failed";
  invoiceId?: string;
  amount?: string;
}

export interface Settings {
  twilioSid: string;
  twilioToken: string;
  twilioNumber: string;
  openaiKey: string;
  elevenLabsKey: string;
  voiceId: string;
  personality: string;
  teluguAccentWeight: number;
  followUpDelayDays: number;
  rateThresholdAlerts: boolean;
  autoInvoicing: boolean;
  tamilMode?: boolean;
  memoryEngine?: string;
  emotionalResponse?: string;
  exportKeywords?: string;
  whatsappAutoSend?: boolean;
  emailAutoSend?: boolean;
  callbackScheduler?: boolean;
  industryMode?: string;
  sidebar?: 'Expanded' | 'Collapsed';
  theme?: 'Light' | 'Dark';
}
