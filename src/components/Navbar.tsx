import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo3.png";

const navLinks = [
  { label: "ABOUT", href: "#about" },
  { label: "HISTORY", href: "#history" },
  { label: "EVENTS", href: "#events" },
  { label: "SCHEDULE", href: "#schedule" },
  { label: "FAQ", href: "#faq" },
  { label: "CONTACT", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Track section in view for highlighting nav link
  useEffect(() => {
    const handleSectionScroll = () => {
      let found = false;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const link = navLinks[i];
        const id = link.href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) { // 80px offset for navbar height
            setActiveLink(link.label);
            found = true;
            break;
          }
        }
      }
      if (!found) setActiveLink(null);
    };
    window.addEventListener('scroll', handleSectionScroll, { passive: true });
    // Run once on mount
    handleSectionScroll();
    return () => window.removeEventListener('scroll', handleSectionScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      
      if (mobileOpen) {
        setMobileOpen(false);
        // Wait for the menu closing animation
        setTimeout(() => {
          elem?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        elem?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar if scrolled to top
      if (currentScrollY < 50) {
        setIsVisible(true);
        setScrolled(false);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide navbar
        setIsVisible(false);
        setScrolled(true);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
        setScrolled(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-black/30 backdrop-blur-xl border-b border-arcade-pink/30" 
          : "bg-black/20"
      }`}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "-100%" }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {/* THIN TOP ACCENT LINE */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-arcade-yellow" />

      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* LOGO */}
        <motion.a
          href="#"
          className="flex items-center flex-shrink-0"
          whileHover={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={logo}
            alt="Adsophos 2026"
            className="h-12 w-auto"
          />
        </motion.a>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-12 cursor-pointer">
          {navLinks.map((link, idx) => (
            <motion.div
              key={link.href}
              className="relative"
              onMouseEnter={() => setActiveLink(link.label)}
              onMouseLeave={() => setActiveLink(null)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[10px] font-arcade uppercase tracking-widest transition-all duration-300 ${
                  activeLink === link.label
                    ? "text-arcade-yellow"
                    : "text-foreground/70 hover:text-arcade-cyan"
                }`}
              >
                {link.label}
              </a>

              {/* BOTTOM BORDER INDICATOR */}
              <motion.div
                className="absolute -bottom-1 left-0 h-[3px] bg-arcade-cyan"
                initial={false}
                animate={activeLink === link.label ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* REGISTER BUTTON - Arcade Retro Style */}
          <Button asChild variant="default" className="hidden md:flex font-arcade text-[10px] tracking-[0.2em] px-6 py-3 bg-transparent border-2 border-arcade-pink text-arcade-yellow hover:bg-arcade-yellow hover:text-white transition-all duration-300 rounded-none">
            <a href="#events" onClick={(e) => handleNavClick(e, '#events')}>REGISTER</a>
          </Button>

          {/* MOBILE TOGGLE */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2  hover:border-arcade-pink transition-colors duration-300"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileOpen ? (
              <X size={20} className="text-arcade-yellow" strokeWidth={2.5} />
            ) : (
              <Menu size={20} className="text-arcade-pink" strokeWidth={2.5} />
            )}
          </motion.button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden border-t border-arcade-pink/20 bg-black/20 backdrop-blur-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-6 py-5 border-b border-arcade-pink/20 text-[10px] font-arcade uppercase tracking-[0.2em] text-foreground/80 hover:text-arcade-cyan hover:bg-arcade-cyan/10 transition-colors duration-300 last:border-b-0"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* MOBILE CTA */}
              <Button asChild variant="default" className="mx-6 my-6 px-6 py-3 font-arcade text-[10px] tracking-[0.2em] text-center bg-transparent border-2 border-arcade-pink text-arcade-pink hover:bg-arcade-pink hover:text-white transition-all rounded-none">
                <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>REGISTER</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
