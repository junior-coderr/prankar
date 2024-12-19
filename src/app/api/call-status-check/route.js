import { NextResponse } from "next/server";
import createTable from "../../utils/sqllite/connect";
export async function GET(request) {
  let uniqueId = null;
  const url = new URL(request.url);
  const sid = url.searchParams.get("sid");
  // console.log("sid", sid);

  const sharedStream = new ReadableStream({
    start(controller) {
      let interval;
      let isSetTimeout = false;
      let isBusy = false;
      const push = async () => {
        try {
          const db = await createTable();

          const dbData = await db.get(
            "SELECT * FROM callStatus WHERE sid = ?",
            sid.toString()
          );

          if (!dbData) {
            // console.log("No data found");
            if (controller) {
              controller.close();
              clearInterval(interval);
              // console.log("Interval cleared");
            }
            return;
          }

          const data = JSON.stringify({
            message: `Call status updated for id: ${sid}`,
            Data: dbData,
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(`data: ${data}\n\n`);
          // console.log("Pushed data:", data);
          // Continue sending data every second

          // console.log("dbData.status", dbData?.status);
          if (!dbData?.status) {
            return;
          }
          if (dbData?.status === "completed") {
            if (isSetTimeout) {
              return;
            }
            isSetTimeout = true;
            setTimeout(() => {
              if (interval) {
                clearInterval(interval);
                // console.log("Interval cleared");
              }
              if (controller) {
                controller.close();
                // console.log("Controller closed");
              }
              isSetTimeout = false;
              // return;
            }, 16000);
          } else if (
            dbData?.status === "initiated" ||
            dbData?.status === "in-progress" ||
            dbData?.status === "ringing"
          ) {
            // return;
          } else if (dbData?.status === "busy") {
            if (isBusy) {
              return;
            }
            isBusy = true;
            setTimeout(() => {
              if (interval) {
                clearInterval(interval);
                // console.log("Interval cleared");
              }
              if (controller) {
                controller.close();
                // console.log("Controller closed");
              }
              isBusy = false;
              // clearInterval(interval);
              // console.log("Interval cleared");
              // isBusy = false;
            }, 6000);
          } else {
            if (controller) {
              controller.close();
              clearInterval(interval);
              // console.log("Interval cleared");
            }
          }
        } catch (error) {
          console.error("Failed to push data:", error);
          if (controller) {
            controller.close();
            clearInterval(interval);
            // console.log("Interval cleared by catch");
            controller.error(error);
          }
        }
      };
      interval = setInterval(push, 5000);
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
