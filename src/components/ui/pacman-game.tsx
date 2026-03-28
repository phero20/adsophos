import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Timer, X, Gamepad2, RotateCcw, Clock } from "lucide-react";

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-zinc-950 border-4 relative overflow-hidden flex flex-col items-center p-4 py-8"
        style={{
          borderColor: `hsl(var(--arcade-pink))`,
          boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
        }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors z-[100]">
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b-2 border-zinc-800 pb-4 w-full justify-center">
          <Gamepad2 className="text-arcade-yellow" />
          <h2 className="font-arcade text-xl md:text-2xl text-white tracking-widest uppercase">ADSOPHOS MAN</h2>
        </div>

        <div className="w-full h-[320px] md:h-[400px] bg-black border-4 border-zinc-800 relative overflow-hidden flex items-center justify-center">
           <canvas 
             ref={canvasRef} 
             width={GAME_SIZE} 
             height={GAME_SIZE} 
             className={`w-full h-full block ${gameState === "playing" ? "opacity-100" : "opacity-0"}`} 
           />

           <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-[60] p-6 text-center ${gameState === "playing" ? "hidden" : "flex"}`}>
                {gameState === "start" ? (
                  <div className="flex flex-col items-center">
                    <h3 className="font-arcade text-3xl text-arcade-yellow mb-6">READY?</h3>
                    <div className="border-2 border-zinc-800 bg-zinc-950 p-4 mb-8">
                        <p className="font-body font-bold text-xs text-zinc-400 uppercase tracking-widest leading-loose">
                        COLLECT PELLETS (+10)<br/>
                        AVOID THE GHOSTS!<br/><br/>
                        <span className="text-arcade-cyan">WASD / ARROW KEYS</span>
                        </p>
                    </div>
                    <button onClick={startGame} className="font-arcade text-sm px-8 py-4 bg-zinc-900 border-2 text-white hover:bg-zinc-800 transition-colors"
                        style={{
                            borderColor: `hsl(var(--arcade-pink))`,
                            boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
                        }}>
                      START QUEST
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <h3 className="font-arcade text-4xl text-arcade-pink mb-4" style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}>GAME OVER</h3>
                    <div className="border-2 border-zinc-800 bg-zinc-950 px-8 py-4 mb-8">
                        <p className="font-arcade text-2xl text-arcade-yellow">{score} PTS</p>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full px-10">
                       <button onClick={startGame} className="flex items-center justify-center gap-2 font-arcade text-xs py-4 bg-zinc-900 border-2 text-white hover:bg-zinc-800 transition-colors"
                        style={{
                            borderColor: `hsl(var(--arcade-pink))`,
                            boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
                        }}>
                         <RotateCcw size={14} /> REPLAY
                       </button>
                       <button onClick={onClose} className="font-body font-bold text-xs py-4 bg-zinc-900 border-2 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                         QUIT
                       </button>
                    </div>
                  </div>
                )}
           </div>

           {/* Mobile Controls (Overlay Grid) */}
           {gameState === "playing" && (
             <div className="absolute inset-0 md:hidden grid grid-cols-2 grid-rows-2 z-[70]">
                 <button onClick={() => pacDir.current = { x: 0, y: -1 }} className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">UP</button>
                 <button onClick={() => pacDir.current = { x: 0, y: 1 }} className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">DOWN</button>
                 <button onClick={() => pacDir.current = { x: -1, y: 0 }} className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">LEFT</button>
                 <button onClick={() => pacDir.current = { x: 1, y: 0 }} className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">RIGHT</button>
             </div>
           )}
        </div>

        <div className="w-full flex justify-between items-center mt-6">
          <div className="flex flex-col">
             <span className="font-arcade text-[7px] text-muted-foreground uppercase opacity-70 mb-1">Score</span>
             <span className="font-arcade text-lg text-arcade-yellow leading-none">{score}</span>
          </div>
          
          <div className="flex flex-col items-center">
             <Clock className="text-arcade-cyan mb-1 w-4 h-4" />
             <span className="font-arcade text-xs text-arcade-cyan leading-none">{Math.ceil(timeLeft)}s</span>
          </div>

          <div className="flex flex-col items-end">
             <span className="font-arcade text-[7px] text-muted-foreground uppercase opacity-70 mb-1">High Score</span>
             <span className="font-arcade text-lg text-white leading-none">{highScore}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PacmanGame;
