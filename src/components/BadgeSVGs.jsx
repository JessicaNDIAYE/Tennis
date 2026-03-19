/**
 * Custom SVG badge illustrations — inspired by tennis sticker aesthetics
 * Bold, colorful, with tennis-ball elements, rackets, player silhouettes
 */

// Shared tennis ball element
function Ball({ cx, cy, r, light = false }) {
  const fill = light ? "#C8E840" : "#A8D820";
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <path d={`M${cx} ${cy - r} Q${cx - r * 0.6} ${cy - r * 0.2} ${cx - r * 0.3} ${cy} Q${cx} ${cy + r * 0.4} ${cx} ${cy + r}`}
        fill="none" stroke="white" strokeWidth={r * 0.12} strokeLinecap="round" />
      <path d={`M${cx} ${cy - r} Q${cx + r * 0.6} ${cy - r * 0.2} ${cx + r * 0.3} ${cy} Q${cx} ${cy + r * 0.4} ${cx} ${cy + r}`}
        fill="none" stroke="white" strokeWidth={r * 0.12} strokeLinecap="round" />
    </g>
  );
}

// Racket element
function Racket({ x, y, size, angle = 0, color = "#1E4B33" }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <ellipse cx="0" cy={-size * 0.5} rx={size * 0.35} ry={size * 0.45} fill={color} />
      {[-0.25, -0.08, 0.08, 0.25].map((ox, i) => (
        <line key={`v${i}`} x1={ox * size} y1={-size * 0.9} x2={ox * size} y2={-size * 0.1} stroke="white" strokeWidth="1.2" opacity="0.7" />
      ))}
      {[-0.35, -0.2, -0.05, 0.1, 0.25].map((oy, i) => (
        <line key={`h${i}`} x1={-size * 0.32} y1={oy * size - size * 0.5} x2={size * 0.32} y2={oy * size - size * 0.5} stroke="white" strokeWidth="1.2" opacity="0.7" />
      ))}
      <rect x={-size * 0.07} y={-size * 0.05} width={size * 0.14} height={size * 0.45} rx={size * 0.07} fill={color} />
    </g>
  );
}

// ─────────────────────────────────────────────
// Badge SVG Components
// ─────────────────────────────────────────────

export function BadgeSVG_FirstWin({ size = 72 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#F6ED5B" stroke="#1E4B33" strokeWidth="3" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="#1E4B33" strokeWidth="1.5" strokeDasharray="4 2" />
      {/* Trophy */}
      <path d="M24 20 L48 20 L46 36 Q44 44 36 46 Q28 44 26 36 Z" fill="#FCA833" stroke="#C17B5A" strokeWidth="1.5" />
      <path d="M24 24 Q16 26 18 33 Q20 38 26 36" fill="none" stroke="#C17B5A" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 24 Q56 26 54 33 Q52 38 46 36" fill="none" stroke="#C17B5A" strokeWidth="2" strokeLinecap="round" />
      <rect x="33" y="46" width="6" height="8" fill="#FCA833" />
      <rect x="27" y="52" width="18" height="4" rx="2" fill="#F6ED5B" stroke="#C17B5A" strokeWidth="1.5" />
      <text x="36" y="35" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">1st!</text>
    </svg>
  );
}

export function BadgeSVG_FiveWins({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#1C55DB" stroke="#0E4F83" strokeWidth="3" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
      {/* Target circles */}
      {[20, 14, 8].map((r, i) => (
        <circle key={i} cx="36" cy="34" r={r} fill="none" stroke="white" strokeWidth={i === 2 ? 2 : 1} opacity={0.4 + i * 0.2} />
      ))}
      <circle cx="36" cy="34" r="5" fill="#F6ED5B" />
      <Ball cx="36" cy="34" r="4" light />
      <text x="36" y="58" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">5 VICTOIRES</text>
    </svg>
  );
}

export function BadgeSVG_TenWins({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      {/* Shield shape */}
      <path d="M36 6 L62 18 L62 42 Q62 58 36 68 Q10 58 10 42 L10 18 Z"
        fill="#FCA833" stroke="#C17B5A" strokeWidth="2.5" />
      <path d="M36 12 L56 22 L56 42 Q56 54 36 62 Q16 54 16 42 L16 22 Z"
        fill="#FFD580" />
      {/* Stars */}
      {[-18, 0, 18].map((dx, i) => (
        <text key={i} x={36 + dx} y="28" textAnchor="middle" fontSize="10" fill="#FCA833">★</text>
      ))}
      <text x="36" y="42" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1E4B33">CHAMP</text>
      <text x="36" y="53" textAnchor="middle" fontSize="8" fontWeight="700" fill="#C17B5A">×10</text>
    </svg>
  );
}

