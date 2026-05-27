"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Phone, Mail, Lock, ArrowRight, Eye, EyeOff, User, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist signup data so login can recognize returning user
    if (typeof window !== "undefined") {
      const users = JSON.parse(localStorage.getItem("voxai_registered_users") || "[]");
      users.push({ name: form.name, email: form.email, company: form.company });
      localStorage.setItem("voxai_registered_users", JSON.stringify(users));
    }
    window.location.href = "/login?signup=success";
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-chart-3/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/8 rounded-full blur-[120px]" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
              <Phone size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Vox<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start automating your sales calls with AI
          </p>
        </div>

        {/* Signup Card */}
        <div className="p-8 rounded-2xl glass border border-border/50 glow-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Work Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Company Name
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  placeholder="Your company"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2 py-2">
              {["100 free AI calls per month", "Unlimited leads & contacts", "Telugu, English & Hindi support"].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-chart-2" />
                  <span className="text-xs text-muted-foreground">{b}</span>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity glow-blue"
            >
              Create Account
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
