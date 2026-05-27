"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Phone, Bot, BarChart3, Zap, MessageSquare, Users,
  ArrowRight, Play, Star, CheckCircle2, Globe, Shield,
  Headphones, TrendingUp, Clock, Sparkles, ChevronRight,
  PhoneCall, CalendarCheck, Send
} from "lucide-react";
import { useRef } from "react";

/* ────────────────────────── ANIMATIONS ────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ────────────────────────── NAVBAR ────────────────────── */
function LandingNav() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
            <Phone size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Vox<span className="gradient-text">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Analytics", "Pricing", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

/* ────────────────────────── HERO ─────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-3/8 rounded-full blur-[120px] animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-2/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8"
        >
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-medium text-primary">AI-Powered Telugu Voice CRM</span>
          <ChevronRight size={12} className="text-primary/60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-foreground">Your AI Voice Agent</span>
          <br />
          <span className="gradient-text">for Export Businesses</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Human-like Telugu AI calling system that automates follow-ups,
          qualifies leads, and drives conversions — so your team can focus
          on closing deals.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-200 glow-blue text-sm"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass border border-border hover:border-primary/30 font-medium transition-all duration-200 text-sm"
          >
            <Play size={16} className="text-primary" />
            Live Demo
          </Link>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-3xl blur-2xl" />
          <div className="relative rounded-2xl overflow-hidden glass border border-border/50">
            <DashboardPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────── DASHBOARD PREVIEW ────────────── */
