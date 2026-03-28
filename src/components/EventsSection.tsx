import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Image, Brain, PartyPopper, Lightbulb, Key } from "lucide-react";

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

const levels = [
  {
    level: 1,
    title: "Paper Presentation",
    icon: FileText,
    events: ["Technical Papers", "Research Showcase", "Innovation Pitches", "Case Studies"],
  },
  {
    level: 2,
    title: "Poster Presentation",
    icon: Image,
    events: ["Creative Posters", "Infographic Design", "Visual Storytelling", "Data Visualization"],
  },
  {
    level: 3,
    title: "Quiz Competition",
    icon: Brain,
    events: ["Tech Quiz", "General Knowledge", "Rapid Fire", "Buzzer Round"],
  },
  {
    level: 4,
    title: "Fun Events",
    icon: PartyPopper,
    events: ["Treasure Hunt", "Quiz Bowl", "Meme Contest", "Talent Show"],
  },
  {
    level: 5,
    title: "Project Expo",
    icon: Lightbulb,
    events: ["IoT Projects", "AI/ML Demos", "Web Apps", "Hardware Hacks"],
  },
  {
    level: 6,
    title: "Escape Room",
    icon: Key,
    events: ["Mystery Puzzle", "Code Breaking", "Logic Maze", "Time Challenge"],
  },
];

const EventsSection = () => (
  <section id="events" className="relative py-20 px-4 arcade-grid-bg scroll-mt-24">
    <div className="container mx-auto max-w-6xl">
      <div className="flex flex-col items-center justify-center mb-6 mt-10">
        <div className="overflow-hidden mb-1">
          <h2
            className="font-arcade text-4xl md:text-6xl text-center text-white"
            style={{ textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)" }}
          >
            <SplitText text="ENTER" delay={0.1} />
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2
            className="font-arcade text-4xl md:text-6xl text-center text-arcade-yellow"
            style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
          >
            <SplitText text="THE ARENA" delay={0.3} />
          </h2>
        </div>
      </div>
      <p className="text-center text-arcade-cyan mb-14 font-arcade text-[10px] sm:text-xs uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}>
        SELECT AN ARENA AND BEGIN YOUR QUEST
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((lvl, i) => (
          <motion.div
            key={lvl.title}
            className="relative bg-card pixel-border p-6 group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <div className="flex items-center gap-3 mb-4 mt-2">
              <lvl.icon className="w-7 h-7 text-arcade-pink" />
              <h3 className="font-display text-xl text-foreground">{lvl.title}</h3>
            </div>

            <ul className="space-y-2 mb-6">
              {lvl.events.map((e) => (
                <li key={e} className="flex items-center gap-2 text-muted-foreground font-body text-sm">
                  <span className="w-2 h-2 bg-arcade-pink" />
                  {e}
                </li>
              ))}
            </ul>

            <button className="w-full font-arcade text-[9px] py-3 bg-background text-arcade-pink pixel-btn hover:bg-arcade-pink hover:text-primary-foreground transition-colors">
              ▶ BEGIN QUEST
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
