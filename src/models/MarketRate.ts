import mongoose, { Schema, Document } from "mongoose";

export interface IMarketRate extends Document {
  licenseType: "RO" | "RODTEP" | "ROSTL" | "DT" | "TP" | "SPICES" | "APEDA" | "IEC";
  currentRate: number;
  lastWeekRate: number;
  updatedAt: Date;
  updatedBy?: string;
}

const MarketRateSchema: Schema = new Schema(
  {
    licenseType: {
      type: String,
      enum: ["RO", "RODTEP", "ROSTL", "DT", "TP", "SPICES", "APEDA", "IEC"],
      required: true,
      unique: true,
    },
    currentRate: { type: Number, required: true },
    lastWeekRate: { type: Number, required: true },
    updatedBy: { type: String, default: "Admin" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MarketRate || mongoose.model<IMarketRate>("MarketRate", MarketRateSchema);
