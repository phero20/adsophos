import { useState } from "react";
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

const MarqueeTicker = () => (
  <div className="bg-arcade-yellow overflow-hidden py-2">
    <div className="animate-marquee whitespace-nowrap flex">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="font-arcade text-[9px] text-background mx-8">
          ★ ADSOPHOS 2026 — LEVEL UP YOUR SKILLS ★ 2-DAY TECH FEST ★ PAPER PRESENTATION • POSTER PRESENTATION • QUIZ COMPETITION • FUN EVENTS ★
        </span>
      ))}
    </div>
  </div>
);

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <MarqueeTicker />
        <AboutSection />
        <HistorySection />
        <EventsSection />
        <ScheduleSection />
        <FAQSection />
        <ContactSection />
        <JoystickTrigger />
        <Footer />
      </div>
    </>
  );
};

export default Index;
