import { motion } from "framer-motion";
import { UtensilsCrossed, Gamepad, Flame, Award } from "lucide-react";

const stalls = [
  { icon: UtensilsCrossed, label: "Food Stalls", desc: "Fuel up for the next level", color: "text-neon-orange" },
  { icon: Gamepad, label: "Gaming Booths", desc: "Retro & VR experiences", color: "text-neon-red" },
  { icon: Flame, label: "Fun Challenges", desc: "Mini-games & prizes", color: "text-neon-yellow" },
  { icon: Award, label: "Sponsor Stalls", desc: "Exclusive merch & demos", color: "text-neon-purple" },
];

const StallsSection = () => (
  <section id="stalls" className="relative py-24 px-4">
    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-arcade text-lg md:text-2xl text-center text-glow-cyan mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Bonus Stages
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-lg">
        Unlock extra fun between levels
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stalls.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card neon-border-pink hover:neon-glow transition-all duration-300 group cursor-default"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
          >
            <s.icon className={`w-8 h-8 ${s.color} group-hover:scale-110 transition-transform`} />
            <span className="font-display text-sm font-bold text-foreground text-center">{s.label}</span>
            <span className="text-xs text-muted-foreground text-center">{s.desc}</span>
            <span className="font-arcade text-[8px] text-neon-pink mt-1">🔓 UNLOCKED</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StallsSection;
