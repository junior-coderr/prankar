import { NextResponse } from "next/server";
import Contact from "../../models/contactus";
import connectDB from "../../utils/mongodb/connect";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    await connectDB();

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send message." },
      { status: 500 }
    );
  }
}
