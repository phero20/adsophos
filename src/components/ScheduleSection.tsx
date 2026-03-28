

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, useVelocity, useSpring, useAnimationFrame, useMotionValue } from "framer-motion";
import { Clock, Trophy, GraduationCap, Presentation, Mic2, Gamepad2, Sparkles, MapPin } from "lucide-react";

// Reusable: split text into chars for stagger animation
const SplitText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", skewY: 8 }}
          animate={inView ? { opacity: 1, y: "0%", skewY: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.032, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const allEvents = [
  {
    day: "DAY 1",
    date: "9th April",
    items: [
      { time: "9:00 AM", title: "Opening Ceremony", desc: "Welcome & Keynote", icon: Mic2, color: "arcade-pink" },
      { time: "10:30 AM", title: "Paper Presentation", desc: "Technical research & innovation showcase", icon: Presentation, color: "arcade-yellow" },
      { time: "12:00 PM", title: "Poster Presentation", desc: "Visual storytelling & data visualization", icon: GraduationCap, color: "arcade-cyan" },
      { time: "2:00 PM", title: "Quiz Competition — Round 1", desc: "Preliminary eliminator rounds", icon: Trophy, color: "arcade-pink" },
      { time: "5:00 PM", title: "Fun Events Arena", desc: "Mini-games, treasure hunts & social quests", icon: Gamepad2, color: "arcade-yellow" },
    ]
  },
  {
    day: "DAY 2",
    date: "10th April",
    items: [
      { time: "9:00 AM", title: "Project Expo", desc: "Live demonstrations of hardware & software hacks", icon: Sparkles, color: "arcade-cyan" },
      { time: "11:00 AM", title: "Quiz Finale", desc: "The ultimate showdown for the championship", icon: Trophy, color: "arcade-pink" },
      { time: "1:00 PM", title: "Evaluation Phase", desc: "Final judging and expert reviews", icon: MapPin, color: "arcade-yellow" },
      { time: "3:00 PM", title: "Fun Events Finale", desc: "Meme contest & talent show results", icon: Gamepad2, color: "arcade-cyan" },
      { time: "5:30 PM", title: "Award Gala", desc: "Closing ceremony & prize distribution", icon: Sparkles, color: "arcade-pink" },
    ]
  }
];

const DOT_COLORS = [
  "hsl(var(--arcade-pink))",
  "hsl(var(--arcade-yellow))",
  "hsl(var(--arcade-cyan))",
  "hsl(var(--arcade-pink))",
  "hsl(var(--arcade-yellow))",
];

const STROKE_COLORS = [
  "hsl(var(--arcade-pink))",
  "hsl(var(--arcade-yellow))",
  "hsl(var(--arcade-cyan))",
  "hsl(var(--arcade-pink))",
];

const ALT_COLORS: Record<string, string> = {
  "arcade-pink": "arcade-yellow",
  "arcade-yellow": "arcade-yellow",
  "arcade-cyan": "arcade-yellow",
};

const SHADOW_COLORS: Record<string, string> = {
  "arcade-pink": "rgba(157, 23, 77, 1)",
  "arcade-yellow": "rgba(234, 179, 8, 0.4)",
  // "arcade-cyan": "rgba(8, 145, 178, 0.6)",
};

function ZigZagSnake({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const draw = () => {
      const container = containerRef.current;
      const svg = svgRef.current;
      if (!container || !svg) return;

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const totalW = container.offsetWidth;
      const totalH = container.offsetHeight;
      const isMobile = totalW < 768;

      // On mobile: spine is at x=27 (left edge where dot sits)
      // On desktop: spine is at center
      const cx = isMobile ? 27 : totalW / 2;

      svg.setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);
      svg.setAttribute("width", `${totalW}`);
      svg.setAttribute("height", `${totalH}`);

      const dots = container.querySelectorAll<HTMLElement>("[data-dot]");
      const rows = container.querySelectorAll<HTMLElement>("[data-side]");

      if (dots.length < 2) return;

      const cRect = container.getBoundingClientRect();
      const points: { x: number; y: number; side: string }[] = [];

      dots.forEach((dot, i) => {
        const dRect = dot.getBoundingClientRect();
        points.push({
          x: cx,
          y: dRect.top - cRect.top + dot.offsetHeight / 2,
          side: rows[i]?.dataset.side ?? "left",
        });
      });

      for (let i = 0; i < points.length - 1; i++) {
        const p = points[i];
        const n = points[i + 1];
        const mid = (p.y + n.y) / 2;
        const col = STROKE_COLORS[i % STROKE_COLORS.length];

        let swingX: number;
        if (isMobile) {
          // On mobile all cards are on the right, so snake always swings right
          swingX = totalW * 0.85;
        } else {
          // On desktop: swing to the opposite side of the current card
          swingX = p.side === "left" ? totalW * 0.84 : totalW * 0.16;
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", col);
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linecap", "square");
        path.setAttribute(
          "d",
          `M ${p.x} ${p.y} L ${p.x} ${mid} L ${swingX} ${mid} L ${swingX} ${mid} L ${n.x} ${n.y}`
        );
        svg.appendChild(path);
      }
    };

    draw();

    const ro = new ResizeObserver(draw);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function ParallaxDivider({ className, baseVelocity = 20 }: { className: string; baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const directionFactor = useRef<number>(baseVelocity < 0 ? -1 : 1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * Math.abs(baseVelocity) * (delta / 1000);
    const velocity = smoothVelocity.get();
    
    if (velocity < 0) {
      directionFactor.current = -1;
    } else if (velocity > 0) {
      directionFactor.current = 1;
    }

    // Reduced the scroll velocity multiplier from 0.05 to 0.015 appropriately
    moveBy += directionFactor.current * Math.abs(velocity) * 0.0020;
    
    // Pixel divider pattern repeats every 16px (8px color, 8px transparent).
    let nextX = baseX.get() + moveBy;
    nextX = ((nextX % 16) + 16) % 16;
    baseX.set(nextX - 16); 
  });

  return (
    <div className="w-[110vw] -ml-[5vw] overflow-hidden">
      <motion.div style={{ x: baseX }} className={`w-full ${className}`} />
    </div>
  );
}

const ScheduleSection = () => {
  const dayRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} id="schedule" className="relative py-28 px-0 scroll-mt-24 bg-zinc-950 border-y-4 border-black overflow-hidden">
      <ParallaxDivider className="pixel-divider-yellow mb-20" baseVelocity={-20} />

      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center mb-16 px-0">
          <div className="overflow-hidden mb-1">
            <h2
              className="font-arcade text-4xl md:text-6xl text-center text-white"
              style={{ textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)" }}
            >
              <SplitText text="GAME" delay={0.1} />
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2
              className="font-arcade text-4xl md:text-6xl text-center text-arcade-yellow"
              style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
            >
              <SplitText text="TIMELINE" delay={0.3} />
            </h2>
          </div>
          <p className="text-center text-arcade-cyan mt-6 font-arcade text-[10px] sm:text-xs uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}>
            THE QUEST SCHEDULE FOR ADSOPHOS 2026
          </p>
        </div>

        <div className="space-y-12">
          {allEvents.map((dayGroup, dayIdx) => (
            <div key={dayGroup.day} className="relative pt-10">
              {/* Day Heading */}
              <div className="relative z-20 flex justify-center mb-12">
                <div className="px-8 py-4 bg-zinc-950 border-2 border-arcade-cyan font-arcade text-xs md:text-sm text-arcade-orange shadow-[4px_4px_0_0_hsl(var(--arcade-pink))] tracking-widest">
                  {dayGroup.day} — {dayGroup.date}
                </div>
              </div>

              {/* Row container with zig-zag SVG */}
              <div ref={dayRefs[dayIdx]} className="relative">
                <ZigZagSnake containerRef={dayRefs[dayIdx]} />

                <div className="space-y-12">
                  {dayGroup.items.map((ev, i) => (
                    <motion.div
                      key={ev.title}
                      data-side={i % 2 === 0 ? "left" : "right"}
                      className={`relative flex flex-col md:flex-row items-start md:items-center ${
                        i % 2 === 0 ? "md:flex-row-reverse" : ""
                      }`}
                      initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      {/* Dot — left edge on mobile, center on desktop */}
                      <div
                        data-dot
                        className="absolute left-[19px] md:left-[calc(50%-8px)] top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-950 rounded-none z-10 box-content transition-transform duration-150 group-hover:scale-125"
                        style={{
                          border: `4px solid hsl(var(--${ev.color}))`,
                          boxShadow: `2px 2px 0px 0px ${SHADOW_COLORS[ev.color] || `hsl(var(--${ev.color}))`}`,
                        }}
                      />

                      {/* Content Box */}
                      <div
                        className={`w-full md:w-[45%] group pl-10 pr-5 md:pr-0 md:pl-0 ${
                          i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 text-left"
                        }`}
                      >
                        <div 
                          className={`bg-zinc-950 p-6 border-4 border-zinc-800 transition-all duration-150 relative group-hover:-translate-y-1 ${
                            i % 2 === 0 ? "group-hover:-translate-x-1 md:pr-14" : "group-hover:translate-x-1 md:pl-14"
                          }`}
                          style={{
                             borderColor: `hsl(var(--arcade-pink))`,
                             boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`
                          }}
                        >
                          {/* Inside Time */}
                          <div
                            className={`flex items-center gap-2 mb-3 font-arcade text-[12px] justify-start ${
                              i % 2 === 0 ? "md:justify-end" : "md:justify-start"
                            }`}
                            style={{ color: `hsl(var(--${ALT_COLORS[ev.color] || "arcade-yellow"}))` }}
                          >
                            <Clock size={20} className="opacity-70 mb-1" />
                            <span>{ev.time}</span>
                          </div>

                          {/* Side Accent Icon */}
                          <div
                            className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-950 border-2 items-center justify-center transition-opacity z-20 ${
                              i % 2 === 0 ? "-right-5" : "-left-5"
                            }`}
                            style={{ 
                               borderColor: `hsl(var(--arcade-cyan))`,
                               boxShadow: `3px 3px 0px 0px hsl(var(--arcade-pink))`
                            }}
                          >
                            <ev.icon size={18}  style={{ color: `hsl(var(--${ALT_COLORS[ev.color] || "arcade-yellow"}))` }} />
                          </div>

                          <h4 
                             className="font-arcade text-sm md:text-base mb-2 transition-colors"
                             style={{ color: `hsl(var(--${ALT_COLORS[ev.color] || "arcade-yellow"}))` }}
                          >
                            {ev.title}
                          </h4>
                          <p className="font-body text-[11px] md:text-sm text-zinc-300 font-bold leading-relaxed">
                            {ev.desc}
                          </p>
                        </div>
                      </div>

                      {/* Spacer */}
                      <div className="hidden md:block w-1/2" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ParallaxDivider className="pixel-divider mt-24" baseVelocity={20} />
    </section>
  );
};

export default ScheduleSection;
