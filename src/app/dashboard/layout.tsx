"use client";

import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import { CRMProvider, useCRMStore } from "@/store/crmStore";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { settings } = useCRMStore();
  const isCollapsed = settings?.sidebar === 'Collapsed';
  const sidebarWidth = isCollapsed ? '72px' : '240px';

  // Apply dark mode theme if enabled
  const isDark = settings?.theme === 'Dark';
  const bgColor = isDark ? '#111827' : '#F8F9FC';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor, transition: 'background-color 0.3s' }}>
      <AppSidebar />
      <div style={{ 
        marginLeft: sidebarWidth,
        transition: 'margin-left 0.3s ease',
        flex: 1,
        minWidth: 0,
        backgroundColor: bgColor,
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        <AppHeader />
        <main style={{ 
          padding: '24px',
          paddingTop: '88px',
          minHeight: '100vh',
          boxSizing: 'border-box'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CRMProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </CRMProvider>
  );
}
