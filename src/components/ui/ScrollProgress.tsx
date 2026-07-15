import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Scroll Progress Bar
 *
 * A thin, GPU-accelerated bar fixed to the very top of the viewport that
 * fills left-to-right as the page scrolls. The raw scroll progress is
 * spring-smoothed so the bar glides rather than snapping — reads as calm
 * and premium. Purely decorative, so it's hidden from assistive tech.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  // Gentle spring so the fill trails the scroll ever so slightly.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary/70 via-primary to-primary/70 shadow-[0_0_10px_rgba(255,107,53,0.5)]"
    />
  );
}
