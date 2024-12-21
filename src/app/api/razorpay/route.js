import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID, // Add this to your `.env` file
      key_secret: process.env.RAZORPAY_SECRET, // Add this to your `.env` file
    });

    const order = await razorpay.orders.create({
      amount, // Amount in paise
      currency: "INR",
      payment_capture: 1, // Auto-capture payment
    });

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create Razorpay order" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
