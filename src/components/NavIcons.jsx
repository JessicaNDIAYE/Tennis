/**
 * Cute hand-drawn style SVG nav icons — tennis themed
 */

export function IconHome({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12 L12 4 L21 12" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10 L5 20 Q5 21 6 21 L10 21 L10 16 Q10 14 12 14 Q14 14 14 16 L14 21 L18 21 Q19 21 19 20 L19 10"
        stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Little tennis ball on roof */}
      <circle cx="12" cy="4" r="2.2" fill={active ? "#A8D84E" : "#A8D84E"} />
      <path d="M10.5 3.2 Q12 2 13.5 3.2" stroke="white" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M10.5 4.8 Q12 6 13.5 4.8" stroke="white" strokeWidth="0.7" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconTrophy({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4 L17 4 L16 13 Q15 18 12 19 Q9 18 8 13 Z"
        stroke={c} strokeWidth="2" strokeLinejoin="round" fill={active ? "rgba(246,237,91,0.2)" : "rgba(255,255,255,0.1)"} />
      <path d="M7 7 Q3 8 4 12 Q5 15 8 14" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M17 7 Q21 8 20 12 Q19 15 16 14" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="12" y1="19" x2="12" y2="22" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 22 L15 22" stroke={c} strokeWidth="2" strokeLinecap="round" />
      {/* Star */}
      <text x="12" y="13" textAnchor="middle" fontSize="5" fill={active ? "#F6ED5B" : "white"}>★</text>
    </svg>
  );
}

export function IconRacket({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Racket head */}
      <ellipse cx="10" cy="10" rx="7" ry="8.5" stroke={c} strokeWidth="2"
        fill={active ? "rgba(246,237,91,0.15)" : "rgba(255,255,255,0.08)"} />
      {/* Strings */}
      {[-3, 0, 3].map((x, i) => (
        <line key={`v${i}`} x1={10 + x} y1="2.5" x2={10 + x} y2="17.5" stroke={c} strokeWidth="0.8" opacity="0.6" />
      ))}
      {[-4.5, -1.5, 1.5, 4.5].map((y, i) => (
        <line key={`h${i}`} x1="4" y1={10 + y} x2="16" y2={10 + y} stroke={c} strokeWidth="0.8" opacity="0.6" />
      ))}
      {/* Throat + handle */}
      <path d="M7.5 17 L12 20" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M12.5 17 L12 20" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="20" x2="15" y2="23" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      {/* Ball */}
      <circle cx="17" cy="7" r="2.5" fill="#A8D84E" />
      <path d="M15.8 6 Q17 5 18.2 6" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlayers({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Person 1 */}
      <circle cx="9" cy="7" r="3" stroke={c} strokeWidth="1.8" fill={active ? "rgba(246,237,91,0.2)" : "rgba(255,255,255,0.1)"} />
      <path d="M4 20 Q4 14 9 14 Q14 14 14 20" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Person 2 (partially behind) */}
      <circle cx="17" cy="6" r="2.5" stroke={c} strokeWidth="1.5" fill={active ? "rgba(246,237,91,0.1)" : "rgba(255,255,255,0.08)"} />
      <path d="M14 19 Q14 14 17 14 Q20 14 20 19" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Tennis ball between them */}
      <circle cx="12" cy="11" r="2" fill="#A8D84E" />
      <path d="M10.8 10.4 Q12 9.8 13.2 10.4" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconBadge({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Medal ribbon */}
      <path d="M9 2 L15 2 L15 10 L12 12 L9 10 Z"
        stroke={c} strokeWidth="1.8" fill={active ? "rgba(246,237,91,0.15)" : "rgba(255,255,255,0.1)"} />
      <line x1="10.5" y1="2" x2="10.5" y2="8" stroke={c} strokeWidth="1" opacity="0.5" />
      <line x1="13.5" y1="2" x2="13.5" y2="8" stroke={c} strokeWidth="1" opacity="0.5" />
      {/* Medal circle */}
      <circle cx="12" cy="17" r="5.5" stroke={c} strokeWidth="2"
        fill={active ? "rgba(246,237,91,0.2)" : "rgba(255,255,255,0.1)"} />
      <circle cx="12" cy="17" r="3.5" fill={active ? "#F6ED5B" : "white"} opacity={active ? 1 : 0.15} />
      <text x="12" y="20" textAnchor="middle" fontSize="5" fontWeight="900"
        fill={active ? "#1E4B33" : c}>★</text>
    </svg>
  );
}

