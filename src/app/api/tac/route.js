import { NextResponse } from "next/server";
import connect from "../../utils/mongodb/connect";
import TermsAndConditions from "../../models/termsAndConditions";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const isConnected = await connect();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const userTerms = await TermsAndConditions.findOne({ email });

    return NextResponse.json({
      accepted: userTerms?.accepted || false,
    });
  } catch (error) {
    console.error("Error checking terms and conditions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}