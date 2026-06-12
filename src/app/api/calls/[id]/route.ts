import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Call from "@/models/Call";
import Customer from "@/models/Customer";

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const call = await Call.findById(id).populate("exporterId");
    
    if (!call) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }
    
    const cust = (call as any).exporterId;
    const mappedCall = {
      _id: call._id,
      id: String(call._id),
      customerId: cust ? String(cust._id) : "",
      customerName: cust ? cust.name : "Unknown Exporter",
      company: cust ? cust.company : "Unknown Company",
      duration: String(call.duration || 0),
      date: call.callDate ? call.callDate.toISOString() : new Date().toISOString(),
      status: call.status || "Completed",
      sentiment: (call.outcome || "Neutral"),
      summary: call.outcome || "Call completed.",
      transcript: call.transcript || []
    };
    
    return NextResponse.json(mappedCall);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
