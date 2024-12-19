import React, { useState, useEffect } from "react";

const Logo = () => {
  const [isAnimating, setIsAnimating] = useState(true); // Changed to true for initial animation

  useEffect(() => {
    // Initial animation cleanup
    const initialTimeout = setTimeout(() => setIsAnimating(false), 2000);

    // Regular interval animation
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 30000);

    // Cleanup both timers
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative">
      <svg
        className="w-8 h-8 mr-2 transition-all duration-300"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Phone icon */}
        <path
          d="M21.15 19.74L17.42 16a1.24 1.24 0 00-1.72.04l-2.34 2.34a15.76 15.76 0 01-6.07-6.07l2.34-2.34a1.24 1.24 0 00.04-1.72L6.26 4.85a1.25 1.25 0 00-1.72-.04L2.29 6.92a1.25 1.25 0 00-.37.89c0 .28.01.57.03.86.24 3.22 1.79 7.33 4.8 10.34s7.12 4.57 10.34 4.8c.29.02.58.03.86.03h.06a1.25 1.25 0 00.89-.37l2.11-2.23a1.25 1.25 0 00.14-1.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isAnimating ? "animate-shake" : ""}
        />
        {/* Jester hat - changed animation from bounce to hat-lift */}
        <path
          d="M12 2c1.5 0 2.5 1 2.5 2.5S13.5 7 12 7 9.5 6 9.5 4.5 10.5 2 12 2z"
          fill="currentColor"
          className={`transition-colors duration-300 ${
            isAnimating ? "animate-hat-lift fill-[#4ade80]" : ""
          }`}
        />
        {/* Circles with existing animations */}
        {[
          { cx: 12, cy: 2, animation: "translate-x" },
          { cx: 10.5, cy: 4.5, animation: "translate-y" },
          { cx: 13.5, cy: 4.5, animation: "translate-y-neg" },
        ].map((circle, i) => (
          <circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r="0.5"
            fill="currentColor"
            className={`transition-transform duration-300 ${
              isAnimating ? `animate-${circle.animation}` : ""
            }`}
          />
        ))}
      </svg>
    </div>
  );
};

export default Logo;
