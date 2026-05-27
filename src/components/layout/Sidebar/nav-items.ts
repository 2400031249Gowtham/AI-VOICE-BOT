// src/components/layout/Sidebar/nav-items.ts

import { LayoutDashboard, MessageSquare, Users, PhoneCall, CalendarCheck, BarChart3, Bot, Settings, TrendingUp, type LucideIcon } from "lucide-react";
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
  { id: "followups", label: "Follow‑up Operations", icon: CalendarCheck, href: "/dashboard/followups" },
  { id: "communication", label: "Communication", icon: PhoneCall, href: "/dashboard/calls" },
  { id: "assistant", label: "AI Assistant", icon: Bot, href: "/dashboard/assistant" },
];

export const bottomNav: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
];
