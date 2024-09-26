"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { useRef } from "react";
import Loader from "./loader";

export function TabsDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef();

  const handlePlayPause = (type, extra = false) => {
    if (isPlaying) {
      // if (extra) return;
      setIsLoading(true);
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      if (extra) return;
      let url = "";
      if (type == "funny") {
        url =
          "https://webnew.blob.core.windows.net/audio/keyboard-typing-5997.mp3";
      } else if (type == "serious") {
        url =
          "https://webnew.blob.core.windows.net/audio/keyboard-typing-5997.mp3";
      } else {
        url =
          "https://webnew.blob.core.windows.net/audio/keyboard-typing-5997.mp3";
      }
      setIsLoading(true);
      audioRef.current = new Audio(url);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          audioRef.current.addEventListener("ended", () => {
            setIsPlaying(false);
          });
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsLoading(false);
        });
    }
  };

  return (
    <Tabs
      defaultValue="funny"
      className="w-[85%] min-w-[250px] h-full mx-auto pt-2"
      onValueChange={(value) => {
        handlePlayPause(value, true);
        console.log("value", value);
      }}
    >
      <TabsList className="flex justify-center bg-[#3f3f3f] text-white items-center w-full">
        <TabsTrigger value="funny" className="w-full">
          Funny
        </TabsTrigger>
        <TabsTrigger value="serious" className="w-full">
          Serious
        </TabsTrigger>
        <TabsTrigger value="notorious" className="w-full">
          Notorious
        </TabsTrigger>
      </TabsList>
      <TabsContent className="text-white h-full " value="funny">
        <div className="flex justify-center items-center flex-col h-[70%]">
          {isLoading ? (
            <Loader width="50px" borderWidth="5px" />
          ) : isPlaying ? (
            <FaCirclePause
              className="w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => {
                handlePlayPause("serious");
              }}
            />
          ) : (
            <FaCirclePlay
              className="w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => {
                handlePlayPause("serious");
              }}
            />
          )}
        </div>
      </TabsContent>
      <TabsContent className="text-white h-full" value="serious">
        <div className="flex justify-center items-center flex-col h-[70%]">
          {isLoading ? (
            <Loader />
          ) : isPlaying ? (
            <FaCirclePause
              className="w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => {
                handlePlayPause("serious");
              }}
            />
          ) : (
            <FaCirclePlay
              className="w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => {
                handlePlayPause("serious");
              }}
            />
          )}
        </div>
      </TabsContent>
      <TabsContent className="text-white h-full" value="notorious">
        <div className="flex justify-center items-center flex-col h-[70%]">
          {isLoading ? (
            <Loader />
          ) : isPlaying ? (
            <FaCirclePause
              className="w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => {
                handlePlayPause("notorious");
              }}
            />
          ) : (
            <FaCirclePlay
              className="w-12 h-12 cursor-pointer transition-all duration-200 hover:scale-110"
              onClick={() => {
                handlePlayPause("notorious");
              }}
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default TabsDemo;
