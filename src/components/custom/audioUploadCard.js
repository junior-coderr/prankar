import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const AudioUploadCard = () => {
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
            className="cursor-pointer hover:scale-105 transition-all duration-150 active:scale-100 select-none p-2  border-[#ababab56]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioUploadCard;
