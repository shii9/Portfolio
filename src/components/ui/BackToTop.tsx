import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { SPRING } from "@/lib/animations";

/**
 * Back-to-Top Button
 *
 * Fades and scales in once the user has scrolled past a threshold, then
 * smooth-scrolls back to the top of the page. Reuses the shared spring so
 * its hover/tap feedback matches every other interactive element.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide while the mobile nav drawer is open so the arrow doesn't sit on top of it.
  useEffect(() => {
    const onDrawer = (e: Event) => setDrawerOpen((e as CustomEvent<boolean>).detail);
    window.addEventListener("drawer-toggle", onDrawer as EventListener);
    return () => window.removeEventListener("drawer-toggle", onDrawer as EventListener);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && !drawerOpen && (
        <motion.button
          key="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
          data-testid="button-back-to-top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          whileHover={{ y: -3, scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white border border-primary/60 shadow-[0_0_22px_rgba(255,107,53,0.4)] hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
