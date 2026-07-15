import { useEffect, useRef, useCallback } from "react";

interface Fragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function CrackCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const fragmentsRef = useRef<Fragment[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const isActiveRef = useRef(false); // Track if there's anything to draw

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const spawnFragments = useCallback((x: number, y: number, speed: number) => {
    const now = performance.now();
    if (now - lastSpawnRef.current < 50) return; // throttle spawning
    lastSpawnRef.current = now;

    const count = Math.min(Math.floor(speed / 10), 3);
    if (count === 0) return;

    const fragments = fragmentsRef.current;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const ejectionSpeed = 0.3 + Math.random() * 0.8;
      const life = 25 + Math.random() * 20;

      fragments.push({
        x,
        y,
        vx: Math.cos(angle) * ejectionSpeed,
        vy: Math.sin(angle) * ejectionSpeed,
        size: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        opacity: 0.5 + Math.random() * 0.3,
        life,
        maxLife: life,
      });
    }

    // Cap total fragments for performance
    if (fragments.length > 40) {
      fragmentsRef.current = fragments.slice(-40);
    }
    isActiveRef.current = true;
  }, []);

  const drawTriangle = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.moveTo(0, -size * 0.6);
      ctx.lineTo(size * 0.5, size * 0.4);
      ctx.lineTo(-size * 0.5, size * 0.3);
      ctx.closePath();

      ctx.fillStyle = "rgba(255, 107, 53, 0.15)";
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 107, 53, ${opacity * 0.7})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    },
    []
  );

  useEffect(() => {
    // Skip entirely if user prefers reduced motion
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Add trail point (reduced from 20 to 12 max)
      trailRef.current.push({ x: mouse.x, y: mouse.y, age: 0 });
      if (trailRef.current.length > 12) {
        trailRef.current.shift();
      }

      if (speed > 8) {
        spawnFragments(mouse.x, mouse.y, speed);
      }
      isActiveRef.current = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const animate = () => {
      const trail = trailRef.current;
      const fragments = fragmentsRef.current;

      // Skip rendering when nothing to draw
      if (!isActiveRef.current && trail.length === 0 && fragments.length === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Draw trail line ---
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
          trail[i].age += 1;
        }
        trail[0].age += 1;

        ctx.strokeStyle = "rgba(255, 107, 53, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Micro-crack lines (every 4th point only)
        for (let i = 0; i < trail.length; i += 4) {
          const p = trail[i];
          const fadeAlpha = Math.max(0, 1 - p.age / 25);
          if (fadeAlpha <= 0) continue;

          for (let j = 0; j < 2; j++) {
            const crackAngle = Math.random() * Math.PI * 2;
            const crackLen = 6 + Math.random() * 10;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(
              p.x + Math.cos(crackAngle) * crackLen,
              p.y + Math.sin(crackAngle) * crackLen
            );
            ctx.strokeStyle = `rgba(255, 107, 53, ${fadeAlpha * 0.18})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        trailRef.current = trail.filter((p) => p.age < 25);
      }

      // --- Draw and update fragments ---
      for (let i = fragments.length - 1; i >= 0; i--) {
        const f = fragments[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vx *= 0.97;
        f.vy *= 0.97;
        f.rotation += f.rotationSpeed;
        f.life -= 1;

        const lifeRatio = f.life / f.maxLife;
        const currentOpacity = f.opacity * lifeRatio;

        if (f.life <= 0) {
          fragments.splice(i, 1);
          continue;
        }

        drawTriangle(ctx, f.x, f.y, f.size, f.rotation, currentOpacity);
      }

      // If nothing left, mark inactive so we skip future frames
      if (trail.length === 0 && fragments.length === 0) {
        isActiveRef.current = false;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [spawnFragments, drawTriangle, prefersReducedMotion]);

  // Don't render canvas at all if reduced motion
  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
