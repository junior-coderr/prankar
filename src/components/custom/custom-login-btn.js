import React from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

async function manualLogin(router) {
  const response = await fetch("/api/custom-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "user@example.com",
      name: "User Example",
      image:
        "https://img.freepik.com/premium-vector/programming-home_118813-4357.jpg?semt=ais_hybrid", // Optional
    }),
  });

  if (response.ok) {
    console.log("Session created manually");
    const t = await response.json();
    console.log(t);
    const { token } = t;

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    console.log("Decoded Token:", decoded);

    router.push("/home");
    // window.location.reload();
  } else {
    const error = await response.json();
    console.error("Failed to create session:", error);
  }
}

export default function CustomLoginBtn() {
  const router = useRouter();

  const handleLogin = async () => {
    console.log("Logging in manually...");
    await manualLogin(router);
  };

  return <p onClick={handleLogin}>Custom Login</p>;
}
