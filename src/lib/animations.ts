/**
 * Shared Animation Presets
 * 
 * Single source of truth for all scroll-reveal and entrance animations.
 * Uses one easing curve (expo-out) and standardized timing throughout.
 */

import type { Variants, Transition } from "framer-motion";

// ─── Core Easing ────────────────────────────────────────────────────
// Smooth ease-out (quint-style): gentle glide that eases into a soft
// settle. Tuned for calm, premium scroll reveals rather than a snappy pop.
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Durations ──────────────────────────────────────────────────────
// Longer than a basic fade so content visibly glides into place.
export const DURATION = {
  fast: 0.55,
  normal: 0.85,
  slow: 1.05,
} as const;

// ─── Blur amounts ───────────────────────────────────────────────────
// A gentle focus-in adds a premium, "materializing" quality to reveals
// (content resolves as it rises rather than just fading). Kept modest so
// paint stays cheap — entrances run once, so cost is one-time.
export const BLUR = {
  soft: "blur(6px)",
  none: "blur(0px)",
} as const;

// ─── Stagger Config ─────────────────────────────────────────────────
export const STAGGER = {
  fast: 0.06,
  normal: 0.09,
  slow: 0.12,
} as const;

// ─── Viewport Config ────────────────────────────────────────────────
// Reveal a touch earlier so elements are already gliding by the time
// they're comfortably in view — reads smoother during a scroll.
export const VIEWPORT = {
  once: true,
  margin: "-80px" as const,
};

// ─── Reusable Transition ────────────────────────────────────────────
export const smoothTransition = (delay = 0): Transition => ({
  duration: DURATION.normal,
  ease: EASE_OUT,
  delay,
});

// ─── Container (for stagger children) ───────────────────────────────
export const staggerContainer = (
  stagger: number = STAGGER.normal,
  delayChildren: number = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

// ─── Fade Up (most common — cards, headers, content blocks) ─────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44, filter: BLUR.soft },
  show: {
    opacity: 1,
    y: 0,
    filter: BLUR.none,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT,
    },
  },
};

// ─── Fade Up (for whileInView usage — single elements) ──────────────
export const fadeUpProps = (delay = 0) => ({
  initial: { opacity: 0, y: 44, filter: BLUR.soft },
  whileInView: { opacity: 1, y: 0, filter: BLUR.none },
  viewport: VIEWPORT,
  transition: smoothTransition(delay),
});

// ─── Subtle Fade Up (minimal rise — professional, calm entrance) ──────
// Even more restrained than fadeSoftProps. Small travel + gentle settle,
// for dense content sections (credentials, certifications, papers).
// Reads as polished and premium without visible sweep.
export const fadeSubtleProps = (delay = 0) => ({
  initial: { opacity: 0, y: 22, filter: BLUR.soft },
  whileInView: { opacity: 1, y: 0, filter: BLUR.none },
  viewport: VIEWPORT,
  transition: smoothTransition(delay),
});

// ─── Soft Reveal (minimal rise — dense timeline / list sections) ────
// A restrained "little" lift: small travel + gentle settle, for
// sections that shouldn't visibly sweep in (certifications, papers,
// write-ups). Reads as calm and professional.
export const fadeSoftProps = (delay = 0) => ({
  initial: { opacity: 0, y: 30, filter: BLUR.soft },
  whileInView: { opacity: 1, y: 0, filter: BLUR.none },
  viewport: VIEWPORT,
  transition: smoothTransition(delay),
});

// ─── Fade Left (timeline items) ─────────────────────────────────────
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT,
    },
  },
};

export const fadeLeftProps = (delay = 0) => ({
  initial: { opacity: 0, x: -24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: VIEWPORT,
  transition: smoothTransition(delay),
});

// ─── Fade Right (timeline items from right) ──────────────────────────
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASE_OUT,
    },
  },
};

export const fadeRightProps = (delay = 0) => ({
  initial: { opacity: 0, x: 24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: VIEWPORT,
  transition: smoothTransition(delay),
});

// ─── Scale In (hero image, featured elements) ───────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASE_OUT,
    },
  },
};

export const scaleInProps = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: VIEWPORT,
  transition: {
    duration: DURATION.slow,
    ease: EASE_OUT,
    delay,
  },
});

// ─── Stagger Items (for mapped lists) ───────────────────────────────
export const staggerItemProps = (index: number, stagger = STAGGER.normal) => ({
  initial: { opacity: 0, y: 44, filter: BLUR.soft },
  whileInView: { opacity: 1, y: 0, filter: BLUR.none },
  viewport: VIEWPORT,
  transition: smoothTransition(Math.min(index * stagger, 0.45)), // cap at 450ms
});

// ─── Interactive Micro-interactions ─────────────────────────────────
// Hover/tap physics live here so every interactive card shares the same
// feel. A snappy spring (not the entrance expo curve) makes pointer
// feedback feel immediate and premium. Respects reduced-motion via CSS.
export const SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.7,
};

// Card lift — subtle rise + scale for primary cards (projects, research,
// skills, achievements, experience, about).
export const hoverLift = {
  whileHover: { y: -6, scale: 1.02, transition: SPRING },
  whileTap: { scale: 0.985, transition: SPRING },
};

// Softer lift — for smaller tiles / list rows (social links, compact cards).
export const hoverLiftSm = {
  whileHover: { y: -3, scale: 1.015, transition: SPRING },
  whileTap: { scale: 0.99, transition: SPRING },
};

// Combines a scroll-reveal entrance with the card-lift interaction in one
// spread. Entrance uses the shared expo curve; hover/tap use the spring.
export const revealLift = (index = 0, stagger = STAGGER.normal) => ({
  ...staggerItemProps(index, stagger),
  ...hoverLift,
});

// ─── Fade + Scale (no vertical travel) ──────────────────────────────
// For cards where an upward slide isn't wanted — content settles in
// place with a gentle scale/opacity. Reads calmer than a rise.
export const fadeScaleProps = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.96, filter: BLUR.soft },
  whileInView: { opacity: 1, scale: 1, filter: BLUR.none },
  viewport: VIEWPORT,
  transition: smoothTransition(delay),
});

export const staggerScaleProps = (index: number, stagger = STAGGER.normal) => ({
  initial: { opacity: 0, scale: 0.94, y: 24, filter: BLUR.soft },
  whileInView: { opacity: 1, scale: 1, y: 0, filter: BLUR.none },
  viewport: VIEWPORT,
  transition: smoothTransition(Math.min(index * stagger, 0.45)),
});

// Fade+scale entrance combined with the card-lift interaction.
export const revealScaleLift = (index = 0, stagger = STAGGER.normal) => ({
  ...staggerScaleProps(index, stagger),
  ...hoverLift,
});
