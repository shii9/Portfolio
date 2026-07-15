import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Download,
  Home,
  Wrench,
  FolderGit2,
  FlaskConical,
  Briefcase,
  Trophy,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navLinks = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Skills", href: "#skills", icon: Wrench },
  { name: "Projects", href: "#projects", icon: FolderGit2 },
  { name: "Research", href: "#research", icon: FlaskConical },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Achievements", href: "#achievements", icon: Trophy },
  { name: "Connect", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isManualScroll = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  // Decoupled pill position — moves instantly on click, independent of heavy theme transition
  const [pillIsDark, setPillIsDark] = useState(isDark);
  useEffect(() => { setPillIsDark(isDark); }, [isDark]);

  const themeTransitionRef = useRef(false);

  const handleThemeChange = useCallback((newTheme: string) => {
    if (resolvedTheme === newTheme || themeTransitionRef.current) return;
    themeTransitionRef.current = true;

    // Slide the pill immediately (decoupled from theme)
    setPillIsDark(newTheme === 'dark');

    const goingDark = newTheme === 'dark';

    // Capture the CURRENT theme's background color as a mask
    const currentBg = goingDark
      ? 'hsl(30, 20%, 98%)'   // current is light
      : 'hsl(20, 15%, 5%)';   // current is dark

    // Create a single mask panel — covers the screen with CURRENT theme color
    const mask = document.createElement('div');
    mask.className = 'theme-slide-overlay';
    mask.style.backgroundColor = currentBg;
    mask.style.transform = 'translateX(0)'; // fully covers screen

    document.documentElement.appendChild(mask);
    // Force reflow so the mask is painted before we change anything
    void mask.offsetHeight;

    // Switch the theme underneath the mask (user can't see it yet)
    setTheme(newTheme);

    // After theme paints, slide the mask away using GPU-accelerated transform
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mask.style.transition = 'transform 1s cubic-bezier(0.22, 1, 0.36, 1)';

        // Slide the mask off-screen
        if (goingDark) {
          mask.style.transform = 'translateX(100%)';
        } else {
          mask.style.transform = 'translateX(-100%)';
        }

        const cleanup = () => {
          mask.remove();
          themeTransitionRef.current = false;
        };
        mask.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, 1300); // fallback
      });
    });

  }, [resolvedTheme, setTheme]);



  const handleNavClick = (name: string) => {
    setActive(name);
    isManualScroll.current = true;

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 1000); // 1000ms matches the smooth scroll animation duration
  };

  // Lock body scroll while drawer is open, and broadcast its state so other
  // fixed overlays (e.g. the back-to-top button) can hide behind the drawer.
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.dispatchEvent(new CustomEvent("drawer-toggle", { detail: mobileMenuOpen }));
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const sections = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isManualScroll.current) {
            const link = navLinks.find((l) => l.href === `#${id}`);
            if (link) setActive(link.name);
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-[22px]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand */}
        <a href="#home" className="font-serif font-bold text-2xl tracking-tight text-foreground flex items-center">
          <span className="text-primary font-bold">/</span>
          <span>Sourov</span>
          <span className="text-primary font-bold">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1 border border-foreground/15 rounded-full p-1 bg-foreground/5 backdrop-blur-md h-11">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.name)}
                data-testid={`nav-${link.name.toLowerCase()}`}
                className={`relative flex items-center justify-center px-4 h-full rounded-full text-sm font-medium transition-all duration-200 ${active === link.name
                  ? "text-white"
                  : "text-foreground/55 hover:text-foreground hover:bg-foreground/10"
                  }`}
              >
                {active === link.name && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-primary border border-primary/60 shadow-[0_0_15px_rgba(255,107,53,0.15)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Theme Toggle (Desktop) */}
          <div className="relative flex items-center border border-foreground/15 rounded-full p-1 bg-foreground/5 backdrop-blur-md h-11 w-[88px]">
            {/* GPU-accelerated sliding pill */}
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-primary border border-primary/60 shadow-[0_0_15px_rgba(255,107,53,0.15)]"
              style={{ left: 4, willChange: 'transform' }}
              animate={{ x: pillIsDark ? '100%' : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`relative flex items-center justify-center flex-1 h-full rounded-full text-sm font-medium z-10 transition-colors duration-300 ${!pillIsDark ? 'text-white' : 'text-foreground/55 hover:text-foreground'}`}
                  aria-label="Light Mode"
                >
                  <Sun size={15} strokeWidth={2.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={12}>
                <p>Day</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`relative flex items-center justify-center flex-1 h-full rounded-full text-sm font-medium z-10 transition-colors duration-300 ${pillIsDark ? 'text-white' : 'text-foreground/55 hover:text-foreground'}`}
                  aria-label="Dark Mode"
                >
                  <Moon size={15} strokeWidth={2.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={12}>
                <p>Night</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <a
            href="/resume.pdf"
            download="Sourov_Hossen_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-download-resume"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/85 px-4 h-11 rounded-full transition-all duration-200 hover:shadow-[0_0_22px_rgba(255,107,53,0.45)]"
          >
            <Download size={16} />
            <span>Download Resume</span>
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden relative z-[60] flex items-center justify-center w-11 h-11 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/80 hover:text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          data-testid="button-mobile-menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop — no blur, just solid overlay for performance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[55] bg-black/60"
            />

            {/* Drawer Panel — reduced blur, GPU-optimized */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
              className="md:hidden fixed top-0 right-0 bottom-0 z-[56] w-[85%] max-w-sm bg-background border-l border-foreground/10 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.3)]"
              data-testid="mobile-drawer"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center">
                  <span className="text-primary font-bold">/</span>
                  <span className="font-serif font-bold text-xl text-foreground">Sourov</span>
                  <span className="text-primary font-bold">.</span>
                </div>
              </div>

              {/* Section label */}
              <div className="px-6 pt-2 pb-3">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary/80">
                  Navigation
                </p>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 pb-4">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = active === link.name;
                    return (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          onClick={() => {
                            handleNavClick(link.name);
                            setMobileMenuOpen(false);
                          }}
                          data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                          className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-medium transition-colors duration-150 ${isActive
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "text-foreground/75 hover:text-foreground hover:bg-foreground/5 border border-transparent"
                            }`}
                        >
                          <span
                            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150 ${isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-foreground/5 text-foreground/60 group-hover:bg-foreground/10 group-hover:text-foreground"
                              }`}
                          >
                            <Icon size={18} />
                          </span>
                          <span className="flex-1">{link.name}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>

                {/* Divider */}
                <div className="my-5 border-t border-foreground/10" />
              </nav>

              {/* Drawer footer with theme toggle + resume button */}
              <div className="mt-auto px-5 pt-4 pb-6 border-t border-foreground/10 bg-gradient-to-t from-black/5 to-transparent flex flex-col gap-3">

                {/* Theme Toggle (Mobile) */}
                <div className="relative flex items-center justify-center border border-foreground/10 rounded-full p-1.5 bg-foreground/5 w-full">
                  {/* GPU-accelerated sliding pill */}
                  <motion.div
                    className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full bg-primary border border-primary/60 shadow-[0_0_15px_rgba(255,107,53,0.15)]"
                    style={{ left: 6, willChange: 'transform' }}
                    animate={{ x: pillIsDark ? '100%' : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
                  />
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full z-10 transition-colors duration-300 ${!pillIsDark ? 'text-white' : 'text-foreground/55 hover:text-foreground'}`}
                    aria-label="Light Mode"
                  >
                    <Sun size={18} strokeWidth={2.5} />
                    <span className="text-sm font-medium">Day</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full z-10 transition-colors duration-300 ${pillIsDark ? 'text-white' : 'text-foreground/55 hover:text-foreground'}`}
                    aria-label="Dark Mode"
                  >
                    <Moon size={18} strokeWidth={2.5} />
                    <span className="text-sm font-medium">Night</span>
                  </button>
                </div>

                 <a
                  href="/resume.pdf"
                  download="Sourov_Hossen_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClickCapture={(e) => {
                    // Prevent closing the menu when clicking the button
                    e.stopPropagation();
                  }}
                  className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-white bg-primary hover:bg-primary/90 px-6 py-3.5 rounded-full transition-all hover:shadow-[0_0_24px_rgba(255,107,53,0.45)]"
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}