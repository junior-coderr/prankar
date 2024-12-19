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
  const persistedState = useSelector((state) => state.persistedState);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch("/api/audio/default");
        let audioData = await response.json();
        setIsAudioFetched(true);
        //  console.log("audioData", audioData.audio);
        setAudioData(audioData.audio);
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    fetchAudio();
  }, []);

  useEffect(() => {
    if (persistedState.selectedAudioIndex !== null) {
      dispatch(setAudioSelected(persistedState.selectedAudioIndex));
    }
  }, []);

  // Modify this useEffect to properly handle persisted audio selection
  useEffect(() => {
    if (audioSelected !== null && audioData.length > 0) {
      // Set the element object state for the persisted selection
      setElemObj((prev) => ({
        ...prev,
        [audioSelected]: {
          isLoading: false,
          isPlaying: true,
        },
      }));

      // Only create new Howl instance if there isn't one already playing
      if (!playingAudio) {
        const sound = new Howl({
          src: [audioData[audioSelected]],
          autoplay: false,
          volume: 0.5,
          onload: () => {
            setIsLoading(false);
            dispatch(setPlayingAudio(sound));
          },
          onstop: () => {
            setIsLoading(false);
            setElemObj((prev) => ({
              ...prev,
              [audioSelected]: {
                isLoading: false,
                isPlaying: false,
              },
            }));
          },
        });
        setCurrentIndex(audioSelected);
      }
    }
  }, [audioSelected, audioData]);

  const handleAudioClick = async (index, audio) => {
    if (isLoading) return;
    setIsLoading(true);

    // If clicking the same audio that's currently selected
    if (index === currentIndex) {
      if (playingAudio) {
        playingAudio.stop();
        await playingAudio.unload();
        dispatch(setPlayingAudio(null));
      }
      dispatch(setAudioSelected(null));
      setCurrentIndex(null);
      setElemObj((prev) => ({
        ...prev,
        [index]: {
          isLoading: false,
          isPlaying: false,
        },
      }));
      setIsLoading(false);
      return;
    }

    // First, stop any currently playing audio
    if (playingAudio) {
      // Check if the audio is actually loaded before trying to stop it
      if (playingAudio.state() === "loaded") {
        playingAudio.stop();
        await playingAudio.unload();
      }
      dispatch(setPlayingAudio(null));
      dispatch(setAudioSelected(null));
    }

    // Reset all audio states
    setElemObj((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key] = {
          isLoading: false,
          isPlaying: false,
        };
      });
      return newState;
    });

    // Set loading state for clicked audio
    setElemObj((prev) => ({
      ...prev,
      [index]: {
        isLoading: true,
        isPlaying: false,
      },
    }));

    // Create new audio instance
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
            isLoading: false,
            isPlaying: false,
          },
        }));
      },
      onload: () => {
        setIsLoading(false);
        if (externalAudioUnload) {
          dispatch(setExternalAudioUnload(false));
        } else {
          sound.play();
        }
      },
      onstop: () => {
        setIsLoading(false);
        setElemObj((prev) => ({
          ...prev,
          [index]: {
            isLoading: false,
            isPlaying: false,
          },
        }));
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
        <CarouselItem className="w-full">
          <div
            className="px-5 font-bold text-xl w-full"
            style={{ textAlign: "center" }}
          >
            Hindi
          </div>
          <div
            className="flex-shrink-0 w-full font-medium h-[100%] mx-auto grid-cols-2 sm:grid-cols-3 gap-y-5 px-5 overflow-y-auto place-items-center pb-10"
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
                  <div key={index} className="">
                    <div
                      className={`text-center bg-[#e5e5e5] rounded-lg p-3 w-28  text-black hover:opacity-85 transition-all relative  cursor-pointer  ${
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
                  </div>
                );
              })
            ) : (
              <div className="flex items-center absolute justify-center w-full mx-auto">
                <Loader className="mx-auto" />
              </div>
            )}
          </div>
        </CarouselItem>
        <CarouselItem className="flex-shrink-0 w-full p">
          English - Coming soon
        </CarouselItem>
        {/* <CarouselItem className="flex-shrink-0 w-full">Audio 3</CarouselItem> */}
      </CarouselContent>
      <CarouselPrevious className="left-3  cursor-pointer text-black active:scale-90 duration-150" />
      <CarouselNext className="right-3  cursor-pointer text-black active:scale-90 duration-150" />
    </Carousel>
  );
};

export default SelectAudioCarousel;
