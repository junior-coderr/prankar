import { NextResponse } from "next/server";
import { createUserTable } from "../../utils/sqllite/connect";

export async function GET(request) {
  try {
    const db = await createUserTable();
    const email = "pratik@mgail.com";
    // const query = `INSERT INTO paymentStatus (email, status) VALUES (?, 'completed') ON CONFLICT(email) DO UPDATE SET status = 'completed'`;
    // const d = await db.run(query, [email]);

    // // console.log("Payment Status Table:", d);

    const query2 = `SELECT * FROM paymentStatus WHERE email = ?`;
    const data = await db.all(query2, [email]);
    // console.log("Payment Status Table:", data);
    return NextResponse.json({ data: data[0] });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
