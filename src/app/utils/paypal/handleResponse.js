export async function handleResponse(response) {
  try {
    // // console.log("response from capture :", response);

    const jsonResponse = await response.json();

    // // Convert nested objects to readable form
    // if (jsonResponse.purchase_units && jsonResponse.purchase_units.length > 0) {
    //   jsonResponse.purchase_units = jsonResponse.purchase_units.map((unit) => {
    //     if (unit.shipping) {
    //       unit.shipping = JSON.stringify(unit.shipping);
    //     }
    //     if (unit.payments) {
    //       unit.payments = JSON.stringify(unit.payments);
    //     }

    //     // console.log("unit:", unit);
    //   });
    // }
    let parsedAmount = { value: 0 }; // Define parsedAmount outside the if block
    if (jsonResponse.purchase_units && jsonResponse.purchase_units.length > 0) {
      const d = JSON.stringify(jsonResponse.purchase_units[0].payments);
      jsonResponse.purchase_units[0].payments = d;
      const parsedPayments = JSON.parse(d);
      // console.log("unit:", parsedPayments);
      const amount = JSON.stringify(parsedPayments.captures[0].amount);
      parsedAmount = JSON.parse(amount);
      // parsedAmount = parsedAmount.value;
      // console.log("parsedAmount:", parsedAmount.value);
    }
    // // console.log(
    //   "Parsed response from capture:",
    //   JSON.stringify(jsonResponse.purchase_units[0].payments)
    // );
    return {
      jsonResponse,
      httpStatusCode: response.status,
      amount: Number(parsedAmount.value),
      // success: true,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(err);
  }
}
