import twilio from "twilio";

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function makeCall(audioFileUrl, toPhoneNumber = "+9175175505361") {
  return new Promise((resolve, reject) => {
    client.calls
      .create({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/twiml?audioFileUrl=${audioFileUrl}`, // TwiML endpoint (we'll create this next)
        to: toPhoneNumber, // Recipient's phone number
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        record: true, // Enable recording
        statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/call-status`,
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        recordingStatusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/recording`,
      })
      .then((call) => {
        resolve({ message: "Call initiated", callSid: call.sid });
      })
      .catch((error) => {
        console.error("Error making call:", error);
        reject({ error: error.message });
      });
  });
}

export default makeCall;