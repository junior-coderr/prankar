import { NextResponse } from "next/server";
import connect from "../../../utils/mongodb/connect";
import User from "app/utils/MongoSchema/user";

export async function POST(req) {
  try {
    await connect();
    const { email } = await req.json();
    const user = await User.findOne({ email });
    return NextResponse.json(
      { credits: user.credits, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get credits:", error);
    return NextResponse.json(
      { error: "Failed to get credits", success: false },
      { status: 500 }
    );
  }
}
