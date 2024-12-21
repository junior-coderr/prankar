import { NextResponse } from "next/server";
import createTable from "../../utils/sqllite/connect";
export async function GET(request) {
  let uniqueId = null;
  const url = new URL(request.url);
  const sid = url.searchParams.get("sid");
  console.log("sid", sid);

  const sharedStream = new ReadableStream({
    start(controller) {
      let interval;
      let isSetTimeout = false;
      let isBusy = false;
      let isControllerClosed = false;
      let timeoutId = null;

      const safeCloseController = () => {
        if (!isControllerClosed) {
          isControllerClosed = true; // Set flag first
          if (interval) {
            clearInterval(interval);
            interval = null;
            console.log("Interval cleared");
          }
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          try {
            controller.close();
            console.log("Controller closed");
          } catch (error) {
            console.log("Controller already closed or invalid");
          }
        }
      };

      const push = async () => {
        if (isControllerClosed) return;

        try {
          const db = await createTable();
          const dbData = await db.get(
            "SELECT * FROM callStatus WHERE sid = ?",
            sid.toString()
          );

          if (!dbData) {
            console.log("No data found");
            safeCloseController();
            return;
          }

          const data = JSON.stringify({
            message: `Call status updated for id: ${sid}`,
            Data: dbData,
            timestamp: new Date().toISOString(),
          });

          try {
            if (!isControllerClosed) {
              controller.enqueue(`data: ${data}\n\n`);
              console.log("Pushed data:", data);
            }
          } catch (error) {
            console.log("Failed to enqueue data, closing controller");
            safeCloseController();
            return;
          }

          if (!dbData?.status) return;

          switch (dbData.status) {
            case "completed":
              if (!isSetTimeout) {
                isSetTimeout = true;
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(safeCloseController, 16000);
              }
              break;
            case "busy":
              if (!isBusy) {
                isBusy = true;
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(safeCloseController, 6000);
              }
              break;
            case "initiated":
            case "in-progress":
            case "ringing":
              break;
            default:
              safeCloseController();
          }
        } catch (error) {
          console.error("Failed to push data:", error);
          safeCloseController();
        }
      };

      interval = setInterval(push, 5000);

      // Cleanup function
      return () => {
        safeCloseController();
      };
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
