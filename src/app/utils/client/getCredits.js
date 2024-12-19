async function getCredits(email) {
  try {
    // console.log("email xjs", email);
    const get = await fetch("/api/client/getCredits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    // console.log("fetch xjs", get);
    const response = await get.json();

    // console.log("response xjs", response);
    if (response.success) {
      return response.credits;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Failed to get credits:", error);
    return null;
  }
}

export default getCredits;
