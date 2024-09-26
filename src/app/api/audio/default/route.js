import { NextResponse } from "next/server";
import connect from "../../../utils/mongodb/connect";

export async function GET(req) {
  try {
    const client = await connect();
    const db = client.db("prankar");
    const collection = db.collection("preloadedaudio");
    const audio = await collection.find({}).toArray();
    console.log(audio);
    return NextResponse.json({ audio }, { status: 200 });
  } catch (error) {
    console.error("Error fetching audio:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 500 }
    );
  }
}
