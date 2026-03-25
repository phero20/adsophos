import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onComplete: () => void;
}

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

    const drawDino = (x: number, y: number, frame: number) => {
      ctx.fillStyle = "#FF2D78";
      ctx.fillRect(x + 4, y, 12, 14);
      ctx.fillRect(x + 8, y - 8, 12, 10);
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(x + 16, y - 6, 2, 2);
      ctx.fillStyle = "#FF2D78";
      ctx.fillRect(x + 18, y - 2, 4, 2);
      ctx.fillRect(x + 14, y + 4, 4, 2);
      if (frame % 2 === 0) {
        ctx.fillRect(x + 4, y + 14, 4, 6);
        ctx.fillRect(x + 10, y + 14, 4, 4);
      } else {
        ctx.fillRect(x + 4, y + 14, 4, 4);
        ctx.fillRect(x + 10, y + 14, 4, 6);
      }
      ctx.fillRect(x - 2, y + 2, 6, 4);
      ctx.fillRect(x - 6, y, 4, 4);
    };

    const drawCactus = (x: number, y: number) => {
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(x, y, 6, 20);
      ctx.fillRect(x - 6, y + 4, 6, 4);
      ctx.fillRect(x - 6, y + 4, 2, 10);
      ctx.fillRect(x + 6, y + 8, 6, 4);
      ctx.fillRect(x + 10, y + 6, 2, 8);
    };

    const drawGround = () => {
      ctx.fillStyle = "#FF2D78";
      ctx.fillRect(0, 160, W, 3);
      for (let i = 165; i < H; i += 4) {
        ctx.fillStyle = `rgba(255, 45, 120, ${Math.max(0.3 - (i - 165) * 0.008, 0.02)})`;
        ctx.fillRect(0, i, W, 2);
      }
    };

    let frame = 0;
    let dinoY = 140;
    let jumping = false;
    let jumpVel = 0;
    const cacti = [{ x: 380 }, { x: 550 }];

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

    const jumpInterval = setInterval(() => {
      if (!jumping) {
        jumping = true;
        jumpVel = -5;
      }
    }, 1200);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      drawGround();

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

      cacti.forEach((c) => {
        c.x -= 2.5;
        if (c.x < -20) c.x = W + 100 + Math.random() * 200;
        drawCactus(c.x, 142);
      });

      // Score
      ctx.fillStyle = "#FFD700";
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.textAlign = "right";
      ctx.fillText(String(Math.floor(frame / 3)).padStart(4, "0"), W - 20, 24);

      // HUD corners
      ctx.strokeStyle = "#FF2D78";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 30); ctx.lineTo(12, 14); ctx.lineTo(28, 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W - 12, 30); ctx.lineTo(W - 12, 14); ctx.lineTo(W - 28, 14);
      ctx.stroke();

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
            className="w-full max-w-[500px] aspect-[2/1] pixel-border"
            style={{ imageRendering: "pixelated" }}
          />

          <div className="flex flex-col items-center gap-3">
            <span className="font-arcade text-[10px] text-arcade-pink animate-blink">
              LOADING LEVEL...
            </span>
            <div className="w-48 h-3 bg-secondary pixel-border" style={{ borderWidth: 2, boxShadow: '2px 2px 0 0 hsl(340 100% 57%)' }}>
              <motion.div
                className="h-full bg-arcade-yellow"
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
