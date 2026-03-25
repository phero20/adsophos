import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Sparkles } from "lucide-react";
import PacmanGame from "./pacman-game";

const JoystickTrigger = () => {
  const [clickCount, setClickCount] = useState(0);
  const [gameOpen, setGameOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerActivation = () => {
    setShowNotification(true);
    setTimeout(() => {
        setShowNotification(false);
        setGameOpen(true);
    }, 1500);
  };

  const handleJoystickClick = () => {
    setClickCount(prev => prev + 1);
    
    // Reset click count after 1s if not finished
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setClickCount(0), 1000);

    if (clickCount + 1 >= 3) {
      triggerActivation();
      setClickCount(0);
    }
  };

  const handlePointerDown = () => {
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
        triggerActivation();
        setIsHolding(false);
    }, 2000);
  };

  const handlePointerUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setIsHolding(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
            {showNotification && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    className="bg-arcade-pink px-6 py-3 pixel-border shadow-[0_0_20px_rgba(255,45,120,0.5)] flex items-center gap-3 mb-4 pointer-events-auto"
                >
                    <Sparkles className="text-white animate-pulse" />
                    <span className="font-arcade text-[10px] text-white tracking-widest leading-none">🎮 SECRET LEVEL UNLOCKED</span>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.button
          onClick={handleJoystickClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: isHolding ? 1.2 : 1,
            rotate: isHolding ? [0, -5, 5, 0] : 0 
          }}
          whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
          transition={{ rotate: { repeat: isHolding ? Infinity : 0, duration: 0.2 } }}
          className="bg-card w-16 h-16 md:w-20 md:h-20 rounded-full pixel-border border-4 border-arcade-pink flex items-center justify-center pointer-events-auto cursor-pointer group shadow-[0_0_30px_rgba(255,45,120,0.3)] hover:shadow-[0_0_50px_rgba(255,45,120,0.6)] transition-shadow"
        >
          <div className={`relative ${isHolding ? "animate-bounce" : "animate-float"}`}>
             <Gamepad2 className="w-8 h-8 md:w-10 md:h-10 text-arcade-pink group-hover:text-white transition-colors" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-arcade-yellow rounded-full animate-pulse shadow-[0_0_10px_#FFD700]" />
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {gameOpen && (
          <PacmanGame onClose={() => setGameOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default JoystickTrigger;
