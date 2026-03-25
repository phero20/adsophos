import { motion } from "framer-motion";
import { Code, Bot, Gamepad2, PartyPopper, Lightbulb } from "lucide-react";

const levels = [
  {
    level: 1,
    title: "Coding Events",
    icon: Code,
    color: "neon-blue",
    border: "border-neon-blue/40",
    shadow: "shadow-[0_0_20px_hsl(210_100%_55%/0.3)]",
    events: ["Hackathon", "Debug Wars", "Code Golf", "Algorithm Challenge"],
  },
  {
    level: 2,
    title: "Robotics",
    icon: Bot,
    color: "neon-green",
    border: "border-neon-green/40",
    shadow: "shadow-[0_0_20px_hsl(145_100%_45%/0.3)]",
    events: ["Line Follower", "Robo Race", "Drone Challenge", "Bot Battle"],
  },
  {
    level: 3,
    title: "Gaming",
    icon: Gamepad2,
    color: "neon-red",
    border: "border-neon-red/40",
    shadow: "shadow-[0_0_20px_hsl(348_100%_60%/0.3)]",
    events: ["Valorant", "BGMI", "FIFA", "Retro Arcade"],
  },
  {
    level: 4,
    title: "Fun Events",
    icon: PartyPopper,
    color: "neon-yellow",
    border: "border-neon-yellow/40",
    shadow: "shadow-[0_0_20px_hsl(50_100%_55%/0.3)]",
    events: ["Treasure Hunt", "Quiz Bowl", "Meme Contest", "Talent Show"],
  },
  {
    level: 5,
    title: "Project Expo",
    icon: Lightbulb,
    color: "neon-purple",
    border: "border-neon-purple/40",
    shadow: "shadow-[0_0_20px_hsl(270_100%_60%/0.3)]",
    events: ["IoT Projects", "AI/ML Demos", "Web Apps", "Hardware Hacks"],
  },
];

const EventsSection = () => (
  <section id="events" className="relative py-24 px-4">
    <div className="container mx-auto max-w-6xl">
      <motion.h2
        className="font-arcade text-lg md:text-2xl text-center text-glow-cyan mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Choose Your Level
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-lg">
        Select an arena and begin your quest
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((lvl, i) => (
          <motion.div
            key={lvl.level}
            className={`relative rounded-xl bg-card border ${lvl.border} p-6 group cursor-pointer transition-all duration-300 hover:${lvl.shadow}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Level badge */}
            <div className={`absolute -top-3 left-4 font-arcade text-[10px] bg-background px-3 py-1 rounded-full border ${lvl.border} text-${lvl.color}`}>
              LVL {lvl.level}
            </div>

            <div className="flex items-center gap-3 mb-4 mt-2">
              <lvl.icon className={`w-7 h-7 text-${lvl.color}`} />
              <h3 className="font-display text-xl font-bold text-foreground">{lvl.title}</h3>
            </div>

            <ul className="space-y-2 mb-6">
              {lvl.events.map((e) => (
                <li key={e} className="flex items-center gap-2 text-muted-foreground font-body">
                  <span className={`w-1.5 h-1.5 rounded-full bg-${lvl.color}`} />
                  {e}
                </li>
              ))}
            </ul>

            <button className={`w-full font-display text-sm font-bold py-2.5 rounded-lg border ${lvl.border} text-${lvl.color} bg-transparent hover:bg-${lvl.color}/10 transition-colors duration-200`}>
              ▶ PLAY NOW
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
