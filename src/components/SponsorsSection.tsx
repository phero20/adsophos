import { motion } from "framer-motion";

const sponsors = [
  "Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4",
  "Sponsor 5", "Sponsor 6",
];

const SponsorsSection = () => (
  <section id="sponsors" className="relative py-24 px-4">
    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-arcade text-lg md:text-2xl text-center text-glow-cyan mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Power-Ups
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-lg">
        Our sponsors make the game possible
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sponsors.map((s, i) => (
          <motion.div
            key={s}
            className="h-28 rounded-xl bg-card neon-border-pink flex items-center justify-center group hover:neon-glow transition-all duration-300 cursor-default"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-display text-muted-foreground group-hover:text-neon-cyan transition-colors font-bold">
              {s}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SponsorsSection;
