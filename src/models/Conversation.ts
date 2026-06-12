import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  exporterId: mongoose.Types.ObjectId;
  channel: "whatsapp" | "email" | "call";
  messages: { sender: string; text: string; time: Date }[];
  createdAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    exporterId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    channel: {
      type: String,
      enum: ["whatsapp", "email", "call"],
      default: "whatsapp",
    },
    messages: [
      {
        sender: { type: String, required: true },
        text: { type: String, required: true },
        time: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
