import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import h1 from "@/assets/history/h1.jpg";
import h2 from "@/assets/history/h2.jpg";
import h3 from "@/assets/history/h3.jpg";
import h4 from "@/assets/history/h4.jpg";
import h6 from "@/assets/history/h6.png";
import h7 from "@/assets/history/h7.png";
import h8 from "@/assets/history/h8.jpg";
import h9 from "@/assets/history/h9.jpg";
import { ChevronDown } from "lucide-react";

const historyImages = [
  { src: h1, title: "TECH SHOWCASE" },
  { src: h2, title: "INNOVATION DEMOS" },
  { src: h3, title: "EVENT ARENA" },
  { src: h4, title: "CROWD MOMENTS" },
  { src: h6, title: "ARCADE SPIRIT" },
  { src: h7, title: "VISIONARY WALL" },
  { src: h8, title: "ADSOPHOS CREW" },
  { src: h9, title: "CYBER ROBOTICS" },
];

const SplitText = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", skewY: 8 }}
          animate={inView ? { opacity: 1, y: "0%", skewY: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.032,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const MemoryCard = ({
  card,
  index,
  activeIndex,
  total,
}: {
  card: any;
  index: number;
  activeIndex: number;
  total: number;
}) => {
  const diff = index - activeIndex;
  const isActive = diff === 0;

  const scale = isActive ? 1 : Math.max(0.6, 1 - Math.abs(diff) * 0.15);
  const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(diff) * 0.4);
  const yOffset = diff * 50;
  const rotateX = diff * -15;

  return (
    <motion.div
      initial={false}
      animate={{
        scale,
        opacity,
        y: yOffset,
        z: -Math.abs(diff) * 100,
        rotateX,
        filter: isActive
          ? "brightness(1.1) saturate(1.2)"
          : "brightness(0.5) saturate(0.5)",
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="absolute inset-0 flex items-center justify-center p-4"
      style={{ zIndex: total - Math.abs(diff), perspective: "1200px" }}
    >
      <div
        className={`relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[480px] aspect-[4/3] bg-black p-1 transition-all ${
          isActive
            ? "border-2 border-arcade-pink shadow-[4px_4px_0_0_hsl(var(--arcade-cyan))]"
            : "border-2 border-zinc-800 shadow-[4px_4px_0_0_#27272a]"
        }`}
      >
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.15] scanlines" />
        <img
          src={card.src}
          alt={card.title}
          loading="lazy"
          className="w-full h-full object-cover grayscale-[30%]"
        />
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-8 sm:-bottom-10 left-0 right-0 text-center"
            >
              <h3
                className="font-arcade text-[9px] sm:text-sm text-arcade-yellow tracking-widest uppercase whitespace-nowrap"
                style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
              >
                {card.title}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ── Desktop: scroll-driven ────────────────────────────────────────────────────
const DesktopHistory = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const activeIndexDecimal = useTransform(
    scrollYProgress,
    [0, 1],
    [0, historyImages.length - 1]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return activeIndexDecimal.on("change", (latest) => {
      setActiveIndex(Math.round(latest));
    });
  }, [activeIndexDecimal]);

  return (
    <section
      id="history"
      ref={containerRef}
      className="relative h-[500vh] scroll-mt-24"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 arcade-grid-bg bg-zinc-950">
        <div className="container relative z-10 w-full max-w-7xl flex flex-row items-center justify-center gap-20 h-full py-20">
          {/* Left: Story */}
          <motion.div
            className="flex-1 w-full max-w-xl flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <div className="overflow-hidden mb-3">
                <div
                  className="font-arcade text-5xl leading-[1.2] tracking-wide text-white"
                  style={{ textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)" }}
                >
                  <SplitText text="MEMORY" delay={0.1} />
                </div>
              </div>
              <div className="overflow-hidden pl-1 ml-1">
                <div
                  className="font-arcade text-5xl leading-[1.2] tracking-wide text-arcade-yellow"
                  style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
                >
                  <SplitText text="CARD." delay={0.2} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="font-body text-muted-foreground text-base leading-relaxed">
                Adsophos used to happen every single year, known as one of the{" "}
                <span className="text-arcade-cyan font-bold">biggest tech fests in Hyderabad</span>.
                Students from different colleges flocked to MJCET to witness groundbreaking
                projects and compete in high-stakes activities.
              </p>
              <p className="font-body text-muted-foreground text-base leading-relaxed">
                After a brief hiatus due to COVID-19, the legacy was momentarily paused...{" "}
                <span
                  className="text-arcade-pink font-arcade uppercase text-sm mt-2 block"
                  style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
                >
                  But now, finally, we are back.
                </span>
              </p>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex flex-col gap-1">
                  <span
                    className="font-arcade text-4xl text-arcade-cyan"
                    style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
                  >
                    2026
                  </span>
                  <span className="font-arcade text-[7px] text-muted-foreground tracking-widest mt-1">
                    THE REAWAKENING
                  </span>
                </div>
                <div className="h-12 w-[2px] bg-zinc-800 ml-2" />
                <p className="font-body text-[10px] text-muted-foreground italic">
                  Continuing the legacy where it left off, leveling up for the new era.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Stacked Cards */}
          <div className="flex-1 relative w-full h-[500px] flex items-center justify-center">
            <div className="absolute inset-0">
              {historyImages.map((card, i) => (
                <MemoryCard
                  key={i}
                  card={card}
                  index={i}
                  activeIndex={activeIndex}
                  total={historyImages.length}
                />
              ))}
            </div>

            {/* Nav dots */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-50">
              {historyImages.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    const scrollTarget =
                      containerRef.current!.offsetTop +
                      (i / (historyImages.length - 1)) *
                        (containerRef.current!.scrollHeight - window.innerHeight);
                    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
                  }}
                  animate={{
                    scale: activeIndex === i ? 1.6 : 1,
                    backgroundColor: activeIndex === i ? "#ec4899" : "#27272a",
                  }}
                  className={`w-2 h-2 rounded-none transition-shadow ${
                    activeIndex === i
                      ? "shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                      : "shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Mobile: normal section, swipe to cycle cards ──────────────────────────────
const MobileHistory = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(historyImages.length - 1, i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section id="history" className="relative bg-zinc-950 arcade-grid-bg scroll-mt-24 py-16 px-4">
      <div className="flex flex-col items-center gap-10 max-w-xl mx-auto">

        {/* Text */}
        <motion.div
          className="w-full flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-6">
            <div
              className="font-arcade text-3xl leading-[1.2] tracking-wide text-white"
              style={{ textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)" }}
            >
              <SplitText text="MEMORY" delay={0.1} />
            </div>
            <div
              className="font-arcade text-3xl leading-[1.2] tracking-wide text-arcade-yellow mt-1"
              style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
            >
              <SplitText text="CARD." delay={0.2} />
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Adsophos used to happen every single year, known as one of the{" "}
              <span className="text-arcade-cyan font-bold">biggest tech fests in Hyderabad</span>.
              Students from different colleges flocked to MJCET to witness groundbreaking projects
              and compete in high-stakes activities.
            </p>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              After a brief hiatus due to COVID-19, the legacy was momentarily paused...{" "}
              <span
                className="text-arcade-pink font-arcade uppercase text-xs mt-2 block"
                style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
              >
                But now, finally, we are back.
              </span>
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex flex-col gap-1">
                <span
                  className="font-arcade text-3xl text-arcade-cyan"
                  style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
                >
                  2026
                </span>
                <span className="font-arcade text-[7px] text-muted-foreground tracking-widest mt-1">
                  THE REAWAKENING
                </span>
              </div>
              <div className="h-10 w-[2px] bg-zinc-800 ml-2" />
              <p className="font-body text-[10px] text-muted-foreground italic">
                Continuing the legacy where it left off, leveling up for the new era.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card carousel */}
        <div
          className="relative w-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Fixed height container so cards don't overflow */}
          <div className="relative w-full h-[260px] flex items-center justify-center">
            <div className="absolute inset-0">
              {historyImages.map((card, i) => (
                <MemoryCard
                  key={i}
                  card={card}
                  index={i}
                  activeIndex={activeIndex}
                  total={historyImages.length}
                />
              ))}
            </div>
          </div>

          {/* Card title spacing */}
          <div className="h-10" />

          {/* Prev / Next buttons */}
          <div className="flex items-center justify-between mt-2 px-2">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              className="font-arcade text-[9px] text-arcade-pink border border-arcade-pink px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              ◀ PREV
            </button>

            {/* Pagination dots */}
            <div className="flex gap-2 items-center">
              {historyImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-none transition-all duration-300 shadow-[1px_1px_0_0_rgba(0,0,0,1)] ${
                    i === activeIndex ? "w-5 bg-arcade-cyan" : "w-1.5 bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={activeIndex === historyImages.length - 1}
              className="font-arcade text-[9px] text-arcade-pink border border-arcade-pink px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              NEXT ▶
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

// ── Root: render correct version based on screen size ────────────────────────
const HistorySection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <MobileHistory /> : <DesktopHistory />;
};

export default HistorySection;