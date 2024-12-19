"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import { Input } from "components/ui/input";
const poppins = Poppins({
  weight: ["400", "500"],
  subsets: ["latin"],
});
import { PayPalButtons } from "@paypal/react-paypal-js";
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
import { FaPaypal } from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";

const PayPalScriptProviderClient = dynamic(
  () =>
    import("@paypal/react-paypal-js").then((mod) => mod.PayPalScriptProvider),
  { ssr: false }
);

const Payment = () => {
  const [selectedElement, setSelectedElement] = React.useState(0);
  const [amount, setAmount] = React.useState("");
  const [showPrice, setShowPrice] = React.useState(0);
  const dispatch = useDispatch();
  const [width, setWidth] = React.useState(220);
  const [height, setHeight] = React.useState(220);
  const [celebrate, setCelebrate] = React.useState(false);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = React.useState("other");
  const [rupeePrice, setRupeePrice] = React.useState(0);

  React.useEffect(() => {
    if (paymentMethod === "other") {
      // For Razorpay: 1 credit = ₹4
      const inrPrice = amount * 4;
      setRupeePrice(Math.round(inrPrice));
    } else {
      // Original PayPal calculation
      const price =
        ((amount * 0.1) / 100) * 2.9 + amount * 0.1 + 0.3 + amount * 0.02;
      setShowPrice(price.toFixed(2));
    }
  }, [amount, paymentMethod]);

  // Add useEffect to set default value when payment method changes
  React.useEffect(() => {
    if (paymentMethod === "other") {
      setAmount("3");
      dispatch(setCredits("3"));
      dispatch(setElem(4));
    } else {
      setAmount("");
      dispatch(setCredits(""));
      setSelectedElement(0);
    }
  }, [paymentMethod]);

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
      //  console.log("Received SSE data:", data);
      // Handle the received data
    };

    eventSource.onopen = () => {
      //  console.log("SSE connection opened.");
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

  async function handleRazorpayPayment(session) {
    try {
      const paise = rupeePrice * 100; // Convert rupees to paise
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paise,
          email: session?.user?.email,
        }),
      });

      const data = await res.json();

      if (!data.id) {
        toast.error("Failed to create order");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Uniika",
        description: "Credit Purchase",
        order_id: data.id,
        handler: function (response) {
          celebFunction(8000);
          toast.success(`Payment successful: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: session?.user?.name || "User",
          email: session?.user?.email,
          contact: "",
        },
        theme: {
          color: "#0E47A1",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    }
  }

  function Paypal() {
    const element = useSelector((state) => state.transaction.element);
    const credits = useSelector((state) => state.transaction.credits);
    const { data: session } = useSession();

    // React.useEffect(() => {
    //   //  console.log("session", session);
    // }, [session]);

    const initialOptions = {
      "client-id":
        "AR5nROE58zmq06_zRkt-6zLcZb5HIJKsmCAiAXqFgHmYw8TLmP0AWPOpVoLSlFvWebLJAEHIaa9dwwGD",
      "enable-funding": "venmo",
      currency: "USD",
      "data-page-type": "product-details",
      components: "buttons",
      "data-sdk-integration-source": "developer-studio",
      intent: "capture", //cc
    };

    React.useEffect(() => {
      //  console.log("credits new :", credits);
      //  console.log("elements: new", element);
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

    return session && session?.user ? (
      <PayPalScriptProviderClient options={initialOptions}>
        {isLoading ? (
          <Loader3 />
        ) : (
          <Suspense fallback={<Loader3 />}>
            <PayPalButtons
              className="px-2"
              disabled={element < 0 && credits === "0" ? true : false}
              style={style}
              createOrder={async () => {
                // //  console.log("currentSelect 22", element);
                // //  console.log("amount 22", credits);
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
                    //  console.log("orderData.id", orderData.id);
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
                //  console.log("onApprove:", data, "action:", actions);
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

                  //  console.log("orderData", orderData);

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
          </Suspense>
        )}
      </PayPalScriptProviderClient>
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

  function PaymentMethods() {
    return (
      <div className="w-full max-w-[450px] mx-auto">
        <div className="bg-[#464646]/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg">
          <div className="flex gap-2 sm:gap-4 justify-center">
            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`flex-1 p-3 sm:p-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                paymentMethod === "paypal"
                  ? "bg-[#0070B9] text-white"
                  : "bg-[#535353]/70 text-gray-300 hover:bg-[#535353]"
              }`}
            >
              <FaPaypal className="text-lg sm:text-xl" />
              <span className="text-sm sm:text-base">PayPal</span>
            </button>
            <button
              onClick={() => setPaymentMethod("other")}
              className={`flex-1 p-3 sm:p-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                paymentMethod === "other"
                  ? "bg-[#0E47A1] text-white"
                  : "bg-[#535353]/70 text-gray-300 hover:bg-[#535353]"
              }`}
            >
              <SiRazorpay className="text-lg sm:text-xl" />
              <span className="text-sm sm:text-base">Razorpay</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  function OtherPaymentOption() {
    const { data: session } = useSession();

    return session && session?.user ? (
      <div className="w-full max-w-[450px] mx-auto">
        <button
          className="w-full bg-[#0E47A1] hover:bg-[#0D3C8C] p-4 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-all"
          onClick={() => handleRazorpayPayment(session)}
        >
          <SiRazorpay className="text-xl" />
          Pay ₹{rupeePrice}
        </button>
      </div>
    ) : (
      <div>
        <h1>Sign in to continue</h1>
      </div>
    );
  }

  function PayPalPlans() {
    return (
      <div className="grid gap-3 sm:gap-4">
        {[
          { price: "$3.5", credits: "25" },
          { price: "$7.2", credits: "55" },
          { price: "$12.7", credits: "100" },
        ].map((plan, index) => (
          <div
            key={index}
            className={`bg-[#464646]/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg cursor-pointer transition-all hover:bg-[#535353]/50 ${
              selectedElement === index ? "ring-2 ring-[#b6b6b6]" : ""
            }`}
            onClick={() => setElement(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold">{plan.price}</h3>
              <p className="text-base sm:text-lg">{plan.credits} credits</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function OtherPaymentPlans() {
    return (
      <div className="flex flex-col gap-3 bg-[#464646] p-3 md:p-4 rounded-lg">
        <div className="flex justify-between p-4 md:p-5 border-b-2 border-[#656565] rounded-md">
          <div className="flex justify-between w-full">
            <h3 className="text-xl font-bold">Regular Plan</h3>
            <p className="text-lg">₹{rupeePrice}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`text-white w-full select-none ${poppins.className} min-h-screen pb-16 sm:pb-20`}
    >
      {celebrate && <CelebComp />}

      <header className="py-4 sm:py-6 mb-6 sm:mb-8">
        <div className="px-4">
          <div className="flex items-center gap-3">
            <Back />
            <h1 className="font-bold text-xl sm:text-lg md:text-xl">
              Buy Credits
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-[750px] mx-auto px-4 space-y-0 sm:space-y-8">
        <section>
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
            Payment Method
          </h2>
          <PaymentMethods />
        </section>

        <section>
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
            {paymentMethod === "paypal" ? "Select Plan" : ""}
          </h2>
          <div className="max-w-[450px] mx-auto">
            {paymentMethod === "other" ? (
              // <OtherPaymentPlans />
              ""
            ) : (
              <PayPalPlans />
            )}
          </div>
        </section>

        <section>
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
            Custom Amount
          </h2>
          <div className="bg-[#464646]/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg max-w-[450px] mx-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4 text-base sm:text-lg">
              <span>Total Amount</span>
              <span className="font-semibold">
                {paymentMethod === "paypal"
                  ? `$${showPrice}`
                  : `₹${rupeePrice}`}
              </span>
            </div>
            <Input
              value={amount}
              onChange={(e) => {
                let value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  value = Math.round(value);
                  setAmount(value);
                  if (paymentMethod === "paypal") {
                    const price =
                      ((value * 0.1) / 100) * 2.9 +
                      value * 0.1 +
                      0.3 +
                      value * 0.02;
                    setShowPrice(price.toFixed(2));
                  }
                  setSelectedElement(4);
                  dispatch(setCredits(value));
                  dispatch(setElem(4));
                }
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
              type="text"
              placeholder="Enter credits (min 3)"
              className="w-full p-3 sm:p-4 border-none bg-[#535353]/70 text-base sm:text-lg font-medium placeholder:text-[#d0d0d0] placeholder:font-normal rounded-lg"
            />
          </div>
        </section>

        <section className="pt-2 sm:pt-4">
          <div className="max-w-[450px] mx-auto">
            {paymentMethod === "other" ? (
              <OtherPaymentOption />
            ) : (
              <Paypal currentSelect={selectedElement} amount={amount} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Payment;
