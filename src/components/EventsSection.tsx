import { motion } from "framer-motion";
import { FileText, Image, Brain, PartyPopper, Lightbulb, Key } from "lucide-react";

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
      <motion.h2
        className="font-display text-4xl md:text-6xl text-center text-arcade-yellow mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        ENTER THE ARENA
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-sm uppercase tracking-widest">
        Select an arena and begin your quest
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
