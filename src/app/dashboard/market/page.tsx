"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useCrm } from "@/hooks/useCrm";
import { 
  TrendingUp, TrendingDown, RefreshCw, Edit3, CheckCircle2, 
  HelpCircle, Sparkles, Scale, Info, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Simulated historical price data for the last 6 months
const mockHistoryData = [
  { month: "Dec", iec: 2500, spices: 40000, apeda: 25000, fssai: 60000 },
  { month: "Jan", iec: 2500, spices: 42000, apeda: 24000, fssai: 60000 },
  { month: "Feb", iec: 2500, spices: 42000, apeda: 23500, fssai: 62000 },
  { month: "Mar", iec: 2500, spices: 44000, apeda: 23000, fssai: 62000 },
  { month: "Apr", iec: 2500, spices: 44000, apeda: 22000, fssai: 65000 },
  { month: "May", iec: 2500, spices: 45000, apeda: 22000, fssai: 65000 },
];

export default function MarketRatesPage() {
  const { marketRates, updateMarketRate } = useCrm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Bundle Calculator State
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>(["iec", "spices"]);
  const [discountPercent, setDiscountPercent] = useState<number>(10); // 10% off for bundle

  const handleEditClick = (id: string, currentRate: number) => {
    setEditingId(id);
    setEditPrice(currentRate);
  };

  const handleSaveClick = async (id: string) => {
    await updateMarketRate(id, editPrice);
    setEditingId(null);
    const licenseName = marketRates.find(r => r.id === id)?.licenseName || "License";
    
    setShowToast(`Successfully updated ${licenseName} market rate to ₹${editPrice.toLocaleString("en-IN")}`);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Bundle calculations
  const calculateBundle = () => {
    const subtotal = selectedLicenses.reduce((acc, id) => {
      const rate = marketRates.find(r => r.id === id)?.currentRate || 0;
      return acc + rate;
    }, 0);
    const discount = (subtotal * discountPercent) / 100;
    return {
      subtotal,
      discount,
      total: subtotal - discount
    };
  };

  const toggleLicenseSelection = (id: string) => {
    setSelectedLicenses(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const bundleResult = calculateBundle();

  return (
    <PageContainer>
      {/* Toast Alert */}
      {showToast && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50 glass px-4 py-3 rounded-xl border border-primary/30 text-xs text-foreground flex items-center gap-2 shadow-[0_0_20px_hsl(234_89%_74%/0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <CheckCircle2 size={16} className="text-chart-2" />
          <span>{showToast}</span>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Market Rates Management</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Configure default license fees, view industry price charts, and calculate export license package bundles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-[12px] gap-1.5" onClick={() => window.location.reload()}>
            <RefreshCw size={12} /> Sync Rates
          </Button>
        </div>
      </motion.div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rate Cards (Admin-Editable) */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketRates.map((rate, i) => (
                <GlassCard key={rate.id} className="relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{rate.category}</span>
                      <h3 className="text-sm font-bold mt-0.5 truncate pr-8">{rate.licenseName}</h3>
                    </div>
                    <Badge variant="outline" className={`text-[10px] flex items-center gap-1 font-semibold ${
                      rate.weeklyTrend === "up" ? "bg-chart-2/10 text-chart-2 border-chart-2/20" :
                      rate.weeklyTrend === "down" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      "bg-secondary text-muted-foreground border-border"
                    }`}>
                      {rate.weeklyTrend === "up" ? <TrendingUp size={10} /> :
                       rate.weeklyTrend === "down" ? <TrendingDown size={10} /> :
                       <Scale size={10} />}
                      {rate.changePercent !== 0 ? `${rate.changePercent > 0 ? "+" : ""}${rate.changePercent}%` : "Stable"}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-4 h-8 overflow-hidden text-ellipsis line-clamp-2">
                    {rate.description}
                  </p>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Current Setup Price</p>
                      {editingId === rate.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold">₹</span>
                          <Input 
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                            className="w-24 h-7 text-xs bg-secondary border-border focus:border-primary/50 text-foreground"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-extrabold text-foreground mt-0.5">₹{rate.currentRate.toLocaleString("en-IN")}</p>
                          {rate.dailyFluctuation !== undefined && rate.dailyFluctuation !== 0 && (
                            <span className={`text-[9px] font-semibold block ${rate.dailyFluctuation > 0 ? "text-chart-2" : "text-destructive"}`}>
                              {rate.dailyFluctuation > 0 ? "+" : ""}₹{rate.dailyFluctuation.toLocaleString("en-IN")} today
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1.5">
                      {editingId === rate.id ? (
                        <>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" className="h-7 text-[10px] gap-1 px-2.5" onClick={() => handleSaveClick(rate.id)}>
                            <Save size={10} /> Save
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px] gap-1 px-2.5 opacity-80 group-hover:opacity-100 border-primary/20 hover:border-primary/50 hover:text-primary transition-all"
                          onClick={() => handleEditClick(rate.id, rate.currentRate)}
                        >
                          <Edit3 size={10} /> Edit Price
                        </Button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Historical Trends Recharts Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <GlassCard>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5"><Sparkles size={14} className="text-primary"/> Pricing Trend History</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Historical chart of central license acquisition fees (6 months)</p>
                </div>
                <div className="flex gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-chart-1"/> Spices Board</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-chart-3"/> FSSAI Export</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-chart-4"/> APEDA</span>
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockHistoryData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpices" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(234 89% 74%)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="hsl(234 89% 74%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorFssai" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(280 80% 60%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(280 80% 60%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorApeda" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(340 80% 60%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(340 80% 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 14%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(240 5% 50%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "hsl(240 5% 50%)" }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(20, 20, 25, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                    />
                    <Area type="monotone" dataKey="spices" stroke="hsl(234 89% 74%)" fill="url(#colorSpices)" strokeWidth={2} />
                    <Area type="monotone" dataKey="fssai" stroke="hsl(280 80% 60%)" fill="url(#colorFssai)" strokeWidth={2} />
                    <Area type="monotone" dataKey="apeda" stroke="hsl(340 80% 60%)" fill="url(#colorApeda)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Combined Package Calculator (Right Column) */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <GlassCard className="h-full">
              <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
                <Scale size={15} className="text-primary" /> Bundle Calculator
              </h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
                Calculate total rates when offering combined license packaging to exporters. Includes custom discount slider.
              </p>

              {/* License Checkboxes */}
              <div className="space-y-2 mb-6">
                {marketRates.map((rate) => {
                  const isSelected = selectedLicenses.includes(rate.id);
                  return (
                    <div 
                      key={rate.id}
                      onClick={() => toggleLicenseSelection(rate.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-primary/5 border-primary/40 shadow-[0_0_10px_rgba(120,119,255,0.05)]" 
                          : "bg-secondary/20 border-border hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 bg-transparent"
                        }`}>
                          {isSelected && <span className="text-[9px] font-bold">✓</span>}
                        </div>
                        <span className="text-xs text-foreground font-medium truncate max-w-[140px]">{rate.licenseName}</span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">₹{rate.currentRate.toLocaleString("en-IN")}</span>
                    </div>
                  );
                })}
              </div>

              {/* Discount Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-[10px] font-semibold">
                  <span className="text-muted-foreground uppercase tracking-wider">Bundle Discount</span>
                  <span className="text-primary">{discountPercent}% OFF</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                  className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[8px] text-muted-foreground">
                  <span>0%</span>
                  <span>10%</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Calculation Summary Block */}
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 space-y-3.5 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">₹{bundleResult.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-chart-2">
                  <span>Bundle Discount ({discountPercent}%):</span>
                  <span>- ₹{bundleResult.discount.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">Exporters Offer Price:</span>
                  <span className="text-base font-extrabold text-primary">₹{bundleResult.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  className="w-full text-xs h-9 gap-1.5"
                  disabled={selectedLicenses.length === 0}
                  onClick={() => {
                    setShowToast(`Export rate quote generated! Total bundle: ₹${bundleResult.total.toLocaleString("en-IN")}`);
                    setTimeout(() => setShowToast(null), 3000);
                  }}
                >
                  Generate PDF Quote
                </Button>
                <div className="flex items-start gap-1.5 p-2 rounded-lg bg-primary/5 border border-primary/10 text-[9px] text-muted-foreground leading-normal">
                  <Info size={12} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>Offers above ₹1,00,000 auto-trigger relationship tracking updates for licensing managers.</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