export function BadgeSVG_TwentyWins({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#EC4899" stroke="#BE185D" strokeWidth="3" />
      {/* Crown */}
      <path d="M16 46 L16 30 L24 38 L36 22 L48 38 L56 30 L56 46 Z"
        fill="#F6ED5B" stroke="#FCA833" strokeWidth="2" />
      <circle cx="36" cy="22" r="3.5" fill="#FCA833" />
      <circle cx="16" cy="30" r="3" fill="#FCA833" />
      <circle cx="56" cy="30" r="3" fill="#FCA833" />
      <rect x="14" y="44" width="44" height="8" rx="2" fill="#F6ED5B" stroke="#FCA833" strokeWidth="1.5" />
      <text x="36" y="50.5" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#BE185D">LÉGENDE</text>
    </svg>
  );
}

export function BadgeSVG_Streak3({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#FF6B35" stroke="#C17B5A" strokeWidth="3" />
      {/* Flame shape */}
      <path d="M36 12 C36 12 20 28 24 40 C26 46 22 48 22 52 C22 60 28 66 36 66 C44 66 50 60 50 52 C50 48 46 46 48 40 C52 28 36 12 36 12Z"
        fill="#F6ED5B" />
      <path d="M36 22 C36 22 28 32 30 40 C31 44 28 46 28 50 C28 56 31 60 36 60 C41 60 44 56 44 50 C44 46 41 44 42 40 C44 32 36 22 36 22Z"
        fill="#FCA833" />
      <path d="M36 32 C36 32 31 38 33 43 C34 46 36 50 36 54 C36 50 38 46 39 43 C41 38 36 32 36 32Z"
        fill="#FF6B35" />
      <text x="36" y="58" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">×3</text>
    </svg>
  );
}

export function BadgeSVG_Streak5({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#A8D84E" stroke="#1E4B33" strokeWidth="3" />
      {/* Lightning bolt */}
      <path d="M42 10 L24 38 L34 38 L30 62 L48 32 L38 32 Z"
        fill="#F6ED5B" stroke="#1E4B33" strokeWidth="2" strokeLinejoin="round" />
      <path d="M42 10 L24 38 L34 38 L30 62 L48 32 L38 32 Z"
        fill="white" opacity="0.3" />
    </svg>
  );
}

export function BadgeSVG_Streak10({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3" />
      {/* Sunset half-circle */}
      <path d="M8 50 Q8 24 36 24 Q64 24 64 50 Z" fill="#FCA833" opacity="0.4" />
      <path d="M8 50 Q8 30 36 30 Q64 30 64 50 Z" fill="#F6ED5B" opacity="0.5" />
      {/* Sun rays */}
      {[-40, -25, -10, 5, 20, 35, 50].map((angle, i) => (
        <line key={i}
          x1={36 + 22 * Math.cos((angle - 90) * Math.PI / 180)}
          y1={50 + 22 * Math.sin((angle - 90) * Math.PI / 180)}
          x2={36 + 30 * Math.cos((angle - 90) * Math.PI / 180)}
          y2={50 + 30 * Math.sin((angle - 90) * Math.PI / 180)}
          stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      ))}
      {/* Player silhouette */}
      <circle cx="36" cy="38" r="4" fill="white" opacity="0.9" />
      <path d="M36 42 L33 52 M36 42 L39 52 M33 44 L40 46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <text x="36" y="65" textAnchor="middle" fontSize="7" fontWeight="900" fill="white">INVINCIBLE</text>
    </svg>
  );
}

