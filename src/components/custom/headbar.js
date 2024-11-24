"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginPop from "./loginPop";
import SlideSideBar from "./slideSideBar";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Headbar = () => {
  const { data: session } = useSession();
  const [custom_session, setCustom_session] = useState(null);

  useEffect(() => {
    async function getCustomFun() {
      try {
        const decodedToken = await fetch("/api/get-data-custom-login");
        const customSession = await decodedToken.json();
        setCustom_session({ user: customSession });
      } catch (err) {
        console.log("error fetching custom token data", err);
      }
    }
    getCustomFun();
  }, []);

  // Helper function to get active session
  const getActiveSession = () => {
    if (session) {
      return session;
    } else if (custom_session?.user?.email) {
      return custom_session;
    } else {
      return null;
    }
  };

  const activeSession = getActiveSession();

  return (
    <>
      <div
        className={`${poppins.className} w-full border-0 border-b-[1px] border-b-[#3f3f3f] bg-[#2f322faf] relative h-[60px] p-5 flex justify-between text-[#ffffff] select-none `}
      >
        <Link href="/" className="paytoneOne text-xl md:text-2xl font-[400]">
          UNIIKA
        </Link>

        <div
          className={`flex gap-1 justify-center items-center text-md cursor hover:bg-[#3f3f3f] p-4  cursor-pointer border-[1px] border-[#3f3f3f] relative bg-[#2f2f2f] rounded-md transition-all duration-300 `}
        >
          {activeSession ? (
            window.innerWidth < 768 ? (
              <SlideSideBar content={activeSession} />
            ) : (
              "Ahoy, " + activeSession?.user?.name?.split(" ")[0]
            )
          ) : (
            <LoginPop />
          )}
        </div>
      </div>
    </>
  );
};

export default Headbar;
