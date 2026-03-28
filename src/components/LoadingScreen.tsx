import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";

interface Props {
  onComplete: () => void;
}

const GLITCH_CHARS = "!@#$%^&*<>?/|\\~`";

function useGlitchText(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let frame = 0;
    const animate = () => {
      frame++;
      if (frame > 12) { setDisplay(text); return; }
      setDisplay(
        text.split("").map((c) =>
          Math.random() < 0.3 && c !== " "
            ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            : c
        ).join("")
      );
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [active, text]);

  return display;
}

const Scanlines = () => (
  <div
    className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]"
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
    }}
  />
);

const WalkingSprite = ({ progress }: { progress: number }) => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFrame((f) => (f + 1) % 2), 200);
    return () => clearInterval(t);
  }, []);

  const pixels0 = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ];
  const pixels1 = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
  ];
  const pixels = frame === 0 ? pixels0 : pixels1;

  return (
    <div
      style={{
        position: "absolute",
        left: `${Math.min(progress, 96)}%`,
        bottom: "100%",
        transform: "translateX(-50%)",
        marginBottom: 4,
      }}
    >
      {pixels.map((row, ri) => (
        <div key={ri} style={{ display: "flex" }}>
          {row.map((on, ci) => (
            <div
              key={ci}
              style={{ width: 4, height: 4, background: on ? "#FF2D78" : "transparent" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const LoadingScreen = ({ onComplete }: Props) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"boot" | "ready" | "exit">("boot");        

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 1.4;
        if (next >= 100) {
          clearInterval(interval);
          setPhase("ready");
          return 100;
        }
        return next;
      });
    }, 28);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(() => {
      setPhase("exit");
      setTimeout(onComplete, 600);
    }, 300);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const displayProgress = Math.floor(progress);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-transparent"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Scanlines />

          {/* Main content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6">

            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.img
                layoutId="main-logo"
                src={logo}
                alt="ADSOPHOS"
                className="w-[120px] md:w-[160px]"
                style={{ imageRendering: "pixelated" }}
              />

              {/* 3D Title */}
              <div className="overflow-hidden mt-4">
                <h1
                  className="font-arcade text-3xl md:text-5xl text-center text-white"
                  style={{ textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)" }}
                  aria-label="ADSOPHOS"
                >
                  {"ADSOPHOS".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.05,
                        delay: 0.4 + i * 0.2,
                      }}
                      style={{ display: "inline-block", whiteSpace: "pre" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h1>
              </div>
            </motion.div>

            {/* Pixel progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-[280px] md:max-w-[420px]"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 10,
                }}
              >
                <span style={{ color: "#FF2D78" }}>LOADING</span>
                <span style={{ color: "#FFD700" }}>{displayProgress}%</span>
              </div>

              <div
                style={{
                  position: "relative",
                  height: 20,
                  background: "#0a0a14",
                  border: "2px solid #1a1a3e",
                  overflow: "visible",
                }}
              >
                <div style={{ display: "flex", height: "100%", gap: 2, padding: 2 }}>
                  {Array.from({ length: 40 }).map((_, i) => {
                    const filled = (i / 40) * 100 < progress;
                    const color = i < 14 ? "#FF2D78" : i < 27 ? "#FFD700" : "#00F0FF";
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          background: filled ? color : "#111128",
                          transition: "background 0.1s",
                        }}
                      />
                    );
                  })}
                </div>
                <WalkingSprite progress={progress} />
              </div>
            </motion.div>
          </div>

          <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
