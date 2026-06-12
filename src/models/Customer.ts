import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  company: string;
  phone: string;
  email: string;
  whatsapp?: string;
  licenseTypes: string[];
  availabilityStatus: "Available" | "Unavailable" | "Check Later";
  lastRateDiscussed?: number;
  leadScore: "Hot" | "Warm" | "Cold" | "Future Prospect";
  nextFollowupDate?: Date;
  whatsappSent?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String },
    licenseTypes: { type: [String], default: ["RODTEP"] },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Unavailable", "Check Later"],
      default: "Available",
    },
    lastRateDiscussed: { type: Number },
    leadScore: {
      type: String,
      enum: ["Hot", "Warm", "Cold", "Future Prospect"],
      default: "Warm",
    },
    nextFollowupDate: { type: Date },
    whatsappSent: { type: Boolean, default: false },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
