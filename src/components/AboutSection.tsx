import { motion, useScroll, useTransform, useInView, useVelocity, useSpring, useAnimationFrame, useMotionValue } from "framer-motion";
import { FileText, Image, Brain, PartyPopper, Lightbulb } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: FileText,
    label: "Paper Presentation",
    desc: "Present your research & ideas",
    index: "01",
  },
  {
    icon: Image,
    label: "Poster Presentation",
    desc: "Showcase creative visual displays",
    index: "02",
  },
  {
    icon: Brain,
    label: "Quiz Competition",
    desc: "Test your knowledge & win",
    index: "03",
  },
  {
    icon: PartyPopper,
    label: "Fun Events",
    desc: "Treasure hunts & quizzes",
    index: "04",
  },
  {
    icon: Lightbulb,
    label: "Project Expo",
    desc: "Showcase your innovations",
    index: "05",
  },
];

// Reusable: split text into chars for stagger animation
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

// Horizontal marquee ticker
const Ticker = () => {
  const items = [
    "PAPER",
    "POSTER",
    "QUIZ",
    "EXPO",
    "FUN EVENTS",
    "COMPETE",
    "CREATE",
    "INNOVATE",
  ];
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-arcade-yellow/30 py-2 my-14 select-none">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="font-arcade text-[10px] tracking-widest text-arcade-yellow/50 flex items-center gap-8"
          >
            {item}
            <span className="text-arcade-pink/40">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const AboutSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for the large number
  const bgNumY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 px-1 scroll-mt-24 overflow-hidden"
    >
      {/* ── Background large ghost text ─────────────────────────────────── */}
      <motion.div
        style={{ y: bgNumY }}
        className="pointer-events-none absolute -right-8 top-0 select-none"
        aria-hidden
      >
        <span
          className="font-arcade text-[22vw] leading-none text-foreground/[0.03] block"
          style={{ letterSpacing: "-0.04em" }}
        >
          2026
        </span>
      </motion.div>

      {/* ── Pixel divider top ─────────────────────────────────────────── */}
      <ParallaxDivider className="pixel-divider mb-28" baseVelocity={-20} />

      <div className="container mx-auto max-w-5xl">
        {/* ── HEADER BLOCK ─────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end mb-4">
          {/* Title */}
          <div>
            {/* Main heading — clipped reveal */}
            <div className="overflow-hidden mb-3">
              <div
                className="font-arcade text-3xl md:text-5xl leading-[1.2] tracking-wide text-white"
                style={{
                  textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)",
                }}
              >
                <SplitText text="A BLAST" delay={0.1} />
              </div>
            </div>
            <div className="overflow-hidden mb-3 pl-1 ml-1">
              <div
                className="font-arcade text-3xl md:text-5xl leading-[1.2] tracking-wide text-arcade-yellow"
                style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
              >
                <SplitText text="FROM THE" delay={0.2} />
              </div>
            </div>
            <div className="overflow-hidden mt-1">
              <div
                className="font-arcade text-3xl md:text-5xl leading-[1.2] tracking-wide text-white"
                style={{
                  textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)",
                }}
              >
                <SplitText text="PAST." delay={0.3} />
              </div>
            </div>
          </div>

          {/* Right meta block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden md:flex flex-col items-end gap-1 pb-1"
          >
            <span
              className="font-arcade text-[15px] text-arcade-cyan tracking-widest"
              style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
            >
              2-DAY FEST
            </span>
          </motion.div>
        </div>

        {/* Animated underline rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-arcade-yellow origin-left mb-12"
        />

        {/* ── BODY COPY ─────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-10 mb-0">
          {[
            "ADSOPHOS 2026 is a vibrant two-day fest where fun, creativity, and culinary delights come together. It’s a space to explore, compete, and enjoy a variety of exciting activities with your friends.",
            "From thrilling challenges, a highly insightful Tech expo, to engaging quizzes, watch teams climb their way to the top and leave their mark. Play, compete, and make your place among the best.",
          ].map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-body text-sm text-muted-foreground leading-relaxed"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>

      {/* ── TICKER ─────────────────────────────────────────────────────────
      <div className="container mx-auto max-w-5xl">
        <Ticker />
      </div> */}

      {/* ── FEATURE CARDS ─────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 bg-transparent p-2">
          {features.map((f, i) => (
            <FeatureCard key={f.label} f={f} i={i} />
          ))}
        </div>
      </div>

      {/* ── Pixel divider bottom ─────────────────────────────────────────── */}
      <ParallaxDivider className="pixel-divider-yellow mt-28" baseVelocity={20} />
    </section>
  );
};

// ── Extracted card with its own inView hook ─────────────────────────────────
const FeatureCard = ({ f, i }: { f: any; i: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full"
    >
      <div
        style={{ minHeight: 170 }}
        className="group relative flex-1 flex flex-col bg-zinc-900 border-2 border-arcade-pink px-5 pt-6 pb-5 cursor-pointer overflow-visible transition-all duration-150 shadow-[4px_4px_0_0_hsl(var(--arcade-cyan))] hover:shadow-[2px_2px_0_0_hsl(var(--arcade-cyan))] hover:translate-y-[2px] hover:translate-x-[2px] active:shadow-[0_0_0_0_hsl(var(--arcade-cyan))] active:translate-y-[4px] active:translate-x-[4px]"
      >
        {/* Hover fill — slides up from bottom */}
        <div className="absolute inset-0 bg-arcade-pink/10 origin-bottom scale-y-0 opacity-0 transition-all duration-300 group-hover:scale-y-100 group-hover:opacity-100 pointer-events-none" />

        {/* Index number */}
        <span className="font-arcade text-[9px] text-muted-foreground/40 mb-auto tracking-widest group-hover:text-arcade-yellow transition-colors relative z-10">
          {f.index}
        </span>

        {/* Icon */}
        <div className="mt-4 mb-3 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
          <f.icon
            className="w-7 h-7 text-arcade-yellow transition-colors duration-200 group-hover:text-arcade-cyan"
            strokeWidth={1.5}
          />
        </div>

        {/* Label */}
        <span
          className="font-arcade text-[10px] text-white leading-snug tracking-wide mb-1.5 relative z-10"
          style={{ textShadow: "1px 1px 0px rgba(0,0,0,1)" }}
        >
          {f.label}
        </span>

        {/* Desc */}
        <span className="font-body text-[10px] text-muted-foreground leading-relaxed font-bold group-hover:text-white/80 transition-colors relative z-10">
          {f.desc}
        </span>

        {/* Bottom border accent — expands on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-arcade-pink origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 pointer-events-none z-20" />
      </div>
    </motion.div>
  );
};


export default AboutSection;
