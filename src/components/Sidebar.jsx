import { TennisRacket, NetPattern, TennisBall } from "./TennisIllustrations";
import { NAV_ICONS } from "./NavIcons";

const navItems = [
  { id: "dashboard",  label: "Tableau de Bord" },
  { id: "scoreboard", label: "Classement" },
  { id: "matches",    label: "Mes Matchs" },
  { id: "players",    label: "Joueurs" },
  { id: "friends",    label: "Amis" },
  { id: "groups",     label: "Groupes" },
  { id: "badges",     label: "Badges" },
  { id: "tips",       label: "Conseils du Jour" },
  { id: "news",       label: "Actualités" },
  { id: "watch",      label: "Ma Montre" },
  { id: "rules",      label: "Règles du Tennis" },
  { id: "profile",    label: "Mon Profil" },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-64 bg-court-green min-h-screen flex flex-col relative overflow-hidden">
      <NetPattern />

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            {/* Cute ACE logo — tennis ball with text */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill="#1C55DB" />
              <circle cx="24" cy="24" r="18" fill="#A8D84E" />
              <path d="M24 6 Q14 14 16 24 Q18 34 24 42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M24 6 Q34 14 32 24 Q30 34 24 42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <text x="24" y="27" textAnchor="middle" fontSize="11" fontWeight="900" fill="white"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: 1 }}>ACE</text>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl text-court-yellow tracking-wide leading-none">
              Tennis Hub
            </h1>
            <p className="text-court-cream/50 text-xs font-medium tracking-widest uppercase">
              Printemps 2026
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = NAV_ICONS[item.id];
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200
                ${isActive
                  ? "bg-court-yellow text-court-green font-black shadow-md"
                  : "text-court-cream/70 hover:bg-white/10 hover:text-court-cream font-medium"
                }`}
            >
              {Icon && <Icon size={20} active={isActive} />}
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-court-green" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Season info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <TennisBall size={24} />
          <div>
            <p className="text-court-yellow text-xs font-bold">Saison 2026</p>
            <p className="text-court-cream/50 text-xs">Printemps · Semaine 12</p>
          </div>
        </div>
      </div>

      {/* Decorative racket */}
      <div className="absolute -bottom-4 -right-8 opacity-10 rotate-12">
        <TennisRacket size={100} color="white" />
      </div>
    </aside>
  );
}
