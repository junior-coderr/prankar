import { generateAccessToken } from "../../../utils/paypal/generateAccessToken";
import { handleResponse } from "../../../utils/paypal/handleResponse";
import { NextResponse } from "next/server";
const base = "https://api-m.sandbox.paypal.com";
import { getSession } from "next-auth/react";
const getEmailFromSession = async () => {
  const session = await getSession();
  console.log("session", session);
  // if (session && session.user && session.user.email) {
  //   return session.user.email;
  // } else {
  //   throw new Error("Email not found in session");
  // }
};

const email = await getEmailFromSession();

// createOrder.js
const createOrder = async (data) => {
  try {
    const total = "2";
    const credits = data.credits;
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE", //cc
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total,
          },
          custom_id: "email",
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    console.log("error", error);
    throw new Error(error.message);
    // return { success: false, error: `Failed to create order.${error.message}` };
  }
};

// createOrder route
export async function POST(req) {
  try {
    // use the cart information passed from the front-end to calculate the order amount details
    const data = await req.json();
    console.log("data", data.d);
    const { jsonResponse, httpStatusCode } = await createOrder(data);
    // res.status(httpStatusCode).json(jsonResponse);
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to create order:", error);
    // res.status(500).json({ error: "Failed to create order." });
    return NextResponse.json(
      { error: `Failed to create order.${error.message}` },
      { status: 500 }
    );
  }
}
