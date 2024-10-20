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
import { setAudioSelected } from "../../app/redux/slices/audioSelected";
import { setPlayingAudio } from "../../app/redux/slices/playingAudio";
import { Howl } from "howler";
import Loader from "../custom/loader";
import { setExternalAudioUnload } from "../../app/redux/slices/ExternalAudioUnload";

const SelectAudioCarousel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [elemObj, setElemObj] = useState({});
  const [audioData, setAudioData] = useState([]);
  const [isAudioFetched, setIsAudioFetched] = useState(false);

  const externalAudioUnload = useSelector(
    (state) => state.externalAudioUnload.value
  );

  const audioSelected = useSelector(
    (state) => state.audioSelected.audioSelected
  );
  const dispatch = useDispatch();
  const playingAudio = useSelector((state) => state.playingAudio.value);

  // const tempUrl =
  //   "https://webnew.blob.core.windows.net/audio/keyboard-typing-5997.mp3";

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch("/api/audio/default");
        let audioData = await response.json();
        setIsAudioFetched(true);
        console.log("audioData", audioData.audio);
        setAudioData(audioData.audio);
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    fetchAudio();
  }, []);

  const handleAudioClick = async (index, audio) => {
    if (isLoading) return;
    setIsLoading(true);
    if (playingAudio) {
      playingAudio.stop();
      await playingAudio.unload();
      dispatch(setPlayingAudio(null));
      dispatch(setAudioSelected(null));
    }
    setElemObj((prev) => ({
      ...prev,
      [currentIndex]: {
        // ...prev[currentIndex],
        isPlaying: false,
        isLoading: false,
      },
    }));

    if (index == currentIndex) {
      dispatch(setAudioSelected(null));
      dispatch(setPlayingAudio(null));
      setIsLoading(false);
      setCurrentIndex(null);
      return;
    }

    // if (playingAudio != null) return;
    dispatch(setAudioSelected(index));

    // setIsLoading(true);
    setElemObj((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        isLoading: true,
      },
    }));
    const sound = new Howl({
      src: [audio],
      autoplay: false,
      volume: 0.5,
      onplay: () => {
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            isLoading: false,
            isPlaying: true,
          },
        }));
      },
      onend: () => {
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            isPlaying: false,
          },
        }));
      },
      onload: () => {
        // console.log("externalAudioUnload", externalAudioUnloadEffect);
        setIsLoading(false);
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            isLoading: false,
            isPlaying: true,
          },
        }));
        console.log("externalAudioUnload in load call", externalAudioUnload);
        if (externalAudioUnload) {
          console.log("setting externalAudioUnload to false");
          dispatch(setExternalAudioUnload(false));
        } else {
          sound.play(); // Play only after it's loaded
        }
        setIsLoading(false);
      },
      onstop: () => {
        setIsLoading(false);
      },
    });
    setCurrentIndex(index);
    dispatch(setAudioSelected(index));
    dispatch(setPlayingAudio(sound));
  };
  return (
    <Carousel className="w-full  h-[50%]">
      <CarouselContent className=" h-full">
        {/* h-[calc(55vh)] */}
        <CarouselItem
          className="flex-shrink-0 w-full font-medium h-[100%] mx-auto grid-cols-2 sm:grid-cols-3 gap-y-5 px-5 overflow-y-auto place-items-center "
          style={{
            display: "grid",
            gridAutoRows: "1fr",
            gridAutoColumns: "1fr",
          }}
        >
          {audioData?.length > 0 ? (
            audioData.map((audio, index) => {
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
                    elemObj[index]?.isPlaying && audioSelected == index
                      ? "border-4 border-[#25b09b]"
                      : ""
                  }`}
                  onClick={() => {
                    handleAudioClick(index, audio);
                  }}
                  disabled={elemObj[index]?.isLoading}
                >
                  {elemObj[index]?.isLoading ? (
                    <div className="flex items-center justify-center scale-50">
                      <Loader className="mx-auto" />
                    </div>
                  ) : (
                    <span className="text-center relative">
                      {/* {audio.slice(0, 10)} */}
                      Audio {index + 1}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex items-center absolute justify-center w-full mx-auto">
              <Loader className="mx-auto" />
            </div>
          )}
        </CarouselItem>
        {/* <CarouselItem className="flex-shrink-0 w-full">Audio 2</CarouselItem> */}
        {/* <CarouselItem className="flex-shrink-0 w-full">Audio 3</CarouselItem> */}
      </CarouselContent>
      <CarouselPrevious className="left-3  cursor-pointer text-black active:scale-90 duration-150" />
      <CarouselNext className="right-3  cursor-pointer text-black active:scale-90 duration-150" />
    </Carousel>
  );
};

export default SelectAudioCarousel;
