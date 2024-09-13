"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Particles from "../magicui/particles";

const SmileRandom = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  const [quantity, setQuantity] = useState(20);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const updateQuantity = () => {
      const screenWidth = window.innerWidth;
      const quantityPer30px = 1; // Adjust this value as needed
      const newQuantity = Math.min(
        Math.max(5, Math.floor(screenWidth / 35) * quantityPer30px),
        18
      );
      const newSize = Math.floor(screenWidth / 163.63);
      setQuantity(Math.max(5, newQuantity)); // Ensure minimum quantity is 10
      setSize(Math.min(Math.max(1.5, newSize), 4.5)); // Ensure minimum quantity is 10
    };

    updateQuantity();
    window.addEventListener("resize", updateQuantity);

    return () => window.removeEventListener("resize", updateQuantity);
  }, []);

  useEffect(() => {
    console.log(size);
  }, [size]);

  return (
    <>
      {size && (
        <Particles
          className="absolute inset-0"
          quantity={quantity}
          ease={20}
          size={size}
          color={color}
          refresh={true}
        />
      )}
    </>
  );
};

export default SmileRandom;
