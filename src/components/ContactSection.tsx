import { motion } from "framer-motion";
import { Mail, Phone, Instagram, Linkedin, Twitter } from "lucide-react";

const ContactSection = () => (
  <section id="contact" className="relative py-24 px-4">
    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-arcade text-lg md:text-2xl text-center text-glow-pink mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Need Help?
      </motion.h2>
      <p className="text-center text-muted-foreground mb-14 font-body text-lg">
        Reach out to the game masters
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact form */}
        <motion.div
          className="bg-card rounded-xl p-6 neon-border"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-body border border-border focus:border-neon-cyan focus:outline-none transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-body border border-border focus:border-neon-cyan focus:outline-none transition-colors"
            />
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-body border border-border focus:border-neon-cyan focus:outline-none transition-colors resize-none"
            />
            <button className="w-full font-display font-bold text-sm py-3 rounded-lg bg-neon-pink/10 text-neon-pink neon-border-pink hover:bg-neon-pink/20 transition-all">
              SEND MESSAGE
            </button>
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div
          className="flex flex-col justify-center gap-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-neon-cyan" />
            <span className="font-body text-foreground">adsophos2026@college.edu</span>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-neon-cyan" />
            <span className="font-body text-foreground">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-neon-cyan" />
            <span className="font-body text-foreground">+91 98765 43211</span>
          </div>

          <div className="flex gap-4 mt-4">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-lg bg-card neon-border flex items-center justify-center text-muted-foreground hover:text-neon-cyan hover:neon-glow transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;