function DashboardPreview() {
  return (
    <div className="p-6 bg-card/80">
      {/* Mini nav bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-chart-4/80" />
          <div className="w-3 h-3 rounded-full bg-chart-2/80" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/50 border border-border w-48">
          <span className="text-[10px] text-muted-foreground">app.voxai.io/dashboard</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Calls", value: "2,847", change: "+12.5%", color: "text-chart-1" },
          { label: "Active Leads", value: "684", change: "+23%", color: "text-chart-2" },
          { label: "AI Conversations", value: "1,249", change: "+18%", color: "text-chart-3" },
          { label: "Conversion Rate", value: "34.8%", change: "+5.2%", color: "text-chart-4" },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl bg-secondary/30 border border-border/50">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color} mt-1`}>{stat.value}</p>
            <p className="text-[10px] text-chart-2 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 p-4 rounded-xl bg-secondary/20 border border-border/30 h-40 flex items-end gap-1">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary/40 to-primary/80 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </div>
        <div className="p-4 rounded-xl bg-secondary/20 border border-border/30">
          <p className="text-[10px] text-muted-foreground mb-3">AI Status</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
            <span className="text-xs text-chart-2">Online</span>
          </div>
          <div className="space-y-2">
            {["Telugu", "English", "Hindi"].map((lang) => (
              <div key={lang} className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{lang}</span>
                <span className="text-[10px] text-foreground">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── FEATURE GRID ─────────────────── */
const features = [
  {
    icon: PhoneCall,
    title: "AI Voice Calls",
    desc: "Human-like Telugu AI calling system that handles outbound calls, qualifies leads, and books meetings automatically.",
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Users,
    title: "Lead Management",
    desc: "Smart CRM with AI-powered lead scoring, automatic categorization, and intelligent follow-up scheduling.",
    color: "from-chart-2/20 to-chart-2/5",
    iconColor: "text-chart-2",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Workflows",
    desc: "Automated WhatsApp messaging sequences that nurture leads and keep your pipeline flowing 24/7.",
    color: "from-chart-3/20 to-chart-3/5",
    iconColor: "text-chart-3",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Real-time dashboards with conversion funnels, call metrics, and AI-powered business insights.",
    color: "from-chart-4/20 to-chart-4/5",
    iconColor: "text-chart-4",
  },
  {
    icon: CalendarCheck,
    title: "Auto Follow-ups",
    desc: "AI schedules and executes follow-up calls based on lead behavior, sentiment analysis, and optimal timing.",
    color: "from-chart-5/20 to-chart-5/5",
    iconColor: "text-chart-5",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "SOC 2 compliant infrastructure with end-to-end encryption, audit logs, and role-based access controls.",
    color: "from-primary/20 to-chart-2/5",
    iconColor: "text-primary",
  },
];

function FeatureGrid() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-4">
            <Zap size={12} />
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to
            <br />
            <span className="gradient-text">close more deals</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A complete AI-powered CRM suite built specifically for export businesses
            that need to scale their outreach in Telugu, English, and Hindi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-6 rounded-2xl bg-card/60 border border-border hover:border-primary/20 card-hover cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={20} className={feature.iconColor} />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── AI WORKFLOW ──────────────────── */
function WorkflowSection() {
  const steps = [
    { icon: Globe, label: "Lead Captured", desc: "From website, WhatsApp, or manual entry" },
    { icon: Bot, label: "AI Qualifies", desc: "Automated Telugu voice call to qualify the lead" },
    { icon: TrendingUp, label: "Score & Prioritize", desc: "AI scores leads based on conversation analysis" },
    { icon: CalendarCheck, label: "Auto Follow-up", desc: "Schedule callbacks at optimal times" },
    { icon: CheckCircle2, label: "Deal Closed", desc: "Convert qualified leads into customers" },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-3/10 border border-chart-3/20 text-xs font-medium text-chart-3 mb-4">
            <Bot size={12} />
            AI Workflow
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            From lead to deal,
            <br />
            <span className="gradient-text">fully automated</span>
          </h2>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary/30 via-chart-3/30 to-chart-2/30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center max-w-[180px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-3 card-hover">
                <step.icon size={22} className="text-primary" />
              </div>
              <p className="text-sm font-semibold mb-1">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── ANALYTICS PREVIEW ────────────── */
function AnalyticsSection() {
  return (
    <section id="analytics" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chart-2/10 border border-chart-2/20 text-xs font-medium text-chart-2 mb-4">
              <BarChart3 size={12} />
              Real-time Analytics
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Insights that drive
              <br />
              <span className="gradient-text">smarter decisions</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Monitor every aspect of your AI calling campaigns with real-time dashboards.
              Track conversion rates, call durations, sentiment scores, and ROI — all in one place.
            </p>

            <div className="space-y-4">
              {[
                { label: "Call Success Rate", value: "87%", width: "87%" },
                { label: "Lead Conversion", value: "34.8%", width: "35%" },
                { label: "Follow-up Completion", value: "92%", width: "92%" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <span className="text-sm font-semibold text-foreground">{metric.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-chart-3"
                      initial={{ width: 0 }}
                      whileInView={{ width: metric.width }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 to-chart-3/5 rounded-3xl blur-2xl" />
            <div className="relative p-6 rounded-2xl glass border border-border/50">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Avg Call Duration", value: "3m 42s", icon: Clock },
                  { label: "AI Accuracy", value: "96.2%", icon: Bot },
                  { label: "Calls Today", value: "184", icon: PhoneCall },
                  { label: "Revenue Impact", value: "$47.2k", icon: TrendingUp },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <item.icon size={14} className="text-primary mb-2" />
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-32 flex items-end gap-1 p-3 rounded-xl bg-secondary/20 border border-border/30">
                {[30, 50, 35, 70, 55, 80, 65, 90, 75, 85, 60, 95, 70, 88, 78].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-chart-3/40 to-chart-3/80 rounded-t-sm"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.5 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── TESTIMONIALS ─────────────────── */
const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "CEO, KumarExports",
    text: "VoxAI transformed our lead management. Our conversion rate jumped 40% in just 2 months with the Telugu AI calling system.",
    rating: 5,
  },
  {
    name: "Priya Venkatesh",
    role: "Sales Director, TechFlow",
    text: "The AI follow-up system is incredible. It handles calls exactly like a human would — our customers can't tell the difference.",
    rating: 5,
  },
  {
    name: "Arun Narayanan",
    role: "Founder, ExportHub India",
    text: "We scaled from 50 to 500 calls per day without hiring a single person. The analytics dashboard gives us complete visibility.",
    rating: 5,
  },
];

function TestimonialSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Trusted by <span className="gradient-text">export leaders</span>
          </h2>
          <p className="text-muted-foreground">See what our customers say about VoxAI CRM</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-card/60 border border-border card-hover"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-chart-4 text-chart-4" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── CTA SECTION ─────────────────── */
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <Headphones size={28} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to automate your
            <br />
            <span className="gradient-text">sales pipeline?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start making AI-powered Telugu voice calls today. No credit card required.
            Free for up to 100 calls per month.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all glow-blue text-sm"
            >
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-border hover:border-primary/30 font-medium transition-all text-sm"
            >
              <Play size={16} className="text-primary" />
              Watch Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────── FOOTER ───────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
                <Phone size={14} className="text-white" />
              </div>
              <span className="text-base font-bold">VoxAI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered Telugu voice CRM for export businesses.
            </p>
          </div>
          {[
            { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Analytics", href: "#analytics" }, { label: "Pricing", href: "#pricing" }, { label: "Demo", href: "/dashboard" }] },
            { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }, { label: "Contact", href: "#" }] },
            { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Security", href: "#" }] },
          ].map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold mb-4">{section.title}</p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; 2026 VoxAI CRM. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────── PAGE ─────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <LandingNav />
      <HeroSection />
      <FeatureGrid />
      <WorkflowSection />
      <AnalyticsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}