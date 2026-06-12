"use client";

import { Search, Bell, User, X, Clock, UserPlus, PhoneCall, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCRMStore } from '@/store/crmStore';
import { showToast } from '@/components/ui/Toast';

export default function AppHeader() {
  const router = useRouter();
  const { settings } = useCRMStore();
  const [mounted, setMounted] = useState(false);
  
  const isCollapsed = settings?.sidebar === 'Collapsed';
  const isDark = settings?.theme === 'Dark';
  
  const sidebarWidth = isCollapsed ? '72px' : '240px';
  const bgColor = isDark ? '#1F2937' : '#FFFFFF';
  const borderColor = isDark ? '#374151' : '#E4E7EC';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const mutedText = isDark ? '#9CA3AF' : '#6B7280';
  
  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Profile state
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<any>({ name: 'Admin User', email: 'gowthamreddyeruvuri@gmail.com', company: 'Hanexis CRM' });

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Load profile
    const stored = localStorage.getItem('crm_profile');
    if (stored) {
      try { setProfileData(JSON.parse(stored)); } catch(e){}
    }
    
    // Fetch notifications payload
    Promise.all([
      fetch('http://localhost:8080/api/followups').then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/api/calls').then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/api/customers').then(r => r.json()).catch(() => [])
    ]).then(([followups, calls, customers]) => {
      const notifs: any[] = [];
      const safeFollowups = Array.isArray(followups) ? followups : [];
      const pendingFollowups = safeFollowups.filter((f:any) => f.status === 'PENDING');
      pendingFollowups.forEach(f => {
        notifs.push({ id: `f_${f.id}`, type: 'followup', title: 'Followup Due', sub: `${f.customerName || 'Customer'} - ${f.company || ''}`, time: 'Due today', data: f });
      });

      const safeCalls = Array.isArray(calls) ? calls : [];
      safeCalls.slice(0,3).forEach((c:any) => {
        notifs.push({ id: `c_${c.id}`, type: 'call', title: 'Call Completed', sub: `Status: ${c.status?.split('|')[0] || 'Unknown'}`, time: new Date(c.startTime || Date.now()).toLocaleTimeString(), data: c });
      });

      const safeCusts = Array.isArray(customers) ? customers : [];
      safeCusts.sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0,2).forEach((c:any) => {
        notifs.push({ id: `u_${c.id}`, type: 'customer', title: 'New Customer Added', sub: `${c.name || 'Unknown'} - ${c.company || ''}`, time: 'Recent', data: c });
      });
      
      setNotifications(notifs);
      setUnreadCount(pendingFollowups.length + Math.min(3, safeCalls.length));
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic (debounced)
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    const delay = setTimeout(() => {
      fetch('http://localhost:8080/api/customers')
        .then(r => r.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : [];
          const q = query.toLowerCase();
          const filtered = arr.filter(c => 
            (c.name && c.name.toLowerCase().includes(q)) || 
            (c.company && c.company.toLowerCase().includes(q)) ||
            (c.phone && c.phone.toLowerCase().includes(q)) ||
            (c.email && c.email.toLowerCase().includes(q))
          );
          setResults(filtered.slice(0, 5));
          setShowResults(true);
        })
        .catch(console.error);
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSignOut = () => {
    localStorage.removeItem('voxai_auth_user');
    localStorage.removeItem('crm_profile');
    router.push('/');
  };

  if (!mounted) {
    return (
      <header style={{ 
        position: 'fixed', top: 0, left: '240px', right: 0, height: '64px', zIndex: 99,
        backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E7EC'
      }} />
    );
  }

  return (
    <header style={{ 
      position: 'fixed', top: 0, left: sidebarWidth, right: 0, height: '64px', zIndex: 99,
      backgroundColor: bgColor, borderBottom: `1px solid ${borderColor}`, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
      transition: 'left 0.3s ease, background-color 0.3s'
    }}>
      
      {/* SEARCH BAR */}
      <div className="flex items-center gap-4 flex-1 relative" ref={searchRef}>
        <div className="relative group" style={{ width: '320px' }} suppressHydrationWarning>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#7C3AED] transition-colors" />
          <input 
            suppressHydrationWarning
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if(query.length > 0) setShowResults(true); }}
            placeholder="Search customers, deals..." 
            className="w-full text-sm transition-all focus:outline-none placeholder:text-[#9CA3AF]"
            style={{ 
              backgroundColor: isDark ? '#374151' : '#F5F7FA', border: `1px solid ${borderColor}`, borderRadius: '10px',
              padding: '8px 36px 8px 36px', color: textColor
            }}
          />
          {query.length > 0 && (
            <button 
              onClick={() => { setQuery(''); setShowResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <style dangerouslySetInnerHTML={{__html: `
            input:focus { border-color: #7C3AED !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1) !important; background-color: ${isDark ? '#1F2937' : '#FFFFFF'} !important; }
          `}} />
        </div>

        {/* SEARCH DROPDOWN */}
        {showResults && (
          <div style={{
            position: 'absolute', top: '50px', left: 0, width: '360px', backgroundColor: bgColor,
            borderRadius: '16px', border: `1px solid ${borderColor}`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            zIndex: 200, overflow: 'hidden'
          }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${borderColor}`, backgroundColor: isDark ? '#374151' : '#F8F9FC' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: mutedText }}>🔍 Search results for "{query}"</p>
            </div>
            
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {results.length > 0 ? results.map((res: any) => (
                <div 
                  key={res.id} 
                  onClick={() => { setShowResults(false); setQuery(''); router.push(`/dashboard/customers/${res.id}`); }}
                  style={{ padding: '12px 16px', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer' }}
                  className="hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User className="w-4 h-4 text-[#7C3AED]" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{res.name}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{res.company || 'Unknown'} • {res.phone}</p>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', marginTop: '4px', display: 'inline-block' }}>{res.leadStatus || 'NEW'}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>No customers found for '{query}'</p>
                </div>
              )}
            </div>
            
            {results.length > 0 && (
              <div 
                onClick={() => { setShowResults(false); setQuery(''); router.push('/dashboard/customers'); }}
                style={{ padding: '12px', textAlign: 'center', backgroundColor: isDark ? '#374151' : '#F8F9FC', cursor: 'pointer', borderTop: `1px solid ${borderColor}` }}
                className="hover:bg-[#F3F4F6] transition-colors text-xs font-bold text-[#7C3AED]"
              >
                View all results ({results.length})
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        
        {/* NOTIFICATIONS */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ color: mutedText, position: 'relative' }} 
            className="hover:text-[#111827] transition-colors p-2 rounded-full hover:bg-[#F3F4F6]"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid #FFFFFF' }}></span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', top: '60px', right: '-12px', width: '360px', backgroundColor: '#FFFFFF',
              borderRadius: '16px', border: '1px solid #E4E7EC', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>Notifications</h3>
                <button onClick={() => setUnreadCount(0)} style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 600 }} className="hover:underline">Mark all as read</button>
              </div>
              <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
                {notifications.length > 0 ? notifications.map((notif: any) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (notif.type === 'followup') router.push('/dashboard/followups');
                      else if (notif.type === 'call') router.push('/dashboard/calls');
                      else if (notif.type === 'customer') router.push(`/dashboard/customers/${notif.data.id}`);
                    }}
                    style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}
                    className="hover:bg-[#F9FAFB] transition-colors flex gap-3"
                  >
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: notif.type === 'followup' ? '#FFFBEB' : notif.type === 'call' ? '#ECFDF5' : '#EFF6FF'
                    }}>
                      {notif.type === 'followup' && <Clock className="w-4 h-4 text-[#F59E0B]" />}
                      {notif.type === 'call' && <PhoneCall className="w-4 h-4 text-[#10B981]" />}
                      {notif.type === 'customer' && <UserPlus className="w-4 h-4 text-[#3B82F6]" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: '#111827', fontSize: '13px' }}>{notif.title}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', lineHeight: '1.4' }}>{notif.sub}</p>
                    </div>
                    <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>{notif.time}</span>
                  </div>
                )) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>No new notifications</div>
                )}
              </div>
              <div 
                onClick={() => {
                  setShowNotifications(false);
                  showToast('Dedicated notifications center is coming soon!', 'info');
                }}
                style={{ padding: '12px', textAlign: 'center', backgroundColor: '#F8F9FC', cursor: 'pointer', borderTop: '1px solid #E4E7EC' }}
                className="hover:bg-[#F3F4F6] transition-colors text-xs font-bold text-[#111827]"
              >
                View All Notifications
              </div>
            </div>
          )}
        </div>
        
        {/* PROFILE */}
        <div style={{ borderLeft: `1px solid ${borderColor}`, position: 'relative' }} className="pl-6" ref={profileRef}>
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 cursor-pointer group p-1.5 -m-1.5 rounded-xl hover:bg-[#F5F7FA] transition-colors"
          >
            <div className="text-right hidden md:block">
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: textColor }}>{profileData.name.split(' ')[0]}</p>
              <p style={{ fontSize: '0.75rem', color: mutedText, fontWeight: 500 }}>{profileData.company}</p>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E0D4FC' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#7C3AED' }}>{profileData.name.substring(0,1)}</span>
            </div>
          </div>

          {showProfile && (
            <div style={{
              position: 'absolute', top: '56px', right: 0, width: '280px', backgroundColor: '#FFFFFF',
              borderRadius: '16px', border: '1px solid #E4E7EC', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#7C3AED' }}>{profileData.name.substring(0,1)}</span>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontWeight: 700, color: '#111827', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileData.name}</p>
                  <p style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profileData.email}</p>
                  <p style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600, marginTop: '2px' }}>{profileData.company}</p>
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <button onClick={() => { setShowProfile(false); router.push('/dashboard/profile'); }} className="w-full text-left px-4 py-2 hover:bg-[#F9FAFB] flex items-center gap-3 transition-colors">
                  <User className="w-4 h-4 text-[#6B7280]" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>My Profile</span>
                </button>
                <button onClick={() => { setShowProfile(false); router.push('/dashboard/settings'); }} className="w-full text-left px-4 py-2 hover:bg-[#F9FAFB] flex items-center gap-3 transition-colors">
                  <Settings className="w-4 h-4 text-[#6B7280]" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Settings</span>
                </button>
                <button onClick={() => { setShowProfile(false); router.push('/dashboard/settings'); }} className="w-full text-left px-4 py-2 hover:bg-[#F9FAFB] flex items-center gap-3 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-[#6B7280]" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Change Password</span>
                </button>
              </div>
              <div style={{ borderTop: '1px solid #F3F4F6', padding: '8px 0' }}>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-[#FEF2F2] flex items-center gap-3 transition-colors group">
                  <LogOut className="w-4 h-4 text-[#EF4444] group-hover:text-[#DC2626]" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
