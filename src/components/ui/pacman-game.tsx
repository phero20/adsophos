import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Timer, X, Gamepad2, RotateCcw, Clock, ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
  const pellets = useRef<{ x: number; y: number }[]>([]);
  const ghosts = useRef<{ x: number; y: number; color: string; speed: number }[]>([]);
  const lastTime = useRef<number>(0);
  const frameId = useRef<number>();
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem("adsophos_pac_highscore");
    if (saved) setHighScore(parseInt(saved));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
        e.preventDefault();
      keys.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, []);

  const spawnPellet = () => {
    pellets.current.push({
      x: Math.random() * (GAME_SIZE - PELLET_SIZE * 2) + PELLET_SIZE,
      y: Math.random() * (GAME_SIZE - PELLET_SIZE * 2) + PELLET_SIZE,
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
      { x: GAME_SIZE - 30, y: GAME_SIZE - 30, color: "#FFB0FF", speed: 70 },
    ];
    for (let i = 0; i < 15; i++) spawnPellet();
    setGameState("playing");
    lastTime.current = performance.now();
    gameLoop(performance.now());
  };

  const endGame = () => {
    setGameState("gameover");
    if (frameId.current) cancelAnimationFrame(frameId.current);
    setHighScore((prev) => {
      const newHigh = Math.max(prev, score);
      localStorage.setItem("adsophos_pac_highscore", newHigh.toString());
      return newHigh;
    });
  };

  const drawGhost = (ctx: CanvasRenderingContext2D, g: { x: number; y: number; color: string }, time: number) => {
    const r = GHOST_SIZE / 2;
    const x = g.x;
    const y = g.y;

    // Body
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(x, y - 2, r, Math.PI, 0); // dome top
    ctx.lineTo(x + r, y + r);          // right side down

    // Wavy bottom — 3 bumps
    const bumps = 3;
    const bumpW = (r * 2) / bumps;
    const bumpH = 5 + Math.sin(time / 300) * 2; // animate the wave
    for (let b = bumps; b >= 0; b--) {
      const bx = x - r + b * bumpW;
      const by = y + r - (b % 2 === 0 ? bumpH : 0);
      ctx.lineTo(bx, by);
    }
    ctx.lineTo(x - r, y + r);
    ctx.fill();

    // White eye whites
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.ellipse(x - 8, y - 6, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 8, y - 6, 5, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Blue pupils (look toward pac)
    ctx.fillStyle = "#2244FF";
    ctx.beginPath(); ctx.ellipse(x - 7, y - 5, 2.5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 9, y - 5, 2.5, 3, 0, 0, Math.PI * 2); ctx.fill();
  };

  const drawPacman = (ctx: CanvasRenderingContext2D, time: number) => {
    const x = pacPos.current.x;
    const y = pacPos.current.y;
    const r = PAC_SIZE / 2;
    const mouthOpen = (time % 400) < 200 ? 0.25 : 0.02;

    let rotation = 0;
    if (pacDir.current.x === 1)  rotation = 0;
    if (pacDir.current.x === -1) rotation = Math.PI;
    if (pacDir.current.y === 1)  rotation = Math.PI / 2;
    if (pacDir.current.y === -1) rotation = -Math.PI / 2;

    // Body
    ctx.fillStyle = "#FFE000";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, rotation + mouthOpen * Math.PI, rotation + (2 - mouthOpen) * Math.PI);
    ctx.fill();

    // Eye — always 90deg counterclockwise from facing direction
    const eyeAngle = rotation - Math.PI / 2.8;
    const eyeX = x + Math.cos(eyeAngle) * (r * 0.55);
    const eyeY = y + Math.sin(eyeAngle) * (r * 0.55);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Cheek blush
    const blushAngle = rotation + Math.PI / 2.5;
    const blushX = x + Math.cos(blushAngle) * (r * 0.5);
    const blushY = y + Math.sin(blushAngle) * (r * 0.5);
    ctx.fillStyle = "rgba(255, 100, 100, 0.35)";
    ctx.beginPath();
    ctx.ellipse(blushX, blushY, 4, 3, blushAngle, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPellet = (ctx: CanvasRenderingContext2D, p: { x: number; y: number }, time: number, idx: number) => {
    // Subtle shimmer using index offset so they don't all pulse together
    const pulse = 0.85 + Math.sin(time / 400 + idx * 0.8) * 0.15;
    ctx.fillStyle = `rgba(255, 215, 0, ${pulse})`;
    // Small star shape instead of plain circle
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(time / 800 + idx);
    ctx.beginPath();
    for (let pt = 0; pt < 8; pt++) {
      const angle = (pt * Math.PI) / 4;
      const rad = pt % 2 === 0 ? PELLET_SIZE / 2 : PELLET_SIZE / 4;
      pt === 0
        ? ctx.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad)
        : ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const gameLoop = (time: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const dt = (time - lastTime.current) / 1000;
    lastTime.current = time;

    // Input
    const speed = 200;
    if (keys.current["ArrowUp"]    || keys.current["w"]) pacDir.current = { x: 0,  y: -1 };
    if (keys.current["ArrowDown"]  || keys.current["s"]) pacDir.current = { x: 0,  y: 1  };
    if (keys.current["ArrowLeft"]  || keys.current["a"]) pacDir.current = { x: -1, y: 0  };
    if (keys.current["ArrowRight"] || keys.current["d"]) pacDir.current = { x: 1,  y: 0  };

    pacPos.current.x += pacDir.current.x * speed * dt;
    pacPos.current.y += pacDir.current.y * speed * dt;

    if (pacPos.current.x < 0) pacPos.current.x = GAME_SIZE;
    if (pacPos.current.x > GAME_SIZE) pacPos.current.x = 0;
    if (pacPos.current.y < 0) pacPos.current.y = GAME_SIZE;
    if (pacPos.current.y > GAME_SIZE) pacPos.current.y = 0;

    // ── Background ──────────────────────────────────────────────────
    ctx.fillStyle = "#05050a";
    ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE);

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx <= GAME_SIZE; gx += 20) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, GAME_SIZE); ctx.stroke();
    }
    for (let gy = 0; gy <= GAME_SIZE; gy += 20) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(GAME_SIZE, gy); ctx.stroke();
    }

    // ── Pellets ──────────────────────────────────────────────────────
    for (let i = pellets.current.length - 1; i >= 0; i--) {
      const p = pellets.current[i];
      const dist = Math.hypot(pacPos.current.x - p.x, pacPos.current.y - p.y);
      if (dist < PAC_SIZE / 2 + PELLET_SIZE / 2) {
        pellets.current.splice(i, 1);
        setScore((s) => s + 10);
        spawnPellet();
        continue;
      }
      drawPellet(ctx, p, time, i);
    }

    // ── Ghosts ───────────────────────────────────────────────────────
    for (const g of ghosts.current) {
      const dx = pacPos.current.x - g.x;
      const dy = pacPos.current.y - g.y;
      const angle = Math.atan2(dy, dx);
      g.x += Math.cos(angle) * g.speed * dt;
      g.y += Math.sin(angle) * g.speed * dt;

      drawGhost(ctx, g, time);

      const dist = Math.hypot(pacPos.current.x - g.x, pacPos.current.y - g.y);
      if (dist < PAC_SIZE / 2 + GHOST_SIZE / 2) endGame();
    }

    // ── Pac-Man ───────────────────────────────────────────────────────
    drawPacman(ctx, time);

    // ── Timer ─────────────────────────────────────────────────────────
    setTimeLeft((prev) => {
      const nextTime = prev - dt;
      if (nextTime <= 0) { endGame(); return 0; }
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
        className="w-full max-w-xl bg-zinc-950 border-4 relative overflow-hidden flex flex-col items-center p-2 md:px-4 py-6"
        style={{
          borderColor: `hsl(var(--arcade-pink))`,
          boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
        }}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors z-[100]">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-2 mb-6 border-b-2 border-zinc-800 pb-4 w-full px-4">
          <div className="flex items-center gap-3 justify-center">
            <Gamepad2 className="text-arcade-yellow mb-1" size={30} />
            <h2 className="font-arcade text-xl text-white tracking-widest uppercase">PAC MAN</h2>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 border border-zinc-800/50">
            <div className="flex items-center gap-1.5">
              {[ChevronLeft, ChevronUp, ChevronDown, ChevronRight].map((Icon, i) => (
                <div key={i} className="flex items-center justify-center w-6 h-6 border-2 border-zinc-800 bg-zinc-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <Icon size={14} className="text-arcade-cyan " />
                </div>
              ))}
            </div>
            <span className="font-arcade text-[8px] text-arcade-pink tracking-[0.2em]">USE ARROWS TO PLAY</span>
          </div>
        </div>

        <div className="w-full h-[380px] md:h-[420px] bg-black border-4 border-zinc-800 relative overflow-hidden flex items-center justify-center">
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
                    COLLECT PELLETS (+10)<br />
                    AVOID THE GHOSTS!<br /><br />
                    <span className="text-arcade-cyan">WASD / ARROW KEYS</span>
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className="font-arcade text-sm px-8 py-4 bg-zinc-900 border-2 text-white hover:bg-zinc-800 transition-colors"
                  style={{
                    borderColor: `hsl(var(--arcade-pink))`,
                    boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
                  }}
                >
                  START QUEST
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="font-arcade text-xl md:text-4xl text-arcade-pink mb-4" style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}>
                  GAME OVER
                </h3>
                <div className="border-2 border-zinc-800 bg-zinc-950 px-8 py-4 mb-8">
                  <p className="font-arcade text-2xl text-arcade-yellow">{score} PTS</p>
                </div>
                <div className="flex flex-col gap-3 md:gap-4 w-full px-4 md:px-10">
                  <button
                    onClick={startGame}
                    className="flex items-center justify-center gap-2 font-arcade text-[10px] md:text-xs py-3 md:py-4 bg-zinc-900 border-2 text-white hover:bg-zinc-800 transition-colors"
                    style={{
                      borderColor: `hsl(var(--arcade-pink))`,
                      boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
                    }}
                  >
                    <RotateCcw className="w-3 h-3 md:w-4 md:h-4" /> REPLAY
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 font-arcade text-[10px] md:text-xs py-3 md:py-4 bg-zinc-900 border-2 text-white hover:bg-zinc-800 transition-colors"
                    style={{
                      borderColor: `hsl(var(--arcade-cyan))`,
                      boxShadow: `4px 4px 0px 0px hsl(var(--arcade-pink))`,
                    }}
                  >
                    <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> QUIT
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          {gameState === "playing" && (
            <div className="absolute inset-0 md:hidden grid grid-cols-2 grid-rows-2 z-[70]">
              <button onClick={() => pacDir.current = { x: 0, y: -1 }} className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">UP</button>
              <button onClick={() => pacDir.current = { x: 0, y: 1 }}  className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">DOWN</button>
              <button onClick={() => pacDir.current = { x: -1, y: 0 }} className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">LEFT</button>
              <button onClick={() => pacDir.current = { x: 1, y: 0 }}  className="border border-white/5 bg-white/5 active:bg-white/10 text-[8px] font-arcade text-white/20">RIGHT</button>
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