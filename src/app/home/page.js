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
import { setCredits, setCreditsLoading } from "../../app/redux/slices/credits";

import { VscDebugRestart } from "react-icons/vsc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { FaCopy } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { IoMusicalNotes } from "react-icons/io5";
import { FaCoins } from "react-icons/fa";
import { BsPiggyBank } from "react-icons/bs";
import { IoMdHelpCircle } from "react-icons/io"; // Add this import

// Main Page Component
const Page = () => {
  const [isMobile, setIsMobile] = useState(null);
  const creditRef = useRef();
  const [checkTAS, setCheckTAS] = useState(false);
  const [showTACPopup, setShowTACPopup] = useState(false);
  const [tacLoading, setTacLoading] = useState(false);
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

  const dispatch = useDispatch();
  const credits = useSelector((state) => state.credits.value);
  const creditsLoading = useSelector((state) => state.credits.loading);

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
    } finally {
      dispatch(setCreditsLoading(false));
    }
  }

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      // console.log("session", session);
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
    // Add this line to control popover state
    const [open, setOpen] = useState(false);

    useEffect(() => {
      dispatch(setPhoneNo(prefixData + " "));
      // console.log("prefix", prefixData);
    }, [prefixData, dispatch]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <IoIosArrowDropdownCircle
            size={31}
            className="bg-[#e2e2e2] text-[#3f3f3f] box-content rounded-md p-[15px] cursor-pointer md:p-[22px] border-[#767676] border-4 md:border-8 md:border-r-0 border-r-0 active:translate-x-1 hover:bg-opacity-90 transition-all duration-150 rounded-tr-none rounded-br-none md:py-0 h-[28px] md:min-h-[70px] shadow-inner"
          />
        </PopoverTrigger>
        <PopoverContent className="bg-[#e2e2e2] p-1.5 border-2 border-[#767676] shadow-lg w-auto">
          <div className="w-[100px] xs:w-[120px] sm:w-[130px] md:w-[140px] max-h-[250px] md:max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#767676] scrollbar-track-[#e2e2e2] rounded-md">
            {Object.entries(prefixLengths).map(([prefix, length]) => (
              <div
                key={prefix}
                onClick={() => {
                  dispatch(setPrefix(prefix));
                  dispatch(setPhoneNo(prefix + " "));
                  setOpen(false); // Close popover after selection
                }}
                className={`p-2 md:p-2.5 transition-all select-none duration-150 cursor-pointer flex items-center justify-between gap-1 border-b border-[#d1d1d1] last:border-b-0 text-sm ${
                  prefix === prefixData
                    ? "bg-[#3f3f3f] text-white hover:bg-[#4a4a4a]"
                    : "hover:bg-[#d1d1d1]"
                }`}
              >
                <span className="font-medium text-xs md:text-sm">{prefix}</span>
                <span className="text-[10px] md:text-xs opacity-75">
                  ({length})
                </span>
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
      if (credits === 0) {
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
      // console.log("cid", cid);
      if (cid) {
        // console.log("cid", cid);
        serverSEvent(cid);
        handleScroll("down");
        handleScroll("down");
      }
    }, [searchParams]);

    const serverSEvent = async (sid) => {
      // console.log("sid", sid);
      let setStarted = false;
      const eventSource = new EventSource(`/api/call-status-check?sid=${sid}`);

      eventSource.onopen = () => {
        // console.log("Connection to server opened.");
        setSseEstablished(true);
        setIsRestart(false);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log("Received server-side event:", data);
        // console.log("data.Data.status", data?.Data?.status);

        if (data?.Data?.status == "completed" && data?.Data?.recordingUrl) {
          setRecUrl(data?.Data?.recordingUrl);
          creditsCall(session?.user?.email);
          setIsRestart(true);
          eventSource.close();
          setSseEstablished(false);
        }
        // // console.log("recUrl", recUrl);

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
        // console.log("Event source closed");
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
                // console.log("changing :");
              }
            }

            // console.log("sid", data.twilioCall.callSid);
            window.history.replaceState(
              null,
              "",
              `/home/?cid=${data.twilioCall.callSid}`
            );

            // router.replace(`home/?cid=${data.twilioCall.callSid}`);
            serverSEvent(data.twilioCall.callSid);
            // console.log("Audio selected uploaded successfully:", data);
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
                // console.log("changing :");
              }
            }

            dispatch(setSid(data.callResponse.callSid));
            window.history.replaceState(
              null,
              "",
              `/home/?cid=${data.callResponse.callSid}`
            );

            serverSEvent(data.callResponse.callSid);
            // console.log("Audio file uploaded successfully:", data);
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
      // console.log("statusColor", statusColor);
    }, [statusColor]);

    const handleCopyUrl = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying:", error);
        toast.error("Failed to copy link");
      }
    };

    // JSX for Content component
    return (
      <div className="w-full h-[100%] ">
        <section className="flex overflow-auto">
          <div className="w-full h-[calc(100svh-60px)] min-h-[500px] overflow-auto  flex items-center justify-center">
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
                      <div className="relative flex items-center gap-[2px] justify-center group">
                        <PopOverForPrefix />
                        <Input
                          ref={inputRef}
                          type="text"
                          value={phoneNo}
                          onChange={handlePhoneNoChange}
                          className="relative box-border text-xl p-4 px-2  pl-3 placeholder:text-xl w-[60%] text-[#3f3f3f] min-w-[200px] bg-[#e2e2e2] max-w-[360px] font-semibold placeholder:text-[#666] placeholder:font-medium transition-all md:min-w-[300px] md:text-2xl md:p-5 md:pl-3 md:placeholder:text-2xl  md:border-8 duration-150 border-[#767676] border-4   placeholder:opacity-75 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none mx-0 border-l-0 md:border-l-0 rounded-tl-none rounded-bl-none py-0 md:py-0 md:h-[87px] h-[65px] shadow-inner focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                        className={`bg-[#e2e2e2] text-[#242424] px-6 py-3.5 rounded-md hover:bg-opacity-90 active:scale-95 transition-all font-bold duration-150 md:px-8 md:py-4 md:text-xl shadow-md hover:shadow-lg flex items-center gap-2 ${
                          isActive
                            ? "opacity-100 transform hover:-translate-y-0.5"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        Continue
                        <IoIosSend
                          size={20}
                          className={`${
                            isActive ? "group-hover:translate-x-1" : ""
                          } transition-transform`}
                        />
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
                      className="p-2.5 py-2 hover:bg-[#444444] font-semibold transition-all active:scale-95 cursor-pointer duration-150 rounded-full hover:shadow-md"
                      onClick={() => {
                        handleScroll("up");
                        handleScroll("up");
                      }}
                    >
                      <TbArrowBackUp
                        size={25}
                        className="text-white hover:rotate-45 transition-transform duration-200"
                      />
                    </div>
                    <button
                      className={`font-semibold bg-white flex items-center justify-center p-3.5 transition-all w-auto min-w-[120px] active:scale-95 cursor-pointer duration-150 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
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
                          <span className="text-sm md:text-base whitespace-nowrap px-1">
                            Set Audio
                          </span>
                          <IoMusicalNotes
                            size={18}
                            className="ml-1.5 md:ml-2 min-w-[18px] md:min-w-[20px]"
                          />
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
                          <div className="flex items-center gap-4">
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
                            {/* Add copy URL button */}
                            {status === "recordingUrl" && (
                              <FaCopy
                                onClick={handleCopyUrl}
                                size={22}
                                className="opacity-70 mt-5 cursor-pointer hover:opacity-100 active:scale-90 transition-all duration-150 text-blue-400"
                              />
                            )}
                          </div>
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
    // console.log("isImgLoading", isImgLoading);
  }, [isImgLoading]);

  // Sidebar Component
  const SideBar = () => {
    return isMobile != null ? (
      <div className="relative w-[25%] min-w-[200px] max-w-[300px] border-l-[2px] border-[#3f3f3f] h-[calc(100svh-60px)]">
        {/* User profile image */}
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mt-10 border-[5px] border-[#3f3f3f]">
          {session && isImgLoading && session?.user?.image ? (
            <Skeleton className="w-full h-full bg-[#444444] shadow-md" />
          ) : (
            <Image
              src={session?.user?.image}
              alt=" "
              width={100}
              height={100}
              onLoadingComplete={() => setIsImgLoading(false)}
              className="object-cover mx-auto bg-[#444444] shadow-md"
            />
          )}
        </div>
        {/* User info section */}
        <div className="mt-4">
          {session ? (
            <div className="text-center flex flex-col items-start bg-[#3f3f3f] p-2.5 rounded-md mx-auto w-[90%] border-[2px] border-[#444444] text-white">
              <div className="w-full">
                <p className="text-white text-sm md:text-base w-full break-words overflow-hidden">
                  {session?.user.email.length > 20
                    ? `${session?.user.email.substring(0, 20)}...`
                    : session?.user.email}
                </p>
              </div>
              <div className="flex items-center justify-between w-full my-2 bg-[#2d2d2d] p-2 rounded-md">
                <span className="text-sm md:text-base">Balance:</span>
                {creditsLoading ? (
                  <span className="inline-flex items-center justify-center">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                ) : (
                  <span className="font-semibold text-green-400">
                    {credits}
                  </span>
                )}
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
        {/* Logout and Help buttons */}
        {session && (
          <div className="fixed md:absolute bottom-4 right-1 left-1 flex gap-2 flex-col px-2 md:px-4">
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
              className="relative overflow-hidden bg-gradient-to-r from-red-500/50 to-red-600/50 hover:from-red-500/60 hover:to-red-600/60 text-white px-4 py-2.5 rounded-md transition-all duration-300 flex text-xs sm:text-sm items-center justify-center gap-2 w-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 font-medium group"
            >
              <span>Logout</span>
              <IoIosExit
                size={16}
                className="min-w-[16px] transition-transform group-hover:rotate-180 duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </button>
            <Link href="/contact" className="w-full block">
              <button className="relative overflow-hidden bg-gradient-to-r from-blue-500/50 to-blue-600/50 hover:from-blue-500/60 hover:to-blue-600/60 text-white px-4 py-2.5 rounded-md transition-all duration-300 flex text-xs sm:text-sm items-center justify-center gap-2 w-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 font-medium group">
                <span>Help Center</span>
                <IoMdHelpCircle
                  size={18}
                  className="min-w-[18px] transition-transform group-hover:rotate-12 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </div>
        )}
      </div>
    ) : null;
  };

  // Main component return
  return (
    <div className="w-full h-[calc(100svh)]">
      <Header />
      <TermsACPopup
        open={showTACPopup}
        onAccept={handleAcceptTerms}
        isLoading={tacLoading}
      />
      <section className="flex overflow-auto h-[calc(100svh-60px)] min-h-[500px]">
        <div className="w-full h-[100%] overflow-auto min-h-[500px]">
          <Content />
        </div>
        {!isMobile ? <SideBar /> : null}
        {/* {<SideBar />} */}
      </section>
    </div>
  );
};

export default Page;
