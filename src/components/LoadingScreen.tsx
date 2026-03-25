import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

// Simple pixel dino runner game as loading screen
const LoadingScreen = ({ onComplete }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const W = 400;
    const H = 200;
    canvas.width = W;
    canvas.height = H;

    // Dino sprite (pixel art)
    const drawDino = (x: number, y: number, frame: number) => {
      ctx.fillStyle = "#a0c4ff";
      // Body
      ctx.fillRect(x + 4, y, 12, 14);
      // Head
      ctx.fillRect(x + 8, y - 8, 12, 10);
      // Eye
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(x + 16, y - 6, 2, 2);
      // Mouth
      ctx.fillStyle = "#a0c4ff";
      ctx.fillRect(x + 18, y - 2, 4, 2);
      // Arms
      ctx.fillRect(x + 14, y + 4, 4, 2);
      // Legs (animated)
      ctx.fillStyle = "#a0c4ff";
      if (frame % 2 === 0) {
        ctx.fillRect(x + 4, y + 14, 4, 6);
        ctx.fillRect(x + 10, y + 14, 4, 4);
      } else {
        ctx.fillRect(x + 4, y + 14, 4, 4);
        ctx.fillRect(x + 10, y + 14, 4, 6);
      }
      // Tail
      ctx.fillRect(x - 2, y + 2, 6, 4);
      ctx.fillRect(x - 6, y, 4, 4);
    };

    // Cactus
    const drawCactus = (x: number, y: number) => {
      ctx.fillStyle = "#e040fb";
      ctx.fillRect(x, y, 6, 20);
      ctx.fillRect(x - 6, y + 4, 6, 4);
      ctx.fillRect(x - 6, y + 4, 2, 10);
      ctx.fillRect(x + 6, y + 8, 6, 4);
      ctx.fillRect(x + 10, y + 6, 2, 8);
    };

    // Pixel cloud
    const drawCloud = (x: number, y: number) => {
      ctx.fillStyle = "rgba(100, 100, 180, 0.3)";
      ctx.fillRect(x, y, 20, 6);
      ctx.fillRect(x + 4, y - 4, 12, 4);
      ctx.fillRect(x + 8, y - 8, 6, 4);
    };

    // Ground with scanlines
    const drawGround = () => {
      ctx.fillStyle = "#6b21a8";
      ctx.fillRect(0, 160, W, 2);
      // Scanline ground
      for (let i = 162; i < H; i += 3) {
        const alpha = 0.6 - (i - 162) * 0.01;
        ctx.fillStyle = `rgba(168, 85, 247, ${Math.max(alpha, 0.05)})`;
        ctx.fillRect(0, i, W, 1);
      }
    };

    let frame = 0;
    let dinoY = 140;
    let jumping = false;
    let jumpVel = 0;
    const cacti = [{ x: 380 }, { x: 550 }];
    const clouds = [{ x: 60, y: 30 }, { x: 200, y: 50 }, { x: 320, y: 20 }];

    // Score / progress
    let score = 0;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + 1.5;
      });
    }, 40);

    // Random jumps
    const jumpInterval = setInterval(() => {
      if (!jumping) {
        jumping = true;
        jumpVel = -5;
      }
    }, 1200);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, W, H);

      // Clouds
      clouds.forEach((c) => {
        drawCloud(c.x, c.y);
        c.x -= 0.3;
        if (c.x < -30) c.x = W + 20;
      });

      drawGround();

      // Dino physics
      if (jumping) {
        dinoY += jumpVel;
        jumpVel += 0.35;
        if (dinoY >= 140) {
          dinoY = 140;
          jumping = false;
          jumpVel = 0;
        }
      }

      drawDino(60, dinoY, frame);

      // Cacti
      cacti.forEach((c) => {
        c.x -= 2.5;
        if (c.x < -20) c.x = W + 100 + Math.random() * 200;
        drawCactus(c.x, 142);
      });

      // Score HUD
      score = Math.floor(frame / 3);
      ctx.fillStyle = "#6366f1";
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.textAlign = "right";
      ctx.fillText(String(score).padStart(4, "0"), W - 20, 24);

      // HUD corners
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(12, 30);
      ctx.lineTo(12, 14);
      ctx.lineTo(28, 14);
      ctx.stroke();
      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(W - 12, 30);
      ctx.lineTo(W - 12, 14);
      ctx.lineTo(W - 28, 14);
      ctx.stroke();

      // REC indicator
      if (frame % 40 < 30) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(22, H - 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.textAlign = "left";
        ctx.fillText("REC", 30, H - 16);
      }

      frame++;
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
      clearInterval(jumpInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {progress <= 100 && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full max-w-[500px] aspect-[2/1] rounded-lg border border-border"
            style={{ imageRendering: "pixelated" }}
          />

          <div className="flex flex-col items-center gap-3">
            <span className="font-arcade text-[10px] text-neon-cyan animate-neon-pulse">
              LOADING LEVEL...
            </span>
            <div className="w-48 h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-arcade text-[8px] text-muted-foreground">
              {Math.floor(progress)}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
