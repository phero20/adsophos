import { motion } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <AnimatedShaderBackground />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center mt-12">
        <motion.img
          layoutId="main-logo"
          src={logo}
          alt="ADSOPHOS 2026"
          className="w-40 md:w-56 mb-6"
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        />

        <motion.h1
          className="font-arcade text-3xl md:text-5xl lg:text-7xl text-white tracking-[0.1em] uppercase flex justify-center"
          style={{
            textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,0.5)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
        >
          {"ADSOPHOS".split("").map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block hover:text-arcade-yellow cursor-default"
              whileHover={{
                rotate: index % 2 === 0 ? 10 : -10,
                scale: 1.2,
                y: -10,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          className="flex items-center gap-4 mt-2 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
        >
          <div className="h-1 w-12 md:w-16 bg-arcade-pink" style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.8)" }} />
          <motion.p
            className="font-arcade text-xl md:text-3xl lg:text-5xl text-arcade-yellow tracking-widest cursor-default relative"
            style={{
              textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,0.8)",
            }}
            whileHover={{ 
              scale: 1,
              rotate: -5,
              textShadow: "4px 4px 0px #ec4899, 8px 8px 0px rgba(0,0,0,0.8)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            2026
          </motion.p>
          <div className="h-1 w-12 md:w-16 bg-arcade-pink" style={{ boxShadow: "2px 2px 0px rgba(0,0,0,0.8)" }} />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2 mb-12 mt-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <p 
            className="font-arcade text-xs md:text-sm text-center text-arcade-yellow tracking-widest"
            style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.8)" }}
          >
            LEVEL UP YOUR CURIOSITY
          </p>
          <p 
            className="font-arcade text-[10px] md:text-xs text-center text-white tracking-[0.2em] uppercase"
            style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.8)" }}
          >
            9TH & 10TH APRIL
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring", bounce: 0.6 }}
        >
          <Button asChild variant="default" size="default">
            <a href="#events">EXPLORE EVENTS</a>
          </Button>

          <Button asChild variant="yellow" size="default">
            <a href="#contact">CONTACT US</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
