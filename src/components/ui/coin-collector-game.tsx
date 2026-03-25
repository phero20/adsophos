import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Timer, X, Gamepad2, RotateCcw } from "lucide-react";

interface CoinCollectorGameProps {
  onClose: () => void;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 40;
const COIN_SIZE = 25;
const OBSTACLE_SIZE = 30;

const CoinCollectorGame: React.FC<CoinCollectorGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shake, setShake] = useState(false);

  // Game references
  const playerX = useRef(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
  const items = useRef<{ x: number, y: number, type: "coin" | "obstacle", speed: number }[]>([]);
  const frameId = useRef<number>();
  const lastTime = useRef<number>(0);
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem("adsophos_highscore");
    if (saved) setHighScore(parseInt(saved));

    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState("playing");
    playerX.current = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
    items.current = [];
    lastTime.current = performance.now();
    gameLoop(performance.now());
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const endGame = () => {
    setGameState("gameover");
    if (frameId.current) cancelAnimationFrame(frameId.current);
    
    setHighScore(prev => {
      const newHigh = Math.max(prev, score);
      localStorage.setItem("adsophos_highscore", newHigh.toString());
      return newHigh;
    });
  };

  const gameLoop = (time: number) => {
    if (gameState !== "playing") return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Delta time
    const dt = (time - lastTime.current) / 1000;
    lastTime.current = time;

    // 1. Update Timer
    setTimeLeft(prev => {
      if (prev <= 0) {
        endGame();
        return 0;
      }
      return prev - dt;
    });

    // 2. Clear Canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Background - Pixel stars
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    for(let i=0; i<20; i++) {
        const x = (Math.sin(i * 1234.5) * 0.5 + 0.5) * GAME_WIDTH;
        const y = ((time * 0.05 + i * 50) % GAME_HEIGHT);
        ctx.fillRect(x, y, 2, 2);
    }

    // 3. Move Player
    const speed = 300; // px/s
    if (keys.current["ArrowLeft"]) playerX.current -= speed * dt;
    if (keys.current["ArrowRight"]) playerX.current += speed * dt;
    
    // Bounds
    playerX.current = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, playerX.current));

    // 4. Spawn Items
    if (Math.random() < 0.03) {
      const type = Math.random() < 0.7 ? "coin" : "obstacle";
      items.current.push({
        x: Math.random() * (GAME_WIDTH - 30),
        y: -30,
        type,
        speed: 150 + Math.random() * 100
      });
    }

    // 5. Update & Draw Items
    for (let i = items.current.length - 1; i >= 0; i--) {
      const it = items.current[i];
      it.y += it.speed * dt;

      // Draw Item
      if (it.type === "coin") {
        ctx.fillStyle = "#FFD700"; // Neon yellow
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 10;
        ctx.fillRect(it.x, it.y, COIN_SIZE, COIN_SIZE);
        // Inner detail
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(it.x + 5, it.y + 5, 5, 5);
      } else {
        ctx.fillStyle = "#FF2D78"; // Neon pink obstacle
        ctx.shadowColor = "#FF2D78";
        ctx.shadowBlur = 15;
        ctx.fillRect(it.x, it.y, OBSTACLE_SIZE, OBSTACLE_SIZE);
      }
      ctx.shadowBlur = 0;

      // Collision
      const pRect = { x: playerX.current, y: GAME_HEIGHT - PLAYER_SIZE - 20, w: PLAYER_SIZE, h: PLAYER_SIZE };
      const iRect = { x: it.x, y: it.y, w: it.type === "coin" ? COIN_SIZE : OBSTACLE_SIZE, h: it.type === "coin" ? COIN_SIZE : OBSTACLE_SIZE };

      if (
        pRect.x < iRect.x + iRect.w &&
        pRect.x + pRect.w > iRect.x &&
        pRect.y < iRect.y + iRect.h &&
        pRect.y + pRect.h > iRect.y
      ) {
        if (it.type === "coin") {
          setScore(s => s + 10);
          items.current.splice(i, 1);
        } else {
          triggerShake();
          endGame();
        }
      } else if (it.y > GAME_HEIGHT) {
        items.current.splice(i, 1);
      }
    }

    // 6. Draw Player
    ctx.fillStyle = "#00F0FF"; // Neon cyan
    ctx.fillRect(playerX.current, GAME_HEIGHT - PLAYER_SIZE - 20, PLAYER_SIZE, PLAYER_SIZE);
    // Player eyes
    ctx.fillStyle = "white";
    ctx.fillRect(playerX.current + 8, GAME_HEIGHT - PLAYER_SIZE - 10, 6, 6);
    ctx.fillRect(playerX.current + 26, GAME_HEIGHT - PLAYER_SIZE - 10, 6, 6);

    frameId.current = requestAnimationFrame(gameLoop);
  };

  const getRewardMessage = () => {
    if (score > 500) return "🎮 LEGENDARY PLAYER";
    if (score > 200) return "🏆 ARCADE MASTER UNLOCKED";
    return "";
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md ${shake ? "animate-shake" : ""}`}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-card border-4 border-arcade-pink relative overflow-hidden flex flex-col items-center p-6 shadow-[0_0_50px_rgba(255,45,120,0.3)]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Gamepad2 className="text-arcade-pink animate-pulse" />
          <h2 className="font-display text-2xl text-white tracking-widest">COIN COLLECTOR</h2>
        </div>

        <div className="w-full aspect-[4/5] bg-background border-2 border-arcade-pink/30 relative overflow-hidden group">
           {gameState === "playing" ? (
             <canvas 
               ref={canvasRef} 
               width={GAME_WIDTH} 
               height={GAME_HEIGHT} 
               className="w-full h-full block" 
               style={{ imageRendering: "pixelated" }} 
             />
           ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 z-10 p-6 text-center">
                {gameState === "start" ? (
                  <>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      <Trophy className="w-16 h-16 text-arcade-yellow mb-4" />
                    </motion.div>
                    <h3 className="font-arcade text-[10px] text-white mb-6 leading-relaxed">
                      COLLECT YELLOW COINS<br/>AVOID PINK BLOCKS!
                    </h3>
                    <button onClick={startGame} className="font-arcade text-xs px-8 py-4 bg-arcade-pink text-white pixel-btn">
                      START GAME
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="font-display text-3xl text-arcade-pink mb-2">GAME OVER</h3>
                    <p className="font-arcade text-lg text-arcade-yellow mb-1">{score}</p>
                    <p className="font-arcade text-[8px] text-muted-foreground mb-6 uppercase">POINTS COLLECTED</p>
                    
                    <div className="font-arcade text-[9px] text-white mb-6"> {getRewardMessage()} </div>

                    <div className="flex flex-col gap-4 w-full px-8">
                       <button onClick={startGame} className="flex items-center justify-center gap-2 font-arcade text-[9px] py-4 bg-arcade-pink text-white pixel-btn">
                         <RotateCcw size={14} /> PLAY AGAIN
                       </button>
                       <button onClick={onClose} className="font-arcade text-[9px] py-4 bg-secondary text-white pixel-btn">
                         CLOSE GAME
                       </button>
                    </div>
                  </>
                )}
             </div>
           )}
           
           {/* Mobile Controls Overlay */}
           {gameState === "playing" && (
             <div className="absolute inset-0 md:hidden flex">
               <div 
                 className="flex-1" 
                 onTouchStart={() => keys.current["ArrowLeft"] = true}
                 onTouchEnd={() => keys.current["ArrowLeft"] = false}
               />
               <div 
                 className="flex-1" 
                 onTouchStart={() => keys.current["ArrowRight"] = true}
                 onTouchEnd={() => keys.current["ArrowRight"] = false}
               />
             </div>
           )}
        </div>

        <div className="w-full flex justify-between items-center mt-6">
          <div className="flex flex-col">
             <span className="font-arcade text-[7px] text-muted-foreground uppercase opacity-70">Points</span>
             <span className="font-arcade text-lg text-arcade-yellow">{score}</span>
          </div>
          
          <div className="flex flex-col items-center">
             <Timer className="text-arcade-cyan mb-1 w-4 h-4 animate-pulse" />
             <span className="font-arcade text-xs text-arcade-cyan">{Math.ceil(timeLeft)}s</span>
          </div>

          <div className="flex flex-col items-end">
             <span className="font-arcade text-[7px] text-muted-foreground uppercase opacity-70">High Score</span>
             <span className="font-arcade text-lg text-white">{highScore}</span>
          </div>
        </div>

        <div className="mt-8 text-center">
           <p className="font-arcade text-[7px] text-muted-foreground animate-pulse">
             {gameState === "playing" ? "USE ARROW KEYS OR TAP SIDES" : "🎮 AD SOPHOS ARCADE"}
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CoinCollectorGame;
