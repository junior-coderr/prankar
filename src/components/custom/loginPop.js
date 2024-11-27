"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { GoPerson } from "react-icons/go";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function LoginPop() {
  return (
    <Dialog className="">
      <DialogTrigger asChild>
        <div className="flex gap-1 justify-center items-center">
          <GoPerson size={24} /> <span className={``}>Login</span>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[260px] bg-[#2F322F] rounded-md border-[1px] border-[#3f3f3f] text-white outline-none border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold py-2">Login</DialogTitle>
          <DialogDescription>
            <div className="flex gap-1 justify-center items-center">
              <div className="flex justify-center gap-2 items-center bg-slate-200 w-full p-2 rounded-md hover:bg-slate-300 transition-all duration-300 cursor-pointer">
                <FcGoogle size={30} className="text-[#2F322F] md:text-xl" />{" "}
                <span
                  className="text-[#2F322F] font-semibold text-base"
                  onClick={() => signIn("google")}
                >
                  Login with Google
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
