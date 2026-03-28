import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, Instagram, Linkedin, Twitter } from "lucide-react";

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
    <div className="container mx-auto max-w-4xl">
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
        Reach out to the game masters
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="bg-card p-6 pixel-border"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 bg-secondary text-foreground font-body text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-secondary text-foreground font-body text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors"
            />
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full px-4 py-3 bg-secondary text-foreground font-body text-sm border-2 border-arcade-pink/30 focus:border-arcade-pink focus:outline-none transition-colors resize-none"
            />
            <button className="w-full font-arcade text-[10px] py-3 bg-arcade-yellow text-background pixel-btn-yellow">
              SEND MESSAGE
            </button>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center gap-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-card pixel-border flex items-center justify-center">
              <Mail className="w-4 h-4 text-arcade-pink" />
            </div>
            <span className="font-body text-foreground text-sm">adsophos2026@college.edu</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-card pixel-border flex items-center justify-center">
              <Phone className="w-4 h-4 text-arcade-pink" />
            </div>
            <span className="font-body text-foreground text-sm">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-card pixel-border flex items-center justify-center">
              <Phone className="w-4 h-4 text-arcade-pink" />
            </div>
            <span className="font-body text-foreground text-sm">+91 98765 43211</span>
          </div>

          <div className="flex gap-3 mt-4">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 bg-card pixel-border flex items-center justify-center text-muted-foreground hover:text-arcade-yellow transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;
