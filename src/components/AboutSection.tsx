import { motion } from "framer-motion";
import { Code, Bot, Gamepad2, PartyPopper, Lightbulb } from "lucide-react";

const features = [
  { icon: Code, label: "Coding", desc: "Competitive programming & hackathons" },
  { icon: Bot, label: "Robotics", desc: "Build and battle bots" },
  { icon: Gamepad2, label: "Gaming", desc: "Esports tournaments & retro games" },
  { icon: PartyPopper, label: "Fun Events", desc: "Treasure hunts & quizzes" },
  { icon: Lightbulb, label: "Project Expo", desc: "Showcase your innovations" },
];

const AboutSection = () => (
  <section id="about" className="relative py-20 px-4">
    {/* Pixel divider top */}
    <div className="pixel-divider mb-16" />

    <div className="container mx-auto max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-6xl text-arcade-pink mb-4 leading-tight">
            A BLAST FROM<br />THE PAST
          </h2>
          <div className="w-20 h-1 bg-arcade-yellow mb-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
            ADSOPHOS 2026 is a 2-day technical extravaganza where innovation meets entertainment.
            Compete, create, and celebrate technology across multiple arenas.
          </p>
          <p className="font-body text-muted-foreground text-sm leading-relaxed">
            From high-speed coders to classic bot battles, see which teams are dominating the charts.
            Play, compete, and claim your spot among the best!
          </p>
        </motion.div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="flex flex-col items-center gap-3 p-5 bg-card pixel-border group cursor-default"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <f.icon className="w-8 h-8 text-arcade-yellow group-hover:text-arcade-pink transition-colors" />
            <span className="font-arcade text-[8px] text-foreground text-center">{f.label}</span>
            <span className="text-[10px] text-muted-foreground text-center font-body">{f.desc}</span>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Pixel divider bottom */}
    <div className="pixel-divider-yellow mt-16" />
  </section>
);

export default AboutSection;
