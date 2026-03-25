import logo from "@/assets/adsophos-logo.png";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-10 px-4">
    <div className="container mx-auto max-w-4xl flex flex-col items-center gap-4">
      <img src={logo} alt="ADSOPHOS 2026" className="h-12 w-auto" />
      <span className="font-display font-bold text-foreground">ADSOPHOS 2026</span>
      <div className="flex gap-4">
        {[Instagram, Twitter, Linkedin].map((Icon, i) => (
          <a
            key={i}
            href="#"
            className="text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-body">
        © 2026 ADSOPHOS. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