export function IconBulb({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Bulb */}
      <path d="M12 2 Q18 2 18 9 Q18 13 15 15 L15 18 L9 18 L9 15 Q6 13 6 9 Q6 2 12 2Z"
        stroke={c} strokeWidth="2" fill={active ? "rgba(246,237,91,0.2)" : "rgba(255,255,255,0.1)"} />
      <path d="M9 18 L15 18 M9.5 20.5 L14.5 20.5" stroke={c} strokeWidth="2" strokeLinecap="round" />
      {/* Tennis ball glow inside */}
      <circle cx="12" cy="9" r="3.5" fill="#A8D84E" opacity={active ? 0.9 : 0.6} />
      <path d="M10.5 7.8 Q12 7 13.5 7.8" stroke="white" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <path d="M10.5 10.2 Q12 11 13.5 10.2" stroke="white" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* Rays */}
      {[-30, 0, 30].map((a, i) => (
        <line key={i}
          x1={12 + 7 * Math.cos((a - 90) * Math.PI / 180)}
          y1={9 + 7 * Math.sin((a - 90) * Math.PI / 180)}
          x2={12 + 9.5 * Math.cos((a - 90) * Math.PI / 180)}
          y2={9 + 9.5 * Math.sin((a - 90) * Math.PI / 180)}
          stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      ))}
    </svg>
  );
}

export function IconNews({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Paper */}
      <rect x="4" y="3" width="16" height="18" rx="2.5"
        stroke={c} strokeWidth="1.8" fill={active ? "rgba(246,237,91,0.1)" : "rgba(255,255,255,0.08)"} />
      {/* Lines */}
      <line x1="8" y1="8" x2="16" y2="8" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="11.5" x2="16" y2="11.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="15" x2="12" y2="15" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Tennis ball stamp */}
      <circle cx="15" cy="16" r="3" fill="#A8D84E" />
      <path d="M13.8 15.2 Q15 14.5 16.2 15.2" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <path d="M13.8 16.8 Q15 17.5 16.2 16.8" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconWatch({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Band */}
      <rect x="9" y="2" width="6" height="4" rx="1.5" stroke={c} strokeWidth="1.5" fill="none" />
      <rect x="9" y="18" width="6" height="4" rx="1.5" stroke={c} strokeWidth="1.5" fill="none" />
      {/* Watch case */}
      <rect x="5" y="5.5" width="14" height="13" rx="4"
        stroke={c} strokeWidth="2" fill={active ? "rgba(246,237,91,0.15)" : "rgba(255,255,255,0.1)"} />
      {/* Screen */}
      <rect x="7" y="7.5" width="10" height="9" rx="2" fill="none" stroke={c} strokeWidth="1" opacity="0.5" />
      {/* Tennis ball on screen */}
      <circle cx="12" cy="12" r="3" fill="#A8D84E" />
      <path d="M10.8 11 Q12 10.3 13.2 11" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round" />
      <path d="M10.8 13 Q12 13.7 13.2 13" stroke="white" strokeWidth="0.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function IconScoreboard({ size = 22, active = false }) {
  const c = active ? "#F6ED5B" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Podium */}
      <rect x="9" y="6" width="6" height="14" rx="1.5"
        stroke={c} strokeWidth="2" fill={active ? "rgba(246,237,91,0.2)" : "rgba(255,255,255,0.1)"} />
      <rect x="3" y="11" width="6" height="9" rx="1.5"
        stroke={c} strokeWidth="1.8" fill={active ? "rgba(246,237,91,0.1)" : "rgba(255,255,255,0.07)"} />
      <rect x="15" y="13" width="6" height="7" rx="1.5"
        stroke={c} strokeWidth="1.8" fill={active ? "rgba(246,237,91,0.1)" : "rgba(255,255,255,0.07)"} />
      {/* Numbers */}
      <text x="12" y="15" textAnchor="middle" fontSize="6" fontWeight="900" fill={c}>1</text>
      <text x="6" y="17" textAnchor="middle" fontSize="5.5" fontWeight="700" fill={c}>2</text>
      <text x="18" y="18" textAnchor="middle" fontSize="5.5" fontWeight="700" fill={c}>3</text>
      {/* Ball on top */}
      <circle cx="12" cy="4" r="2.2" fill="#A8D84E" />
    </svg>
  );
}

// Map for sidebar
export const NAV_ICONS = {
  dashboard:  IconHome,
  scoreboard: IconScoreboard,
  matches:    IconRacket,
  players:    IconPlayers,
  badges:     IconBadge,
  tips:       IconBulb,
  news:       IconNews,
  watch:      IconWatch,
};
