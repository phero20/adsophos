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
    <section id="register" className="relative py-20 px-4 scroll-mt-24">
      <div className="pixel-divider-yellow mb-16" />

      <div className="container mx-auto max-w-3xl text-center">
        <motion.h2
          className="font-display text-4xl md:text-6xl text-arcade-pink mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          START YOUR JOURNEY
        </motion.h2>
        <p className="text-muted-foreground mb-10 font-body text-sm uppercase tracking-widest">
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
              <div className="w-16 h-16 md:w-20 md:h-20 bg-card pixel-border flex items-center justify-center">
                <span className="font-arcade text-lg md:text-2xl text-arcade-yellow">
                  {String(u.value).padStart(2, "0")}
                </span>
              </div>
              <span className="font-arcade text-[7px] text-muted-foreground mt-2">{u.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Registration form */}
        <motion.div
          className="bg-card p-6 md:p-8 pixel-border text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {["Your Name", "Email Address", "College / Institution", "Team Name (optional)"].map((ph) => (
              <input
                key={ph}
                type="text"
                placeholder={ph}
                className="w-full px-4 py-3 bg-secondary text-foreground font-body text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors"
              />
            ))}
          </div>
          <button className="w-full font-arcade text-[10px] py-4 bg-arcade-pink text-primary-foreground pixel-btn">
             REGISTER NOW
          </button>
        </motion.div>
      </div>

      <div className="pixel-divider mt-16" />
    </section>
  );
};

export default RegistrationSection;
