import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Timer, X, Gamepad2, RotateCcw, Clock, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface PacmanGameProps {
  onClose: () => void;
}

const GAME_SIZE = 400;
const PAC_SIZE = 30;
const PELLET_SIZE = 8;
const GHOST_SIZE = 30;

const PacmanGame: React.FC<PacmanGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const pacPos = useRef({ x: GAME_SIZE / 2, y: GAME_SIZE / 2 });
  const pacDir = useRef({ x: 0, y: 0 });
  const pellets = useRef<{ x: number, y: number }[]>([]);
  const ghosts = useRef<{ x: number, y: number, color: string, speed: number }[]>([]);
  const lastTime = useRef<number>(0);
  const frameId = useRef<number>();
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem("adsophos_pac_highscore");
    if (saved) setHighScore(parseInt(saved));

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => { 
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
            e.preventDefault();
        }
        keys.current[e.key] = true; 
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, []);

  const spawnPellet = () => {
    pellets.current.push({
      x: Math.random() * (GAME_SIZE - PELLET_SIZE * 2) + PELLET_SIZE,
      y: Math.random() * (GAME_SIZE - PELLET_SIZE * 2) + PELLET_SIZE
    });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    pacPos.current = { x: GAME_SIZE / 2, y: GAME_SIZE / 2 };
    pacDir.current = { x: 0, y: 0 };
    pellets.current = [];
    ghosts.current = [
      { x: 30, y: 30, color: "#FF0000", speed: 90 },
      { x: GAME_SIZE - 30, y: GAME_SIZE - 30, color: "#FFB0FF", speed: 70 }
    ];
    for (let i = 0; i < 15; i++) spawnPellet();
    
    setGameState("playing");
    lastTime.current = performance.now();
    gameLoop(performance.now());
  };

  const endGame = () => {
    setGameState("gameover");
    if (frameId.current) cancelAnimationFrame(frameId.current);
    
    setHighScore(prev => {
      const newHigh = Math.max(prev, score);
      localStorage.setItem("adsophos_pac_highscore", newHigh.toString());
      return newHigh;
    });
  };

  const gameLoop = (time: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const dt = (time - lastTime.current) / 1000;
    lastTime.current = time;

    // Movement Logic
    const speed = 200;
    if (keys.current["ArrowUp"] || keys.current["w"]) pacDir.current = { x: 0, y: -1 };
    if (keys.current["ArrowDown"] || keys.current["s"]) pacDir.current = { x: 0, y: 1 };
    if (keys.current["ArrowLeft"] || keys.current["a"]) pacDir.current = { x: -1, y: 0 };
    if (keys.current["ArrowRight"] || keys.current["d"]) pacDir.current = { x: 1, y: 0 };

    pacPos.current.x += pacDir.current.x * speed * dt;
    pacPos.current.y += pacDir.current.y * speed * dt;

    if (pacPos.current.x < 0) pacPos.current.x = GAME_SIZE;
    if (pacPos.current.x > GAME_SIZE) pacPos.current.x = 0;
    if (pacPos.current.y < 0) pacPos.current.y = GAME_SIZE;
    if (pacPos.current.y > GAME_SIZE) pacPos.current.y = 0;

    // Drawing
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);

    // Pellets
    ctx.fillStyle = "#FFD700";
    for (let i = pellets.current.length - 1; i >= 0; i--) {
      const p = pellets.current[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, PELLET_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      const dist = Math.hypot(pacPos.current.x - p.x, pacPos.current.y - p.y);
      if (dist < PAC_SIZE / 2 + PELLET_SIZE / 2) {
        pellets.current.splice(i, 1);
        setScore(s => s + 10);
        spawnPellet();
      }
    }

    // Ghosts
    for (const g of ghosts.current) {
      const dx = pacPos.current.x - g.x;
      const dy = pacPos.current.y - g.y;
      const angle = Math.atan2(dy, dx);
      g.x += Math.cos(angle) * g.speed * dt;
      g.y += Math.sin(angle) * g.speed * dt;

      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.arc(g.x, g.y, GHOST_SIZE / 2, Math.PI, 0);
      ctx.lineTo(g.x + GHOST_SIZE / 2, g.y + GHOST_SIZE / 2);
      ctx.lineTo(g.x - GHOST_SIZE / 2, g.y + GHOST_SIZE / 2);
      ctx.fill();

      const dist = Math.hypot(pacPos.current.x - g.x, pacPos.current.y - g.y);
      if (dist < PAC_SIZE / 2 + GHOST_SIZE / 2) endGame();
    }

    // Pacman
    ctx.fillStyle = "#FFFB00";
    ctx.beginPath();
    const mouthOpen = (time % 400) < 200 ? 0.25 : 0;
    let rotation = 0;
    if (pacDir.current.x === 1) rotation = 0;
    if (pacDir.current.x === -1) rotation = Math.PI;
    if (pacDir.current.y === 1) rotation = Math.PI / 2;
    if (pacDir.current.y === -1) rotation = -Math.PI / 2;

    ctx.moveTo(pacPos.current.x, pacPos.current.y);
    ctx.arc(pacPos.current.x, pacPos.current.y, PAC_SIZE / 2, rotation + mouthOpen * Math.PI, rotation + (2 - mouthOpen) * Math.PI);
    ctx.fill();

    // Timer logic at the end to ensure score updates before closing
    setTimeLeft(prev => {
      const nextTime = prev - dt;
      if (nextTime <= 0) {
        endGame();
        return 0;
      }
      return nextTime;
    });

    if (timeLeft > 0) {
      frameId.current = requestAnimationFrame(gameLoop);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-8 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-[95vw] md:max-w-2xl bg-zinc-950 border-4 flex flex-col p-4 md:p-8 max-h-[98vh] overflow-y-auto overflow-x-hidden"
        style={{
          borderColor: `hsl(var(--arcade-pink))`,
          boxShadow: `8px 8px 0px 0px hsl(var(--arcade-cyan))`,
        }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 text-zinc-500 hover:text-white transition-colors z-[100] bg-zinc-900 border-2 p-1 border-zinc-800">
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4 md:mb-6 border-b-4 border-zinc-900 pb-4 w-full justify-center mt-2 md:mt-0 relative z-10">
          <Gamepad2 className="text-arcade-yellow w-6 h-6 md:w-8 md:h-8" />
          <h2 className="font-arcade text-xl md:text-4xl text-white tracking-widest uppercase" style={{ textShadow: "3px 3px 0px hsl(var(--arcade-pink))" }}>ADSOPHOS MAN</h2>
        </div>

        {/* Score Board */}
        <div className="w-full grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6 bg-zinc-900 border-2 border-zinc-800 p-2 md:p-4 shrink-0 relative z-10">
          <div className="flex flex-col items-center">
             <span className="font-body font-bold text-[8px] md:text-[10px] text-arcade-pink uppercase mb-1">SCORE</span>
             <span className="font-arcade text-base md:text-2xl text-white leading-none">{score}</span>
          </div>
          
          <div className="flex flex-col items-center">
             <span className="font-body font-bold text-[8px] md:text-[10px] text-arcade-cyan uppercase mb-1 flex items-center gap-1"><Clock size={10} /> TIME</span>
             <span className={`font-arcade text-base md:text-2xl leading-none ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{Math.ceil(timeLeft)}s</span>
          </div>

          <div className="flex flex-col items-center">
             <span className="font-body font-bold text-[8px] md:text-[10px] text-arcade-yellow uppercase mb-1 whitespace-nowrap">HIGH SCORE</span>
             <span className="font-arcade text-base md:text-2xl text-white leading-none">{highScore}</span>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="w-full max-w-[320px] md:max-w-none md:w-4/5 mx-auto border-4 border-zinc-800 relative bg-black shrink-0 aspect-square shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center">
           {/* CRT Scanline Overlay */}
           <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:100%_4px] z-[50]"></div>

           <canvas 
             ref={canvasRef} 
             width={GAME_SIZE} 
             height={GAME_SIZE} 
             className={`w-full h-full block object-contain ${gameState === "playing" ? "opacity-100" : "opacity-0"}`} 
           />

           {/* Start/End Menus */}
           <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-[60] p-4 md:p-8 text-center ${gameState === "playing" ? "hidden" : "flex"}`}>
                {gameState === "start" ? (
                  <div className="flex flex-col items-center w-full">
                    <h3 className="font-arcade text-2xl md:text-4xl text-arcade-yellow mb-6">READY?</h3>
                    <div className="border-2 border-zinc-800 bg-zinc-950 p-4 md:p-6 mb-6 md:mb-8 w-[90%] md:w-full max-w-xs">
                        <p className="font-body font-bold text-[9px] md:text-xs text-zinc-400 uppercase tracking-widest leading-loose">
                        COLLECT PELLETS (+10)<br/>
                        AVOID THE GHOSTS!<br/><br/>
                        <span className="text-arcade-cyan whitespace-nowrap">WASD / ARROW KEYS</span>
                        </p>
                    </div>
                    <button onClick={startGame} className="font-arcade text-sm md:text-base px-6 md:px-8 py-3 md:py-4 bg-zinc-900 border-2 text-white hover:bg-zinc-800 hover:-translate-y-1 transition-all"
                        style={{
                            borderColor: `hsl(var(--arcade-pink))`,
                            boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
                        }}>
                      START QUEST
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <h3 className="font-arcade text-3xl md:text-5xl text-arcade-pink mb-4" style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}>GAME OVER</h3>
                    <div className="border-2 border-zinc-800 bg-zinc-950 px-8 py-4 mb-6 md:mb-8">
                        <p className="font-arcade text-xl md:text-3xl text-arcade-yellow">{score} PTS</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto px-4">
                       <button onClick={startGame} className="flex items-center justify-center gap-2 font-arcade text-xs md:text-sm px-8 py-3 md:py-4 bg-zinc-900 border-2 text-white hover:bg-zinc-800 hover:-translate-y-1 transition-all"
                        style={{
                            borderColor: `hsl(var(--arcade-pink))`,
                            boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
                        }}>
                         <RotateCcw size={16} /> REPLAY
                       </button>
                       <button onClick={onClose} className="font-body font-bold text-xs md:text-sm px-8 py-3 md:py-4 bg-zinc-900 border-2 border-zinc-700 text-zinc-400 hover:text-white hover:-translate-y-1 transition-all">
                         QUIT
                       </button>
                    </div>
                  </div>
                )}
           </div>
        </div>

        {/* Mobile controls strictly below canvas */}
        {gameState === "playing" && (
          <div className="mt-4 md:hidden grid grid-cols-3 gap-2 w-48 mx-auto shrink-0 relative z-10 bottom-0 pb-2">
             <div />
             <button onTouchStart={(e) => { e.preventDefault(); pacDir.current = { x: 0, y: -1 } }} className="bg-zinc-900 border-b-4 border-zinc-800 active:border-b-0 active:translate-y-1 h-12 flex items-center justify-center text-arcade-pink"><ArrowUp size={24} /></button>
             <div />
             <button onTouchStart={(e) => { e.preventDefault(); pacDir.current = { x: -1, y: 0 } }} className="bg-zinc-900 border-b-4 border-zinc-800 active:border-b-0 active:translate-y-1 h-12 flex items-center justify-center text-arcade-pink"><ArrowLeft size={24} /></button>
             <button onTouchStart={(e) => { e.preventDefault(); pacDir.current = { x: 0, y: 1 } }} className="bg-zinc-900 border-b-4 border-zinc-800 active:border-b-0 active:translate-y-1 h-12 flex items-center justify-center text-arcade-pink"><ArrowDown size={24} /></button>
             <button onTouchStart={(e) => { e.preventDefault(); pacDir.current = { x: 1, y: 0 } }} className="bg-zinc-900 border-b-4 border-zinc-800 active:border-b-0 active:translate-y-1 h-12 flex items-center justify-center text-arcade-pink"><ArrowRight size={24} /></button>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default PacmanGame;
