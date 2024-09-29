import { generateAccessToken } from "../../../utils/paypal/generateAccessToken";
import { handleResponse } from "../../../utils/paypal/handleResponse";
import { NextResponse } from "next/server";
const base = "https://api-m.sandbox.paypal.com";

const createOrder = async (data, email) => {
  console.log("data :2:", data);
  try {
    let total = 0;
    const credits = data.credits;
    const plan = parseInt(data.element, 10);
    if (plan === 0) {
      console.log("plan", plan);
      total = 3.5;
    } else if (plan === 1) {
      total = 7.2;
    } else if (plan === 2) {
      total = 12.7;
    } else if (plan === 4) {
      total =
        ((credits * 0.1) / 100) * 2.9 + credits * 0.1 + 0.3 + credits * 0.02;
      console.log("total :", total);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid plan",
        },
        { status: 400 }
      );
    }

    if (total < 0 && total == 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
        },
        { status: 400 }
      );
    }
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE", //cc
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
          },
          custom_id: email,
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
  // const userEmail = await sessionEmail(req);

  try {
    // use the cart information passed from the front-end to calculate the order amount details
    const data = await req.json();
    console.log("data", data);
    if (!data.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }
    const { jsonResponse, httpStatusCode } = await createOrder(
      data,
      data.email
    );
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
