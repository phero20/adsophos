import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";

interface Props {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          // Give Framer Motion time to run the exit fade-out transition before destroying the component
          setTimeout(onComplete, 450);
          return 101; // trigger AnimatePresence exit
        }
        return p + 2.5; // sped up loading process
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {progress <= 100 && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-12"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }} // quicker fade out
        >
          <motion.img
            layoutId="main-logo"
            src={logo}
            alt="ADSOPHOS Logo"
            className="w-48 md:w-64"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <div className="flex flex-col items-center gap-4">
            <motion.span 
              className="font-arcade text-[10px] text-arcade-pink animate-blink tracking-widest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              LOADING...
            </motion.span>
            
            <motion.div 
              className="w-56 h-3 bg-secondary pixel-border" 
              style={{ borderWidth: 2, boxShadow: '2px 2px 0 0 hsl(340 100% 57%)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            >
              <motion.div
                className="h-full bg-arcade-yellow"
                style={{ width: `${progress}%` }}
              />
            </motion.div>
            
            <motion.span 
              className="font-arcade text-[9px] text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
            >
              {Math.floor(progress)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
