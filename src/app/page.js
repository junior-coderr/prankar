import { Paytone_One } from "next/font/google";
const paytoneOne = Paytone_One({
  weight: "400",
  variable: "--wght@400",
  subsets: ["latin"],
});

import LetterPullup from "../components/magicui/letter-pullup";
import ShinyButton from "../components/magicui/shiny-button";
import * as motion from "framer-motion/client";
import { cn } from "../lib/utils";

import DemoContainer from "../components/custom/DemoContainer";
import DotPattern from "../components/magicui/dot-pattern";
import Headbar from "../components/custom/headbar";
import ShineBorder from "../components/magicui/shine-border";
import SmileRandom from "../components/custom/SmileRandom";

export default function Home() {
  async function HeadText() {
    return (
      <>
        <div className="flex flex-col text-[2.8rem] md:text-7xl select-none leading-[2.8rem] md:leading-[2rem]">
          <LetterPullup
            className={"text-white tracking-[0.02em]"}
            words={"Live LONG"}
            delay={0.03}
          />
          <LetterPullup
            className={"text-white tracking-[0.02em]"}
            words={"DIE Laughing"}
            delay={0.03}
          />
        </div>
      </>
    );
  }
  // ===== Component Definitions =====

  function ShinyButtonDemo() {
    return (
      <ShinyButton
        text="CONTINUE"
        className="bg-white p-2 px-4 text-base text-[#1a1a1a]"
      />
    );
  }

  // ===== Component Definitions =====

  function Container() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring", // Specify the type as 'spring'
          stiffness: 150, // How stiff the spring should be
          damping: 12, // How much to damp the spring (like friction)
          mass: 0.2, // The mass of the object (affects the speed and bounciness)
          delay: 0.4, // Delay of 0.2 seconds
        }}
      >
        <ShineBorder
          className="relative h-[250px] w-[260px] md:w-[300px]  overflow-hidden rounded-lg border-[.8px] bg-[#494A49] mx-auto md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <div className="absolute h-full w-full top-0">
            <DemoContainer />
          </div>
        </ShineBorder>
      </motion.div>
    );
  }

  // ===== Component Definitions =====

  return (
    <>
      {/* Main container for the entire page */}
      <main className="w-[100%] bg-[#2F322F] h-[calc(100svh-60px)] min-h-[500px] relative">
        {/* Animated wrapper for the Headbar component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
          }}
        >
          {/* Header component */}
          <Headbar />
        </motion.div>
        {/* Component for random smile particles */}
        <SmileRandom />
        {/* Main content section */}
        <section
          className={`${paytoneOne.className}
        flex flex-col items-center
        w-full h-full
        justify-center
        `}
        >
          {/* Container for main content elements */}
          <div className="z-10 ">
            {/* Component for the main heading text */}
            <HeadText />
            <br />
            <br />
            {/* Container component, likely for a featured element */}
            <Container />
            <br />

            {/* Wrapper for the action button */}
            <div className="flex">
              {/* Animated link wrapper for the button */}
              <motion.a
                href="/home"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring", // Specify the type as 'spring'
                  stiffness: 300, // How stiff the spring should be
                  damping: 10, // How much to damp the spring (like friction)
                  mass: 0.5, // The mass of the object (affects the speed and bounciness)
                  delay: 0.6, // Delay of 0.2 seconds
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                {/* Component for the shiny button */}
                <ShinyButtonDemo />
              </motion.a>
            </div>
          </div>
          {/* Background dot pattern component */}
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(100svh_circle_at_center,white,transparent)]"
            )}
          />
        </section>
      </main>
    </>
  );
}
