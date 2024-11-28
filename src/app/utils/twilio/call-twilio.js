import twilio from "twilio";

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function makeCall(audioFileUrl, toPhoneNumber = "+9175175505361", email) {
  return new Promise((resolve, reject) => {
    client.calls
      .create({
        url: `${process.env.NEXTAUTH_URL_T}/api/twilio/twiml?audioFileUrl=${audioFileUrl}`, // TwiML endpoint (we'll create this next)
        to: toPhoneNumber, // Recipient's phone number
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        record: true, // Enable recording
        statusCallback: `${process.env.NEXTAUTH_URL_T}/api/twilio/call-status?email=${email}`,
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        recordingStatusCallback: `${process.env.NEXTAUTH_URL_T}/api/twilio/recording?email=${email}`,
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
