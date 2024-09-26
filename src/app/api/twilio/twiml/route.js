import { twiml as TwilioTwiml } from "twilio";
import { NextResponse } from "next/server";

async function handler(req) {
  const audioFileUrl = new URL(req.url).searchParams.get("audioFileUrl");
  const voiceResponse = new TwilioTwiml.VoiceResponse();

  // Play custom audio
  voiceResponse.play(audioFileUrl); // Your custom audio URL

  return new NextResponse(voiceResponse.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
}

export { handler as GET, handler as POST };
