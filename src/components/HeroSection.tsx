import { useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";

const HeroSection = () => {
  const [entered, setEntered] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Synthwave sunset background */}
      <AnimatedShaderBackground />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.img
          src={logo}
          alt="ADSOPHOS 2026"
          className="w-36 md:w-52 mb-6 drop-shadow-[0_0_40px_rgba(255,105,180,0.4)]"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        />

        <motion.h1
          className="font-arcade text-xl md:text-3xl lg:text-4xl text-foreground mb-3 text-glow-pink"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          ADSOPHOS 2026
        </motion.h1>

        <motion.p
          className="font-display text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-neon-pink via-neon-orange to-neon-yellow bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          LEVEL UP
        </motion.p>

        <motion.p
          className="font-body text-xl md:text-2xl text-muted-foreground mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Unlock the Next Level
        </motion.p>

        <motion.button
          onClick={() => {
            setEntered(true);
            setTimeout(() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }, 400);
          }}
          className="relative font-arcade text-xs md:text-sm px-8 py-4 rounded-lg bg-secondary text-neon-pink neon-border-pink hover:bg-neon-pink/10 transition-all duration-300 animate-glow-pulse"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {entered ? "▶ ENTER FEST" : "🪙 INSERT COIN"}
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-neon-pink/40 flex justify-center pt-1">
          <div className="w-1 h-2 bg-neon-pink rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
