import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo3.png"; // Combined MJ college logo

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Schedule", href: "#schedule" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b-4 border-arcade-pink" : "bg-background border-b-4 border-arcade-pink"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <a href="#" className="flex items-center group">
          <img
            src={logo}
            alt="Muffakham Jah College"
            className="h-10 md:h-12 w-auto"
          />
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-arcade text-[9px] uppercase text-foreground hover:text-arcade-yellow transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-arcade-pink"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t-4 border-arcade-pink px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-arcade text-[10px] uppercase text-foreground hover:text-arcade-yellow transition-colors border-b border-arcade-pink/20"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
