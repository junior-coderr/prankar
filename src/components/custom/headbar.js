"use client";
import React, { useEffect } from "react";
import { GoPerson } from "react-icons/go";
import { Paytone_One } from "next/font/google";
import Link from "next/link";
import LoginPop from "./loginPop";
import { useSession } from "next-auth/react";
import SlideSideBar from "./slideSideBar";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
const paytoneOne = Paytone_One({
  weight: "400",
  variable: "--wght@400",
  subsets: ["latin"],
});
const Headbar = () => {
  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    console.log(session);
  }, [session]);
  return (
    <>
      <div
        className={`${poppins.className} w-full border-0 border-b-[1px] border-b-[#3f3f3f] bg-[#2f322faf] relative h-[60px] p-5 flex justify-between text-[#ffffff] z-10 select-none`}
      >
        <Link
          href="/"
          className={`${paytoneOne.className} text-xl md:text-2xl font-[400] `}
        >
          PRANKAR
        </Link>

        <div
          className={`flex gap-1 justify-center items-center text-md cursor hover:bg-[#3f3f3f] p-4  cursor-pointer border-[1px] border-[#3f3f3f] bg-[#2f2f2f] rounded-md transition-all duration-300`}
        >
          {session ? (
            window.innerWidth < 768 ? (
              <SlideSideBar content={session} />
            ) : (
              "Ahoy, " + session.user.name.split(" ")[0]
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
