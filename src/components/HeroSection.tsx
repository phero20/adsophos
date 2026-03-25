import { useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";

const HeroSection = () => {
  const [entered, setEntered] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <AnimatedShaderBackground />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Revolving logo */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <motion.img
            src={logo}
            alt="ADSOPHOS 2026"
            className="w-44 md:w-64 lg:w-72"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.p
          className="font-display text-3xl md:text-5xl lg:text-6xl text-arcade-yellow mb-3 text-glow-yellow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          2026
        </motion.p>

        <motion.p
          className="font-body text-lg md:text-xl text-muted-foreground mb-10 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Level Up • The Arcade Fest
        </motion.p>

        <motion.div className="flex gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
          <motion.button
            onClick={() => {
              setEntered(true);
              setTimeout(() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }, 400);
            }}
            className="font-arcade text-[10px] md:text-xs px-6 py-4 bg-arcade-pink text-primary-foreground pixel-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {entered ? "▶ ENTER FEST" : "🪙 INSERT COIN"}
          </motion.button>

          <motion.a
            href="#events"
            className="font-arcade text-[10px] md:text-xs px-6 py-4 bg-background text-arcade-yellow pixel-btn-yellow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            VIEW EVENTS
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="font-arcade text-[8px] text-arcade-pink animate-blink">▼ SCROLL ▼</div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
