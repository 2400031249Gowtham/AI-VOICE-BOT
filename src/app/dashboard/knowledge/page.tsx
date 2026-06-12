// frontend/src/app/dashboard/knowledge/page.tsx
"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, FileText, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", category: "GENERAL" });

  const fetchDocs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/knowledge");
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response from:', "http://localhost:8080/api/knowledge");
        setDocuments([]);
        return;
      }
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/knowledge", {
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
    setFormData({ title: "", content: "", category: "GENERAL" });
    fetchDocs();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Knowledge Base</h1>
          <p className="text-sm text-[#6B7280] mt-1">Train the AI with company data, FAQs, and product details</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="p-4 border-b border-[#E4E7EC] bg-[#F5F7FA] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-full rounded-lg py-2 pl-10 pr-4 text-sm bg-[#FFFFFF] border border-[#E4E7EC] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FFFFFF] text-[#9CA3AF] uppercase font-semibold text-xs border-b border-[#E4E7EC]">
              <tr>
                <th className="px-6 py-4 tracking-wider">Document Title</th>
                <th className="px-6 py-4 tracking-wider">Category</th>
                <th className="px-6 py-4 tracking-wider">Last Updated</th>
                <th className="px-6 py-4 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-[#E4E7EC] hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#F5F3FF] flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#7C3AED]" />
                      </div>
                      <span className="font-bold text-[#111827]">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#F5F7FA] text-[#6B7280] border border-[#E4E7EC]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#6B7280] font-medium">
                    {new Date(doc.updatedAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#EF4444] hover:bg-[#FEF2F2] p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#9CA3AF]">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No knowledge base documents uploaded yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4" onClick={() => setIsModalOpen(false)}>
          <div 
            className="card w-full max-w-2xl overflow-hidden p-0 flex flex-col relative"
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
            <div className="px-6 py-5 border-b border-[#E4E7EC] bg-[#F5F7FA] pr-16">
              <h3 className="text-lg font-bold text-[#111827]">Add Training Document</h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-[#374151]">Title</label>
                  <input required type="text" className="w-full rounded-lg p-2.5 text-sm border border-[#E4E7EC] bg-[#FFFFFF] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-[#374151]">Category</label>
                  <select className="w-full rounded-lg p-2.5 text-sm border border-[#E4E7EC] bg-[#FFFFFF] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="GENERAL">GENERAL</option>
                    <option value="PRODUCT">PRODUCT</option>
                    <option value="SALES_SCRIPT">SALES_SCRIPT</option>
                    <option value="FAQ">FAQ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-[#374151]">Document Content (Text)</label>
                <textarea required rows={8} className="w-full rounded-lg p-3 text-sm border border-[#E4E7EC] bg-[#FFFFFF] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 resize-none" placeholder="Paste the text content here for the AI to learn..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#E4E7EC]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
