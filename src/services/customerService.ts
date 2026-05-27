import apiClient from "@/lib/apiClient";
import { Customer, TimelineEvent, MessageLog } from "@/types";

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@techvision.com",
    phone: "+91 98401 23456",
    company: "TechVision Inc.",
    location: "Vijayawada, Andhra Pradesh",
    status: "Hot",
    interestLevel: "High",
    preferredLanguage: "Teleglish",
    value: "₹45,000",
    lastContact: "Today, 10:30 AM",
    calls: 12,
    initials: "PS",
    leadScore: 92,
    lastInteractionSummary: "Priya exports cardamoms to Dubai. She is highly interested in obtaining a Spices Board License. Approved pricing of ₹45,000 in principle.",
    companyDetails: "TechVision Inc. is a leading organic agricultural exporter based out of South India, specializing in premium spices.",
    notes: "Spoke in mixed Telugu-English (Teleglish). Prefers callbacks on weekdays before 2:00 PM."
  },
  {
    id: 2,
    name: "Arjun Mehta",
    email: "arjun@cloudsync.com",
    phone: "+91 98765 43210",
    company: "CloudSync Labs",
    location: "Mumbai, Maharashtra",
    status: "Warm",
    interestLevel: "Medium",
    preferredLanguage: "English",
    value: "₹1,25,000",
    lastContact: "Yesterday, 2:15 PM",
    calls: 8,
    initials: "AM",
    leadScore: 78,
    lastInteractionSummary: "Interested in APEDA registration for mango export. Requested custom quote for multi-site certificates.",
    companyDetails: "CloudSync Labs specializes in software solutions and bulk trade logistics facilitation.",
    notes: "Requires formal approval from board before invoice disbursement."
  },
  {
    id: 3,
    name: "Deepa Rajan",
    email: "deepa@exporthub.in",
    phone: "+91 94440 98765",
    company: "ExportHub India",
    location: "Guntur, Andhra Pradesh",
    status: "Hot",
    interestLevel: "High",
    preferredLanguage: "Telugu",
    value: "₹67,200",
    lastContact: "2 days ago",
    calls: 6,
    initials: "DR",
    leadScore: 88,
    lastInteractionSummary: "Needs FSSAI Export License for tea exports. Highlighted Telugu business communication as a positive experience. Requested callback after 10 days.",
    companyDetails: "ExportHub is a cooperative of tea growers in Nilgiris seeking direct-to-consumer international shipping licenses.",
    notes: "Explicitly requested: '10 days తర్వాత call చేయండి' (Call after 10 days)."
  },
  {
    id: 4,
    name: "Vikram Singh",
    email: "vikram@nexaedge.ai",
    phone: "+91 99999 88888",
    company: "NexaEdge AI",
    location: "Delhi NCR",
    status: "Converted",
    interestLevel: "High",
    preferredLanguage: "English",
    value: "₹2,10,000",
    lastContact: "Today, 11:45 AM",
    calls: 18,
    initials: "VS",
    leadScore: 98,
    lastInteractionSummary: "IEC setup and RCMC membership completed successfully. Customer fully satisfied with automated onboarding.",
    companyDetails: "NexaEdge AI handles high-tech electronics shipping components to Southeast Asia.",
    notes: "Onboarded via our custom fast-track export license bundle."
  },
  {
    id: 5,
    name: "Ramesh Krishnan",
    email: "ramesh@krishnanagri.com",
    phone: "+91 94220 54321",
    company: "Krishnan Agri Exports",
    location: "Visakhapatnam, Andhra Pradesh",
    status: "Future Prospect",
    interestLevel: "Low",
    preferredLanguage: "Telugu",
    value: "₹35,000",
    lastContact: "5 days ago",
    calls: 3,
    initials: "RK",
    leadScore: 55,
    lastInteractionSummary: "Discussed general rates for coir export licensing. Delayed further steps until next financial quarter.",
    companyDetails: "Visakhapatnam-based coir pith manufacturer exporting to Europe.",
    notes: "Wants a follow-up call in 3 months: '3 months తర్వాత follow-up చేద్దాం'."
  }
];

