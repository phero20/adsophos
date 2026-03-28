import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, Instagram, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "./ui/button";

// Reusable: split text into chars for stagger animation
const SplitText = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", skewY: 8 }}
          animate={inView ? { opacity: 1, y: "0%", skewY: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.032,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const ContactSection = () => (
  <section id="contact" className="relative py-20 px-4 scroll-mt-24">
    <div className="container mx-auto max-w-4xl px-3">
      <div className="flex flex-col items-center justify-center mb-6 mt-10">
        <div className="overflow-hidden mb-1">
          <h2
            className="font-arcade text-4xl md:text-6xl text-center text-white"
            style={{
              textShadow: "3px 3px 0px #ec4899, 6px 6px 0px rgba(0,0,0,1)",
            }}
          >
            <SplitText text="NEED" delay={0.1} />
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2
            className="font-arcade text-4xl mt-2 md:text-6xl text-center text-arcade-yellow"
            style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
          >
            <SplitText text="HELP?" delay={0.3} />
          </h2>
        </div>
      </div>
      <p className="text-center text-arcade-cyan mb-14 font-arcade text-[10px] sm:text-xs uppercase tracking-widest" style={{ textShadow: "2px 2px 0px rgba(0,0,0,1)" }}>
        Reach out to the ADSOPHOS support.
      </p>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 px-2 pb-6">
        <motion.div
          className="bg-zinc-950 border-4 p-6 md:p-8 flex flex-col group"
          style={{
            borderColor: `hsl(var(--arcade-pink))`,
            boxShadow: `4px 4px 0px 0px hsl(var(--arcade-cyan))`,
          }}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-5">
            <input
              type="text"
              placeholder="NAME"
              className="w-full px-4 py-4 bg-zinc-900/50 text-white font-body font-bold text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors placeholder:text-zinc-600"
            />
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full px-4 py-4 bg-zinc-900/50 text-white font-body font-bold text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors placeholder:text-zinc-600"
            />
            <textarea
              rows={4}
              placeholder="YOUR MESSAGE..."
              className="w-full px-4 py-4 bg-zinc-900/50 text-white font-body font-bold text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors resize-none placeholder:text-zinc-600"
            />
            <Button
              className="w-full font-body font-bold text-xs tracking-[0.1em] py-3 h-auto"
            >
              SEND MESSAGE
              <Send className="ml-2" size={16} />
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center gap-6 md:gap-8"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:-translate-y-1"
              style={{
                borderColor: `hsl(var(--arcade-pink))`,
                boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
              }}>
              <Mail className="w-5 h-5 text-arcade-yellow" />
            </div>
            <span className="font-body font-bold text-white text-sm md:text-base tracking-widest uppercase transition-colors group-hover:text-arcade-yellow">adsophos2026@college.edu</span>
          </div>
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:-translate-y-1"
              style={{
                borderColor: `hsl(var(--arcade-pink))`,
                boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
              }}>
              <Phone className="w-5 h-5 text-arcade-yellow" />
            </div>
            <span className="font-body font-bold text-white text-sm md:text-base tracking-widest transition-colors group-hover:text-arcade-yellow">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:-translate-y-1"
              style={{
                borderColor: `hsl(var(--arcade-pink))`,
                boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
              }}>
              <Phone className="w-5 h-5 text-arcade-yellow" />
            </div>
            <span className="font-body font-bold text-white text-sm md:text-base tracking-widest transition-colors group-hover:text-arcade-yellow">+91 98765 43211</span>
          </div>

          <div className="flex gap-4 md:gap-6 mt-4">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-12 h-12 bg-zinc-950 border-2 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-1"
                style={{
                  borderColor: `hsl(var(--arcade-pink))`,
                  boxShadow: `2px 2px 0px 0px hsl(var(--arcade-cyan))`,
                }}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;
