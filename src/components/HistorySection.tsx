import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import h1 from "@/assets/history/h1.jpg";
import h2 from "@/assets/history/h2.jpg";
import h3 from "@/assets/history/h3.jpg";
import h4 from "@/assets/history/h4.jpg";
import h6 from "@/assets/history/h6.png";
import h7 from "@/assets/history/h7.png";
import h8 from "@/assets/history/h8.jpg";
import h9 from "@/assets/history/h9.jpg";
import { History, ChevronUp, ChevronDown, Gamepad2 } from "lucide-react";

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

const MemoryCard = ({ card, index, activeIndex, total }: { card: any, index: number, activeIndex: number, total: number }) => {
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
        filter: isActive ? "brightness(1.1) saturate(1.2)" : "brightness(0.3) saturate(0.5)",
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="absolute inset-0 flex items-center justify-center p-4"
      style={{ zIndex: total - Math.abs(diff), perspective: "1200px" }}
    >
      <div className={`relative w-full max-w-[280px] md:max-w-[420px] aspect-[4/3] bg-black pixel-border p-1 ${isActive ? 'shadow-[0_0_50px_rgba(255,45,120,0.5)] border-arcade-pink' : 'border-white/5'}`}>
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.15] scanlines" />
        
        {isActive && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-arcade text-[7px] text-white">RECALLING...</span>
          </div>
        )}

        <img 
          src={card.src} 
          alt={card.title}
          loading="lazy"
          className="w-full h-full object-cover grayscale-[30%] active:grayscale-0"
        />

        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -bottom-12 md:-bottom-16 left-0 right-0 text-center"
                >
                    <h3 className="font-display text-lg md:text-2xl text-arcade-pink tracking-[0.2em] hero-title-glow uppercase whitespace-nowrap">
                       {card.title}
                    </h3>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const HistorySection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll progress to active card index
    const activeIndexDecimal = useTransform(scrollYProgress, [0, 1], [0, historyImages.length - 1]);
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
            className="relative h-[500vh] scroll-mt-24" // Extra height for pin duration
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 arcade-grid-bg bg-[#050505]">
                {/* Background Glow */}
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-arcade-pink/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-arcade-blue/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 h-full py-20">
                    
                    {/* Left: The Story */}
                    <motion.div 
                        className="flex-1 max-w-xl order-2 lg:order-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="font-display text-4xl md:text-7xl text-white tracking-widest uppercase">
                                MEMORY CARD
                            </h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-1 px-4 border-l-4 border-arcade-pink bg-arcade-pink/5">
                                <p className="font-arcade text-[8px] md:text-sm text-arcade-yellow uppercase tracking-[0.4em]">
                                    Glimpses from the Legend
                                </p>
                            </div>

                            <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed">
                                Adsophos used to happen every single year, known as one of the <span className="text-white font-bold">biggest tech fests in Hyderabad</span>. 
                                Students from different colleges flocked to MJCET to witness groundbreaking projects and compete in high-stakes activities.
                            </p>
                            
                            <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed">
                                After a brief hiatus due to COVID-19, the legacy was momentarily paused... <span className="text-arcade-pink font-display uppercase tracking-widest text-lg md:text-2xl mt-4 block">But now, finally, we are back.</span>
                            </p>

                            <div className="flex items-center gap-4 pt-6">
                                <div className="flex flex-col gap-1">
                                    <span className="font-display text-3xl text-arcade-cyan">2026</span>
                                    <span className="font-arcade text-[6px] text-muted-foreground tracking-widest">THE REAWAKENING</span>
                                </div>
                                <div className="h-12 w-[2px] bg-white/10" />
                                <p className="font-body text-[10px] text-muted-foreground italic">
                                    Continuing the legacy where it left off, leveling up for the new era.
                                </p>
                            </div>
                        </div>

                        {/* Pagination Dots on Mobile (Inline) */}
                        <div className="flex lg:hidden gap-3 mt-12 justify-center">
                            {historyImages.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-arcade-pink" : "w-1.5 bg-muted"}`} 
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Right/Center: The Stacked Cards */}
                    <div className="flex-1 relative w-full h-[400px] md:h-[500px] order-1 lg:order-2">
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

                        {/* Navigation Dots (Desktop Aside) */}
                        <div className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 flex-col gap-5 z-50">
                            {historyImages.map((_, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => {
                                        // Since we use scroll progress, clicking a dot should scroll the window
                                        const scrollTarget = containerRef.current!.offsetTop + (i / (historyImages.length - 1)) * (containerRef.current!.scrollHeight - window.innerHeight);
                                        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                                    }}
                                    animate={{
                                        scale: activeIndex === i ? 1.6 : 1,
                                        backgroundColor: activeIndex === i ? "#ff2d78" : "#222",
                                        boxShadow: activeIndex === i ? "0 0 15px #ff2d78" : "none",
                                    }}
                                    className="w-1.5 h-1.5 rounded-full"
                                />
                            ))}
                        </div>

                        {/* Scroll Help Text */}
                        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 select-none">
                             <span className="font-arcade text-[7px] tracking-widest">SCROLL TO REVEAL MEMORIES</span>
                             <ChevronDown size={14} className="animate-bounce" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HistorySection;
