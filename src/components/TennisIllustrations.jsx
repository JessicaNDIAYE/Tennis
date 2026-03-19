// Beautiful SVG Tennis Illustrations

export function TennisBall({ size = 60, animate = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={animate ? "animate-float" : ""}>
      <circle cx="30" cy="30" r="28" fill="#C8E840" stroke="#A8C820" strokeWidth="2"/>
      <path d="M30 2C30 2 18 14 18 30C18 46 30 58 30 58" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M30 2C30 2 42 14 42 30C42 46 30 58 30 58" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="30" cy="30" r="28" fill="none" stroke="#A8C820" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

export function TennisRacket({ size = 80, color = "#1C55DB" }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 80 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="40" cy="36" rx="28" ry="34" fill={color} stroke="white" strokeWidth="3"/>
      {/* Strings horizontal */}
      {[16, 22, 28, 34, 40, 46, 52, 56].map((y, i) => (
        <line key={`h${i}`} x1="14" y1={y} x2="66" y2={y} stroke="white" strokeWidth="1" opacity="0.7"/>
      ))}
      {/* Strings vertical */}
      {[20, 27, 34, 40, 46, 53, 60].map((x, i) => (
        <line key={`v${i}`} x1={x} y1="6" x2={x} y2="66" stroke="white" strokeWidth="1" opacity="0.7"/>
      ))}
      {/* Sweet spot */}
      <ellipse cx="40" cy="36" rx="10" ry="12" fill="none" stroke="#F6ED5B" strokeWidth="2" opacity="0.8"/>
      {/* Throat */}
      <path d="M28 68 L40 76 L52 68" fill={color} stroke="white" strokeWidth="2"/>
      {/* Handle */}
      <rect x="35" y="72" width="10" height="36" rx="5" fill="#C17B5A" stroke="white" strokeWidth="2"/>
      {/* Grip tape */}
      {[78, 84, 90, 96].map((y, i) => (
        <line key={`g${i}`} x1="35" y1={y} x2="45" y2={y} stroke="white" strokeWidth="1.5" opacity="0.5"/>
      ))}
    </svg>
  );
}

export function TrophyIcon({ size = 60, gold = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cup */}
      <path d="M15 8 L45 8 L42 30 Q40 40 30 42 Q20 40 18 30 Z" fill={gold ? "#F6ED5B" : "#E5E7EB"} stroke={gold ? "#FCA833" : "#9CA3AF"} strokeWidth="2"/>
      {/* Handles */}
      <path d="M15 12 Q6 14 8 22 Q10 28 18 26" fill="none" stroke={gold ? "#FCA833" : "#9CA3AF"} strokeWidth="3" strokeLinecap="round"/>
      <path d="M45 12 Q54 14 52 22 Q50 28 42 26" fill="none" stroke={gold ? "#FCA833" : "#9CA3AF"} strokeWidth="3" strokeLinecap="round"/>
      {/* Stem */}
      <rect x="27" y="42" width="6" height="10" fill={gold ? "#FCA833" : "#9CA3AF"}/>
      {/* Base */}
      <rect x="20" y="50" width="20" height="5" rx="2" fill={gold ? "#F6ED5B" : "#E5E7EB"} stroke={gold ? "#FCA833" : "#9CA3AF"} strokeWidth="2"/>
      {/* Stars */}
      {gold && <text x="26" y="28" fontSize="12" fill="#FCA833">★</text>}
    </svg>
  );
}

export function CourtDiagram({ size = 200 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Court surface */}
      <rect x="5" y="5" width="190" height="110" rx="3" fill="#1C55DB" opacity="0.15"/>
      {/* Court lines */}
      <rect x="10" y="10" width="180" height="100" fill="none" stroke="#1C55DB" strokeWidth="2"/>
      {/* Center line */}
      <line x1="100" y1="10" x2="100" y2="110" stroke="#1C55DB" strokeWidth="1.5"/>
      {/* Service boxes */}
      <line x1="10" y1="60" x2="190" y2="60" stroke="#1C55DB" strokeWidth="1.5"/>
      <line x1="40" y1="10" x2="40" y2="110" stroke="#1C55DB" strokeWidth="1.5"/>
      <line x1="160" y1="10" x2="160" y2="110" stroke="#1C55DB" strokeWidth="1.5"/>
      {/* Net */}
      <line x1="10" y1="60" x2="190" y2="60" stroke="#0E4F83" strokeWidth="3"/>
      {[20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map((x, i) => (
        <line key={i} x1={x} y1="58" x2={x} y2="62" stroke="#0E4F83" strokeWidth="1"/>
      ))}
      {/* Tennis ball */}
      <circle cx="120" cy="40" r="6" fill="#C8E840" stroke="#A8C820" strokeWidth="1.5"/>
      <path d="M116 40 Q120 36 124 40" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function BadgeFrame({ children, color, borderColor, size = 80, rarity = "common" }) {
  const rarityGlow = {
    common: "none",
    uncommon: `0 0 10px ${color}60`,
    rare: `0 0 15px ${color}80`,
    epic: `0 0 20px ${color}90`,
    legendary: `0 0 25px ${color}`,
  };
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}ee, ${color}99)`,
        border: `4px solid ${borderColor}`,
        boxShadow: rarityGlow[rarity],
      }}
    >
      {/* Outer ring decoration */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30" />
      {/* Star decorations for rare+ */}
      {(rarity === "rare" || rarity === "epic" || rarity === "legendary") && (
        <>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-white text-xs">★</div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-white text-xs">★</div>
        </>
      )}
      {(rarity === "epic" || rarity === "legendary") && (
        <>
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-white text-xs">★</div>
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-white text-xs">★</div>
        </>
      )}
      <span className="text-2xl z-10">{children}</span>
    </div>
  );
}

export function PlayerAvatar({ emoji, color, size = 50, rank }) {
  const rankColors = { 1: "#F6ED5B", 2: "#E5E7EB", 3: "#D97706" };
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="rounded-full flex items-center justify-center font-bold text-2xl border-4"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${color}33, ${color}66)`,
          borderColor: color,
        }}
      >
        {emoji}
      </div>
      {rank && rank <= 3 && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-white"
          style={{ background: rankColors[rank], color: rank === 1 ? "#1E4B33" : rank === 3 ? "white" : "#374151" }}
        >
          {rank}
        </div>
      )}
    </div>
  );
}

export function NetPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="net" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#net)"/>
      </svg>
    </div>
  );
}

export function WavyPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="wavy" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
            <path d="M0 15 Q15 0 30 15 Q45 30 60 15" fill="none" stroke="currentColor" strokeWidth="2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wavy)" color="white"/>
      </svg>
    </div>
  );
}

export function CheckerPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="checker" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="white"/>
            <rect x="20" y="20" width="20" height="20" fill="white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#checker)"/>
      </svg>
    </div>
  );
}
