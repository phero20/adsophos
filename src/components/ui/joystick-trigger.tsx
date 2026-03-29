import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import PacmanGame from "./pacman-game";

const JoystickTrigger = () => {
  const [gameOpen, setGameOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end gap-3 pointer-events-none">
        <motion.button
          onClick={() => setGameOpen(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -4 }}
          className="bg-zinc-950 w-14 h-14 md:w-16 md:h-16 border-4 flex items-center justify-center pointer-events-auto cursor-pointer group transition-all"
          style={{
            borderColor: `hsl(var(--arcade-pink))`,
            boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
          }}
        >
          <div className="relative">
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
