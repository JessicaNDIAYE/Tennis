import { useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ScoreBoard from "./components/ScoreBoard";
import MatchTracker from "./components/MatchTracker";
import Players from "./components/Players";
import BadgesPage from "./components/BadgesPage";
import TipsPage from "./components/TipsPage";
import NewsPage from "./components/NewsPage";

const pages = {
  dashboard: Dashboard,
  scoreboard: ScoreBoard,
  matches: MatchTracker,
  players: Players,
  badges: BadgesPage,
  tips: TipsPage,
  news: NewsPage,
};

function MobileNav({ activePage, onNavigate }) {
  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Accueil" },
    { id: "scoreboard", icon: "🏆", label: "Classement" },
    { id: "matches", icon: "🎾", label: "Matchs" },
    { id: "players", icon: "👥", label: "Joueurs" },
    { id: "tips", icon: "💡", label: "Conseils" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-court-green border-t border-white/10 flex lg:hidden z-50">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
            ${activePage === item.id ? "text-court-yellow" : "text-white/50"}`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="hidden xs:block">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Header({ activePage }) {
  const titles = {
    dashboard: "Tableau de Bord",
    scoreboard: "Classement",
    matches: "Mes Matchs",
    players: "Joueurs",
    badges: "Badges",
    tips: "Conseils",
    news: "Actualités",
  };
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-court-green rounded-xl flex items-center justify-center lg:hidden">
          <span className="text-lg">🎾</span>
        </div>
        <div>
          <h1 className="font-black text-court-green text-lg leading-none">{titles[activePage]}</h1>
          <p className="text-gray-400 text-xs">ACE Tennis Hub</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-court-cream px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          En ligne · 5 joueurs
        </span>
        <div className="w-9 h-9 bg-court-blue rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
          A
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="flex min-h-screen bg-court-cream">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activePage={activePage} />
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto w-full">
          <PageComponent onNavigate={setActivePage} />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}
