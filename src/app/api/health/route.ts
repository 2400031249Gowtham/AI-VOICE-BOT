import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json(
      { 
        status: "error", 
        message: "MongoDB not connected" 
      },
      { status: 500 }
    );
  }
  return NextResponse.json({ 
    status: "ok", 
    message: "MongoDB connected",
    db: conn.connection.name 
  });
}
