import { useState } from "react";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import HistorySection from "@/components/HistorySection";
import EventsSection from "@/components/EventsSection";
import ScheduleSection from "@/components/ScheduleSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import JoystickTrigger from "@/components/ui/joystick-trigger";


import AnimatedShaderBackground from "@/components/ui/animated-shader-background";

const items = [
  { text: "ADSOPHOS 2026", accent: false },
  { text: "✦", accent: true },
  { text: "LEVEL UP YOUR SKILLS", accent: false },
  { text: "✦", accent: true },
  { text: "2-DAY TECH FEST", accent: false },
  { text: "✦", accent: true },
  { text: "PAPER PRESENTATION", accent: false },
  { text: "✦", accent: true },
  { text: "POSTER PRESENTATION", accent: false },
  { text: "✦", accent: true },
  { text: "QUIZ COMPETITION", accent: false },
  { text: "✦", accent: true },
  { text: "FUN EVENTS", accent: false },
  { text: "✦", accent: true },
  { text: "PROJECT EXPO", accent: false },
  { text: "✦", accent: true },
];

// Duplicate for seamless loop
const track = [...items, ...items];

const InfoBanner = () => (
  <div className="w-full border-y border-arcade-pink/20 py-2.5 relative z-10 overflow-hidden bg-background">
    <motion.div
      className="flex gap-8 whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 22, ease: "linear", repeat: Infinity }}
    >
      {track.map((item, i) => (
        <span
          key={i}
          className={`
            font-arcade text-[9px] tracking-[0.2em] select-none shrink-0
            ${item.accent
              ? "text-arcade-pink/50"
              : "text-arcade-yellow/70"}
          `}
        >
          {item.text}
        </span>
      ))}
    </motion.div>
  </div>
);


const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-[#060610] min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-screen z-0 pointer-events-none overflow-hidden">
        <AnimatedShaderBackground />
      </div>

      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      
      <div 
        className="relative z-10 duration-700 transition-opacity"
        style={{ opacity: loaded ? 1 : 0, pointerEvents: loaded ? "auto" : "none" }}
      >
        <Navbar />
        <HeroSection loaded={loaded} />
        <InfoBanner />
        <AboutSection />
        <HistorySection />
        <EventsSection />
        <ScheduleSection />
        <FAQSection />
        <ContactSection />
        <JoystickTrigger />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
