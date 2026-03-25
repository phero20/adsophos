import { motion } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";

const HeroSection = () => {

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

      <div className="relative z-10 flex flex-col items-center justify-center mt-12 md:mt-20">
        <motion.img
          layoutId="main-logo"
          src={logo}
          alt="ADSOPHOS 2026"
          className="w-40 md:w-56 mb-6"
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        />

        <motion.h1
          className="font-arcade text-4xl md:text-6xl lg:text-7xl text-white mb-2 tracking-wide hero-title-glow"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            WebkitTextStroke: '2px hsl(340, 100%, 57%)',
            paintOrder: 'stroke fill',
          }}
        >
          ADSOPHOS
        </motion.h1>

        <motion.p
          className="font-display text-4xl md:text-6xl lg:text-7xl text-arcade-yellow mb-2 hero-year-glow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          2026
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3 mb-12 mt-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <p className="font-arcade text-xs md:text-xl text-center text-arcade-yellow tracking-widest hero-glow">
            LEVEL UP YOUR CURIOSITY
          </p>
          <p className="font-arcade text-[10px] md:text-sm text-center text-white tracking-[0.2em] uppercase">
            9TH & 10TH APRIL
          </p>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <motion.a
            href="#events"
            className="font-arcade text-[10px] md:text-xs px-8 py-4 bg-arcade-pink text-primary-foreground pixel-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            EXPLORE EVENTS
          </motion.a>

          <motion.a
            href="#contact"
            className="font-arcade text-[10px] md:text-xs px-8 py-4 bg-background text-arcade-yellow pixel-btn-yellow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            CONTACT US
          </motion.a>
        </motion.div>
      </div>


    </section>
  );
};

export default HeroSection;
