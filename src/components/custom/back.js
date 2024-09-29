import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Back = () => {
  const router = useRouter();
  return (
    <div>
      <IoArrowBack
        onClick={() => {
          router.back();
        }}
        className="text-2xl cursor-pointer"
      />
    </div>
  );
};

export default Back;
