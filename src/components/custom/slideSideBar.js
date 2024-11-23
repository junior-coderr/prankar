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
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
const SideBar = ({ props }) => {
  const creditRef = useRef();
  let cValue = null;

  const creditsCall = useCallback(async (email) => {
    if (!email) return;
    // console.log("emaildwefw", email);
    const c = await getCredits(email);
    // console.log("crredits", credits);
    // setCredits(credits);
    console.log("ccc", c);
    console.log("dom", creditRef.current);
    if (creditRef.current) creditRef.current.textContent = c;
    cValue = c;
    // console.log("credits", credits);
  }, []);

  useEffect(() => {
    creditsCall(props.content.user.email);
    console.log("ggg", props.content.user.image);
  }, [props.content, creditsCall]);

  return (
    <div
      className={`${poppins.className} relative w-[55%] min-w-[170px]  h-[calc(100svh-60px)]`}
    >
      {/* User profile image */}
      <div className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mt-10 border-[5px] border-[#3f3f3f]">
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
      <div className=" mt-4">
        {props.content ? (
          <div className="text-center flex flex-col items-start bg-[#3f3f3f] p-1 rounded-md mx-auto w-[100%] border-[2px] border-[#444444] text-white ">
            <p className="text-white truncate w-full flex items-start">
              {/* {session?.user.email} */}
              {props.content.user.email}
            </p>
            <p className="text-white my-2">
              {/* Credits left: {credits ? credits : "..."} */}
              Credits left: {<span ref={creditRef}></span>}
            </p>
            <p>{/* <CustomLogin /> */}</p>
            <Link href={"/payment"} className="flex  gap-2  items-center">
              Credits <FaArrowRight className="text-green-600 text-[18px]" />
            </Link>
          </div>
        ) : (
          <>
            <Skeleton className="h-4 w-3/4 mx-auto mb-2  bg-[#444444]" />
            <Skeleton className="h-4 w-1/2 mx-auto bg-[#444444]" />
          </>
        )}
      </div>
      {/* Buttons section - modified to center buttons */}
      {props.content && (
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-2 px-4">
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
            className="bg-red-500 bg-opacity-50 text-white px-4 py-2 rounded-md hover:bg-opacity-70 transition-all duration-300 flex text-sm items-center gap-2 w-full justify-center"
          >
            Logout <IoIosExit size={20} className="opacity-75" />
          </button>
          <Link href="/contact" className="w-full">
            <button className="bg-blue-500 bg-opacity-50 text-white px-4 py-2 rounded-md hover:bg-opacity-70 transition-all duration-300 flex text-sm items-center gap-2 w-full justify-center">
              Help
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
      <SheetTrigger>Ahoy, {props.content.user.name.split(" ")[0]}</SheetTrigger>
      <SheetContent className="bg-[#2F322F] border-0 w-[200px] text-white">
        <SheetHeader>
          <br />
          <SheetDescription className="text-white">
            <SideBar props={props} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SlideSideBar;
