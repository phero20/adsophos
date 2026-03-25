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

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
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
