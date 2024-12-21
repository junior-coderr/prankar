"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/custom/headbar";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Skeleton } from "../../components/ui/skeleton";
import { IoIosExit } from "react-icons/io";
import { Input } from "../../components/ui/input";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setPhoneNo, setPrefix } from "../../app/redux/slices/phoneNoInput";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { TbArrowBackUp } from "react-icons/tb";
import SelectAudioCarousel from "../../components/custom/selectAudioCarousel";
import AudioUploadCard from "../../components/custom/audioUploadCard";
import { setPlayingAudio } from "../../app/redux/slices/playingAudio";
import { setSid } from "../../app/redux/slices/sid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import Loader2 from "../../components/custom/loader2";
import Loader3 from "../../components/custom/loader3";
import toast from "react-hot-toast";
import RecordAudioPlayer from "../../components/custom/RecordAudioPlayer";
import { setExternalAudioUnload } from "app/redux/slices/ExternalAudioUnload";
import getCredits from "app/utils/client/getCredits";
import TermsAndConditions from "app/utils/client/termsAndComditions";
import { FaArrowRight } from "react-icons/fa6";
import TermsACPopup from "../../components/custom/termsAC";
import { setCurrentScroll } from "../../app/redux/slices/pageState";
import {
  setPersistedPhoneNumber,
  setPersistedPrefix,
  setPersistedSelectedAudioIndex,
  setPersistedCustomAudioFile,
  setPersistedCurrentPage,
} from "../../app/redux/slices/persistedState";
import { setAudioFile } from "../../app/redux/slices/audioFile";
import { setAudioSelected } from "../../app/redux/slices/audioSelected";
import { setCredits, setCreditsLoading } from "../redux/slices/credits";

import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
import { VscDebugRestart } from "react-icons/vsc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { IoArrowForward } from "react-icons/io5";
import { FaHeadphones } from "react-icons/fa6";

