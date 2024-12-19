import { NextResponse } from "next/server";

import customAudioUpload from "../../../utils/custom-audio-upload";
import createTable from "../../../utils/sqllite/connect";
import connect from "app/utils/mongodb/connect";
import User from "app/utils/MongoSchema/user";

export async function POST(req) {
  try {
    const text = await req.text(); // Get the raw text from the request
    const params = new URLSearchParams(text); // Parse the text as form data
    const queryParams = Object.fromEntries(new URL(req.url).searchParams);
    //  console.log("Query Params:", queryParams);
    const email = queryParams?.email;

    // Convert form data to an object
    const body = Object.fromEntries(params);

    //  * decreasing the credit of the user
    await connect();
    const user = await User.findOneAndUpdate(
      { email: email },
      { $inc: { credits: -1 } },
      { new: true }
    ).exec();

    // //  console.log("user updated", user);

    // Extract necessary information
    const { CallSid, RecordingUrl } = body;
    // //  console.log("CallSid", CallSid);
    const stdUrl = RecordingUrl;
    //  console.log("stdUrl", stdUrl);
    const publicRecordingUrl = await customAudioUpload(null, "flex", stdUrl);
    //  console.log("publicRecordingUrl", publicRecordingUrl.audioFileUrl);

    const db = await createTable();
    await db.run("UPDATE callStatus SET recordingUrl = ? WHERE sid = ?", [
      publicRecordingUrl.audioFileUrl.toString(),
      CallSid,
    ]);

    const rows = await db.all("SELECT * FROM callStatus");
    // //  console.log("Table rows:", rows);

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
