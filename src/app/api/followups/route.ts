import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Followup from "@/models/Followup";
import Customer from "@/models/Customer";

export async function GET() {
  try {
    await dbConnect();
    const followups = await Followup.find({}).populate("exporterId").sort({ scheduledDate: 1 });
    
    const mappedFollowups = followups.map((f: any) => {
      const cust = f.exporterId;
      return {
        _id: f._id,
        id: String(f._id),
        customerId: cust ? String(cust._id) : "",
        customerName: cust ? cust.name : "Unknown Exporter",
        company: cust ? cust.company : "Unknown Company",
        initials: cust ? cust.name.substring(0, 2).toUpperCase() : "U",
        time: f.scheduledDate ? f.scheduledDate.toISOString() : new Date().toISOString(),
        type: f.type || "Call",
        status: f.status === "Done" ? "Completed" : f.status || "Pending",
        priority: "Medium",
        aiNotes: f.notes || "No notes available."
      };
    });
    
    return NextResponse.json(mappedFollowups);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Map customerId from frontend format if provided
    if (body.customerId && !body.exporterId) {
      body.exporterId = body.customerId;
    }
    
    // Map frontend Completed status to Done
    if (body.status === "Completed") {
      body.status = "Done";
    }
    
    if (body.time && !body.scheduledDate) {
      body.scheduledDate = new Date(body.time);
    }
    
    if (body.aiNotes && !body.notes) {
      body.notes = body.aiNotes;
    }
    
    const followup = await Followup.create(body);
    return NextResponse.json(followup, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
