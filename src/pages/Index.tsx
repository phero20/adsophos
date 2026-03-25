import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import ScheduleSection from "@/components/ScheduleSection";
import StallsSection from "@/components/StallsSection";
import RegistrationSection from "@/components/RegistrationSection";
import SponsorsSection from "@/components/SponsorsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const MarqueeTicker = () => (
  <div className="bg-arcade-yellow overflow-hidden py-2">
    <div className="animate-marquee whitespace-nowrap flex">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="font-arcade text-[9px] text-background mx-8">
          ★ ADSOPHOS 2026 — REGISTER NOW ★ LEVEL UP YOUR SKILLS ★ 2-DAY TECH FEST ★ CODING • ROBOTICS • GAMING • FUN EVENTS ★
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
        <EventsSection />
        <ScheduleSection />
        <StallsSection />
        <RegistrationSection />
        <SponsorsSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
