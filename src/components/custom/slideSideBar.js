"use client";
import { useState, useEffect, useCallback } from "react";

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
import { useDispatch, useSelector } from "react-redux";
import { setCredits, setCreditsLoading } from "../../app/redux/slices/credits";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
const SideBar = ({ props }) => {
  const dispatch = useDispatch();
  const credits = useSelector((state) => state.credits.value);
  const isCreditsLoading = useSelector((state) => state.credits.isLoading);

  const creditsCall = useCallback(
    async (email) => {
      if (!email) return;
      try {
        dispatch(setCreditsLoading(true));
        const c = await getCredits(email);
        dispatch(setCredits(c));
      } catch (error) {
        console.error("Error fetching credits:", error);
        dispatch(setCreditsLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    creditsCall(props.content.user.email);
  }, [props.content, creditsCall]);

  return (
    <div
      className={`${poppins.className} relative w-[100%] min-w-[200px] h-[calc(100svh-60px)]`}
    >
      {/* User profile image */}
      <div className="w-full flex flex-col items-center pt-6 sm:pt-8">
        <div className="relative w-[80px] sm:w-[90px] md:w-[100px] aspect-square rounded-full overflow-hidden border-4 border-[#4a4a4a] shadow-lg transform hover:scale-105 transition-transform duration-300">
          {!props.content.user.email ? (
            <Skeleton className="w-full h-full bg-[#444444] animate-pulse" />
          ) : (
            <Image
              src={props.content.user.image}
              alt="Profile"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </div>

      {/* User info section */}
      <div className="mt-6 px-2">
        {props.content ? (
          <div className="backdrop-blur-md bg-[#ffffff0a] rounded-xl p-4 shadow-lg border border-[#ffffff1a] w-full">
            <div className="space-y-3">
              <p className="text-gray-200 text-sm truncate font-medium">
                {props.content.user.email}
              </p>
              <div className="flex items-center justify-between py-2 border-t border-[#ffffff1a]">
                <span className="text-gray-300 text-sm">Credits:</span>
                {isCreditsLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
                ) : (
                  <span className="text-green-400 font-semibold">
                    {credits}
                  </span>
                )}
              </div>
              <Link
                href="/payment"
                className="flex items-center justify-between w-full px-3 py-2 text-xs sm:text-sm text-white bg-[#ffffff14] hover:bg-[#ffffff22] rounded-lg transition-all duration-300 active:scale-[0.98]"
              >
                <span>Get More Credits</span>
                <FaArrowRight
                  className="text-green-400 group-hover:translate-x-1 transition-transform"
                  size={14}
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-3 sm:h-4 w-3/4 bg-[#444444]" />
            <Skeleton className="h-3 sm:h-4 w-1/2 bg-[#444444]" />
          </div>
        )}
      </div>

      {/* Action buttons */}
      {props.content && (
        <div className="absolute bottom-6 left-0 right-0 px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                signOut({ redirect: false })
                  .then(() => (window.location.href = "/"))
                  .catch((error) => console.error("Logout error:", error));
              }}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300 active:scale-[0.98] text-xs sm:text-sm"
            >
              <span>Logout</span>
              <IoIosExit size={16} />
            </button>
            <Link href="/contact" className="w-full">
              <button className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-300 active:scale-[0.98] text-xs sm:text-sm">
                Help
              </button>
            </Link>
          </div>
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
      <SheetContent className="bg-[#2F322F] border-0 w-[280px] text-white">
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
