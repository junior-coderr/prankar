import { NextResponse } from "next/server";
import customAudioUpload from "../../utils/custom-audio-upload";
import connect from "../../utils/mongodb/connect";
import { preloadedaudio } from "../../utils/MongoSchema/user";
import User from "../../utils/MongoSchema/user";

import callTwilio from "../../utils/twilio/call-twilio";
let audioArr = null;

async function getAudioFromDB() {
  try {
    await new Promise(async (resolve, reject) => {
      try {
        await connect();
        let audio = await preloadedaudio.find({});
        audioArr = audio[0].audios;
        // //  console.log("audio in default sendiiii", audioArr);
        resolve();
      } catch (error) {
        console.error("Error getting audio from DB:", error);
        reject(
          {
            message: "Error in DB 2",
          },
          { status: 500 }
        );
      }
    });
  } catch (error) {
    console.error("Error getting audio from DB:", error);
    return { message: "Error in DB" }, { status: 500 };
  }
}

// Function to handle audio selection uploads
async function audioSelectedUpload(request, email) {
  try {
    // Parse JSON data from the request
    const res = await request.json();
    const selectedAudioIndex = res.audioSelected;
    const phoneNo = res.phoneNo.replace(" ", "");
    //  console.log("phoneNo", phoneNo);
    if (audioArr == null) {
      await getAudioFromDB();
    }

    if (audioArr != null) {
      // audioArr = audioArr.flat();
      const selectedAudio = audioArr[selectedAudioIndex];
      //  console.log("selectedAudio", selectedAudio);

      const twilioCall = await callTwilio(selectedAudio, phoneNo, email);
      return {
        message: "Audio selected uploaded successfully",
        selectedAudio,
        twilioCall,
        status: 200,
      };
    }
    return {
      message: "Seems some error",
      selectedAudio: null,
      twilioCall: null,
      status: 400,
    };
  } catch (error) {
    // Log error and return error response
    console.error("Error uploading audio 2:", error);
    return { error: "Error uploading audio 2" }, { status: 500 };
  }
}

// Main POST handler for audio uploads
export async function POST(request) {
  try {
    //  console.log("request.headers", request.headers);
    const email = request.headers.get("x-user-email");
    //  console.log("email upload audio", email);

    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: email });
    const credits = user.credits;
    //  console.log("credits", credits);
    if (credits <= 0) {
      return NextResponse.json(
        { message: "Insufficient credits" },
        { status: 402 }
      );
    }

    // * checked user as well as credits

    // return NextResponse.json({
    //   message: "User and credits checked",
    //   status: 200,
    // });

    // Check the content type of the request
    if (request.headers.get("content-type")?.includes("application/json")) {
      // Handle audio selected upload
      return NextResponse.json(await audioSelectedUpload(request, email));
    } else if (
      request.headers.get("content-type")?.includes("multipart/form-data")
    ) {
      // Handle custom audio file upload
      return NextResponse.json(
        await customAudioUpload(request, "general", null, email)
      );
    } else {
      // Return error for unsupported content type
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }
  } catch (error) {
    // Log error and return error response
    console.error("Error uploading audio:", error);
    return NextResponse.json(
      { error: "Error uploading audio" },
      { status: 500 }
    );
  }
}
