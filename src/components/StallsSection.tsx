import { motion } from "framer-motion";
import { UtensilsCrossed, Gamepad, Flame, Award } from "lucide-react";

const stalls = [
  { icon: UtensilsCrossed, label: "Food Stalls", desc: "Fuel up for the next level" },
  { icon: Gamepad, label: "Gaming Booths", desc: "Retro & VR experiences" },
  { icon: Flame, label: "Fun Challenges", desc: "Mini-games & prizes" },
  { icon: Award, label: "Sponsor Stalls", desc: "Exclusive merch & demos" },
];

const StallsSection = () => (
  <section id="stalls" className="relative py-20 px-4 arcade-grid-bg">
    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-display text-4xl md:text-6xl text-center text-arcade-yellow mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        BONUS STAGES
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-sm uppercase tracking-widest">
        Unlock extra fun between levels
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stalls.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex flex-col items-center gap-3 p-6 bg-card pixel-border group cursor-default"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <s.icon className="w-8 h-8 text-arcade-pink group-hover:text-arcade-yellow transition-colors" />
            <span className="font-arcade text-[8px] text-foreground text-center">{s.label}</span>
            <span className="text-[10px] text-muted-foreground text-center font-body">{s.desc}</span>
            <span className="font-arcade text-[7px] text-arcade-yellow mt-1">🔓 UNLOCKED</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StallsSection;
