import {
  LayoutDashboard,
  MessageSquare,
  Users,
  PhoneCall,
  CalendarCheck,
  BarChart3,
  Bot,
  Settings,
  TrendingUp,
  ClipboardList,
  Mail,
  Bell,
  MessageSquare as MessageIcon,
  type LucideIcon
} from "lucide-react";
import { Sparkles } from "lucide-react"; // using Sparkles for AI Relationship Workspace

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline";
}

export const mainNav: NavItem[] = [
  { id: "relationship", label: "AI Relationship", icon: Sparkles, href: "/dashboard" },
  { id: "conversation", label: "Conversation", icon: MessageSquare, href: "/dashboard/conversations" },
  { id: "customers", label: "Customer Intelligence", icon: Users, href: "/dashboard/customers" },
  { id: "followups", label: "Follow-up Operations", icon: CalendarCheck, href: "/dashboard/followups" },
  { id: "communication", label: "Communication", icon: PhoneCall, href: "/dashboard/calls" },
  { id: "assistant", label: "AI Assistant", icon: Bot, href: "/dashboard/assistant" },
];

export const modulesNav: NavItem[] = [
  { id: "market", label: "Market Rates", icon: TrendingUp, href: "/dashboard/market" },
  { id: "licenses", label: "License Tracker", icon: ClipboardList, href: "/dashboard/licenses" },
  { id: "whatsapp", label: "WhatsApp Hub", icon: MessageIcon, href: "/dashboard/whatsapp" },
  { id: "email", label: "Email Dispatch", icon: Mail, href: "/dashboard/email" },
  { id: "leads", label: "Lead Intelligence", icon: BarChart3, href: "/dashboard/leads" },
  { id: "callbacks", label: "Callback Queue", icon: Bell, href: "/dashboard/callbacks" },
];

export const bottomNav: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
];
