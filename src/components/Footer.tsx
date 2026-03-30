import logo from "@/assets/adsophos-logo.png";
import { Instagram } from "lucide-react";

const Footer = () => (
  <footer className="border-t-4 border-arcade-pink py-12 px-4  relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>
    <div className="container mx-auto max-w-7xl relative z-10">
      <div className="grid md:grid-cols-3 gap-10 items-center">
        {/* Brand */}
        <div className="flex items-center md:items-start gap-4">
          <img src={logo} alt="ADSOPHOS 2026" className="h-20 w-auto drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-transform hover:scale-105" />
          <span className="font-arcade text-arcade-pink text-xl md:text-2xl tracking-widest" style={{ textShadow: "3px 3px 0px rgba(0,0,0,1)" }}>
            ADSOPHOS <br /> <span className="text-arcade-yellow">2026</span>
          </span>
        </div>

        {/* Links */}
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

        {/* Social */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/adsophos_cse?igsh=Ymt6cnF2eDBoeGho"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 bg-zinc-950 border-2 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 hover:-translate-y-1"
              style={{
                borderColor: `hsl(var(--arcade-pink))`,
                boxShadow: `3px 3px 0px 0px hsl(var(--arcade-cyan))`,
              }}
            >
              <Instagram size={16} />
            </a>
          </div>
          <p className="font-body font-bold text-[10px] text-zinc-600 tracking-widest uppercase">
            © 2026 ADSOPHOS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
