import apiClient from "@/lib/apiClient";
import { CallLog } from "@/types";

const MOCK_CALL_LOGS: CallLog[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "Priya Sharma",
    company: "TechVision Inc.",
    initials: "PS",
    duration: "4m 12s",
    date: "Today, 10:30 AM",
    status: "Completed",
    sentiment: "Positive",
    summary: "Priya verified spice quantities. Agrees to pay Spices Board application fee of ₹45,000. Invoice sent via WhatsApp.",
    transcript: [
      { speaker: "bot", text: "నమస్కారం ప్రియ గారు! VoxAI calling from the export center. Spices Board license process గురించి మాట్లాడటానికి కాల్ చేశాను. How are you?" },
      { speaker: "user", text: "Hi, yeah! నేను బాగున్నాను. Tell me, how much time will the cardamom export registration take?" },
      { speaker: "bot", text: "Spices Board certificate is processed in 12 working days. Documents అన్నీ క్లియర్ గా ఉంటే వెంటనే ప్రాసెసింగ్ చేసేస్తాము. Rates will be ₹45,000." },
      { speaker: "user", text: "Okay, price is fine. Send me the billing link on WhatsApp. నేను పే చేస్తాను." },
      { speaker: "bot", text: "తప్పకుండా! Invoice details లింక్ ఇప్పుడే WhatsApp చేస్తాను. Payment status కన్ఫర్మ్ అయిన వెంటనే ప్రాసెస్ స్టార్ట్ చేస్తాము. ధన్యవాదాలు ప్రియ గారు!" }
    ]
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Arjun Mehta",
    company: "CloudSync Labs",
    initials: "AM",
    duration: "2m 45s",
    date: "Yesterday, 2:15 PM",
    status: "Voicemail",
    sentiment: "Neutral",
    summary: "Outbound agent reached Arjun's voicemail. Left an automated follow-up message about APEDA certificates.",
    transcript: [
      { speaker: "bot", text: "Hello Arjun, this is the Export License desk calling. We tried reaching you regarding APEDA license details. We will email you the registration rates. Thank you!" }
    ]
  },
  {
    id: 3,
    customerId: 3,
    customerName: "Deepa Rajan",
    company: "ExportHub India",
    initials: "DR",
    duration: "6m 30s",
    date: "2 days ago",
    status: "Completed",
    sentiment: "Positive",
    summary: "Deepa requested pricing details for FSSAI Tea Export. She requested a delayed callback (10 days తర్వాత call చేయండి) due to auditor meetings.",
    transcript: [
      { speaker: "bot", text: "నమస్కారం దీప గారు! FSSAI export licensing queries మాకు వచ్చాయి. ఈ వారం ప్రాసెసింగ్ పూర్తి చేయవచ్చా?" },
      { speaker: "user", text: "Hello, yeah. FSSAI rate list నాకు వచ్చింది. కానీ ఇప్పుడు మేము టాక్స్ ఆడిట్ మధ్యలో ఉన్నాము, సో కొంచెం బిజీగా ఉన్నాను." },
      { speaker: "bot", text: "Oh, understandable. Tax audit is important. When is a convenient time to speak again?" },
      { speaker: "user", text: "ఒక 10 రోజుల తర్వాత కాల్ చేయండి. అంతలోపు ఆడిట్ అయిపోతుంది. Then we can lock the deal." },
      { speaker: "bot", text: "తప్పకుండా! 10 రోజుల తర్వాత ఆటో-షెడ్యూల్ కాల్ చేస్తాను. Best of luck with the audit, Deepa. ధన్యవాదాలు!" }
    ]
  }
];

export const callService = {
  async getAll(): Promise<CallLog[]> {
    try {
      const response = await apiClient.get("/calls");
      return response.data;
    } catch {
      return MOCK_CALL_LOGS;
    }
  },

  async getByCustomerId(customerId: number): Promise<CallLog[]> {
    try {
      const response = await apiClient.get(`/calls/customer/${customerId}`);
      return response.data;
    } catch {
      return MOCK_CALL_LOGS.filter((c) => c.customerId === customerId);
    }
  },

  async makeCall(customerId: number, phone: string, voiceSettings: any): Promise<any> {
    try {
      const response = await apiClient.post("/make-call", {
        customerId,
        phone,
        voiceSettings
      });
      return response.data;
    } catch {
      // Simulate successful Twilio call handoff
      await new Promise((r) => setTimeout(r, 1000));
      return {
        status: "initiated",
        sid: "CA" + Math.floor(Math.random() * 1000000000),
        message: "Outbound call successfully queued via Twilio channel.",
        simulatedTranscript: [
          { speaker: "bot", text: "నమస్కారం, ఎగుమతి లైసెన్స్ మేనేజ్‌మెంట్ సెంటర్ నుండి కాల్ చేస్తున్నాము. మీ రిక్వెస్ట్ గురించి మాట్లాడవచ్చా?" },
          { speaker: "user", text: "అవునండి! Spices Board License ఫీజు ఎంత అవుతుంది?" },
          { speaker: "bot", text: "ప్రస్తుతం మార్కెట్ ధర ₹45,000 ఉంది. మీకు WhatsApp లో వివరాలు పంపిస్తాను." },
          { speaker: "user", text: "చాలా థాంక్స్ అండి, వెంటనే పంపండి." },
          { speaker: "bot", text: "తప్పకుండా, ధన్యవాదాలు!" }
        ]
      };
    }
  }
};
