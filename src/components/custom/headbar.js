"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginPop from "./loginPop";
import SlideSideBar from "./slideSideBar";
import { Poppins } from "next/font/google";
import Logo from "./Logo";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  style: ["normal"], // Add explicit style
  preload: true, // Ensure font preloading
});

const Headbar = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    //  console.log("session", session);
  }, [session]);

  return (
    <>
      <div
        className={`w-full border-0 border-b-[1px] border-b-[#3f3f3f] bg-[#2f322faf] relative h-[60px] p-5 flex justify-between text-[#ffffff] select-none`}
      >
        <Link
          href="/"
          className="flex items-center paytoneOne text-xl md:text-2xl font-[400]"
        >
          <Logo />
          UNIIKA
        </Link>

        <div
          className={`flex gap-1 justify-center items-center text-md cursor hover:bg-[#3f3f3f] p-4  cursor-pointer border-[1px] border-[#3f3f3f] relative bg-[#2f2f2f] rounded-md transition-all duration-300`}
        >
          {session ? (
            window.innerWidth < 768 ? (
              <SlideSideBar content={session} />
            ) : (
              "Ahoy, " + session?.user?.name?.split(" ")[0]
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
