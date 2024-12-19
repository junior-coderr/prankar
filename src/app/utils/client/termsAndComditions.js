export default async function TermsAndConditions(email) {
  try {
    const result = await fetch("/api/tac", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const response = await result.json();
    return response;
  } catch (error) {
    //  console.log("Error:", error);
    return null;
  }
}
