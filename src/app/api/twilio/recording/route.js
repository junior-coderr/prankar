import { NextResponse } from "next/server";

import customAudioUpload from "../../../utils/custom-audio-upload";
import createTable from "../../../utils/sqllite/connect";

export async function POST(req) {
  try {
    const text = await req.text(); // Get the raw text from the request
    const params = new URLSearchParams(text); // Parse the text as form data

    // Convert form data to an object
    const body = Object.fromEntries(params);

    // Extract necessary information
    const { CallSid, RecordingUrl } = body;
    console.log("CallSid", CallSid);
    const stdUrl = RecordingUrl;
    console.log("stdUrl", stdUrl);
    const publicRecordingUrl = await customAudioUpload(null, "flex", stdUrl);
    console.log("publicRecordingUrl", publicRecordingUrl.audioFileUrl);

    const db = await createTable();
    await db.run("UPDATE callStatus SET recordingUrl = ? WHERE sid = ?", [
      publicRecordingUrl.audioFileUrl.toString(),
      CallSid,
    ]);

    const rows = await db.all("SELECT * FROM callStatus");
    // console.log("Table rows:", rows);

    return NextResponse.json(
      {
        message: "Recording received",
        publicRecordingUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing recording URL:", error);
    return NextResponse.json(
      { error: "Error processing recording URL" },
      { status: 500 }
    );
  }
}
