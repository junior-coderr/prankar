import { NextResponse } from "next/server";
import { createUserTable } from "../../../utils/sqllite/connect";

// /Users/pratikmishra/Desktop/current/src/app/api/hooks/success/route.js

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      try {
        // const email = body.resource.payee.email_address;
        // TODO: also Update in the main database
        const email = body.resource.custom_id;
        const db = await createUserTable();
        const query = `INSERT INTO paymentStatus (email, status) VALUES (?, 'completed') ON CONFLICT(email) DO UPDATE SET status = 'completed'`;
        await db.run(query, [email]);

        const query2 = `SELECT * FROM paymentStatus WHERE email = ?`;
        const data = await db.all(query2, [email]);
        console.log("Payment Status Table: added", data);
      } catch (err) {
        console.log("error", err);
        return NextResponse.json(
          { error: "Internal Server Error", success: false },
          { status: 500 }
        );
      }
      console.log("success body from success hook: ", body);
    }

    return NextResponse.json(
      { message: "Payment successful", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing PayPal payment success:", error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
