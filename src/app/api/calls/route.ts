import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Call from "@/models/Call";
import Customer from "@/models/Customer"; // Need to import this so Mongoose registers the ref model

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const exporterId = searchParams.get("exporterId");
    const query = exporterId ? { exporterId } : {};
    const calls = await Call.find(query).populate("exporterId").sort({ callDate: -1 });
    
    // Map ref objects to flat CallLog interfaces expected by frontend
    const mappedCalls = calls.map((c: any) => {
      const cust = c.exporterId;
      return {
        _id: c._id,
        id: String(c._id),
        customerId: cust ? String(cust._id) : "",
        customerName: cust ? cust.name : "Unknown Customer",
        company: cust ? cust.company : "Unknown Company",
        duration: String(c.duration || 0),
        date: c.callDate ? c.callDate.toISOString() : new Date().toISOString(),
        status: c.status || "Completed",
        sentiment: (c.outcome || "Neutral"),
        summary: c.outcome || "Call completed.",
        transcript: c.transcript || []
      };
    });
    
    return NextResponse.json(mappedCalls);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const call = await Call.create(body);
    return NextResponse.json(call, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
