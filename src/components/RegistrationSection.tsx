import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FEST_DATE = new Date("2026-09-15T09:00:00");

const RegistrationSection = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = FEST_DATE.getTime() - Date.now();
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "DAYS", value: countdown.days },
    { label: "HRS", value: countdown.hours },
    { label: "MIN", value: countdown.mins },
    { label: "SEC", value: countdown.secs },
  ];

  return (
    <section id="register" className="relative py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <motion.h2
          className="font-arcade text-lg md:text-2xl text-glow-pink mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Start Your Journey
        </motion.h2>
        <p className="text-muted-foreground mb-10 font-body text-lg">
          Register now and secure your spot in the arena
        </p>

        {/* Countdown */}
        <motion.div
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-card neon-border flex items-center justify-center">
                <span className="font-arcade text-lg md:text-2xl text-neon-cyan">
                  {String(u.value).padStart(2, "0")}
                </span>
              </div>
              <span className="font-display text-[10px] text-muted-foreground mt-2">{u.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Registration form */}
        <motion.div
          className="bg-card rounded-xl p-6 md:p-8 neon-border text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-body border border-border focus:border-neon-cyan focus:outline-none transition-colors"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-body border border-border focus:border-neon-cyan focus:outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="College / Institution"
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-body border border-border focus:border-neon-cyan focus:outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Team Name (optional)"
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-body border border-border focus:border-neon-cyan focus:outline-none transition-colors"
            />
          </div>
          <button className="w-full font-arcade text-xs py-4 rounded-lg bg-neon-cyan/10 text-neon-cyan neon-border hover:bg-neon-cyan/20 transition-all duration-200 animate-glow-pulse">
            🎮 REGISTER NOW
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationSection;
