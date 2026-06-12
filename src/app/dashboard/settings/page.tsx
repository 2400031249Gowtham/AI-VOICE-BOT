// frontend/src/app/dashboard/settings/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Bot, Phone, Network, Bell, Palette, Save, Building, Clock, Loader2 } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import ToastProvider from '@/components/ui/Toast';
import { useCRMStore } from '@/store/crmStore';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'Hanexis CRM',
    companyPhone: '+919110791017',
    aiGreeting: 'Hello, this is Priya calling from Hanexis Export Solutions. How can I assist you with your export licensing today?',
    businessHours: '9:00 AM - 6:00 PM IST',
    ollamaUrl: 'http://localhost:11434',
    model: 'llama3.2:1b',
    elVoiceId: 'YOq2y2Up4Rg',
    elApiKey: '',
    twilioSid: '',
    twilioToken: '',
    twilioPhone: '+16143813168',
    webhookUrl: 'https://moody-skier.ngrok.app/api/twilio/webhook',
    ngrokUrl: 'https://moody-skier-mow.ngrok.app',
    emailNotifs: false,
    callAlerts: true,
    followupReminders: true,
    theme: 'Light',
    sidebar: 'Expanded'
  });

  const [ngrokStatus, setNgrokStatus] = useState('Online');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to load settings from backend first
    fetch('http://localhost:8080/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({
            ...prev,
            companyName: data.companyName ?? prev.companyName ?? "",
            companyPhone: data.companyPhone ?? prev.companyPhone ?? "",
            aiGreeting: data.aiGreeting ?? prev.aiGreeting ?? "",
            businessHours: data.businessHours ?? prev.businessHours ?? "",
            ollamaUrl: data.ollamaUrl ?? prev.ollamaUrl ?? "",
            model: data.model ?? prev.model ?? "",
            elVoiceId: data.elVoiceId ?? prev.elVoiceId ?? "",
            elApiKey: data.elApiKey ?? prev.elApiKey ?? "",
            twilioSid: data.twilioSid ?? prev.twilioSid ?? "",
            twilioToken: data.twilioToken ?? prev.twilioToken ?? "",
            twilioPhone: data.twilioPhone ?? prev.twilioPhone ?? "",
            webhookUrl: data.webhookUrl ?? prev.webhookUrl ?? "",
            ngrokUrl: data.ngrokUrl ?? prev.ngrokUrl ?? "",
            emailNotifs: data.emailNotifs ?? prev.emailNotifs ?? false,
            callAlerts: data.callAlerts ?? prev.callAlerts ?? true,
            followupReminders: data.followupReminders ?? prev.followupReminders ?? true,
            theme: data.theme ?? prev.theme ?? "Light",
            sidebar: data.sidebar ?? prev.sidebar ?? "Expanded"
          }));
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch from API, falling back to localStorage');
        const stored = localStorage.getItem('crm_settings_full');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setSettings(prev => ({
              ...prev,
              companyName: parsed.companyName ?? prev.companyName ?? "",
              companyPhone: parsed.companyPhone ?? prev.companyPhone ?? "",
              aiGreeting: parsed.aiGreeting ?? prev.aiGreeting ?? "",
              businessHours: parsed.businessHours ?? prev.businessHours ?? "",
              ollamaUrl: parsed.ollamaUrl ?? prev.ollamaUrl ?? "",
              model: parsed.model ?? prev.model ?? "",
              elVoiceId: parsed.elVoiceId ?? prev.elVoiceId ?? "",
              elApiKey: parsed.elApiKey ?? prev.elApiKey ?? "",
              twilioSid: parsed.twilioSid ?? prev.twilioSid ?? "",
              twilioToken: parsed.twilioToken ?? prev.twilioToken ?? "",
              twilioPhone: parsed.twilioPhone ?? prev.twilioPhone ?? "",
              webhookUrl: parsed.webhookUrl ?? prev.webhookUrl ?? "",
              ngrokUrl: parsed.ngrokUrl ?? prev.ngrokUrl ?? "",
              emailNotifs: parsed.emailNotifs ?? prev.emailNotifs ?? false,
              callAlerts: parsed.callAlerts ?? prev.callAlerts ?? true,
              followupReminders: parsed.followupReminders ?? prev.followupReminders ?? true,
              theme: parsed.theme ?? prev.theme ?? "Light",
              sidebar: parsed.sidebar ?? prev.sidebar ?? "Expanded"
            }));
          } catch(e) {}
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const { saveSettings } = useCRMStore();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Always save to localStorage as a fallback backup
      localStorage.setItem('crm_settings_full', JSON.stringify(settings));
      
      // Update global context state so layout/sidebar re-render immediately
      saveSettings(settings as any);

      // POST to backend API
      const response = await fetch('http://localhost:8080/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        console.warn('Backend settings endpoint returned error or not found.');
      }
      
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings remotely. Saved locally.', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 z-10 relative max-w-[900px] mx-auto" style={{ backgroundColor: '#F8F9FC', minHeight: '100vh' }}>
      <ToastProvider />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ color: '#111827', fontWeight: 700, fontSize: '1.75rem' }}>System Settings</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '4px' }}>Configure AI voice engine, Twilio connections, and preferences.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ 
            backgroundColor: isSaving ? '#6B7280' : '#111827', 
            color: '#FFFFFF', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            fontSize: '0.875rem', 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }} 
          className="transition-colors hover:bg-[#374151]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Business Profile Settings */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '24px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', backgroundColor: '#FFF7ED', borderRadius: '8px' }}>
              <Building className="w-5 h-5 text-[#EA580C]" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Business Identity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Company Name</label>
              <input suppressHydrationWarning type="text" name="companyName" value={settings.companyName ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Company Phone</label>
              <input suppressHydrationWarning type="text" name="companyPhone" value={settings.companyPhone ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div className="md:col-span-2">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>AI Greeting Message</label>
              <textarea suppressHydrationWarning name="aiGreeting" value={settings.aiGreeting ?? ""} onChange={handleChange} rows={2} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div className="md:col-span-2">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Business Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input suppressHydrationWarning type="text" name="businessHours" value={settings.businessHours ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Voice Settings */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', backgroundColor: '#F5F3FF', borderRadius: '8px' }}>
              <Bot className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>AI Voice Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Groq API URL</label>
              <input suppressHydrationWarning type="text" name="ollamaUrl" value={settings.ollamaUrl ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Language Model</label>
              <input suppressHydrationWarning type="text" name="model" value={settings.model ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>ElevenLabs Voice ID</label>
              <input suppressHydrationWarning type="text" name="elVoiceId" value={settings.elVoiceId ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>ElevenLabs API Key</label>
              <input suppressHydrationWarning type="password" name="elApiKey" value={settings.elApiKey ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
          </div>
        </div>

        {/* Twilio Settings */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', backgroundColor: '#ECFDF5', borderRadius: '8px' }}>
              <Phone className="w-5 h-5 text-[#10B981]" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Twilio API Integration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Account SID</label>
              <input suppressHydrationWarning type="password" name="twilioSid" value={settings.twilioSid ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Auth Token</label>
              <input suppressHydrationWarning type="password" name="twilioToken" value={settings.twilioToken ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Primary Phone Number</label>
              <input suppressHydrationWarning type="text" name="twilioPhone" value={settings.twilioPhone ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Webhook TwiML URL</label>
              <input suppressHydrationWarning type="text" name="webhookUrl" value={settings.webhookUrl ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
          </div>
        </div>

        {/* Ngrok & Appearance */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', backgroundColor: '#EFF6FF', borderRadius: '8px' }}>
              <Network className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Tunnel Configuration</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Ngrok Base URL</label>
              <input suppressHydrationWarning type="text" name="ngrokUrl" value={settings.ngrokUrl ?? ""} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#065F46' }}>Tunnel Status: {ngrokStatus}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', backgroundColor: '#FEF2F2', borderRadius: '8px' }}>
              <Palette className="w-5 h-5 text-[#EF4444]" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Appearance</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Theme</label>
              <select suppressHydrationWarning name="theme" value={settings.theme ?? "Light"} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }}>
                <option value="Light">Light Enterprise</option>
                <option value="Dark">Dark Mode (Legacy)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Sidebar State</label>
              <select suppressHydrationWarning name="sidebar" value={settings.sidebar ?? "Expanded"} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E4E7EC', fontSize: '0.875rem', color: '#111827', backgroundColor: '#F9FAFB' }}>
                <option value="Expanded">Expanded (Default)</option>
                <option value="Collapsed">Collapsed (Icons only)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Prefs */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', backgroundColor: '#FFFBEB', borderRadius: '8px' }}>
              <Bell className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #E4E7EC', borderRadius: '8px', cursor: 'pointer' }} className="hover:bg-[#F9FAFB]">
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Email Notifications</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Daily summary of AI activities</span>
              </div>
              <input suppressHydrationWarning type="checkbox" name="emailNotifs" checked={settings.emailNotifs ?? false} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#7C3AED' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #E4E7EC', borderRadius: '8px', cursor: 'pointer' }} className="hover:bg-[#F9FAFB]">
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Live Call Alerts</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Push notifications for completed calls</span>
              </div>
              <input suppressHydrationWarning type="checkbox" name="callAlerts" checked={settings.callAlerts ?? true} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#7C3AED' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #E4E7EC', borderRadius: '8px', cursor: 'pointer' }} className="hover:bg-[#F9FAFB]">
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Followup Reminders</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Alerts for pending manual followups</span>
              </div>
              <input suppressHydrationWarning type="checkbox" name="followupReminders" checked={settings.followupReminders ?? true} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#7C3AED' }} />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
