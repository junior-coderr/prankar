"use client";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import {
  setAudioSelected,
  clearAudioSelected,
} from "../../app/redux/slices/audioSelected";
import { setPlayingAudio } from "../../app/redux/slices/playingAudio";
import { Howl } from "howler";
import Loader from "../custom/loader";

const SelectAudioCarousel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [elemObj, setElemObj] = useState({});
  // useEffect(() => {
  //   console.log(elemObj);
  // }, [elemObj]);
  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);
  const dispatch = useDispatch();
  const playingAudio = useSelector((state) => state.playingAudio.value);
  const tempUrl =
    "https://webnew.blob.core.windows.net/audio/keyboard-typing-5997.mp3";
  const handleAudioClick = (index) => {
    if (playingAudio) {
      playingAudio.stop();
      setElemObj((prev) => ({
        ...prev,
        [currentIndex]: {
          ...prev[currentIndex],
          isPlaying: false,
        },
      }));
    }

    if (elemObj[index]?.isLoading) return;
    dispatch(setAudioSelected(index));
    setElemObj((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        isLoading: true,
      },
    }));
    const sound = new Howl({
      src: [tempUrl],
      autoplay: true,
      volume: 0.5,
      onplay: () => {
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            isPlaying: true,
          },
        }));
      },
      onend: () => {
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            isPlaying: false,
          },
        }));
      },
      onload: () => {
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            isLoading: false,
          },
        }));
      },
      onpause: () => {
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            isPlaying: false,
          },
        }));
      },
    });
    dispatch(setPlayingAudio(sound));
    sound.play();
  };
  return (
    <Carousel className="w-full  h-[50%]">
      <CarouselContent className=" h-full">
        {/* h-[calc(55vh)] */}
        <CarouselItem
          className="flex-shrink-0 w-full font-semibold h-[100%] mx-auto grid-cols-2 sm:grid-cols-3 gap-y-5 px-5 overflow-y-auto place-items-center "
          style={{
            display: "grid",
            // gridTemplateColumns: " repeat(2, 1fr)",
            gridAutoRows: "1fr",
          }}
        >
          {Array.from({ length: 20 }).map((_, index) => {
            // Initialize the element object only once
            if (!(index in elemObj)) {
              setElemObj((prev) => ({
                ...prev,
                [index]: {
                  isLoading: false,
                  isPlaying: false,
                },
              }));
            }
            return (
              <div
                key={index}
                className={`text-center bg-[#e5e5e5] rounded-lg p-5 w-32  text-black hover:opacity-85 transition-all relative  cursor-pointer ${
                  elemObj[index]?.isPlaying ? "border-4 border-[#25b09b]" : ""
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  handleAudioClick(index);
                }}
                disabled={elemObj[index]?.isLoading}
              >
                {elemObj[index]?.isLoading ? (
                  <div className="flex items-center justify-center scale-50">
                    <Loader className="mx-auto" />
                  </div>
                ) : (
                  <span className="text-center relative">
                    Audio {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </CarouselItem>
        <CarouselItem className="flex-shrink-0 w-full">Audio 2</CarouselItem>
        <CarouselItem className="flex-shrink-0 w-full">Audio 3</CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="left-3  cursor-pointer text-black active:scale-90 duration-150" />
      <CarouselNext className="right-3  cursor-pointer text-black active:scale-90 duration-150" />
    </Carousel>
  );
};

export default SelectAudioCarousel;
