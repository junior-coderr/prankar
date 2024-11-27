import { NextResponse } from "next/server";
// import twilio from "twilio";
import createTable from "../../../utils/sqllite/connect";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioClient = twilio(accountSid, authToken);

async function handler(req) {
  try {
    const text = await req.text(); // Get the raw text from the request
    const params = new URLSearchParams(text); // Parse the text as form data

    // console.log("Email: from check status", email);

    // Convert form data to an object
    const body = Object.fromEntries(params);

    const { CallSid, CallStatus } = body;

    const db = await createTable();
    const existingStatus = await db.get(
      "SELECT * FROM callStatus WHERE sid = ?",
      CallSid.toString()
    );
    if (existingStatus) {
      await db.run("UPDATE callStatus SET status = ? WHERE sid = ?", [
        CallStatus,
        CallSid.toString(),
      ]);
    } else {
      await db.run(
        "INSERT INTO callStatus (sid, status, recordingUrl) VALUES (?, ?, ?)",
        [CallSid.toString(), CallStatus, null]
      );
    }
    console.log("Call Status:", { CallSid, CallStatus });

    return new NextResponse(
      JSON.stringify({
        message: "Recording status received",
        CallSid, // Return CallSid
        CallStatus, // Return CallStatus
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing Twilio webhook:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Error processing webhook",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

export { handler as GET, handler as POST };
