/**
 * CyberHexGrid — Pure CSS-animated version
 * 
 * Replaces 9 individual framer-motion animate calls with
 * a single CSS @keyframes hex-pulse animation with staggered delays.
 */

const hexPath = (cx: number, cy: number, r: number) => {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });
  return `M${points.join("L")}Z`;
};

const hexagons = [
  { cx: 60, cy: 60, r: 30, delay: 0, opacity: 0.6 },
  { cx: 115, cy: 60, r: 30, delay: 0.3, opacity: 0.3 },
  { cx: 170, cy: 60, r: 30, delay: 0.6, opacity: 0.5 },
  { cx: 87.5, cy: 112, r: 30, delay: 0.15, opacity: 0.4 },
  { cx: 142.5, cy: 112, r: 30, delay: 0.45, opacity: 0.7 },
  { cx: 197.5, cy: 112, r: 30, delay: 0.75, opacity: 0.3 },
  { cx: 60, cy: 164, r: 30, delay: 0.2, opacity: 0.5 },
  { cx: 115, cy: 164, r: 30, delay: 0.5, opacity: 0.35 },
  { cx: 170, cy: 164, r: 30, delay: 0.8, opacity: 0.6 },
];

export default function CyberHexGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 210"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {hexagons.map((hex, i) => (
        <path
          key={i}
          d={hexPath(hex.cx, hex.cy, hex.r - 3)}
          stroke="rgba(255,107,53,0.3)"
          strokeWidth="1"
          fill="rgba(255,107,53,0.03)"
          className="hex-pulse"
          style={{
            ["--hex-opacity-min" as string]: hex.opacity * 0.4,
            ["--hex-opacity-max" as string]: hex.opacity,
            ["--hex-fill-peak" as string]: hex.opacity * 0.08,
            ["--hex-duration" as string]: `${2.5 + i * 0.3}s`,
            animationDelay: `${hex.delay}s`,
          }}
        />
      ))}
    </svg>
  );
}