const MOCK_TIMELINES: Record<number, TimelineEvent[]> = {
  1: [
    { id: 101, customerId: 1, type: "note", date: "5 days ago", description: "Lead captured from website inquiry form", details: "Requested information on Spices Board registration rates." },
    { id: 102, customerId: 1, type: "call", date: "4 days ago", description: "Outbound AI Call — Initial Qualification", details: "Priya spoke in Telugu. Expressed urgent need for license due to upcoming shipment.", sentiment: "Positive" },
    { id: 103, customerId: 1, type: "whatsapp", date: "4 days ago", description: "WhatsApp documentation checklist sent", details: "Sent APEDA vs Spices Board license comparisons. Delivery: Read" },
    { id: 104, customerId: 1, type: "call", date: "Today, 10:30 AM", description: "Outbound AI Call — Pricing confirmation", details: "Discussed price rate of ₹45,000. Customer agreed. Scheduled follow-up for billing setup.", sentiment: "Positive" }
  ],
  3: [
    { id: 301, customerId: 3, type: "note", date: "10 days ago", description: "System generated lead score update", details: "Score set to 88 due to high web engagement on FSSAI license criteria." },
    { id: 302, customerId: 3, type: "call", date: "2 days ago", description: "Outbound AI Call — Call back schedule", details: "Deepa requested callback in 10 days. Text excerpt: '10 days తర్వాత call చేయండి. Ipo konjam busy'", sentiment: "Neutral" },
    { id: 303, customerId: 3, type: "whatsapp", date: "2 days ago", description: "WhatsApp confirmation sent", details: "Message: 'నమస్కారం దీప, మీ కోరిక మేరకు 10 రోజుల తర్వాత మళ్లీ సంప్రదిస్తాము.'" }
  ]
};

const MOCK_MESSAGES: Record<number, MessageLog[]> = {
  1: [
    { id: 501, customerId: 1, type: "whatsapp", content: "నమస్కారం ప్రియ, స్పైసెస్ బోర్డ్ లైసెన్స్ పొందడానికి అవసరమైన పత్రాలు: 1. PAN కార్డ్, 2. GST సర్టిఫికేట్. ఏదైనా సహాయం కావాలంటే అడగండి.", timestamp: "4 days ago", status: "Read" },
    { id: 502, customerId: 1, type: "email", content: "Subject: Spices Board Registration Proposal - TechVision Inc. \n\nDear Priya, Here is the official proposal outlining our licensing assistance service for cardamoms export. Total Cost: ₹45,000.", timestamp: "Today, 10:35 AM", status: "Sent" }
  ],
  3: [
    { id: 701, customerId: 3, type: "whatsapp", content: "నమస్కారం దీప, మీ కోరిక మేరకు FSSAI ఎగుమతి లైసెన్స్ వివరాలు సిద్ధం చేయబడ్డాయి. జూన్ మొదటి వారంలో కాల్ చేస్తాము. ధన్యవాదాలు!", timestamp: "2 days ago", status: "Delivered" }
  ]
};

const getStoredTimelines = (): Record<number, TimelineEvent[]> => {
  if (typeof window === "undefined") return MOCK_TIMELINES;
  const stored = localStorage.getItem("voxai_timelines");
  if (stored) {
    try { return JSON.parse(stored); } catch { return MOCK_TIMELINES; }
  }
  localStorage.setItem("voxai_timelines", JSON.stringify(MOCK_TIMELINES));
  return MOCK_TIMELINES;
};

const getStoredMessages = (): Record<number, MessageLog[]> => {
  if (typeof window === "undefined") return MOCK_MESSAGES;
  const stored = localStorage.getItem("voxai_messages");
  if (stored) {
    try { return JSON.parse(stored); } catch { return MOCK_MESSAGES; }
  }
  localStorage.setItem("voxai_messages", JSON.stringify(MOCK_MESSAGES));
  return MOCK_MESSAGES;
};

const saveStoredTimelines = (timelines: Record<number, TimelineEvent[]>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("voxai_timelines", JSON.stringify(timelines));
  }
};

const saveStoredMessages = (messages: Record<number, MessageLog[]>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("voxai_messages", JSON.stringify(messages));
  }
};

