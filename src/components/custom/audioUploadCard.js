import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { setAudioFile } from "../../app/redux/slices/audioFile";
import { setPlayingAudio } from "../../app/redux/slices/playingAudio";

const AudioUploadCard = () => {
  const dispatch = useDispatch();
  const playingAudio = useSelector((state) => state.playingAudio.value);
  const persistedState = useSelector((state) => state.persistedState);

  // Add useEffect to initialize from persisted state
  useEffect(() => {
    if (persistedState.customAudioFile) {
      dispatch(setAudioFile(persistedState.customAudioFile));
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "audio/mpeg") {
      // Stop and unload current playing audio if exists
      if (playingAudio) {
        playingAudio.stop();
        playingAudio.unload();
        dispatch(setPlayingAudio(null));
      }

      // Set the new audio file
      dispatch(setAudioFile(file));
      console.log(file);
    } else {
      alert("Please upload an MP3 audio file.");
      dispatch(setAudioFile(null));
    }
  };

  return (
    <Card className="w-[75%] max-w-[450px] max-h-[120px] bg-[#e8e8e8]">
      <CardHeader>
        <CardTitle>
          <p>Upload your audio</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            type="file"
            accept={["audio/mp3", "audio/wav"]}
            onChange={handleFileChange}
            className="cursor-pointer hover:scale-105 transition-all duration-150 active:scale-100 select-none p-2  border-[#ababab56]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioUploadCard;
