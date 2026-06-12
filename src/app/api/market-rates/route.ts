import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MarketRate from "@/models/MarketRate";

const INITIAL_MARKET_RATES = [
  { licenseType: "RO", currentRate: 24500, lastWeekRate: 25000 },
  { licenseType: "RODTEP", currentRate: 15500, lastWeekRate: 15000 },
  { licenseType: "ROSTL", currentRate: 18500, lastWeekRate: 18500 },
  { licenseType: "DT", currentRate: 12000, lastWeekRate: 11500 },
  { licenseType: "TP", currentRate: 8500, lastWeekRate: 8000 },
  { licenseType: "SPICES", currentRate: 45000, lastWeekRate: 42000 },
  { licenseType: "APEDA", currentRate: 22000, lastWeekRate: 23500 },
  { licenseType: "IEC", currentRate: 2500, lastWeekRate: 2500 }
];

export async function GET() {
  try {
    await dbConnect();
    let rates = await MarketRate.find({});
    
    if (rates.length === 0) {
      await MarketRate.insertMany(INITIAL_MARKET_RATES);
      rates = await MarketRate.find({});
    }
    
    const mappedRates = rates.map((r: any) => {
      const type = r.licenseType;
      
      const licenseNameMap: Record<string, string> = {
        RO: "RO Scheme License Registration",
        RODTEP: "RODTEP Scheme Registration",
        ROSTL: "RoSCTL Licensing Setup",
        DT: "Duty Drawback Setup",
        TP: "Transit Permit (Export Permit)",
        SPICES: "Spices Board CRES Setup",
        APEDA: "APEDA Registration (RCMC)",
        IEC: "IEC DGFT Registration"
      };

      const categoryMap: Record<string, string> = {
        RO: "Export License",
        RODTEP: "Rebate Claim",
        ROSTL: "Rebate Claim",
        DT: "Duty Incentive",
        TP: "Export Clearance",
        SPICES: "Commodity Board",
        APEDA: "Agricultural Products",
        IEC: "General Registry"
      };

      const descMap: Record<string, string> = {
        RO: "Reconciliation Office licensing for customs and duty compliance.",
        RODTEP: "Rebate of Duties and Taxes on Exported Products. Essential for duty credits.",
        ROSTL: "Rebate of State and Central Taxes and Levies. Mandated for textile/apparel.",
        DT: "Customs duty drawback tracking and application support for eligible exporters.",
        TP: "Required for inter-state transit and port customs clearance.",
        SPICES: "Certificate of Registration as Exporter of Spices. Mandatory for spices.",
        APEDA: "Required for export of scheduled agricultural products like mangoes, rice, etc.",
        IEC: "Importer Exporter Code issued by DGFT. The foundation for global trade."
      };
      
      const diff = r.currentRate - r.lastWeekRate;
      const pct = r.lastWeekRate > 0 ? parseFloat(((diff / r.lastWeekRate) * 100).toFixed(1)) : 0;
      
      return {
        _id: r._id,
        id: String(r.licenseType).toLowerCase(),
        licenseName: licenseNameMap[type] || `${type} Setup`,
        category: categoryMap[type] || "Setup",
        currentRate: r.currentRate,
        previousRate: r.lastWeekRate,
        weeklyTrend: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
        changePercent: pct,
        description: descMap[type] || "Export license setup and registration assistance.",
        dailyFluctuation: diff
      };
    });
    
    return NextResponse.json(mappedRates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
