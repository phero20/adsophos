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
                    className="bg-zinc-950 border-4 p-4 flex items-center gap-3 mb-4 pointer-events-auto"
                    style={{
                        borderColor: `hsl(var(--arcade-pink))`,
                        boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
                    }}
                >
                    <Sparkles className="text-arcade-yellow animate-pulse" />
                    <span className="font-body font-bold text-xs text-white tracking-widest leading-none">🎮 SECRET LEVEL UNLOCKED</span>
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
            scale: isHolding ? 1.1 : 1,
            rotate: isHolding ? [0, -5, 5, 0] : 0 
          }}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ rotate: { repeat: isHolding ? Infinity : 0, duration: 0.2 } }}
          className="bg-zinc-950 w-14 h-14 md:w-16 md:h-16 border-4 flex items-center justify-center pointer-events-auto cursor-pointer group transition-all"
          style={{
            borderColor: `hsl(var(--arcade-pink))`,
            boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
          }}
        >
          <div className={`relative ${isHolding ? "animate-bounce" : ""}`}>
             <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-arcade-pink group-hover:text-arcade-yellow transition-colors" />
             <div className="absolute -top-2 -right-2 w-2.5 h-2.5 bg-arcade-yellow animate-pulse" />
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
