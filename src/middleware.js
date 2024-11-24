// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function middleware(req) {
  // Get the token from the request using NextAuth's built-in helper
  let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const cookieStore = cookies();
    var t = cookieStore.get("token")?.value;
    if (!t) {
      // If no token is found, redirect or return an unauthorized response
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      try {
        const decoded = await decode({
          token: t, // Change: use 'token' instead of passing t directly
          secret: process.env.NEXTAUTH_SECRET,
        });

        if (!decoded) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        token = decoded;
        console.log("decoded token:", decoded);
      } catch (error) {
        console.error("Token decode error:", error);
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    // return NextResponse.next();
  }

  // Access the user's email from the token
  const userEmail = token.email;
  console.log("userEmail in middleware", userEmail);
  const Header = new Headers(req.headers);
  Header.set("x-user-email", userEmail);
  const responseHeader = NextResponse.next({
    request: {
      headers: Header,
    },
  });
  return responseHeader;
}

// You can configure paths that the middleware should run on
export const config = {
  matcher: ["/api/upload-audio"], // Define routes where the middleware should apply
};
