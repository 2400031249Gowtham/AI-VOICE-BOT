import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const exporterId = searchParams.get("exporterId");
    
    const query = exporterId ? { exporterId } : {};
    const conversations = await Conversation.find(query).populate("exporterId").sort({ createdAt: -1 });
    
    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (body.customerId && !body.exporterId) {
      body.exporterId = body.customerId;
    }
    
    let convo = await Conversation.findOne({ 
      exporterId: body.exporterId,
      channel: body.channel || "whatsapp"
    });
    
    const newMessage = {
      sender: body.sender || "AI",
      text: body.text || body.content || "",
      time: new Date()
    };
    
    if (convo) {
      convo.messages.push(newMessage);
      await convo.save();
    } else {
      convo = await Conversation.create({
        exporterId: body.exporterId,
        channel: body.channel || "whatsapp",
        messages: [newMessage]
      });
    }
    
    return NextResponse.json(convo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
