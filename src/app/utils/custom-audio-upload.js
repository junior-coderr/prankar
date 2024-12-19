import callTwilio from "./twilio/call-twilio";
import { BlobServiceClient } from "@azure/storage-blob";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Function to handle audio file uploads
export default async function customAudioUpload(
  request = null,
  type = "general",
  url = null,
  email = null
) {
  return new Promise(async (resolve, reject) => {
    try {
      // Retrieve form data from the request
      if (type === "general") {
        let formData = await request.formData();
        var phoneNo = formData.get("phoneNo");
        var audioFile = formData.get("audioFile");
        phoneNo = phoneNo.replace(" ", "");
        // console.log("phone no from custom", phoneNo);
        // console.log(audioFile);

        // Check if the audio file is provided
        if (!audioFile && type !== "flex") {
          return reject({
            message: "Audio file is required",
            status: 400,
          });
        }
      }

      let audioFileBuffer;

      if (type === "flex") {
        if (!url) {
          return reject({
            message: "Recording URL is required",
            status: 400,
          });
        }

        if (!accountSid || !authToken) {
          return reject({
            message: "Twilio credentials are required",
            status: 400,
          });
        }

        const credentials = `${accountSid}:${authToken}`;
        const encodedCredentials = Buffer.from(credentials).toString("base64");

        // Fetch audio from Twilio URL
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text(); // Proper error logging
          return reject({
            message: `Error fetching Twilio recording: ${response.status} ${response.statusText}. Details: ${errorText}`,
            status: response.status,
          });
        }

        // Fetch audio data as array buffer
        audioFileBuffer = await response.arrayBuffer();
      } else {
        // Convert base64 string to buffer for general audio file
        audioFileBuffer = await audioFile.arrayBuffer();
      }

      // Azure Blob Upload
      const connectionString = process.env.BLOB_C_STRING; // Changed from BLOB_C_String to BLOB_C_STRING
      // console.log("Environment variables:", {
        hasBlobString: !!process.env.BLOB_C_STRING,
        blobStringLength: process.env.BLOB_C_STRING?.length,
      });

      if (!connectionString) {
        throw new Error("Azure Storage connection string is not configured");
      }

      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);

      if (!blobServiceClient) {
        throw new Error("Failed to create Azure Blob Service client");
      }

      const containerName = type === "general" ? "audio" : "call-recording";
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      try {
        const containerExists = await containerClient.exists();
        if (!containerExists) {
          await containerClient.create();
        }
      } catch (error) {
        throw new Error(
          `Failed to access or create container: ${error.message}`
        );
      }

      // Use either the provided audioFile name or generate a unique name for "flex"
      const blobName = `flex-audio-${Date.now()}`;
      // const blobName = "audio_user_uploaded.mp3";
      //significant change
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload the audio buffer to Azure Blob
      const uploadBlobResponse = await blockBlobClient.uploadData(
        audioFileBuffer,
        {
          blobHTTPHeaders: {
            blobContentType: "audio/mpeg",
          },
        }
      );

      // Get URL for the uploaded audio file
      const audioFileUrl = blockBlobClient.url;
      let callResponse;

      if (type === "general") {
        callResponse = await callTwilio(audioFileUrl, phoneNo, email); // Pass the audio file URL to Twilio
      }

      // console.log("Call Response:", callResponse);

      // Resolve the promise with success response
      resolve({
        message: "Audio uploaded successfully",
        callResponse: callResponse ? { ...callResponse } : null,
        audioFileUrl: audioFileUrl,
        status: 200,
      });
    } catch (error) {
      // Log error and return error response
      console.error("Error uploading audio:", error);
      reject({
        error: error,
        errorMsg: "Error uploading audio",
        status: 400,
      });
    }
  });
}
