"use client";

import Link from 'next/link';
import { LayoutDashboard, Phone, Bot, PhoneCall, Megaphone, Users, Target, Clock, MessageSquare, Brain, BookOpen, BarChart3, Settings, Plug } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCRMStore } from '@/store/crmStore';

export default function AppSidebar() {
  const pathname = usePathname();
  const { settings } = useCRMStore();
  
  const isCollapsed = settings?.sidebar === 'Collapsed';
  const isDark = settings?.theme === 'Dark';
  
  const sidebarWidth = isCollapsed ? '72px' : '240px';
  const bgColor = isDark ? '#1F2937' : '#FFFFFF';
  const borderColor = isDark ? '#374151' : '#E4E7EC';
  const titleColor = isDark ? '#F3F4F6' : '#111827';
  const sectionColor = isDark ? '#6B7280' : '#9CA3AF';
  const itemColor = isDark ? '#D1D5DB' : '#6B7280';
  const activeBg = isDark ? '#374151' : '#F5F3FF';
  const activeColor = isDark ? '#A78BFA' : '#7C3AED';

  const menuGroups = [
    {
      title: "GENERAL",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }
      ]
    },
    {
      title: "CALLING",
      items: [
        { name: "AI Voice Calling", href: "/dashboard/calls", icon: Phone },
        { name: "Voice Bots", href: "/dashboard/voice-bot", icon: Bot },
        { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone }
      ]
    },
    {
      title: "CRM",
      items: [
        { name: "Customers", href: "/dashboard/customers", icon: Users },
        { name: "Followups", href: "/dashboard/followups", icon: Clock },
        { name: "Conversations", href: "/dashboard/conversations", icon: MessageSquare }
      ]
    },
    {
      title: "AI",
      items: [
        { name: "AI Executive", href: "/dashboard/ai-executive", icon: Brain },
        { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen }
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Integrations", href: "/dashboard/integrations", icon: Plug }
      ]
    }
  ];

  return (
    <div style={{ 
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: sidebarWidth,
      zIndex: 100,
      overflowY: 'auto',
      backgroundColor: bgColor,
      borderRight: `1px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease, background-color 0.3s'
    }}>
      <div className={`p-6 shrink-0 flex items-center ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <h1 style={{ color: titleColor, fontWeight: 700, fontSize: isCollapsed ? '0.875rem' : '1.25rem' }} className="truncate">
          {isCollapsed ? 'CRM' : 'Hanexis CRM'}
        </h1>
      </div>
      
      <div className={`flex-1 space-y-6 sidebar-scroll overflow-x-hidden pb-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h2 style={{ color: sectionColor, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }} className="mb-2 px-2">
                {group.title}
              </h2>
            )}
            <ul className="space-y-1">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={i}>
                    <Link href={item.href} prefetch={true} className={`flex items-center gap-3 sidebar-item transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`} style={{
                      backgroundColor: isActive ? activeBg : 'transparent',
                      color: isActive ? activeColor : itemColor,
                      borderLeft: isActive ? `3px solid ${activeColor}` : '3px solid transparent',
                      padding: isCollapsed ? '12px' : '10px 12px',
                      borderRadius: isActive ? '0 8px 8px 0' : '8px'
                    }} title={isCollapsed ? item.name : undefined}>
                      <Icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span className="truncate font-medium">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
