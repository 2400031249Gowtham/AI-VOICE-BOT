import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MarketRate from "@/models/MarketRate";

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await request.json();
    
    let rate;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      rate = await MarketRate.findById(id);
    } else {
      rate = await MarketRate.findOne({ licenseType: id.toUpperCase() });
    }
    
    if (!rate) {
      return NextResponse.json({ error: "Market rate not found" }, { status: 404 });
    }
    
    rate.lastWeekRate = rate.currentRate;
    rate.currentRate = Number(body.currentRate);
    if (body.updatedBy) {
      rate.updatedBy = body.updatedBy;
    }
    
    await rate.save();
    return NextResponse.json(rate);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
