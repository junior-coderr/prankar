import { encode } from "next-auth/jwt";
import { NextResponse } from "next/server";

async function handler(req) {
  try {
    const { email, name, image } = await req.json();

    // Ensure required data is provided
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required." },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = await encode({
      secret: process.env.NEXTAUTH_SECRET,
      token: {
        email,
        name,
        image, // Optional, if provided by frontend
        role: "user", // Example custom field, hardcoded or passed
      },
    });

    // Set the JWT in a secure HTTP-only cookie with NextAuth's default name
    const response = NextResponse.json({
      message: "Session created successfully.",
      token, // Optional: Send token back if needed
    });
    response.headers.set(
      "Set-Cookie",
      `__Host-next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );
    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export { handler as POST };
