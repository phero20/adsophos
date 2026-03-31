import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/adsophos-logo.png";
import { ChevronDown, Github, Instagram, Sparkles } from "lucide-react";

const developers = [
  {
    name: "Shxreef603",
    url: "https://github.com/Shxreef603",
    accent: "from-arcade-pink/35 via-arcade-pink/10 to-transparent",
  },
  {
    name: "phero20",
    url: "https://github.com/phero20",
    accent: "from-arcade-cyan/35 via-arcade-cyan/10 to-transparent",
  },
];

const Footer = () => {
  const [showDevelopers, setShowDevelopers] = useState(false);

  return (
    <footer className="border-t-4 border-arcade-pink py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-arcade-cyan to-transparent opacity-80" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid md:grid-cols-3 gap-10 items-center">
          <div className="flex items-center md:items-start gap-4">
            <img
              src={logo}
              alt="ADSOPHOS 2026"
              className="h-20 w-auto drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-transform hover:scale-105"
            />
            <span
              className="font-arcade text-arcade-pink text-xl md:text-2xl tracking-widest"
              style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}
            >
              ADSOPHOS <br /> <span className="text-arcade-yellow">2026</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-10 text-center md:text-left mx-auto">
            {["Home", "About", "Events", "FAQ", "Contact"].map((link) => (
              <a
                key={link}
                href={link === "Home" ? "#home" : `#${link.toLowerCase()}`}
                className="font-body font-bold text-xs tracking-[0.15em] text-zinc-400 hover:text-arcade-yellow transition-all hover:-translate-y-1 uppercase"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <a
                href="https://www.instagram.com/adsophos_cse?igsh=Ymt6cnF2eDBoeGho"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-zinc-950 border-2 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-1"
                style={{
                  borderColor: "hsl(var(--arcade-pink))",
                  boxShadow: "3px 3px 0px 0px hsl(var(--arcade-cyan))",
                }}
                aria-label="Open Instagram"
              >
                <Instagram size={16} />
              </a>

              <motion.button
                type="button"
                onClick={() => setShowDevelopers((current) => !current)}
                className="group relative overflow-hidden min-h-10 px-4 bg-zinc-950 border-2 border-arcade-yellow text-arcade-yellow font-arcade text-[9px] uppercase tracking-[0.2em] flex items-center gap-2"
                style={{ boxShadow: "3px 3px 0px 0px hsl(var(--arcade-pink))" }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-expanded={showDevelopers}
                aria-controls="developer-panel"
              >
                <motion.span
                  className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(34,211,238,0.35)_35%,transparent_70%)]"
                  animate={{ x: ["-140%", "140%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={14} className="text-arcade-cyan" />
                  Show Developers
                  <motion.span animate={{ rotate: showDevelopers ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </span>
              </motion.button>
            </div>

            <AnimatePresence initial={false}>
              {showDevelopers && (
                <motion.div
                  id="developer-panel"
                  initial={{ opacity: 0, y: -14, scaleY: 0.85 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -12, scaleY: 0.9 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[320px] origin-top"
                >
                  <div className="relative overflow-hidden border-2 border-arcade-cyan bg-zinc-950/95 p-3 shadow-[4px_4px_0px_hsl(var(--arcade-pink))]">
                    <motion.div
                      className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(236,72,153,0.12)_45%,transparent_100%)]"
                      animate={{ y: ["-100%", "100%"] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative z-10">
                      <div className="mb-3 flex items-center gap-2 font-arcade text-[9px] uppercase tracking-[0.25em] text-arcade-cyan">
                        <Github size={13} />
                        Dev Credits
                      </div>

                      <div className="space-y-3">
                        {developers.map((developer, index) => (
                          <motion.a
                            key={developer.name}
                            href={developer.url}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 + index * 0.08, duration: 0.24 }}
                            className={`group relative flex items-center justify-between gap-3 overflow-hidden border border-zinc-700 bg-gradient-to-r ${developer.accent} px-3 py-3 text-left transition-transform hover:-translate-y-1`}
                          >
                            <div className="absolute inset-y-0 left-0 w-1 bg-arcade-yellow" />
                            <div className="pl-3">
                              <p className="font-arcade text-[10px] uppercase tracking-[0.18em] text-white">
                                {developer.name}
                              </p>
                              <p className="mt-1 font-mono text-[10px] text-zinc-400">
                                github.com/{developer.name}
                              </p>
                            </div>
                            <Github
                              size={16}
                              className="shrink-0 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                            />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="font-body font-bold text-[10px] text-zinc-600 tracking-widest uppercase">
              © 2026 ADSOPHOS. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
