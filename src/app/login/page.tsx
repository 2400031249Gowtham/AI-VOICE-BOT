"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("signup") === "success") {
      setSignupSuccess(true);
    }
  }, [mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      // Check if user registered previously to get company info
      const registered = JSON.parse(localStorage.getItem("voxai_registered_users") || "[]");
      const match = registered.find((u: any) => u.email === email);
      localStorage.setItem("voxai_current_user", JSON.stringify({
        email: email || "user@example.com",
        name: match?.name || (email ? email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1) : "Workspace Admin"),
        company: match?.company,
      }));
    }
    window.location.href = "/dashboard";
  };

  const handleDemoAccess = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("voxai_current_user", JSON.stringify({
        email: "demo@voxai.co",
        name: "Demo Admin",
      }));
      // Pre-select demo workspace mode so WorkspaceSelector is skipped
      localStorage.setItem("voxai_demo@voxai.co_workspace_mode", "demo");
    }
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-chart-3/8 rounded-full blur-[120px]" />

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
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your AI Voice CRM dashboard
          </p>
        </div>

        {/* Login Card */}
        {signupSuccess && (
          <div className="mb-4 p-4 rounded-xl bg-chart-2/10 border border-chart-2/30 text-chart-2 text-xs font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-ping" />
            Account created successfully. Please log in.
          </div>
        )}
        <div className="p-8 rounded-2xl glass border border-border/50 glow-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  required
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

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-secondary/50 text-primary focus:ring-primary/20"
                />
                <span className="text-xs text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity glow-blue"
            >
              Sign In
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo access */}
          <button
            onClick={handleDemoAccess}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm font-medium hover:bg-secondary/70 transition-colors"
          >
            <Sparkles size={16} className="text-primary" />
            Access Demo Dashboard
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
