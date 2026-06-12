// frontend/src/app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { User, Mail, Building, Phone, ShieldCheck, Save, Clock } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import ToastProvider from '@/components/ui/Toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'gowthamreddyeruvuri@gmail.com',
    phone: '+91 9110791017',
    company: 'Hanexis Export Solutions',
    role: 'Administrator'
  });
  
  const [stats, setStats] = useState({ customers: 0, calls: 0, convs: 0 });

  useEffect(() => {
    const stored = localStorage.getItem('crm_profile');
    if (stored) {
      try { setProfile(JSON.parse(stored)); } catch(e){}
    }
    
    // Fetch stats
    Promise.all([
      fetch('http://localhost:8080/api/customers').then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/api/calls').then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/api/conversations').then(r => r.json()).catch(() => [])
    ]).then(([custs, calls, convs]) => {
      setStats({
        customers: Array.isArray(custs) ? custs.length : 0,
        calls: Array.isArray(calls) ? calls.length : 0,
        convs: Array.isArray(convs) ? convs.length : 0
      });
    });
  }, []);

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('crm_profile', JSON.stringify(profile));
    showToast('Profile updated successfully!', 'success');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 z-10 relative max-w-[800px] mx-auto" style={{ backgroundColor: '#F8F9FC', minHeight: '100vh' }}>
      <ToastProvider />
      
      <div>
        <h1 style={{ color: '#111827', fontWeight: 700, fontSize: '1.75rem' }}>Profile Settings</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '4px' }}>Manage your personal details and CRM presence.</p>
      </div>

      {/* Profile Header Card */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '16px', backgroundColor: '#F5F3FF', border: '2px solid #E0D4FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '32px', fontWeight: 700, color: '#7C3AED' }}>{profile.name.substring(0,1)}</span>
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{profile.name}</h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail className="w-3.5 h-3.5" /> {profile.email}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#7C3AED', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building className="w-3.5 h-3.5" /> {profile.company}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Personal Information Form */}
        <div className="md:col-span-2 space-y-6" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '32px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>PERSONAL INFORMATION</h3>
          
          <div className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input suppressHydrationWarning type="text" name="name" value={profile.name} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input suppressHydrationWarning type="email" name="email" value={profile.email} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input suppressHydrationWarning type="text" name="phone" value={profile.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Company</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input suppressHydrationWarning type="text" name="company" value={profile.company} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Role</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input suppressHydrationWarning type="text" name="role" value={profile.role} onChange={handleChange} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} readOnly />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button onClick={handleSave} style={{ backgroundColor: '#111827', color: '#FFFFFF', padding: '12px 24px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }} className="hover:bg-[#374151] transition-colors">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        {/* CRM Statistics */}
        <div className="space-y-6" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '32px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>CRM STATISTICS</h3>
          
          <div className="space-y-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Total Customers</span>
              <span style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 800 }}>{stats.customers}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Total Calls Made</span>
              <span style={{ fontSize: '1.25rem', color: '#10B981', fontWeight: 800 }}>{stats.calls}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>Conversations</span>
              <span style={{ fontSize: '1.25rem', color: '#7C3AED', fontWeight: 800 }}>{stats.convs}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', padding: '16px', backgroundColor: '#F8F9FC', borderRadius: '12px' }}>
              <Clock className="w-4 h-4 text-[#9CA3AF]" />
              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>Member since May 2026</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
