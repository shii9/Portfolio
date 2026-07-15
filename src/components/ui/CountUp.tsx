import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/animations";

/**
 * CountUp
 *
 * Animates a number from 0 up to its target value once, the first time it
 * scrolls into view. Any non-numeric prefix/suffix is preserved (e.g. the
 * "+" in "10+", or a leading "$"), and decimal precision is inferred from
 * the target string. Honors prefers-reduced-motion by rendering the final
 * value immediately.
 */
export default function CountUp({
  value,
  duration = 1.4,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  // Split "10+" -> prefix "", number 10, suffix "+". Memoized so the parsed
  // pieces keep a stable identity across renders — otherwise the effect below
  // would restart the animation from 0 on every frame.
  const parsed = useMemo(() => {
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
    if (!m) return null;
    return {
      prefix: m[1],
      target: parseFloat(m[2]),
      suffix: m[3],
      decimals: m[2].includes(".") ? m[2].split(".")[1].length : 0,
    };
  }, [value]);

  const target = parsed?.target ?? 0;
  const [display, setDisplay] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView || !parsed) return;
    if (reduced) {
      setDisplay(parsed.target);
      return;
    }
    const controls = animate(0, parsed.target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduced, parsed, duration]);

  // No number found — render the raw string untouched.
  if (!parsed) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {display.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}
