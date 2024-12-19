import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import connect from "app/utils/mongodb/connect";
import User from "app/utils/MongoSchema/user";

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    //  console.log("Using webhook secret:", webhookSecret?.slice(0, 4) + "..."); // Log partial secret for debugging

    const expectedSignature = createHmac("sha256", webhookSecret || "")
      .update(body)
      .digest("hex");

    if (!signature || signature !== expectedSignature) {
      return NextResponse.json(
        {
          error: "Invalid signature",
          expected: expectedSignature,
          received: signature,
        },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);

    const { event, payload: eventPayload } = payload;
    //  console.log("payload", payload);

    // Handle different webhook events
    switch (event) {
      case "payment.captured":
        // Extract email from payment entity
        const email = eventPayload.payment.entity.email;
        const notes = eventPayload.payment.entity.notes;
        //  console.log("Customer email:", email);
        //  console.log("Payment details:", {
        //   email,
        //   notes,
        //   amount: eventPayload.payment.entity.amount,
        //   paymentId: eventPayload.payment.entity.id,
        // });

        // Connect to MongoDB
        await connect();
        let units = eventPayload.payment.entity.amount / 100;
        units = units / 4;

        // Update user credits
        const user = await User.findOneAndUpdate(
          { email },
          { $inc: { credits: units } },
          { new: true }
        );
        //  console.log("User credits updated:", user);

        break;

      case "payment.failed":
        // Handle failed payment
        //  console.log("Payment failed:", eventPayload.payment.entity);
        break;

      default:
      //  console.log("Unhandled event:", event);
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error details:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
