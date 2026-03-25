import { motion } from "framer-motion";
import { Code, Bot, Gamepad2, PartyPopper, Lightbulb } from "lucide-react";

const features = [
  { icon: Code, label: "Coding", color: "text-neon-blue", desc: "Competitive programming & hackathons" },
  { icon: Bot, label: "Robotics", color: "text-neon-green", desc: "Build and battle bots" },
  { icon: Gamepad2, label: "Gaming", color: "text-neon-red", desc: "Esports tournaments & retro games" },
  { icon: PartyPopper, label: "Fun Events", color: "text-neon-yellow", desc: "Treasure hunts & quizzes" },
  { icon: Lightbulb, label: "Project Expo", color: "text-neon-purple", desc: "Showcase your innovations" },
];

const AboutSection = () => (
  <section id="about" className="relative py-24 px-4">
    <div className="container mx-auto max-w-5xl">
      <motion.h2
        className="font-arcade text-lg md:text-2xl text-center text-glow-pink mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        About Adsophos
      </motion.h2>
      <motion.p
        className="text-center text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-14 font-body"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        ADSOPHOS 2026 is a 2-day technical extravaganza where innovation meets entertainment.
        Compete, create, and celebrate technology across multiple arenas.
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card neon-border hover:neon-glow transition-all duration-300 group cursor-default"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <f.icon className={`w-8 h-8 ${f.color} group-hover:scale-110 transition-transform`} />
            <span className="font-display text-sm font-bold text-foreground">{f.label}</span>
            <span className="text-xs text-muted-foreground text-center">{f.desc}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
