import { useEffect, useRef } from "react";

/**
 * CursorGlow — a soft radial glow that follows the mouse.
 *
 * Performance notes:
 * - No React re-renders: position is written directly to the DOM
 *   via `transform: translate3d()` inside a requestAnimationFrame loop.
 * - Lerp smoothing gives a premium "trailing light" feel.
 * - Disabled on touch devices (no hover) and when reduced motion is set.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on devices with a real hover pointer (desktop)
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    const el = glowRef.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const tick = () => {
      // Smooth trailing (lerp) — snappy but soft
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[1] pointer-events-none opacity-0 transition-opacity duration-500"
      style={{
        width: "38rem",
        height: "38rem",
        willChange: "transform",
        background:
          "radial-gradient(circle, rgba(255,107,53,0.22) 0%, rgba(255,107,53,0.10) 30%, transparent 65%)",
        filter: "blur(16px)",
      }}
    />
  );
}