export function BadgeSVG_EarlyBird({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#F3EEE0" stroke="#FCA833" strokeWidth="3" />
      {/* Horizon line */}
      <line x1="10" y1="46" x2="62" y2="46" stroke="#FCA833" strokeWidth="2" />
      {/* Sun rising */}
      <path d="M10 46 Q36 10 62 46 Z" fill="#FCA833" opacity="0.3" />
      <circle cx="36" cy="46" r="14" fill="#FCA833" />
      <circle cx="36" cy="46" r="10" fill="#F6ED5B" />
      {/* Sun rays above horizon */}
      {[-50, -30, -10, 10, 30, 50].map((angle, i) => (
        <line key={i}
          x1={36 + 17 * Math.cos((angle - 90) * Math.PI / 180)}
          y1={46 + 17 * Math.sin((angle - 90) * Math.PI / 180)}
          x2={36 + 24 * Math.cos((angle - 90) * Math.PI / 180)}
          y2={46 + 24 * Math.sin((angle - 90) * Math.PI / 180)}
          stroke="#FCA833" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <Ball cx="36" cy="46" r="7" />
      <text x="36" y="63" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#FCA833">LÈVE-TÔT</text>
    </svg>
  );
}

export function BadgeSVG_IronRacket({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#374151" stroke="#1F2937" strokeWidth="3" />
      <circle cx="36" cy="36" r="27" fill="none" stroke="#6B7280" strokeWidth="1" />
      {/* Crossed rackets */}
      <g transform="translate(22,20) rotate(-35, 14, 20)">
        <ellipse cx="14" cy="14" rx="8" ry="11" fill="#A8D84E" />
        {[-5, -1.5, 2, 5.5].map((x, i) => (
          <line key={`v${i}`} x1={14 + x} y1="4" x2={14 + x} y2="24" stroke="white" strokeWidth="1" opacity="0.7" />
        ))}
        {[-6, -2, 2, 6, 10].map((y, i) => (
          <line key={`h${i}`} x1="7" y1={14 + y} x2="21" y2={14 + y} stroke="white" strokeWidth="1" opacity="0.7" />
        ))}
        <rect x="12" y="24" width="4" height="14" rx="2" fill="#C17B5A" />
      </g>
      <g transform="translate(36,20) rotate(35, 14, 20)">
        <ellipse cx="14" cy="14" rx="8" ry="11" fill="#A8D84E" />
        {[-5, -1.5, 2, 5.5].map((x, i) => (
          <line key={`v${i}`} x1={14 + x} y1="4" x2={14 + x} y2="24" stroke="white" strokeWidth="1" opacity="0.7" />
        ))}
        {[-6, -2, 2, 6, 10].map((y, i) => (
          <line key={`h${i}`} x1="7" y1={14 + y} x2="21" y2={14 + y} stroke="white" strokeWidth="1" opacity="0.7" />
        ))}
        <rect x="12" y="24" width="4" height="14" rx="2" fill="#C17B5A" />
      </g>
      <Ball cx="36" cy="42" r="7" light />
      <text x="36" y="63" textAnchor="middle" fontSize="7" fontWeight="900" fill="#A8D84E">RAQUETTE DE FER</text>
    </svg>
  );
}

export function BadgeSVG_Marathon({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3" />
      {/* Heartbeat/EKG line with racket */}
      <polyline
        points="8,40 16,40 20,28 24,52 28,36 32,30 36,44 40,36 44,40 56,40 60,40 64,40"
        fill="none" stroke="#F6ED5B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Small racket at heart peak */}
      <ellipse cx="32" cy="30" rx="5" ry="7" fill="white" opacity="0.9" />
      {[-2.5, 0, 2.5].map((x, i) => (
        <line key={i} x1={32 + x} y1="24" x2={32 + x} y2="36" stroke="#8B5CF6" strokeWidth="1" />
      ))}
      {[-4, 0, 4].map((y, i) => (
        <line key={i} x1="28" y1={30 + y} x2="36" y2={30 + y} stroke="#8B5CF6" strokeWidth="1" />
      ))}
      <rect x="30.5" y="36" width="3" height="8" rx="1.5" fill="#C17B5A" />
      <text x="36" y="62" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">MARATHON</text>
    </svg>
  );
}

export function BadgeSVG_AceQueen({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#EC4899" stroke="#BE185D" strokeWidth="3" />
      <circle cx="36" cy="36" r="27" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
      {/* "KISS MY" text */}
      <text x="36" y="30" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">KISS MY</text>
      {/* Big ACE text */}
      <text x="36" y="48" textAnchor="middle" fontSize="18" fontWeight="900" fill="#F6ED5B"
        style={{ letterSpacing: 2 }}>ACE</text>
      <Ball cx="36" cy="58" r="5" light />
    </svg>
  );
}

export function BadgeSVG_ClayMaster({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#C17B5A" stroke="#8B4513" strokeWidth="3" />
      {/* Clay texture dots */}
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={12 + (i % 5) * 12} cy={15 + Math.floor(i / 5) * 14} r="1.5"
          fill="#A0522D" opacity="0.5" />
      ))}
      {/* Court lines */}
      <rect x="12" y="22" width="48" height="36" rx="2" fill="#D4956F" opacity="0.8" />
      <line x1="12" y1="40" x2="60" y2="40" stroke="white" strokeWidth="2" />
      <line x1="36" y1="22" x2="36" y2="58" stroke="white" strokeWidth="1.5" />
      <line x1="20" y1="22" x2="20" y2="58" stroke="white" strokeWidth="1" opacity="0.7" />
      <line x1="52" y1="22" x2="52" y2="58" stroke="white" strokeWidth="1" opacity="0.7" />
      <Ball cx="44" cy="32" r="6" />
      <text x="22" y="52" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="white">MAÎTRE</text>
    </svg>
  );
}

