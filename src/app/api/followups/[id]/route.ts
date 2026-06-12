import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Followup from "@/models/Followup";

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    if (body.status === "Completed") {
      body.status = "Done";
    }
    
    if (body.time && !body.scheduledDate) {
      body.scheduledDate = new Date(body.time);
    }
    
    const followup = await Followup.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });
    
    if (!followup) {
      return NextResponse.json({ error: "Followup not found" }, { status: 404 });
    }
    
    return NextResponse.json(followup);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
