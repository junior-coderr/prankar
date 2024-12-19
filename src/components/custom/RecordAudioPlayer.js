"use client";
import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Skeleton } from "../ui/skeleton";

const RecordAudioPlayer = ({ audioFile }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    //  console.log(isLoading);
  }, [isLoading]);
  return (
    <div className="relative w-[75%] flex flex-col justify-center items-center min-w-[300px] h-[120px]">
      {/* Skeleton overlay */}
      {isLoading && (
        <Skeleton className="absolute inset-0 bg-[#646464] flex items-center justify-center z-10">
          <span className="text-[#c5c5c5] text-lg font-semibold">
            Loading...
          </span>
        </Skeleton>
      )}

      {/* AudioPlayer component is always mounted */}
      <AudioPlayer
        src={audioFile}
        onLoadedMetadata={() => {
          setIsLoading(false); // Stop loading when metadata is loaded
          //  console.log("Metadata loaded");
        }}
        onCanPlay={() => {
          setIsLoading(false); // Stop loading when the audio can play
          //  console.log("Audio can play");
        }}
        autoPlay={true}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        // showDownloadProgress={false}
        showVolumeControls={false}
        style={{ zIndex: isLoading ? 1 : 0 }} // Ensure skeleton overlay is on top
      />
    </div>
  );
};

export default RecordAudioPlayer;
