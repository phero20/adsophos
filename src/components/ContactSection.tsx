import { motion } from "framer-motion";
import { Mail, Phone, Instagram, Linkedin, Twitter } from "lucide-react";

const ContactSection = () => (
  <section id="contact" className="relative py-20 px-4">
    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-display text-4xl md:text-6xl text-center text-arcade-pink mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        NEED HELP?
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-sm uppercase tracking-widest">
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
