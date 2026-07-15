/**
 * CyberShield3D — Pure CSS-animated version
 * 
 * All infinite animations use CSS keyframes (GPU-composited)
 * instead of framer-motion (JS-thread spring physics).
 */

export default function CyberShield3D() {
  const nodeCount = 8;
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2;
    return {
      x: 50 + Math.cos(angle) * 34,
      y: 50 + Math.sin(angle) * 34,
    };
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 24px rgba(255,107,53,0.25))" }}
      >
        <defs>
          <radialGradient id="shieldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,107,53,0.25)" />
            <stop offset="100%" stopColor="rgba(255,107,53,0)" />
          </radialGradient>
          <radialGradient id="coreGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(255,140,80,0.9)" />
            <stop offset="60%" stopColor="rgba(255,107,53,0.6)" />
            <stop offset="100%" stopColor="rgba(200,60,20,0.4)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="shieldClip">
            <path d="M150,30 L250,80 L250,160 Q250,230 150,270 Q50,230 50,160 L50,80 Z" />
          </clipPath>
        </defs>

        {/* Outer ambient glow */}
        <circle cx="150" cy="150" r="130" fill="url(#shieldGrad)" />

        {/* Rotating orbit rings — CSS animated */}
        {[120, 100, 82].map((r, i) => (
          <circle
            key={i}
            cx="150"
            cy="150"
            r={r}
            fill="none"
            stroke="rgba(255,107,53,0.12)"
            strokeWidth="1"
            strokeDasharray={i % 2 === 0 ? "4 8" : "2 12"}
            className={i % 2 === 0 ? "orbit-cw" : "orbit-ccw"}
            style={{
              transformOrigin: "150px 150px",
              ["--orbit-duration" as string]: `${20 + i * 8}s`,
            }}
          />
        ))}

        {/* Orbiting data nodes — CSS animated */}
        {nodes.map((_, i) => {
          const angle = (i / nodeCount) * 360;
          return (
            <g
              key={i}
              className="orbit-cw"
              style={{
                transformOrigin: "150px 150px",
                ["--orbit-duration" as string]: "18s",
                animationDelay: `${-(i / nodeCount) * 18}s`,
              }}
            >
              <circle
                cx={150 + Math.cos((angle * Math.PI) / 180) * 100}
                cy={150 + Math.sin((angle * Math.PI) / 180) * 100}
                r={i % 3 === 0 ? 4 : 2.5}
                fill={i % 3 === 0 ? "rgba(255,107,53,0.9)" : "rgba(255,180,100,0.7)"}
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* Connection lines to center — CSS animated dashes */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * 360;
          const x2 = 150 + Math.cos((a * Math.PI) / 180) * 80;
          const y2 = 150 + Math.sin((a * Math.PI) / 180) * 80;
          return (
            <line
              key={i}
              x1="150"
              y1="150"
              x2={x2}
              y2={y2}
              stroke="rgba(255,107,53,0.15)"
              strokeWidth="1"
              strokeDasharray="3 6"
              className="dash-scroll"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          );
        })}

        {/* Shield body — CSS pulse */}
        <path
          d="M150,38 L242,82 L242,158 Q242,224 150,262 Q58,224 58,158 L58,82 Z"
          fill="rgba(20,12,6,0.7)"
          stroke="rgba(255,107,53,0.5)"
          strokeWidth="1.5"
          filter="url(#softGlow)"
          className="pulse-glow"
          style={{ ["--pulse-duration" as string]: "3s" }}
        />

        {/* Shield inner gradient fill */}
        <path
          d="M150,38 L242,82 L242,158 Q242,224 150,262 Q58,224 58,158 L58,82 Z"
          fill="url(#coreGrad)"
          opacity="0.15"
        />

        {/* Shield inner border */}
        <path
          d="M150,55 L228,93 L228,158 Q228,212 150,246 Q72,212 72,158 L72,93 Z"
          fill="none"
          stroke="rgba(255,107,53,0.25)"
          strokeWidth="1"
        />

        {/* Shield center lock icon */}
        <g transform="translate(150,150)">
          {/* Lock body */}
          <rect
            x="-22"
            y="-10"
            width="44"
            height="34"
            rx="5"
            fill="rgba(255,107,53,0.15)"
            stroke="rgba(255,107,53,0.7)"
            strokeWidth="1.5"
            filter="url(#glow)"
            className="pulse-glow"
            style={{ ["--pulse-duration" as string]: "2s" }}
          />
          {/* Lock shackle */}
          <path
            d="M-12,-10 L-12,-22 Q-12,-36 0,-36 Q12,-36 12,-22 L12,-10"
            fill="none"
            stroke="rgba(255,107,53,0.7)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#glow)"
            className="pulse-glow"
            style={{ ["--pulse-duration" as string]: "2s", animationDelay: "0.3s" }}
          />
          {/* Lock keyhole */}
          <circle cx="0" cy="9" r="5" fill="rgba(255,107,53,0.5)" />
          <rect x="-2" y="9" width="4" height="7" rx="2" fill="rgba(255,107,53,0.5)" />
        </g>

        {/* Scanning line effect — CSS animated */}
        <rect
          x="58"
          y="38"
          width="184"
          height="2"
          fill="rgba(255,107,53,0.4)"
          clipPath="url(#shieldClip)"
          className="scan-line"
          style={{ filter: "blur(1px)" }}
        />

        {/* Corner hex indicators — CSS pulse */}
        {[
          { x: 58, y: 82, angle: -30 },
          { x: 242, y: 82, angle: 30 },
        ].map((pos, i) => (
          <polygon
            key={i}
            points="0,-8 6.9,-4 6.9,4 0,8 -6.9,4 -6.9,-4"
            transform={`translate(${pos.x},${pos.y}) rotate(${pos.angle})`}
            fill="rgba(255,107,53,0.2)"
            stroke="rgba(255,107,53,0.5)"
            strokeWidth="1"
            className="pulse-glow"
            style={{
              ["--pulse-duration" as string]: "1.5s",
              animationDelay: `${i * 0.75}s`,
            }}
          />
        ))}

        {/* Status text — CSS pulse */}
        <text
          x="150"
          y="285"
          textAnchor="middle"
          fill="rgba(255,107,53,0.6)"
          fontSize="9"
          fontFamily="'Outfit', monospace"
          letterSpacing="3"
          className="pulse-glow"
          style={{ ["--pulse-duration" as string]: "2s" }}
        >
          SYSTEM SECURED
        </text>
      </svg>
    </div>
  );
}
