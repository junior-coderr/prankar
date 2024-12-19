const base = "https://api-m.paypal.com";
// import { generateAccessToken } from "../../../../../helpers/palpal/generateAccessToken";
import { generateAccessToken } from "../../../../utils/paypal/generateAccessToken";
import { handleResponse } from "../../../../utils/paypal/handleResponse";
import { NextResponse } from "next/server";
import connect from "app/utils/mongodb/connect";
import User from "app/utils/MongoSchema/user";

// captureOrder.js
const captureOrder = async (orderID, email) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  //  console.log("captureOrder url:", url);
  //  console.log("orderID:", orderID);
  if (!email) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid email",
      },
      { status: 400 }
    );
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only).
      // Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response":
      //   '{"mock_application_codes": "INSTRUMENT_DECLINED"}',
      // "PayPal-Mock-Response":
      //   '{"mock_application_codes": "TRANSACTION_REFUSED"}',
      // "PayPal-Mock-Response":
      //   '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}',
    },
  });
  const { jsonResponse, httpStatusCode, amount } = await handleResponse(
    response
  );
  if (jsonResponse.status === "COMPLETED") {
    // TODO:  Update in the main database
    // TODO: Return Payment successful
    // * No need to have sse for  check in the success hook
    await connect();

    let credits = 0;
    if (amount === 3.5) {
      credits = 25;
    } else if (amount === 7.2) {
      credits = 55;
    } else if (amount === 12.7) {
      credits = 100;
    } else {
      credits = Math.round((Number(amount) - 0.3) / 0.1229);
    }

    //  console.log("credits::", credits);
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { credits: credits } },
      { new: true }
    ).exec();
    //  console.log("user updated", user);
  }

  // TODO: if not updated db success then update in hook success so that we can have sse for check, now update in sqllite db about this faliure
  return { jsonResponse, httpStatusCode };
};

// captureOrder route
export async function POST(req, { params }) {
  try {
    const { id } = params;
    const userData = await req.json();

    const { jsonResponse, httpStatusCode } = await captureOrder(
      id,
      userData.email
    );
    //  console.log("this is running !!");
    //  console.log("jsonResponse: ", jsonResponse);
    //  console.log("httpStatusCode: ", httpStatusCode);
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: `Failed to create order.${error.message}` },
      { status: 500 }
    );
  }
}
