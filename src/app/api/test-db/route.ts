import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ success: false, error: "MONGODB_URI is undefined in process.env" });
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    const dbName = conn.connection.name;
    // disconnect to avoid connection leak in test route
    await mongoose.disconnect();
    return NextResponse.json({ success: true, message: "Connected successfully", db: dbName });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