export function BadgeSVG_GrassKing({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      {/* Heart shape */}
      <path d="M36 62 Q10 46 10 30 Q10 16 22 14 Q30 14 36 22 Q42 14 50 14 Q62 16 62 30 Q62 46 36 62Z"
        fill="#1E4B33" stroke="#0D3A1E" strokeWidth="3" />
      <path d="M36 56 Q14 42 14 30 Q14 20 24 18 Q30 18 36 26 Q42 18 48 18 Q58 20 58 30 Q58 42 36 56Z"
        fill="#2D6B4A" />
      {/* Grass blades */}
      {[-14, -8, -2, 4, 10].map((x, i) => (
        <path key={i} d={`M${36 + x} 52 Q${36 + x - 2} ${46 - i * 2} ${36 + x - 1} ${42 - i * 2}`}
          stroke="#A8D84E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      ))}
      <text x="36" y="36" textAnchor="middle" fontSize="9" fontWeight="900" fill="#A8D84E">I ♥ GAZON</text>
      <Ball cx="36" cy="48" r="5" light />
    </svg>
  );
}

export function BadgeSVG_HardCourt({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#1C55DB" stroke="#0E4F83" strokeWidth="3" />
      {/* Court perspective */}
      <path d="M14 52 L58 52 L48 20 L24 20 Z" fill="#1847B0" />
      <line x1="14" y1="52" x2="58" y2="52" stroke="white" strokeWidth="2" />
      <line x1="24" y1="20" x2="48" y2="20" stroke="white" strokeWidth="2" />
      <line x1="36" y1="20" x2="36" y2="52" stroke="white" strokeWidth="1.5" />
      <line x1="14" y1="36" x2="58" y2="36" stroke="white" strokeWidth="2" />
      <line x1="20" y1="52" x2="27" y2="20" stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1="52" y1="52" x2="45" y2="20" stroke="white" strokeWidth="1" opacity="0.6" />
      {/* Net */}
      <rect x="14" y="34" width="44" height="4" fill="#0E3080" />
      {[20, 25, 30, 35, 40, 45, 50].map((x, i) => (
        <line key={i} x1={x} y1="34" x2={x} y2="38" stroke="#4A7FE8" strokeWidth="1" />
      ))}
      <Ball cx="44" cy="28" r="5" light />
      <text x="36" y="64" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="white">BÉTON ARMÉ</text>
    </svg>
  );
}

export function BadgeSVG_WatchSync({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="34" fill="#1F2937" stroke="#374151" strokeWidth="3" />
      {/* Watch band */}
      <rect x="28" y="10" width="16" height="10" rx="3" fill="#4B5563" />
      <rect x="28" y="52" width="16" height="10" rx="3" fill="#4B5563" />
      {/* Watch face */}
      <rect x="20" y="18" width="32" height="36" rx="8" fill="#374151" stroke="#6B7280" strokeWidth="1.5" />
      <rect x="22" y="20" width="28" height="32" rx="6" fill="#111827" />
      {/* Tennis ball display */}
      <Ball cx="36" cy="34" r="10" light />
      {/* Heartbeat on watch */}
      <polyline points="26,36 29,36 31,30 33,42 35,34 37,36 40,36 42,30 44,36 46,36"
        fill="none" stroke="#A8D84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <text x="36" y="62" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#A8D84E">TECH PLAYER</text>
    </svg>
  );
}

// Map badge id → SVG component
export const BADGE_SVG_MAP = {
  first_win:   BadgeSVG_FirstWin,
  five_wins:   BadgeSVG_FiveWins,
  ten_wins:    BadgeSVG_TenWins,
  twenty_wins: BadgeSVG_TwentyWins,
  streak3:     BadgeSVG_Streak3,
  streak5:     BadgeSVG_Streak5,
  streak10:    BadgeSVG_Streak10,
  early_bird:  BadgeSVG_EarlyBird,
  iron_racket: BadgeSVG_IronRacket,
  marathon:    BadgeSVG_Marathon,
  ace_queen:   BadgeSVG_AceQueen,
  clay_master: BadgeSVG_ClayMaster,
  grass_king:  BadgeSVG_GrassKing,
  hard_court:  BadgeSVG_HardCourt,
  watch_sync:  BadgeSVG_WatchSync,
};

export function BadgeSVGById({ id, size = 72, dimmed = false }) {
  const Component = BADGE_SVG_MAP[id];
  if (!Component) return (
    <div style={{ width: size, height: size }} className="rounded-full bg-gray-200 flex items-center justify-center text-2xl">
      🎾
    </div>
  );
  return (
    <div style={{ opacity: dimmed ? 0.3 : 1, filter: dimmed ? "grayscale(1)" : "none", transition: "all 0.3s" }}>
      <Component size={size} />
    </div>
  );
}
