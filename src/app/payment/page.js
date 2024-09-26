"use client";
import React from "react";
import { Poppins } from "next/font/google";
import { Input } from "components/ui/input";
const poppins = Poppins({
  weight: ["400", "500"],
  subsets: ["latin"],
});
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Loader3 from "components/custom/loader3";
import toast from "react-hot-toast";

function Paypal() {
  const initialOptions = {
    "client-id":
      "AflEnex5QdfWv-7Y9qorPmePi3LlQ_w4GKazu1AoCm2AVL3gIzB96LCB2EuiuuX4qlKH3jjQl_HN4nKG",
    "enable-funding": "venmo",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
    intent: "capture", //cc
  };

  const style = {
    layout: "vertical",
    color: "blue",
    shape: "rect",
    label: "paypal",
    height: 40,
  };

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <PayPalScriptProvider className="" options={initialOptions}>
      {isLoading ? (
        <Loader3 />
      ) : (
        <PayPalButtons
          // disabled={
          //   totalAmount > 0 &&
          //   addressToBeShown &&
          //   cartItems.cart.length > 0 &&
          //   deliveryCharges > 0
          //     ? false
          //     : true
          // }
          style={style}
          createOrder={async () => {
            try {
              const response = await fetch("/api/payment/createOrder", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ d: "d", credits: 50 }),
              });

              const orderData = await response.json();

              if (orderData.id) {
                console.log("orderData.id", orderData.id);
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            console.log("onApprove", data, actions);
            try {
              const response = await fetch(
                `/api/payment/captureOrder/${data.orderID}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const orderData = await response.json();
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message

              console.log("orderData", orderData);

              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
              } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`
                );
              } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                // const transaction =
                //   orderData.purchase_units[0].payments.captures[0];
                // setMessage(
                //   `Transaction ${transaction.status}: ${transaction.id}. See console for all available details``Transaction : . See console for all available details`
                // );
              }
            } catch (error) {
              console.error(error);
              setMessage(
                `Sorry, your transaction could not be processed...${error}`
              );
            }
          }}
          onShippingChange={async (data, actions) => {
            return actions.resolve();
          }}
          onError={(error) => {
            console.error(error);
            setMessage(
              `Sorry, your transaction could not be processed...${error}`
            );
          }}
        />
      )}
    </PayPalScriptProvider>
  );
}
const Payment = () => {
  const [selectedElement, setSelectedElement] = React.useState(0);
  const [amount, setAmount] = React.useState(null);

  React.useEffect(() => {
    console.log("selectedElement ", selectedElement);
    console.log("amount ", amount);
  });

  function setElement(index) {
    setSelectedElement(index);
    setAmount(0);
  }

  return (
    <div className={`text-white w-full select-none ${poppins.className}`}>
      <h1 className="font-bold text-xl text-center  mx-auto p-5 py-8">
        {" "}
        Buy Credits{" "}
      </h1>

      <div className="max-w-[750px] mx-auto">
        <h2 className="font-bold text-2xl p-5">Select your plan</h2>

        <div className="flex flex-col gap-2 bg-[#464646] p-2 rounded-md ">
          <div>
            <div
              className={`flex justify-between p-5 border-b-[1px] border-[#656565] hover:bg-[#94949440] cursor-pointer rounded-sm select-none transition-all ${
                selectedElement === 0 ? "bg-[#656565]" : ""
              }`}
              onClick={() => setElement(0)}
            >
              <div className="flex justify-between w-full">
                <h3 className="text-xl font-bold">$4.99</h3>
                <p className="text-lg">25 credits</p>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex justify-between p-5  border-b-[1px] border-[#656565] hover:bg-[#94949440] cursor-pointer rounded-sm select-none transition-all ${
                selectedElement === 1 ? "bg-[#656565]" : ""
              }`}
              onClick={() => setElement(1)}
            >
              <div className="flex justify-between w-full">
                <h3 className="text-xl font-bold">$9.99</h3>
                <p className="text-lg">55 credits</p>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex justify-between p-5  border-b-[1px] border-[#656565] hover:bg-[#94949440] cursor-pointer rounded-sm select-none transition-all 
                ${selectedElement === 2 ? "bg-[#656565]" : ""}
                  `}
              onClick={() => setElement(2)}
            >
              <div className="flex justify-between w-full">
                <h3 className="text-xl font-bold">$16.99</h3>
                <p className="text-lg">100 credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div className="px-3 max-w-[750px] mx-auto">
        <h2 className="font-bold text-2xl p-5">Customized</h2>
        <div className="pb-2">
          <div className="text-lg max-w-[450px] flex justify-between">
            <span>Price</span>
            <span>$0.1</span>
          </div>
        </div>
        <Input
          onChange={(e) => {
            // console.log(e.target.value);
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              setAmount(value);
              setSelectedElement(null);
            }
            // setAmount(e.target.value);
          }}
          onBlur={(e) => {
            if (amount === "") {
              setAmount(null);
            } else {
              if (amount < 5) {
                toast.error("Minimum 5 credits");
                setAmount(5);
              } else if (amount > 1000) {
                toast.error("Maximum 1000 credits");
                setAmount(1000);
              }
            }
          }}
          value={amount}
          type="text"
          placeholder="min 5 credits"
          className="w-full p-5 border-none bg-[#535353] text-lg font-semibold placeholder:text-[#d0d0d0] placeholder:font-normal max-w-[450px]"
        />
      </div>

      <br />
      <br />
      <div className="px-3 max-w-[750px] mx-auto text-center">
        {/* <button className="bg-[#227B94] active:scale-95 p-4 px-6 cursor-pointer rounded-md font-semibold">
        Continue
      </button> */}
        <Paypal />
      </div>
    </div>
  );
};

export default Payment;