// Main Page Component
const Page = () => {
  const dispatch = useDispatch(); // Add this at the top of the component
  const [isMobile, setIsMobile] = useState(null);
  const creditRef = useRef();
  const [checkTAS, setCheckTAS] = useState(false);
  const [showTACPopup, setShowTACPopup] = useState(false);
  const [tacLoading, setTacLoading] = useState(false);
  const [creditsLoaded, setCreditsLoaded] = useState(false);

  const [isImgLoading, setIsImgLoading] = useState(false);
  const prefixLengths = {
    "+91": 10, // India with prefix and space
    "+1": 7, // USA
    "+44": 10, // UK
    "+55": 11, // Brazil
    "+86": 11, // China
    "+81": 11, // Japan
    "+82": 11, // South Korea
    "+27": 9, // South Africa
    "+61": 9, // Australia
    "+64": 9, // New Zealand
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

  // Modify creditsCall function
  async function creditsCall(email) {
    try {
      dispatch(setCreditsLoading(true));
      const c = await getCredits(email);
      dispatch(setCredits(c));
      if (creditRef.current) {
        creditRef.current.textContent = c;
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
      dispatch(setCreditsLoading(false));
    }
  }

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      console.log("session", session);
      if (session) {
        await creditsCall(session?.user?.email);
        const checkTaS = await TermsAndConditions(session?.user?.email);
        if (!checkTaS) {
          setCheckTAS(true);
        }
        if (!checkTaS.accepted) {
          setShowTACPopup(true);
        }
      }
    };
    fetchTermsAndConditions();
  }, [session]);

  const handleAcceptTerms = async () => {
    if (tacLoading) return;
    await creditsCall(session?.user?.email);

    setTacLoading(true);

    try {
      const response = await fetch("/api/tac/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (response.ok) {
        setShowTACPopup(false);
        toast.success("Terms & Conditions accepted");
      } else {
        toast.error("Failed to update Terms & Conditions");
      }
    } catch (error) {
      console.error("Error updating T&C:", error);
      toast.error("Error updating Terms & Conditions");
    } finally {
      setTacLoading(false);
    }
  };

  function PopOverForPrefix() {
    const prefixData = useSelector((state) => state.phoneNoInput.prefix);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(setPhoneNo(prefixData + " "));
    }, [prefixData, dispatch]);

    return (
      <Popover>
        <PopoverTrigger>
          <IoIosArrowDropdownCircle
            size={31}
            className="bg-[#e2e2e2] text-[#3f3f3f] box-content rounded-md p-[15px] cursor-pointer md:p-[22px] border-[#767676] border-4 md:border-8 md:border-r-0 border-r-0 active:ml-3 hover:opacity-90 transition-all duration-150 rounded-tr-none rounded-br-none md:py-0 h-[28px] md:min-h-[70px]"
          />
        </PopoverTrigger>
        <PopoverContent className="bg-[#e2e2e2] p-1 w-[180px] shadow-lg border-2 border-[#767676]">
          <div className="max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3f3f3f] scrollbar-track-gray-100">
            {Object.entries(prefixLengths).map(([prefix, length]) => (
              <div
                key={prefix}
                onClick={() => {
                  dispatch(setPrefix(prefix));
                  dispatch(setPhoneNo(prefix + " "));
                }}
                className={`flex items-center justify-between px-4 py-2.5 transition-all select-none duration-150 cursor-pointer rounded-md ${
                  prefix === prefixData
                    ? "bg-[#3f3f3f] text-white hover:bg-[#3f3f3f]"
                    : "hover:bg-[#d1d1d1]"
                }`}
              >
                <span className="font-medium">{prefix}</span>
                <span className="text-sm opacity-60">{length} digits</span>
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
    const [isActive, setIsActive] = useState(false);
    const audioSelected = useSelector(
      (state) => state.audioSelected.audioSelected
    );
    // const sid = useSelector((state) => state.sid.value);
    const [isLoading, setIsLoading] = useState(false);
    const audioFile = useSelector((state) => state.audioFile.audioFile);

    const playingAudio = useSelector((state) => state.playingAudio.value);
    const [status, setStatus] = useState("Calling");
    const [statusColor, setStatusColor] = useState("#b1b1b1");
    const [recUrl, setRecUrl] = useState(null);
    const [sseEstablished, setSseEstablished] = useState(false);
    const [isRestart, setIsRestart] = useState(false);

    const dispatch = useDispatch();
    const prefix = useSelector((state) => state.phoneNoInput.prefix);
    const phoneNo = useSelector((state) => state.phoneNoInput.value);
    const router = useRouter();
    const searchParams = useSearchParams(); // Get the query parameters
    const currentScroll = useSelector((state) => state.pageState.currentScroll);

    // Get persisted state
    const persistedState = useSelector((state) => state.persistedState);

    // Initialize states from persisted state
    useEffect(() => {
      if (persistedState.phoneNumber) {
        dispatch(setPhoneNo(persistedState.phoneNumber));
      }
      if (persistedState.prefix) {
        dispatch(setPrefix(persistedState.prefix));
      }
      if (persistedState.selectedAudioIndex !== null) {
        dispatch(setAudioSelected(persistedState.selectedAudioIndex));
      }
    }, []);

    // Update persisted state when values change
    useEffect(() => {
      dispatch(setPersistedPhoneNumber(phoneNo));
    }, [phoneNo]);

    useEffect(() => {
      dispatch(setPersistedPrefix(prefix));
    }, [prefix]);

    useEffect(() => {
      dispatch(setPersistedSelectedAudioIndex(audioSelected));
    }, [audioSelected]);

    useEffect(() => {
      dispatch(setPersistedCustomAudioFile(audioFile));
    }, [audioFile]);

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
      let newScroll = currentScroll;

      if (type === "up") {
        newScroll = Math.max(0, newScroll - 1);
      } else {
        newScroll = Math.min(2, newScroll + 1);
      }

      dispatch(setCurrentScroll(newScroll));
    };

    function perfectScroll() {
      if (scrollRef.current) {
        const scrollHeight = scrollRef.current.scrollHeight;
        const clientHeight = scrollRef.current.clientHeight;
        const scrollTop = scrollRef.current.scrollTop;

        // Check if the height has changed
        if (scrollHeight !== clientHeight) {
          scrollRef.current.scrollTo({
            top: (scrollHeight / 3) * currentScroll,
            behavior: "smooth",
          });
        }
      }
    }

    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === scrollRef.current) {
            const scrollHeight = scrollRef.current.scrollHeight;
            const clientHeight = scrollRef.current.clientHeight;
            const scrollTop = scrollRef.current.scrollTop;

            // Check if the height has changed
            if (scrollHeight !== clientHeight) {
              scrollRef.current.scrollTo({
                top: (scrollHeight / 3) * currentScroll,
                behavior: "smooth",
              });
            }
          }
        }
      });
      if (scrollRef.current) {
        resizeObserver.observe(scrollRef.current);
        // handleScroll("down");
        // handleScroll("down");
      }
      return () => {
        if (scrollRef.current) {
          resizeObserver.unobserve(scrollRef.current);
        }
      };
    }, []);

    // Handler for continue button
    const handleContinue = () => {
      if (!session) {
        toast.error("Please login first!");
        return;
      }
      // console.log("sssss", creditRef.current.textContent);
      if (creditRef.current?.textContent == 0) {
        toast.error("Don't have enough credits!");
        setTimeout(() => {
          router.push("payment");
        }, 3000);
        return;
      }
      if (!phoneNo.includes(prefix)) {
        toast.error("Please enter prefix code");
        return;
      }
      if (
        phoneNo.replace(/\s/g, "").slice(prefix.length).length >= 6 &&
        phoneNo.replace(/\s/g, "").slice(prefix.length).length <=
          // prefixLengths[prefix]
          12
      ) {
        // toast.success(phoneNo);
        handleScroll("down");
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            if (entry.target === scrollRef.current) {
              scrollRef.current.scrollTo({
                top: (scrollRef.current.scrollHeight / 3) * currentScroll,
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
        toast.error("Please enter a valid phone number");
      }
    };
    // Function to get URL parameter
    const getUrlParameter = (name) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    };

    useEffect(() => {
      const cid = searchParams.get("cid");
      console.log("cid", cid);
      if (cid) {
        console.log("cid", cid);
        serverSEvent(cid);
        handleScroll("down");
        handleScroll("down");
      }
    }, [searchParams]);

    const serverSEvent = async (sid) => {
      console.log("sid", sid);
      let setStarted = false;
      const eventSource = new EventSource(`/api/call-status-check?sid=${sid}`);

      eventSource.onopen = () => {
        console.log("Connection to server opened.");
        setSseEstablished(true);
        setIsRestart(false);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received server-side event:", data);
        console.log("data.Data.status", data?.Data?.status);

        if (data?.Data?.status == "completed" && data?.Data?.recordingUrl) {
          setRecUrl(data?.Data?.recordingUrl);
          creditsCall(session?.user?.email);
          setIsRestart(true);
          eventSource.close();
          setSseEstablished(false);
        }
        // console.log("recUrl", recUrl);

        if (data?.Data?.status) {
          if (data?.Data?.status == "ringing") {
            setStatus("Ringing");
            setStatusColor("#FCDE70");
          } else if (data?.Data?.status == "initiated") {
            setStatus("Calling");
          } else if (data?.Data?.status == "in-progress") {
            setStatusColor("#6EC207");
            setStatus("In Progress");
          } else if (data?.Data?.status == "completed") {
            if (setStarted) {
              return;
            }
            setStarted = true;
            setStatus("Call Ended");
            setStatusColor("#E85C0D");
            setRecUrl(data?.Data?.recordingUrl);
            creditsCall(session?.user?.email);

            setTimeout(() => {
              setStatus("recordingUrl");
              setStatusColor("#C5705D");
            }, 3000);
            // C5705D
          } else {
            setStatus(
              data?.Data?.status.charAt(0).toUpperCase() +
                data?.Data?.status.slice(1)
            );
            setIsRestart(true);
          }
        } else {
          setStatus("Calling");
          setStatusColor("#b1b1b1");
          setIsRestart(true);
        }
      };

      eventSource.onclose = () => {
        console.log("Event source closed");
        setSseEstablished(false);
        setIsRestart(true);
      };

      eventSource.onerror = (error) => {
        eventSource.close(); // Close the connection on error
        console.error("Error with server-sent events:", error.message);
        setSseEstablished(false);
        setIsRestart(true);
      };
    };
    const handleUploadAudio = async () => {
      if (isLoading && phoneNo != null) return;
      setIsLoading(true);

      if (audioSelected != null || audioFile != null) {
        const formData = new FormData();
        formData.append("audioFile", audioFile);
        formData.append("phoneNo", phoneNo);

        // Check file size if audioFile is present
        if (audioFile && audioFile.size > 25 * 1024 * 1024) {
          toast.error("File size exceeds 25 MB limit");
          setIsLoading(false);
          return;
        }

        try {
          if (audioSelected != null) {
            // Handle audio selected case
            const response = await fetch("/api/upload-audio", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ audioSelected, phoneNo }),
            });

            if (!response.ok) {
              toast.error("Sorry, something went wrong");
              return;
            }

            const data = await response.json();

            if (playingAudio) {
              if (playingAudio.state() === "loaded") {
                playingAudio.stop();
                await playingAudio.unload();
                dispatch(setPlayingAudio(null));
              } else {
                dispatch(setExternalAudioUnload(true));
                console.log("changing :");
              }
            }

            console.log("sid", data.twilioCall.callSid);
            window.history.replaceState(
              null,
              "",
              `/home/?cid=${data.twilioCall.callSid}`
            );

            // router.replace(`home/?cid=${data.twilioCall.callSid}`);
            serverSEvent(data.twilioCall.callSid);
            console.log("Audio selected uploaded successfully:", data);
            toast.success("Audio uploaded successfully", {
              position: "top-left",
            });
            setTimeout(() => {
              toast.remove();
              toast("Looking for status...", {
                icon: "🤙",
                position: "top-left",
              });
            }, 2000);
          } else if (audioFile != null) {
            // Handle audio file case
            const response = await fetch("/api/upload-audio", {
              method: "POST",
              body: formData,
            });
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (playingAudio) {
              if (playingAudio.state() === "loaded") {
                playingAudio.stop();
                await playingAudio.unload();
                dispatch(setPlayingAudio(null));
              } else {
                dispatch(setExternalAudioUnload(true));
                console.log("changing :");
              }
            }

            dispatch(setSid(data.callResponse.callSid));
            window.history.replaceState(
              null,
              "",
              `/home/?cid=${data.callResponse.callSid}`
            );

            serverSEvent(data.callResponse.callSid);
            console.log("Audio file uploaded successfully:", data);
            toast.success("Audio uploaded successfully", {
              position: "top-left",
            });
            setTimeout(() => {
              toast.remove();
              toast("Looking for status...", {
                icon: "🤙",
                position: "top-left",
              });
            }, 2000);
          }
          // Only scroll if upload is successful
          handleScroll("down");
        } catch (error) {
          console.error("Error uploading audio:", error);
          toast.error("Error uploading audio");
        }
        setIsLoading(false);
      }
    };

    useEffect(() => {
      console.log("statusColor", statusColor);
    }, [statusColor]);

    // JSX for Content component
    return (
      <div className={`${poppins.className} w-full h-[100%] `}>
        <section className="flex overflow-auto">
          <div className="w-full h-[calc(100svh-60px)] min-h-[670px] overflow-auto  flex items-center justify-center">
            <div
              ref={scrollRef}
              className={`${
                currentScroll + 1 == 3 ? "inp_container_status" : ""
              } w-[75%] relative min-w-[300px] inp_containe overflow-hidden mx-auto h-[80%] bg-[#3f3f3f] rounded-md shadow-xl border-[5px] border-[#444444]`}
            >
              {/* Phone number input section 1*/}
              <div
                className={`w-[100%] h-[100%] absolute top-0 left-0 transition-all duration-500 ${
                  currentScroll >= 1
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                <div className="w-[100%] h-[100%] relative flex flex-col items-center justify-center bg-[#444444]">
                  {/* <div
                    className="absolute w-fit p-4 bottom-0 hover:bg-[#444444] transition-all active:scale-95 cursor-pointer duration-150 rounded-full right-0"
                    onClick={() => handleScroll("down")}
                  >
                    <TbArrowBackUp size={35} className="text-white" />
                  </div> */}
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
                      className="relative w-[100%] flex flex-col items-center"
                    >
                      <label className="block text-white text-right mb-2 text-lg w-[60%] max-w-[360px]">
                        Recipient&apos;s number
                      </label>
                      <div className="relative flex items-center gap-[2px] justify-center">
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
                        className={`bg-[#e2e2e2] text-[#242424] px-4 py-2.5 sm:px-5 sm:py-3 rounded-md hover:bg-opacity-70 transition-all font-bold duration-150 flex items-center justify-center gap-2 text-base sm:text-lg md:text-xl ${
                          isActive ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        <span>Continue</span>
                        <IoArrowForward className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
              {/* Audio selection section 2*/}
              <div
                className={`w-[100%] h-[100%] absolute top-0 left-0 transition-all duration-500 ${
                  currentScroll === 1
                    ? "opacity-100 z-10"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="w-[100%] h-[100%] flex-col flex-shrink-0   text-white  flex justify-evenly relative">
                  <div className="w-full h-[180px]  m-w-[350px]  flex items-center  justify-center">
                    <AudioUploadCard />
                  </div>
                  <SelectAudioCarousel />
                  <div className="relative flex items-center justify-between w-full   h-10 select-none   text-black px-4">
                    {/* <TbArrowBackUp size={35} className="text-white" /> */}
                    <div
                      className="p-2 py-1 hover:bg-[#444444] font-semibold transition-all active:scale-95 cursor-pointer duration-150 rounded-full"
                      onClick={() => {
                        handleScroll("up");
                        handleScroll("up");
                      }}
                    >
                      <TbArrowBackUp size={25} className="text-white" />
                    </div>
                    <button
                      className={`font-semibold bg-white flex items-center justify-center gap-2 px-4 py-2.5 transition-all min-w-[120px] sm:min-w-[140px] active:scale-90 cursor-pointer duration-150 rounded-sm shadow-lg ${
                        audioFile != null || audioSelected != null
                          ? "opacity-100"
                          : "opacity-50 cursor-not-allowed"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={handleUploadAudio}
                      disabled={!(audioSelected != null || audioFile != null)}
                    >
                      {isLoading ? (
                        <Loader3 />
                      ) : (
                        <>
                          <span className="text-sm sm:text-base">
                            Set Audio
                          </span>
                          <FaHeadphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#3f3f3f]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {/* Status section 3*/}
              <div
                className={`w-[100%] h-[100%] absolute top-0 left-0 transition-all duration-500 ${
                  currentScroll === 2
                    ? "opacity-100 z-20"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="w-[100%] h-[100%] bg-[#2c2c2c] relative">
                  <div className="w-[100%] h-[100%] bg-[#2c2c2c] relative">
                    <div className="w-[100%] h-[100%] flex items-center justify-center">
                      <p className="text-white text-xl font-semibold flex  flex-col justify-center items-center gap-2">
                        <Loader2 color={statusColor} />
                        {status == "recordingUrl" ? (
                          <>
                            <RecordAudioPlayer audioFile={recUrl} />

                            <span className="hidden">
                              {setTimeout(() => {
                                perfectScroll();
                              }, 1000) && null}
                            </span>
                          </>
                        ) : (
                          <span className="text-white text-3xl font-bold">
                            {status}

                            <span className="hidden">
                              {setTimeout(() => {
                                perfectScroll();
                              }, 1000) && null}
                            </span>
                          </span>
                        )}
                        {isRestart && (
                          <>
                            <VscDebugRestart
                              onClick={() => {
                                handleScroll("up");
                                setIsRestart(false);
                                setStatus("Calling");
                                setStatusColor("#b1b1b1");
                                window.history.replaceState(null, "", `/home`);
                              }}
                              size={25}
                              className="opacity-70 mt-5 cursor-pointer hover:opacity-100 active:scale-90 transition-all duration-150"
                            />
                            <span className="hidden">
                              {setTimeout(() => {
                                perfectScroll();
                              }, 1000) && null}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      // ) : (
      //   <div className="w-full h-[100%] flex items-center justify-center">
      //     <Skeleton className="w-[75%] relative  min-w-[300px] h-[80%] bg-[#646464]" />
      //   </div>
    );
  };

  // Effect for logging image loading state
  useEffect(() => {
    console.log("isImgLoading", isImgLoading);
  }, [isImgLoading]);

  // Sidebar Component
  const SideBar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const credits = useSelector((state) => state.credits.value);
    const isCreditsLoading = useSelector((state) => state.credits.isLoading);

    return (
      <div
        className={`${poppins.className} ${
          isMobile
            ? `fixed top-[60px] right-0 z-50 transform transition-transform duration-300 ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`
            : "relative"
        } w-[85%] sm:w-[70%] md:w-[25%] min-w-[280px] max-w-[300px] bg-[#3f3f3f] h-[calc(100svh-60px)] shadow-xl`}
      >
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white p-2.5 rounded-full bg-[#ffffff14] hover:bg-[#ffffff22] active:scale-95 transition-all duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* User profile section with improved responsive sizing */}
        <div className="w-full flex flex-col items-center pt-14 sm:pt-16 md:pt-8 pb-6 px-4">
          <div className="relative w-[90px] sm:w-[100px] md:w-[120px] h-[90px] sm:h-[100px] md:h-[120px] rounded-full overflow-hidden border-4 border-[#4a4a4a] shadow-lg transform hover:scale-105 transition-transform duration-300">
            {session && isImgLoading && session?.user?.image ? (
              <Skeleton className="w-full h-full bg-[#444444] animate-pulse" />
            ) : (
              <Image
                src={session?.user?.image}
                alt=""
                width={120}
                height={120}
                onLoadingComplete={() => setIsImgLoading(false)}
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>

        {/* User info card with improved spacing */}
        <div className="px-4 sm:px-5 md:px-6">
          {session ? (
            <div className="backdrop-blur-md bg-[#ffffff0a] rounded-xl p-3 sm:p-4 shadow-lg border border-[#ffffff1a]">
              <div className="space-y-2.5 sm:space-y-3">
                <p className="text-gray-200 text-xs sm:text-sm truncate font-medium">
                  {session?.user.email}
                </p>
                <div className="flex items-center justify-between py-2 border-t border-[#ffffff1a]">
                  <span className="text-gray-300 text-xs sm:text-sm">
                    Credits left:
                  </span>
                  {isCreditsLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
                  ) : (
                    <span
                      ref={creditRef}
                      className="text-green-400 font-semibold text-xs sm:text-sm"
                    >
                      {credits}
                    </span>
                  )}
                </div>
                <Link
                  href="/payment"
                  className="flex items-center justify-between w-full px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-white bg-[#ffffff14] hover:bg-[#ffffff22] rounded-lg transition-all duration-300 active:scale-[0.98]"
                >
                  <span>Get More Credits</span>
                  <FaArrowRight className="text-green-400 text-xs sm:text-sm" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4 bg-[#444444]" />
              <Skeleton className="h-4 w-1/2 bg-[#444444]" />
            </div>
          )}
        </div>

        {/* Action buttons with improved responsive layout */}
        {session && (
          <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-5 md:px-6 space-y-2 sm:space-y-3 md:space-y-0 md:space-x-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              <button
                onClick={() => {
                  signOut({ redirect: false }).then(() => {
                    window.location.href = "/";
                  });
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300 active:scale-[0.98] text-xs sm:text-sm w-full"
              >
                <span>Logout</span>
                <IoIosExit className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <Link href="/contact" className="w-full">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-300 active:scale-[0.98] text-xs sm:text-sm w-full">
                  <span>Help</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main component return with mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full h-[calc(100svh)]">
      <Header>
        {isMobile && session && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ml-auto p-2 text-white hover:bg-[#ffffff14] rounded-full transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        )}
      </Header>
      <TermsACPopup
        open={showTACPopup}
        onAccept={handleAcceptTerms}
        isLoading={tacLoading}
      />
      <section className="flex overflow-auto h-[calc(100svh-60px)] min-h-[500px]">
        <div className="w-full h-[100%] overflow-auto min-h-[500px]">
          <Content />
        </div>
        <SideBar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        {/* Mobile overlay */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </section>
    </div>
  );
};

export default Page;
