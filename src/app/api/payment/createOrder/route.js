import { generateAccessToken } from "../../../utils/paypal/generateAccessToken";
import { handleResponse } from "../../../utils/paypal/handleResponse";
import { NextResponse } from "next/server";

// Update the base URL for live mode
const base = "https://api-m.paypal.com";

const createOrder = async (data, email) => {
  console.log("data :2:", data);
  try {
    let total = 0;
    const credits = data.credits;
    const plan = parseInt(data.element, 10);

    // Plan pricing logic
    if (plan === 0) {
      total = 3.5;
    } else if (plan === 1) {
      total = 7.2;
    } else if (plan === 2) {
      total = 12.7;
    } else if (plan === 4) {
      total =
        ((credits * 0.1) / 100) * 2.9 + credits * 0.1 + 0.3 + credits * 0.02;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Validate total amount
    if (total <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Generate access token
    const accessToken = await generateAccessToken();

    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE", // For immediate payment
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
          },
          custom_id: email, // Optional: for tracking
        },
      ],
    };

    // Create PayPal order
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("error", error);
    throw new Error(error.message);
  }
};

// POST route to handle order creation
export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const { jsonResponse, httpStatusCode } = await createOrder(
      data,
      data.email
    );
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: `Failed to create order. ${error.message}` },
      { status: 500 }
    );
  }
}
