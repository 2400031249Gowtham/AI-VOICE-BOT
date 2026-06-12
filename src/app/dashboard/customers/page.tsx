// frontend/src/app/dashboard/customers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Phone, User, Building, Mail, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterTab, setFilterTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "+91", company: "", email: "", leadStatus: "NEW" });

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/customers");
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response from:', "http://localhost:8080/api/customers");
        setAllCustomers([]);
        setFiltered([]);
        return;
      }
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setAllCustomers(arr);
      setFiltered(arr);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Search Bug Fix
  useEffect(() => {
    let result = allCustomers;
    
    // Tab filter
    if (filterTab !== "ALL") {
      result = result.filter(c => c.leadStatus === filterTab);
    }
    
    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.leadStatus || '').toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, allCustomers, filterTab]);

  const handleCall = async (id: string, phone: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/call/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: id, phone })
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      if (response.ok) {
        alert('Call initiated successfully! Phone: ' + phone);
      } else {
        alert('Call failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error initiating call: ' + error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await res.json();
      } else {
        await res.text();
      }
    } catch (e) {
      console.error(e);
    }
    setIsModalOpen(false);
    fetchCustomers();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">NEW</span>;
      case 'ACTIVE':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">ACTIVE</span>;
      case 'INTERESTED':
        return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-semibold">INTERESTED</span>;
      case 'CALLBACK':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full text-xs font-semibold">CALLBACK</span>;
      case 'NOT_INTERESTED':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">NOT_INTERESTED</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-semibold">{status || 'UNKNOWN'}</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 z-10 relative max-w-7xl mx-auto" suppressHydrationWarning>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-[#7C3AED]" />
          Customers
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search customers, companies, phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all border border-gray-200 bg-white shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0 items-center">
          {["ALL", "NEW", "ACTIVE", "INTERESTED", "CALLBACK"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                filterTab === tab 
                  ? 'bg-purple-50 border-[#7C3AED] text-[#7C3AED]' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider sticky top-0 z-10">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Company</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold w-40">Lead Score</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => {
                const safeCustomer = {
                  ...c,
                  name: c.name || "Unknown",
                  company: c.company || "—",
                  email: c.email || "—",
                  score: c.leadScore || 0
                };
                const initials = safeCustomer.name.substring(0, 2).toUpperCase();

                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-200">
                          {initials}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{safeCustomer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[150px]">{safeCustomer.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {safeCustomer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[150px]">{safeCustomer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(safeCustomer.leadStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-[#7C3AED] h-2 rounded-full" 
                            style={{ width: `${Math.min(100, Math.max(0, safeCustomer.score))}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-8">{safeCustomer.score}/100</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button 
                        onClick={() => handleCall(safeCustomer.id, safeCustomer.phone)}
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Call Now
                      </button>
                      <Link 
                        href={`/dashboard/customers/${safeCustomer.id}`}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center shadow-sm"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No customers found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-white w-full max-w-md overflow-hidden p-0 flex flex-col rounded-2xl shadow-xl animate-in zoom-in-95 duration-200 relative"
            onClick={e => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full hover:bg-gray-100 z-50"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center pr-16">
              <h3 className="font-bold text-lg text-gray-900">Add New Customer</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block text-gray-700">Full Name</label>
                <input required type="text" className="w-full rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all border border-gray-200" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-gray-700">Phone Number</label>
                <input required type="text" className="w-full rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all border border-gray-200" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-gray-700">Company</label>
                <input required type="text" className="w-full rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all border border-gray-200" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-gray-700">Lead Status</label>
                <select className="w-full rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all border border-gray-200" value={formData.leadStatus} onChange={e => setFormData({...formData, leadStatus: e.target.value})}>
                  <option value="NEW">NEW</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INTERESTED">INTERESTED</option>
                  <option value="CALLBACK">CALLBACK</option>
                  <option value="NOT_INTERESTED">NOT_INTERESTED</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
