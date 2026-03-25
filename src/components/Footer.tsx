import logo from "@/assets/adsophos-logo.png";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="border-t-4 border-arcade-pink py-10 px-4 bg-card">
    <div className="container mx-auto max-w-5xl">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <img src={logo} alt="ADSOPHOS 2026" className="h-12 w-auto" />
          <span className="font-display text-arcade-pink text-lg">ADSOPHOS 2026</span>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-2 text-center">
          {["About", "Events", "Schedule", "Register", "Sponsors", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-arcade text-[7px] text-muted-foreground hover:text-arcade-yellow transition-colors uppercase"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-3">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 bg-background pixel-border flex items-center justify-center text-muted-foreground hover:text-arcade-yellow transition-colors"
                style={{ borderWidth: 2, boxShadow: '2px 2px 0 hsl(340 100% 57%)' }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
          <p className="font-arcade text-[6px] text-muted-foreground">
            © 2026 ADSOPHOS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
