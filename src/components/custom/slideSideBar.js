"use client";
import { useState, useEffect, useRef, useCallback } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { Skeleton } from "../../components/ui/skeleton";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosExit } from "react-icons/io";
import { signOut } from "next-auth/react";
import getCredits from "app/utils/client/getCredits";
import { Poppins } from "next/font/google";
import { BsPiggyBank } from "react-icons/bs";
import { IoMdHelpCircle } from "react-icons/io"; // Add this import
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
const SideBar = ({ props }) => {
  const creditRef = useRef();
  let cValue = null;

  const creditsCall = useCallback(async (email) => {
    if (!email) return;
    // //  console.log("emaildwefw", email);
    const c = await getCredits(email);
    // //  console.log("crredits", credits);
    // setCredits(credits);
    //  console.log("ccc", c);
    //  console.log("dom", creditRef.current);
    if (creditRef.current) creditRef.current.textContent = c;
    cValue = c;
    // //  console.log("credits", credits);
  }, []);

  useEffect(() => {
    creditsCall(props.content.user.email);
    //  console.log("ggg", props.content.user.image);
  }, [props.content, creditsCall]);

  return (
    <div
      className={`${poppins.className} relative w-full min-w-[170px] h-[calc(100svh-60px)]`}
    >
      {/* User profile image */}
      <div className="w-[80px] h-[80px] rounded-full overflow-hidden mx-auto mt-8 border-[5px] border-[#3f3f3f]">
        {!props.content.user.email ? (
          <Skeleton className="w-full h-full bg-[#444444] shadow-md" />
        ) : (
          <Image
            src={props.content.user.image}
            alt=" "
            width={100}
            height={100}
            className="object-cover mx-auto bg-[#444444] shadow-md"
          />
        )}
      </div>
      {/* User info section */}
      <div className="mt-4 px-3">
        {props.content ? (
          <div className="text-center flex flex-col items-start bg-[#3f3f3f] p-2.5 rounded-md mx-auto w-full border-[2px] border-[#444444] text-white">
            <div className="w-full">
              <p className="text-white text-sm w-full break-words overflow-hidden">
                {props.content.user.email.length > 20
                  ? `${props.content.user.email.substring(0, 20)}...`
                  : props.content.user.email}
              </p>
            </div>
            <div className="flex items-center justify-between w-full my-2 bg-[#2d2d2d] p-2 rounded-md">
              <span className="text-sm">Balance:</span>
              <span className="font-semibold text-green-400">
                <span ref={creditRef}></span>
              </span>
            </div>
            <Link
              href={"/payment"}
              className="w-full bg-gradient-to-r from-yellow-700/70 to-yellow-600/80 hover:from-yellow-600/60 hover:to-yellow-500/60 px-3 py-2 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span className="text-sm font-semibold text-yellow-100">
                Add Credits
              </span>
              <BsPiggyBank className="text-yellow-100 group-hover:scale-110 transition-transform duration-200" />
            </Link>
          </div>
        ) : (
          <>
            <Skeleton className="h-4 w-3/4 mx-auto mb-2 bg-[#444444]" />
            <Skeleton className="h-4 w-1/2 mx-auto bg-[#444444]" />
          </>
        )}
      </div>
      {/* Buttons section */}
      {props.content && (
        <div className="absolute bottom-4 left-0 right-0 flex flex-col gap-2 px-3">
          <button
            onClick={() => {
              signOut({ redirect: false })
                .then(() => {
                  window.location.href = "/";
                })
                .catch((error) => {
                  console.error("Logout error:", error);
                });
            }}
            className="relative overflow-hidden bg-gradient-to-r from-red-500/50 to-red-600/50 hover:from-red-500/60 hover:to-red-600/60 text-white px-4 py-2.5 rounded-md transition-all duration-300 flex text-xs sm:text-sm items-center justify-center gap-2 w-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 font-medium"
          >
            <span>Logout</span>
            <IoIosExit
              size={16}
              className="min-w-[16px] transition-transform group-hover:rotate-180 duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </button>
          <Link href="/contact" className="w-full block">
            <button className="relative overflow-hidden bg-gradient-to-r from-blue-500/50 to-blue-600/50 hover:from-blue-500/60 hover:to-blue-600/60 text-white px-4 py-2.5 rounded-md transition-all duration-300 flex text-xs sm:text-sm items-center justify-center gap-2 w-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 font-medium">
              <span>Help Center</span>
              <IoMdHelpCircle
                size={18}
                className="min-w-[18px] transition-transform hover:rotate-12 duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

const SlideSideBar = (props) => {
  return (
    <Sheet>
      <SheetTrigger className="hover:opacity-80 transition-opacity">
        Ahoy, {props.content.user.name.split(" ")[0]}
      </SheetTrigger>
      <SheetContent className="bg-[#2F322F] border-0 w-[280px] sm:w-[300px] p-0 pt-4 text-white">
        <SheetHeader>
          <SheetDescription className="text-white w-full">
            <SideBar props={props} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SlideSideBar;
