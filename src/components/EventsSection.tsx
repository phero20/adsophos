import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

// Event images
import paperxImg from "../assets/events/paperx.jpeg";
import bytopiaImg from "../assets/events/bytopia.jpeg";
import auctionManiaImg from "../assets/events/auction-mania.jpeg";
import conquestImg from "../assets/events/conquest.jpeg";

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

export const eventCards = [
  {
    name: "PaperX",
    tagline: "Paper Presentation Forum",
    image: paperxImg,
    description: `PaperX is an event for participants to present their research papers and demonstrate their understanding of a chosen topic. Participants are expected to clearly explain the problem statement, discuss existing work, identify research gaps, and present their proposed solution.\nParticipants will present using a PPT and take part in a Q&A session with judges, testing 
both their knowledge and presentation skills.The event focuses on clear understanding, 
originality, and the ability to relate ideas to real-world applications. `,
  },
  {
    name: "Canvas Clash",
    tagline: "Poster Presentation",
    image: bytopiaImg,
    description: `Showcase your creativity, ideas, and artistic skills in Canvas Clash. Participants are required 
to create a handmade poster based on a theme given on the spot, within the allotted time, 
using A3 paper. \nOnce completed, participants will present their concept to the judges, explaining the idea 
and message behind their work. The event tests creativity, presentation, and the ability to 
express ideas visually.`,
  },
  {
    name: "Auction Mania",
    tagline: "Bid Smart. Build Strong. Win Big.",
    image: auctionManiaImg,
    description: `Auction Mania brings the electrifying thrill of the IPL Auction to life! Step into the shoes of team owners, where every bid, every decision, and every player you choose shapes your path to victory.\nStart with strategy, as you plan your budget and team composition wisely. Move into the live auction, where quick thinking, smart bidding, and teamwork will give you the advantage. End with team evaluation, where the strongest and most balanced team will rise above the rest. Only the smartest team will build the ultimate squad and dominate the auction. Build your team. Win the auction. Become the champions of Auction Mania.`,
  },
  {
    name: "Byteopia",
    tagline: "A Fusion of Mind Games, Fueled by Speed",
    image: bytopiaImg,
    description: `Byteopia offers dynamic games with a range of fast-paced, tech-driven challenges that test reflexes, focus, and thinking skills. Participants will take part in interactive activities that require speed, accuracy, and smart decision-making. Each challenge is designed to keep players engaged, encouraging quick reactions and sharp thinking in a high-energy, competitive environment where mastering diverse tasks becomes part of the thrill.`,
  },
  {
    name: "Conquest",
    tagline: "Outsmart. Outplay. Outlast.",
    image: conquestImg,
    description: `Conquest is a multi-round challenge that pushes your speed, strategy, and teamwork to the limit. Begin with Velocity, where quick thinking and communication give you the edge. Move into Shadows & Lies, a round of puzzles, logic, and hidden truths where not everything can be trusted. End with Treasure Hunt: The Final Conquest, an intense race to decode clues and claim victory. Every round brings you closer to the top, if you can keep up. Only one team will conquer it all.`,
  },
  {
    name: "The Gaming Lab: Outbreak edition",
    tagline: "PLAY LIKE A LEGEND. SURVIVE LIKE A HERO.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    description: `Get ready for an action-packed gaming experience like never before! Step into the heart-pounding world of Resident Evil: Leon’s Last Mission, where survival depends on your courage, strategy, and quick decisions. Switch gears and hit the pitch with FIFA on PS5, where skill, teamwork, and competition collide. Score epic goals, outplay your opponents, and claim victory in thrilling matches. The excitement doesn’t stop there, test your aim and accuracy in the fast-paced Cup Shooting Challenge, a fun and competitive activity that keeps everyone on edge!`,
  },
  {
    name: "Mission Impossible",
    tagline: "Every Move Matters. Every Mission Counts.",
    image:
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=800",
    description: `Mission Impossible is a fun-filled strategy and action game where teams take on exciting missions across four thrilling rounds. Each round presents different challenges from secret action missions, social missions, task missions and stealth operations. The twist? Winners of each round receive Special Power Cards that can be used to gain advantages like pausing other teams, swapping missions, sabotaging opponents, or earning bonus points. Using these powers at the right time can completely change the game. Plan smart, act fast, and stay alert because only the most strategic team will complete the missions and win the game.`,
  },
];