export const customerService = {
  async getAll(): Promise<Customer[]> {
    try {
      const response = await apiClient.get("/api/v1/customers");
      return response.data;
    } catch {
      console.warn("Using mock customers");
      return MOCK_CUSTOMERS;
    }
  },

  async getById(id: number): Promise<Customer> {
    try {
      const response = await apiClient.get(`/api/v1/customers/${id}`);
      return response.data;
    } catch {
      const cust = MOCK_CUSTOMERS.find((c) => c.id === id);
      if (!cust) throw new Error("Customer not found");
      return cust;
    }
  },

  async create(customer: Partial<Customer>): Promise<Customer> {
    try {
      const response = await apiClient.post("/api/v1/customers", customer);
      return response.data;
    } catch {
      const newCust: Customer = {
        id: Math.max(...MOCK_CUSTOMERS.map((c) => c.id), 0) + 1,
        name: customer.name || "New Customer",
        email: customer.email || "",
        phone: customer.phone || "",
        company: customer.company || "",
        location: customer.location || "",
        status: customer.status || "Warm",
        interestLevel: customer.interestLevel || "Medium",
        preferredLanguage: customer.preferredLanguage || "Telugu",
        value: customer.value || "₹0",
        lastContact: "Just now",
        calls: 0,
        initials: (customer.name || "NC").split(" ").map((n) => n[0]).join("").toUpperCase(),
        leadScore: customer.leadScore || 50,
        lastInteractionSummary: "New lead created manually.",
      };
      MOCK_CUSTOMERS.push(newCust);
      return newCust;
    }
  },

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    try {
      const response = await apiClient.put(`/api/v1/customers/${id}`, customer);
      return response.data;
    } catch {
      const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Customer not found");
      MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customer };
      return MOCK_CUSTOMERS[index];
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/customers/${id}`);
    } catch {
      const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
      if (index !== -1) MOCK_CUSTOMERS.splice(index, 1);
    }
  },

  async getTimeline(customerId: number): Promise<TimelineEvent[]> {
    try {
      const response = await apiClient.get(`/api/v1/customers/${customerId}/timeline`);
      return response.data;
    } catch {
      const timelines = getStoredTimelines();
      return timelines[customerId] || [
        { id: 999, customerId, type: "note", date: "Just now", description: "No interaction history available." }
      ];
    }
  },

  async getMessages(customerId: number): Promise<MessageLog[]> {
    try {
      const response = await apiClient.get(`/api/v1/customers/${customerId}/messages`);
      return response.data;
    } catch {
      const messages = getStoredMessages();
      return messages[customerId] || [];
    }
  },

  async sendWhatsApp(customerId: number, content: string): Promise<MessageLog> {
    try {
      const response = await apiClient.post(`/api/v1/customers/${customerId}/whatsapp`, { content });
      return response.data;
    } catch {
      const newMsg: MessageLog = {
        id: Math.floor(Math.random() * 10000),
        customerId,
        type: "whatsapp",
        content,
        timestamp: "Just now",
        status: "Sent"
      };
      
      const messages = getStoredMessages();
      if (!messages[customerId]) messages[customerId] = [];
      messages[customerId].unshift(newMsg);
      saveStoredMessages(messages);
      
      // Also add to timeline
      const timelines = getStoredTimelines();
      if (!timelines[customerId]) timelines[customerId] = [];
      timelines[customerId].unshift({
        id: Math.floor(Math.random() * 10000),
        customerId,
        type: "whatsapp",
        date: "Just now",
        description: "WhatsApp message sent",
        details: content.substring(0, 60) + "..."
      });
      saveStoredTimelines(timelines);

      // Simulate network transition to Delivered/Read
      setTimeout(() => {
        newMsg.status = "Read";
        const currentMsgs = getStoredMessages();
        if (currentMsgs[customerId]) {
          const match = currentMsgs[customerId].find(m => m.id === newMsg.id);
          if (match) {
            match.status = "Read";
            saveStoredMessages(currentMsgs);
          }
        }
      }, 3000);

      return newMsg;
    }
  },

  async sendEmail(customerId: number, subject: string, content: string): Promise<MessageLog> {
    try {
      const response = await apiClient.post(`/api/v1/customers/${customerId}/email`, { subject, content });
      return response.data;
    } catch {
      const newMsg: MessageLog = {
        id: Math.floor(Math.random() * 10000),
        customerId,
        type: "email",
        content: `Subject: ${subject}\n\n${content}`,
        timestamp: "Just now",
        status: "Sent"
      };
      
      const messages = getStoredMessages();
      if (!messages[customerId]) messages[customerId] = [];
      messages[customerId].unshift(newMsg);
      saveStoredMessages(messages);
      
      // Also add to timeline
      const timelines = getStoredTimelines();
      if (!timelines[customerId]) timelines[customerId] = [];
      timelines[customerId].unshift({
        id: Math.floor(Math.random() * 10000),
        customerId,
        type: "email",
        date: "Just now",
        description: `Email sent: ${subject}`,
        details: content.substring(0, 60) + "..."
      });
      saveStoredTimelines(timelines);

      return newMsg;
    }
  }
};
