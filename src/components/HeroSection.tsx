import { useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";

const HeroSection = () => {
  const [entered, setEntered] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 arcade-grid-bg">
      <motion.img
        src={logo}
        alt="ADSOPHOS 2026"
        className="w-40 md:w-56 mb-8 drop-shadow-[0_0_30px_hsl(var(--neon-cyan)/0.3)]"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
      />

      <motion.h1
        className="font-arcade text-2xl md:text-4xl lg:text-5xl text-foreground mb-4 text-glow-cyan"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        ADSOPHOS 2026
      </motion.h1>

      <motion.p
        className="font-display text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-neon-red via-neon-yellow to-neon-cyan bg-clip-text text-transparent mb-4"
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
        className="relative font-arcade text-xs md:text-sm px-8 py-4 rounded-lg bg-secondary text-neon-cyan neon-border hover:bg-neon-cyan/10 transition-all duration-300 animate-glow-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {entered ? "▶ ENTER FEST" : "🪙 INSERT COIN"}
      </motion.button>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-neon-cyan/40 flex justify-center pt-1">
          <div className="w-1 h-2 bg-neon-cyan rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
