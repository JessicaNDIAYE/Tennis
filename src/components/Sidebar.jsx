import { TennisRacket, NetPattern } from "./TennisIllustrations";

const navItems = [
  { id: "dashboard", icon: "🏠", label: "Tableau de Bord" },
  { id: "scoreboard", icon: "🏆", label: "Classement" },
  { id: "matches", icon: "🎾", label: "Mes Matchs" },
  { id: "players", icon: "👥", label: "Joueurs" },
  { id: "badges", icon: "🎖️", label: "Badges" },
  { id: "tips", icon: "💡", label: "Conseils du Jour" },
  { id: "news", icon: "📰", label: "Actualités" },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-64 bg-court-green min-h-screen flex flex-col relative overflow-hidden">
      <NetPattern />

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-court-blue rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎾</span>
          </div>
          <div>
            <h1 className="font-display text-3xl text-court-yellow tracking-wide leading-none">ACE</h1>
            <p className="text-court-cream/60 text-xs font-medium tracking-widest uppercase">Tennis Hub</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item w-full text-left ${activePage === item.id ? "active" : ""}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
            {activePage === item.id && (
              <span className="ml-auto w-2 h-2 rounded-full bg-court-green" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom decoration */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <span className="text-2xl">🌟</span>
          <div>
            <p className="text-court-yellow text-xs font-bold">Saison 2026</p>
            <p className="text-court-cream/50 text-xs">Printemps · Semaine 12</p>
          </div>
        </div>
      </div>

      {/* Racket illustration */}
      <div className="absolute -bottom-4 -right-8 opacity-10 rotate-12">
        <TennisRacket size={100} color="white" />
      </div>
    </aside>
  );
}
