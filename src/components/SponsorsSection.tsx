import { motion } from "framer-motion";

const sponsors = [
  "Sponsor 1", "Sponsor 2", "Sponsor 3", "Sponsor 4",
  "Sponsor 5", "Sponsor 6",
];

const SponsorsSection = () => (
  <section id="sponsors" className="relative py-20 px-4 arcade-grid-bg scroll-mt-24">
    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-display text-4xl md:text-6xl text-center text-arcade-yellow mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        POWER-UPS
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-sm uppercase tracking-widest">
        Our sponsors make the game possible
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sponsors.map((s, i) => (
          <motion.div
            key={s}
            className="h-28 bg-card pixel-border flex items-center justify-center group cursor-default"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03 }}
          >
            <span className="font-display text-muted-foreground group-hover:text-arcade-yellow transition-colors">
              {s}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SponsorsSection;
