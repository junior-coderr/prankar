import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function handler(req) {
  try {
    // Get token from cookies using next/headers
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    console.log("token", token);

    if (!token) {
      return NextResponse.json(
        { error: "Session token not found in cookies" },
        { status: 401 }
      );
    }

    // Decode the token
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Return the decoded data
    return NextResponse.json(decoded);
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export { handler as GET };
