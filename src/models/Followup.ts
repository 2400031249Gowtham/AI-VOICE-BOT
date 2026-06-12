import mongoose, { Schema, Document } from "mongoose";

export interface IFollowup extends Document {
  exporterId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  type: string;
  status: "Pending" | "Done" | "Missed";
  notes?: string;
  createdAt: Date;
}

const FollowupSchema: Schema = new Schema(
  {
    exporterId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    scheduledDate: { type: Date, required: true },
    type: { type: String, default: "Call" },
    status: {
      type: String,
      enum: ["Pending", "Done", "Missed"],
      default: "Pending",
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Followup || mongoose.model<IFollowup>("Followup", FollowupSchema);