const BORDER_COLOR = "hsl(var(--arcade-pink))";
const SHADOW = "3px 3px 0px hsl(var(--arcade-cyan))";
const SHADOW_HOVER = "5px 5px 0px hsl(var(--arcade-cyan))";

const EventCard = ({
  evt,
  index,
}: {
  evt: (typeof eventCards)[0];
  index: number;
}) => (
  <Dialog>
    <motion.div
      className="relative bg-zinc-950 border-4 border-arcade-pink flex flex-col md:flex-row group cursor-pointer overflow-hidden h-full min-h-[220px]"
      style={{ boxShadow: SHADOW }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        boxShadow: SHADOW_HOVER,
      }}
    >
      {/* Image: Left on Desktop, Top on Mobile */}
      <div className="w-full md:w-[38%] overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-arcade-pink shrink-0 relative aspect-square md:aspect-auto">
        <img
          src={evt.image}
          alt={evt.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Retro scanline overlay on image only */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,4px_100%] opacity-40" />
      </div>

      {/* Content: Right on Desktop, Bottom on Mobile */}
      <div className="p-5 flex flex-col flex-grow items-start text-left bg-gradient-to-br from-transparent to-arcade-pink/5">
        <h3
          className="font-arcade text-base md:text-lg leading-tight mb-2 text-arcade-yellow"
          style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
        >
          {evt.name}
        </h3>
        <div className="font-arcade text-[8px] md:text-[9px] mb-3 text-arcade-cyan uppercase tracking-wider">
          {evt.tagline}
        </div>
        
        {/* Description Snippet: Desktop only or small snippet */}
        <p className="text-[10px] md:text-xs font-body text-zinc-400 mb-6 line-clamp-3 leading-relaxed">
          {evt.description}
        </p>

        <DialogTrigger asChild>
          <Button
            variant="default"
            className="w-full md:w-auto mt-auto px-6 flex items-center justify-center text-arcade-yellow bg-transparent border-2 border-arcade-pink hover:bg-arcade-yellow hover:text-black transition-all duration-300 rounded-none font-arcade text-[10px]"
          >
            View More <ArrowRight className="ml-2" size={14} />
          </Button>
        </DialogTrigger>
      </div>
    </motion.div>

    {/* Dialog */}
    <DialogContent
      className="fixed left-1/2 top-1/2 max-w-lg w-[calc(100vw-1rem)] box-border translate-x-[-50%] translate-y-[-50%] p-4 sm:p-6 overflow-x-auto overflow-y-auto max-h-[100dvh]"
      style={{ boxShadow: SHADOW }}
    >
      <DialogHeader>
        <DialogTitle
          className="font-arcade text-arcade-yellow text-xl mb-2"
          style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
        >
          {evt.name}
        </DialogTitle>
        <div className="text-arcade-cyan font-arcade text-xs mb-2">
          {evt.tagline}
        </div>
      </DialogHeader>
      <DialogDescription asChild>
        <div className="whitespace-pre-line text-foreground font-body text-sm mb-4 text-left">
          {evt.description}
        </div>
      </DialogDescription>
      <DialogFooter>
        <Button
          asChild
          variant="default"
          className="w-full mt-auto flex items-center justify-center text-arcade-yellow bg-transparent border-2 border-arcade-pink hover:bg-arcade-yellow hover:text-black transition-all duration-300 rounded-none"
        >
          <a href={`/register?event=${encodeURIComponent(evt.name)}`}>
            Register <ArrowRight className="ml-2" size={16} />
          </a>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const EventsSection = () => (
  <section
    id="events"
    className="relative py-20 px-0 arcade-grid-bg scroll-mt-24"
  >
    <div className="container mx-auto max-w-7xl px-4">
      {/* Section Header */}
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
            <SplitText text="THE ARCADE" delay={0.3} />
          </h2>
        </div>
      </div>
      <p
        className="text-center text-arcade-cyan mb-14 font-arcade text-[10px] sm:text-xs uppercase tracking-widest"
        style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}
      >
        SELECT AN ARENA AND BEGIN YOUR QUEST
      </p>

      {/* All 7 events — uniform card sizes, 4 per row on desktop, bottom 3 centred */}
      <div className="flex flex-wrap justify-center gap-8 gap-y-12 px-2">
        {eventCards.map((evt, i) => (
          <div
            key={evt.name}
            className="w-full lg:w-[calc(50%-16px)]"
          >
            <EventCard evt={evt} index={i} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
