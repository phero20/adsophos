import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";
import { Arrow } from "@radix-ui/react-tooltip";
import { ArrowRight } from "lucide-react";

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

const eventCards = [
  {
    title: "Paper Presentation",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Poster Presentation",
    image:
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Quiz Competition",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Fun Events",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Project Expo",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Escape Room",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
  },
];

const EventsSection = () => (
  <section
    id="events"
    className="relative py-20 px-0 arcade-grid-bg scroll-mt-24"
  >
    <div className="container mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center justify-center mb-6 mt-10">
        <div className="overflow-hidden mb-1">
          <h2
            className="font-arcade text-4xl md:text-6xl text-center text-white"
            style={{
              textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)",
            }}
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
      <p
        className="text-center text-arcade-cyan mb-14 font-arcade text-[10px] sm:text-xs uppercase tracking-widest"
        style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
      >
        SELECT AN ARENA AND BEGIN YOUR QUEST
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-2">
        {eventCards.map((evt, i) => (
          <motion.div
            key={evt.title}
            className="relative bg-zinc-950 border-4 flex flex-col group cursor-pointer"
            style={{
              borderColor: `hsl(var(--arcade-pink))`,
              boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <div
              className="w-full aspect-video overflow-hidden border-b-4"
              style={{ borderColor: `hsl(var(--arcade-pink))` }}
            >
              <img
                src={evt.image}
                alt={evt.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 "
              />
            </div>

            <div className="p-5 flex flex-col flex-grow items-center text-center">
              <h3 className="font-arcade text-lg md:text-xl text-arcade-yellow mb-6 leading-tight">
                {evt.title}
              </h3>

              <div className="mt-auto w-full">
                <Button
                  asChild
                  variant="default"
                  className="hidden md:flex font-body font-bold text-xs tracking-[0.1em] px-6 py-2"
                >
                  <div>
                    <a href="#contact">REGISTER</a>
                  <ArrowRight className="ml-2 text-white" size={16} />
                  </div>
                  
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
