import { NextResponse } from "next/server";
import connect from "../../../utils/mongodb/connect";
import { preloadedaudio } from "../../../utils/MongoSchema/user";

export async function GET(req) {
  try {
    await connect();
    let audio = await preloadedaudio.find({});
    audio = audio[0].audios;
    // console.log("audio in default sendi", audio);
    return NextResponse.json({ audio }, { status: 200 });
  } catch (error) {
    console.error("Error fetching audio:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
