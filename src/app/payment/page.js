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
import { setElem, setCredits } from "app/redux/slices/transaction.payment";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import Confetti from "react-confetti";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Back from "components/custom/back";

const Payment = () => {
  const [selectedElement, setSelectedElement] = React.useState(0);
  const [amount, setAmount] = React.useState("");
  const [showPrice, setShowPrice] = React.useState(0);
  const dispatch = useDispatch();
  const [width, setWidth] = React.useState(220);
  const [height, setHeight] = React.useState(220);
  const [celebrate, setCelebrate] = React.useState(false);
  const router = useRouter();

  function CelebComp() {
    return (
      <div className="fixed flex items-center justify-center top-0 left-0 bg-[#04040483] w-full z-[1000] h-[100svh]">
        <Confetti width={width} height={height} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1 }}
          className="flex justify-center gap-2 items-center flex-col "
        >
          <RiVerifiedBadgeFill className="text-green-500 text-5xl" />
          <h1 className="text-center text-xl font-semibold">
            Payment completed
          </h1>
        </motion.div>
      </div>
    );
  }
  async function sse(email) {
    const eventSource = new EventSource(
      `/api/payment-status-check?email=${email}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.success) {
        toast.success("Payment completed", {
          duration: 5000,
          bg: "#4caf50",
        });
      }
      console.log("Received SSE data:", data);
      // Handle the received data
    };

    eventSource.onopen = () => {
      console.log("SSE connection opened.");
      // toast.loading("Processing payment");
    };

    eventSource.onerror = (error) => {
      // console.error("SSE error:", error);
      eventSource.close();
    };
  }
  function celebFunction(duration) {
    setCelebrate(true);
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    setTimeout(() => {});
    setTimeout(() => {
      router.push("/home");
    }, duration);
  }

  function Paypal() {
    const element = useSelector((state) => state.transaction.element);
    const credits = useSelector((state) => state.transaction.credits);
    const { data: session } = useSession();

    // React.useEffect(() => {
    //   console.log("session", session);
    // }, [session]);

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

    React.useEffect(() => {
      console.log("credits new :", credits);
      console.log("elements: new", element);
    }, [element, credits]);
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

    return session && session.user ? (
      <PayPalScriptProvider className="" options={initialOptions}>
        {isLoading ? (
          <Loader3 />
        ) : (
          <PayPalButtons
            className="px-2"
            disabled={element < 0 && credits === "0" ? true : false}
            style={style}
            createOrder={async () => {
              // console.log("currentSelect 22", element);
              // console.log("amount 22", credits);
              try {
                const response = await fetch("/api/payment/createOrder", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    element,
                    credits,
                    email: session?.user?.email,
                  }),
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
              }
            }}
            onApprove={async (data, actions) => {
              console.log("onApprove:", data, "action:", actions);
              try {
                const response = await fetch(
                  `/api/payment/captureOrder/${data.orderID}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email: session?.user?.email,
                    }),
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
                  if (orderData.status == "COMPLETED") {
                    celebFunction(8000);
                    // sse(session?.user?.email);
                    toast.success("Transaction successfull", {
                      duration: 5000,
                    });
                  } else {
                    toast.error("Transaction failed", {
                      duration: 5000,
                    });
                  }
                }
              } catch (error) {
                console.error(error);
                toast.error("Something went wrong!", {
                  duration: 5000,
                });
              }
            }}
            onShippingChange={async (data, actions) => {
              return actions.resolve();
            }}
            onError={(error) => {
              console.error(error);
              toast.error("Something went wrong!", {
                duration: 5000,
              });
            }}
          />
        )}
      </PayPalScriptProvider>
    ) : (
      <div>
        <h1>Sign in to continue</h1>
      </div>
    );
  }

  function setElement(index) {
    dispatch(setElem(index));
    dispatch(setCredits(""));
    setSelectedElement(index);
    setAmount("");
  }

  return (
    <div className={`text-white w-full select-none ${poppins.className}`}>
      {celebrate && <CelebComp />}
      <h1 className="font-bold text-xl text-center relative  mx-auto p-5 py-8">
        <Back /> Buy Credits{" "}
      </h1>

      <div className="max-w-[750px] mx-auto px-6">
        <h2 className="font-bold text-2xl py-2">Select your plan</h2>

        <div className="flex flex-col gap-2 bg-[#464646] p-2 rounded-md ">
          <div>
            <div
              className={`flex justify-between p-5 border-b-2 border-[#656565] hover:bg-[#94949440] cursor-pointer rounded-sm select-none transition-all ${
                selectedElement === 0
                  ? "bg-[#656565] border-2  border-[#b6b6b6]"
                  : ""
              }`}
              onClick={() => setElement(0)}
            >
              <div className="flex justify-between w-full">
                <h3 className="text-xl font-bold">$3.5</h3>
                <p className="text-lg">25 credits</p>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex justify-between p-5  border-b-[2px] border-[#656565] hover:bg-[#94949440] cursor-pointer rounded-sm select-none transition-all ${
                selectedElement === 1
                  ? "bg-[#656565] border-2 border-b-2 border-[#b6b6b6]"
                  : ""
              }`}
              onClick={() => setElement(1)}
            >
              <div className="flex justify-between w-full">
                <h3 className="text-xl font-bold">$7.2</h3>
                <p className="text-lg">55 credits</p>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex justify-between p-5  border-b-[px] border-[#656565] hover:bg-[#94949440] cursor-pointer rounded-sm select-none transition-all box-content
                ${
                  selectedElement === 2
                    ? "bg-[#656565] border-2 border-b-2 border-[#b6b6b6]"
                    : ""
                }
                  `}
              onClick={() => setElement(2)}
            >
              <div className="flex justify-between w-full">
                <h3 className="text-xl font-bold">$12.7</h3>
                <p className="text-lg">100 credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <div className="px-6 max-w-[750px] mx-auto">
        <h2 className="font-bold text-2xl py-2">Customized</h2>
        <div className="pb-2">
          <div className="text-lg max-w-[450px] flex justify-between">
            <span>Price</span>
            <span>${showPrice}</span>
          </div>
        </div>
        <Input
          onChange={(e) => {
            // console.log(e.target.value);
            let value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              value = Math.round(value);
              setAmount(value);
              const price =
                ((value * 0.1) / 100) * 2.9 + value * 0.1 + 0.3 + value * 0.02;
              setShowPrice(price.toFixed(2));
              setSelectedElement(4);
              dispatch(setCredits(value));
              dispatch(setElem(4));
            }
            // setAmount(e.target.value);
          }}
          onBlur={(e) => {
            if (amount == "0") {
              setShowPrice(0);
              setAmount("");
              dispatch(setCredits(""));
              setSelectedElement(0);
              dispatch(setElem(0));
            } else {
              if (amount < 3) {
                toast.success("Minimum 3 credits", {
                  icon: "🥺",
                });
                setAmount(3);
                let value = 3;
                const price =
                  ((value * 0.1) / 100) * 2.9 +
                  value * 0.1 +
                  0.3 +
                  value * 0.02;
                setShowPrice(price.toFixed(2));
              } else if (amount > 1000) {
                let value = 1000;
                const price =
                  ((value * 0.1) / 100) * 2.9 +
                  value * 0.1 +
                  0.3 +
                  value * 0.02;
                setShowPrice(price.toFixed(2));
                toast.success("Maximum 1000 credits", {
                  icon: "🥺",
                });
                setAmount(1000);
                dispatch(setCredits(1000));
              }
            }
          }}
          value={amount}
          type="text"
          placeholder="min 3 credits"
          className="w-full p-5 border-none bg-[#535353] text-lg font-semibold placeholder:text-[#d0d0d0] placeholder:font-normal max-w-[450px]"
        />
      </div>

      <br />
      <br />
      <div className="px-3 max-w-[750px] mx-auto text-center">
        {/* <button className="bg-[#227B94] active:scale-95 p-4 px-6 cursor-pointer rounded-md font-semibold">
        Continue
      </button> */}
        <Paypal currentSelect={selectedElement} amount={amount} />
      </div>
    </div>
  );
};

export default Payment;
