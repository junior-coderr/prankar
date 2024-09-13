"use client";
import React from "react";
import Header from "../../components/custom/headbar";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Skeleton } from "../../components/ui/skeleton";
import { IoIosExit } from "react-icons/io";
import { Input } from "../../components/ui/input";
import { motion } from "framer-motion";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { setPhoneNo, setPrefix } from "../../app/redux/slices/phoneNoInput";
import { IoIosArrowDropdownCircle } from "react-icons/io";
// import { useToast } from "../../components/hooks/use-toast";
import { TbArrowBackUp } from "react-icons/tb";
import SelectAudioCarousel from "../../components/custom/selectAudioCarousel";
import AudioUploadCard from "../../components/custom/audioUploadCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Main Page Component
const Page = () => {
  const [isMobile, setIsMobile] = useState(null);

  const [isImgLoading, setIsImgLoading] = useState(true);
  const prefixLengths = {
    "+91": 10, // India with prefix and space
    "+1": 7, // USA
    "+44": 10, // UK
    // Add more country codes and their respective phone number lengths as needed
  };

  // Effect for handling mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: session } = useSession();

  function PopOverForPrefix() {
    const prefixData = useSelector((state) => state.phoneNoInput.prefix);

    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(setPhoneNo(prefixData + " "));
      console.log("prefix", prefixData);
    }, [prefixData]);

    return (
      <Popover>
        <PopoverTrigger>
          <IoIosArrowDropdownCircle
            size={31}
            className=" bg-[#e2e2e2] text-[#3f3f3f] box-content rounded-md p-[15px]   cursor-pointer  md:p-[22px] border-[#767676] border-4  md:border-8 md:border-r-0 border-r-0 active:ml-3 hover:opacity-90 transition-all duration-150 rounded-tr-none rounded-br-none md:py-0 h-[28px] md:min-h-[70px]"
          />
        </PopoverTrigger>
        <PopoverContent className="bg-[#e2e2e2]">
          <div className=" w-[60px]  md:w-[75px] ">
            {Object.entries(prefixLengths).map(([prefix, length]) => (
              <div
                key={prefix}
                onClick={() => {
                  dispatch(setPrefix(prefix));
                  dispatch(setPhoneNo(prefix + " "));
                }}
                className={`p-2 transition-all select-none duration-150 rounded-md cursor-pointer px-5 ${
                  prefix === prefixData
                    ? "bg-[#3f3f3f] text-white hover:bg-[#3f3f3f]"
                    : "hover:bg-[#c8c8c8]"
                }`}
              >
                <p className="flex items-center justify-center">{prefix}</p>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  // Content Component
  const Content = () => {
    const inputRef = useRef(null);
    const scrollRef = useRef(null);
    const [currentScroll, setCurrentScroll] = useState(0);
    const currentScrollRef = useRef(0);
    const [isActive, setIsActive] = useState(false);

    const dispatch = useDispatch();
    const prefix = useSelector((state) => state.phoneNoInput.prefix);
    const phoneNo = useSelector((state) => state.phoneNoInput.value);

    // Handler for phone number input change
    const handlePhoneNoChange = (e) => {
      const input = e.target.value;
      // Allow only numeric, space, and plus characters
      const sanitizedInput = input.replace(/[^0-9\s+\s-]/g, "");

      if (sanitizedInput !== input) {
        // If the input was sanitized, update the input field
        e.target.value = sanitizedInput;
      }

      if (
        phoneNo.replace(/\s/g, "").slice(prefix.length).length >= 6 &&
        phoneNo.replace(/\s/g, "").slice(prefix.length).length <= 12
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }

      dispatch(setPhoneNo(sanitizedInput));
    };

    // Handler for scrolling
    const handleScroll = (type) => {
      let height = scrollRef.current.scrollHeight;
      let scrollAmount = height / 3;
      let newScroll = currentScrollRef.current;

      if (type === "up") {
        newScroll = newScroll - 1;
      } else {
        newScroll = newScroll + 1;
      }

      newScroll = Math.max(0, Math.min(3, newScroll));

      scrollRef.current.scrollTo({
        top: scrollAmount * newScroll,
        behavior: "smooth",
      });

      currentScrollRef.current = newScroll;
      setCurrentScroll(newScroll);
    };

    // Handler for continue button
    const handleContinue = () => {
      console.log("phoneNo", phoneNo);
      console.log("prefix", prefix);
      console.log("prefixLengths[prefix]", prefixLengths[prefix]);
      console.log("phoneNo.length", phoneNo.length);
      console.log(
        "test length",
        phoneNo.replace(/\s/g, "").slice(prefix.length)
      );

      if (
        phoneNo.replace(/\s/g, "").slice(prefix.length).length >= 6 &&
        phoneNo.replace(/\s/g, "").slice(prefix.length).length <=
          // prefixLengths[prefix]
          12
      ) {
        handleScroll("down");
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            if (entry.target === scrollRef.current) {
              scrollRef.current.scrollTo({
                top:
                  (scrollRef.current.scrollHeight / 3) *
                  currentScrollRef.current,
                behavior: "smooth",
              });
            }
          }
        });

        if (scrollRef.current) {
          resizeObserver.observe(scrollRef.current);
        }

        return () => {
          if (scrollRef.current) {
            resizeObserver.unobserve(scrollRef.current);
          }
        };
      } else {
      }
    };

    // JSX for Content component
    return isMobile != null ? (
      <div className={`${poppins.className} w-full h-[100%] `}>
        <section className="flex overflow-auto">
          <div className="w-full h-[calc(100svh-60px)] min-h-[500px] overflow-auto  flex items-center justify-center">
            <div
              ref={scrollRef}
              className={`${
                currentScrollRef.current + 1 == 3 ? "inp_container_status" : ""
              } w-[75%] relative  min-w-[300px] inp_containe  overflow-hidden mx-auto h-[80%] bg-[#3f3f3f] rounded-md shadow-xl  border-[5px] border-[#444444]`}
            >
              {/* Phone number input section */}
              <div className="w-[100%] h-[100%] relative flex flex-col items-center justify-center bg-[#444444]">
                <div
                  className="absolute w-fit p-4 bottom-0 hover:bg-[#444444] transition-all active:scale-95 cursor-pointer duration-150 rounded-full right-0"
                  onClick={() => handleScroll("down")}
                >
                  <TbArrowBackUp size={35} className="text-white" />
                </div>
                <div className="flex w-[100%] flex-col mt-[-20px] flex-wrap items-center  justify-center gap-2 gap-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: -20, rotate: -10 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 120,
                      damping: 10,
                    }}
                    className="relative w-[100%]"
                  >
                    <div className="relative  flex items-center gap-[2px]  justify-center">
                      <PopOverForPrefix />
                      <Input
                        ref={inputRef}
                        type="text"
                        value={phoneNo}
                        onChange={handlePhoneNoChange}
                        className={`${poppins.className} relative box-border text-xl p-4 px-2  pl-3 placeholder:text-xl w-[60%] text-[#3f3f3f] min-w-[200px] bg-[#e2e2e2] max-w-[360px] font-semibold placeholder:text-black placeholder:font-semibold transition-all md:min-w-[300px] md:text-2xl md:p-5 md:pl-3 md:placeholder:text-2xl  md:border-8 duration-150 border-[#767676] border-4   placeholder:opacity-45 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mx-0 border-l-0 md:border-l-0 rounded-tl-none rounded-bl-none py-0 md:py-0 md:h-[87px] h-[65px]  `}
                        placeholder="Mobile Number"
                      />
                    </div>
                  </motion.div>

                  {/* Continue button */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <button
                      disabled={!isActive}
                      onClick={handleContinue}
                      className={`bg-[#e2e2e2] text-[#242424] px-4 py-3 rounded-md hover:bg-opacity-70 transition-all font-bold duration-150 md:px-6 md:py-4 md:text-xl ${
                        isActive ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      Continue
                    </button>
                  </motion.div>
                </div>
              </div>
              {/* Verification badge section */}
              <div className="w-[100%] flex flex-col  relative h-[100%] bg-[#363636]">
                {/* Audio Carousel */}
                <div className="w-[100%] h-[100%] flex-col flex-shrink-0   text-white  flex justify-evenly ">
                  <div className="w-full h-[180px]  m-w-[350px]  flex items-center  justify-center">
                    <AudioUploadCard />
                  </div>
                  <SelectAudioCarousel />
                  <div
                    className="relative flex items-center justify-end w-full   h-10 select-none   text-black "
                    onClick={() => handleScroll("down")}
                  >
                    {/* <TbArrowBackUp size={35} className="text-white" /> */}
                    <p className="font-semibold bg-white m-4 p-2 transition-all active:scale-90 cursor-pointer duration-150 rounded-sm  shadow-lg">
                      Set Audio
                    </p>
                  </div>
                </div>
                <div
                  className="absolute w-fit  p-2 py-1 top-0 hover:bg-[#444444] font-semibold transition-all active:scale-95 cursor-pointer duration-150 rounded-full right-0"
                  onClick={() => handleScroll("up")}
                >
                  <TbArrowBackUp size={25} className="text-white" />
                </div>
              </div>
              <div className="w-[100%] h-[100%] bg-[#2c2c2c] relative">
                <div
                  className="absolute w-fit p-4 top-0 hover:bg-[#444444] transition-all active:scale-95 cursor-pointer duration-150 rounded-full right-0"
                  onClick={() => handleScroll("up")}
                >
                  <TbArrowBackUp size={35} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    ) : (
      <div className="w-full h-[100%] flex items-center justify-center">
        <Skeleton className="w-[75%] relative  min-w-[300px] h-[80%] bg-[#646464]" />
      </div>
    );
  };

  // Effect for logging image loading state
  useEffect(() => {
    console.log("isImgLoading", isImgLoading);
  }, [isImgLoading]);

  // Sidebar Component
  const SideBar = () => {
    return isMobile != null ? (
      <div
        className={`${poppins.className} relative w-[25%] min-w-[200px] max-w-[300px] border-l-[2px] border-[#3f3f3f] h-[calc(100svh-60px)]`}
      >
        {/* User profile image */}
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mt-10 border-[5px] border-[#3f3f3f]">
          {session && isImgLoading && session.user.image ? (
            <Skeleton className="w-full h-full bg-[#444444] shadow-md" />
          ) : (
            <Image
              src={session?.user.image}
              alt=" "
              width={100}
              height={100}
              onLoadingComplete={() => setIsImgLoading(false)}
              className="object-cover mx-auto bg-[#444444] shadow-md"
            />
          )}
        </div>
        {/* User info section */}
        <div className=" mt-4">
          {session ? (
            <div className="text-center flex flex-col items-start bg-[#3f3f3f] p-2 rounded-md mx-auto w-[90%] border-[2px] border-[#444444]">
              <p className="text-white truncate w-full">{session.user.email}</p>
              <p className="text-white mt-2">
                Credits left: {session.user.credits || 0}
              </p>
            </div>
          ) : (
            <>
              <Skeleton className="h-4 w-3/4 mx-auto mb-2  bg-[#444444]" />
              <Skeleton className="h-4 w-1/2 mx-auto bg-[#444444]" />
            </>
          )}
        </div>
        {/* Logout button */}
        {session && (
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
            className="absolute bottom-4 right-1 bg-red-500 bg-opacity-50 text-white px-4 py-2 rounded-md hover:bg-opacity-70 transition-all duration-300 flex text-sm items-center gap-2"
          >
            Logout <IoIosExit size={20} className="opacity-75" />
          </button>
        )}
      </div>
    ) : null;
  };

  // Main component return
  return (
    <div className="w-full h-[calc(100svh)] ">
      <Header />

      <section className="flex overflow-auto h-[calc(100svh-60px)] min-h-[500px]">
        <div className="w-full h-[100%] overflow-auto min-h-[500px]">
          <Content />
        </div>
        {!isMobile ? <SideBar /> : null}
      </section>
    </div>
  );
};

export default Page;
