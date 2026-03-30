import { useRef, useState, type TouchEvent } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import h1 from "@/assets/history/h1.jpg";
import h2 from "@/assets/history/h2.jpg";
import h3 from "@/assets/history/h3.jpg";
import h4 from "@/assets/history/h4.jpg";
import h6 from "@/assets/history/h6.png";
import h7 from "@/assets/history/h7.png";
import h8 from "@/assets/history/h8.jpg";
import h9 from "@/assets/history/h9.jpg";

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

const storyParagraphs = [
  "ADSOPHOS is one of Hyderabad's biggest tech fests, where fun, creativity, and innovation come together under one roof. Students from colleges across the city flock to MJCET to witness groundbreaking projects, compete in high-stakes challenges, and leave their mark.",
  "From thrilling competitions and engaging quizzes to a highly insightful Tech Expo, ADSOPHOS 2026 is a vibrant two-day celebration of talent, teamwork, and ambition. Play, compete, and make your place among the best.",
  "After a brief hiatus due to COVID-19, the legacy was momentarily paused... but now, finally,",
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

function ParallaxDivider({
  className,
  baseVelocity = 20,
}: {
  className: string;
  baseVelocity?: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const directionFactor = useRef<number>(baseVelocity < 0 ? -1 : 1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * Math.abs(baseVelocity) * (delta / 1000);
    const velocity = smoothVelocity.get();

    if (velocity < 0) {
      directionFactor.current = -1;
    } else if (velocity > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * Math.abs(velocity) * 0.002;

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

const MemoryCard = ({
  card,
  index,
  activeIndex,
  total,
}: {
  card: { src: string; title: string };
  index: number;
  activeIndex: number;
  total: number;
}) => {
  const diff = index - activeIndex;
  const isActive = diff === 0;

  const scale = isActive ? 1 : Math.max(0.62, 1 - Math.abs(diff) * 0.15);
  const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(diff) * 0.4);
  const yOffset = diff * 42;
  const rotateX = diff * -12;

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
          ? "brightness(1.08) saturate(1.15)"
          : "brightness(0.48) saturate(0.55)",
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="absolute inset-0 flex items-center justify-center p-3 md:p-4"
      style={{ zIndex: total - Math.abs(diff), perspective: "1200px" }}
    >
      <div
        className={`relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[440px] aspect-[4/3] bg-black p-1 transition-all ${
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
          className="h-full w-full object-cover grayscale-[25%]"
        />
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -bottom-8 sm:-bottom-10 left-0 right-0 text-center"
            >
              <h3
                className="font-arcade text-[9px] sm:text-xs text-arcade-yellow tracking-widest uppercase whitespace-nowrap"
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

const AboutSection = () => {
  const sectionRef = useRef(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgNumY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const prev = () => {
    setActiveIndex((current) =>
      current === 0 ? historyImages.length - 1 : current - 1
    );
  };

  const next = () => {
    setActiveIndex((current) =>
      current === historyImages.length - 1 ? 0 : current + 1
    );
  };

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-24 scroll-mt-24"
    >
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

      <ParallaxDivider className="pixel-divider mb-20" baseVelocity={-20} />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6">
              <div className="overflow-hidden mb-3">
                <div
                  className="font-arcade text-3xl md:text-5xl leading-[1.15] tracking-wide text-white"
                  style={{
                    textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)",
                  }}
                >
                  <SplitText text="STORY OF" delay={0.1} />
                </div>
              </div>
              <div className="overflow-hidden">
                <div
                  className="font-arcade text-2xl md:text-4xl leading-[1.15] tracking-wide text-arcade-yellow"
                  style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
                >
                  <SplitText text="ADSOPHOS" delay={0.2} />
                </div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 max-w-xl font-arcade text-[10px] uppercase tracking-[0.22em] text-arcade-cyan"
              style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
            >
              Continuing the legacy where it left off. Leveling up for the new era.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="h-px bg-arcade-yellow origin-left mb-8"
            />

            <div className="space-y-5">
              {storyParagraphs.map((paragraph, index) => (
                <motion.p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.28 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-body text-sm md:text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                  {index === 2 && (
                    <>
                      {" "}
                      <span
                        className="text-arcade-pink font-bold"
                        style={{ textShadow: "1px 1px 0px rgba(0,0,0,1)" }}
                      >
                        we are back
                      </span>
                      .
                    </>
                  )}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <div
              className="relative"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="relative h-[280px] sm:h-[340px] lg:h-[460px] flex items-center justify-center">
                <div className="absolute inset-0">
                  {historyImages.map((card, index) => (
                    <MemoryCard
                      key={card.title}
                      card={card}
                      index={index}
                      activeIndex={activeIndex}
                      total={historyImages.length}
                    />
                  ))}
                </div>
              </div>

              <div className="h-10 sm:h-12" />

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={prev}
                  className="font-arcade text-[9px] text-arcade-pink border border-arcade-pink px-3 py-2 transition-transform active:scale-95"
                >
                  ◀ PREV
                </button>

                <div className="flex items-center gap-2">
                  {historyImages.map((card, index) => (
                    <button
                      key={card.title}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show ${card.title}`}
                      className={`rounded-none shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all duration-300 ${
                        index === activeIndex
                          ? "h-1.5 w-5 bg-arcade-cyan"
                          : "h-1.5 w-1.5 bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="font-arcade text-[9px] text-arcade-pink border border-arcade-pink px-3 py-2 transition-transform active:scale-95"
                >
                  NEXT ▶
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ParallaxDivider className="pixel-divider-yellow mt-24" baseVelocity={20} />
    </section>
  );
};

export default AboutSection;
