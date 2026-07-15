import { motion } from "framer-motion";
import { fadeUpProps } from "@/lib/animations";

/**
 * Shared layout primitives
 *
 * Single source of truth for section structure so every section shares the
 * same responsive rhythm, heading scale, and decorative treatment.
 */

// ─── Decorative glow blob ───────────────────────────────────────────
// Mobile-safe: smaller footprint + lighter blur on phones (cheaper paint),
// scales up on larger screens. Positioned relative to the section.
type BlobPosition = "left" | "right" | "center";

const blobPosition: Record<BlobPosition, string> = {
  left: "left-0 top-1/2 -translate-y-1/2",
  right: "right-0 top-1/2 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

export function GlowBlob({
  position = "left",
  className = "",
}: {
  position?: BlobPosition;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute ${blobPosition[position]} w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none ${className}`}
    />
  );
}

// ─── Section shell ──────────────────────────────────────────────────
// pt-24 (96px) preserves the fixed-navbar anchor offset; md:pt-28 adds
// breathing room on desktop. One place controls vertical rhythm.
export function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`pt-24 md:pt-28 pb-8 md:pb-10 relative ${className}`}>
      {children}
    </section>
  );
}

// ─── Main section heading (eyebrow + H2 + underline) ────────────────
export function SectionHeading({
  eyebrow,
  title,
  centered = false,
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  centered?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      {...fadeUpProps()}
      className={`mb-10 ${centered ? "text-center" : ""} ${className}`}
    >
      <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-3">
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground">
        {title}
      </h2>
      <div
        className={`h-1 w-20 bg-primary rounded-full mt-5 ${centered ? "mx-auto" : ""}`}
      />
    </motion.div>
  );
}

// ─── Sub heading (eyebrow + H3 + smaller underline) ─────────────────
export function SubHeading({
  eyebrow,
  title,
  delay = 0,
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div {...fadeUpProps(delay)} className={`mb-10 ${className}`}>
      <p className="text-primary font-semibold text-xs tracking-widest uppercase mb-2">
        {eyebrow}
      </p>
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
        {title}
      </h3>
      <div className="h-0.5 w-12 bg-primary/60 rounded-full mt-3" />
    </motion.div>
  );
}
