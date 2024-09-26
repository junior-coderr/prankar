const base = "https://api-m.sandbox.paypal.com";
// import { generateAccessToken } from "../../../../../helpers/palpal/generateAccessToken";
import { generateAccessToken } from "../../../../utils/paypal/generateAccessToken";
import { handleResponse } from "../../../../utils/paypal/handleResponse";
import { NextResponse } from "next/server";

// captureOrder.js
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  console.log("captureOrder url:", url);
  console.log("orderID:", orderID);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only).
      // Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

// captureOrder route
export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { jsonResponse, httpStatusCode } = await captureOrder(id);
    console.log("this is running !!");
    console.log("jsonResponse: ", jsonResponse);
    console.log("httpStatusCode: ", httpStatusCode);
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: `Failed to create order.${error.message}` },
      { status: 500 }
    );
  }
}
