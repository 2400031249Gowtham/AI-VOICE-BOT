import mongoose, { Schema, Document } from "mongoose";

export interface ICall extends Document {
  exporterId: mongoose.Types.ObjectId;
  duration?: number;
  status?: string;
  transcript: { speaker: "AI" | "Customer"; text: string; time: Date }[];
  callDate: Date;
  outcome?: string;
  followupScheduled?: boolean;
  followupDate?: Date;
}

const CallSchema: Schema = new Schema(
  {
    exporterId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    duration: { type: Number, default: 0 },
    status: { type: String, default: "completed" },
    transcript: [
      {
        speaker: { type: String, enum: ["AI", "Customer"], required: true },
        text: { type: String, required: true },
        time: { type: Date, default: Date.now },
      },
    ],
    callDate: { type: Date, default: Date.now },
    outcome: { type: String },
    followupScheduled: { type: Boolean, default: false },
    followupDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Call || mongoose.model<ICall>("Call", CallSchema);
