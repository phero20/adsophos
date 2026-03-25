import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {progress <= 100 && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-arcade text-sm text-neon-cyan animate-neon-pulse">
            LOADING LEVEL...
          </span>
          <div className="w-64 h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-green"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-arcade text-xs text-muted-foreground">{progress}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
