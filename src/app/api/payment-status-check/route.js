import { NextResponse } from "next/server";
import { createUserTable } from "../../utils/sqllite/connect";

export async function GET(request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  console.log("email from url param", email);

  const sharedStream = new ReadableStream({
    async start(controller) {
      let interval;
      let time = 0;

      const db = await createUserTable();

      async function checkStatus() {
        time += 1;
        const query2 = `SELECT * FROM paymentStatus WHERE email = ?`;

        const dbData = await db.get(query2, [email]);

        console.log("dbData", dbData);
        console.log("status", dbData?.status);

        if (dbData?.status === "completed") {
          // clearInterval(interval);
          const data = JSON.stringify({
            message: "Payment completed",
            success: true,
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(`data: ${data}\n\n`);

          clearInterval(interval);
          if (controller) {
            controller.close();
            console.log("Controller closed after completion");
          }
        } else {
          if (time > 6) {
            clearInterval(interval);
            if (controller) controller.close();

            return;
          }
        }
      }

      interval = setInterval(checkStatus, 4000);
    },
  });

  return new NextResponse(sharedStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
