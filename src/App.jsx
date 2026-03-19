import { useState } from "react";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ScoreBoard from "./components/ScoreBoard";
import MatchTracker from "./components/MatchTracker";
import Players from "./components/Players";
import BadgesPage from "./components/BadgesPage";
import TipsPage from "./components/TipsPage";
import NewsPage from "./components/NewsPage";
import WatchPage from "./pages/WatchPage";
import FriendsPage from "./components/FriendsPage";
import RulesPage from "./components/RulesPage";
import ProfilePage from "./components/ProfilePage";

const pages = {
  dashboard: Dashboard,
  scoreboard: ScoreBoard,
  matches: MatchTracker,
  players: Players,
  badges: BadgesPage,
  tips: TipsPage,
  news: NewsPage,
  watch: WatchPage,
  friends: FriendsPage,
  rules: RulesPage,
  profile: ProfilePage,
};

const navItems = [
  { id: "dashboard", icon: "🏠", label: "Accueil" },
  { id: "scoreboard", icon: "🏆", label: "Classement" },
  { id: "matches", icon: "🎾", label: "Matchs" },
  { id: "friends", icon: "👥", label: "Amis" },
  { id: "profile", icon: "👤", label: "Profil" },
  { id: "players", icon: "👥", label: "Joueurs" },
  { id: "badges", icon: "🎖️", label: "Badges" },
  { id: "tips", icon: "💡", label: "Conseils" },
  { id: "news", icon: "📰", label: "Actualités" },
  { id: "watch", icon: "⌚", label: "Ma Montre" },
  { id: "rules", icon: "📖", label: "Règles" },
];

function MobileNav({ activePage, onNavigate }) {
  const items = navItems.slice(0, 5);
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-court-green border-t border-white/10 flex lg:hidden z-50">
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
            ${activePage === item.id ? "text-court-yellow" : "text-white/50"}`}>
          <span className="text-lg">{item.icon}</span>
        </button>
      ))}
    </nav>
  );
}

function Header({ activePage, onNavigate }) {
  const { profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const titles = {
    dashboard: "Tableau de Bord", scoreboard: "Classement", matches: "Mes Matchs",
    players: "Joueurs", badges: "Badges", tips: "Conseils", news: "Actualités",
    watch: "Ma Montre", friends: "Amis", rules: "Règles du Tennis", profile: "Mon Profil",
  };

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const avatarPublicUrl = profile?.avatar_url
    ? `${supabaseUrl}/storage/v1/object/public/avatars/${profile.avatar_url}`
    : null;

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-court-green rounded-xl flex items-center justify-center lg:hidden">
          <span className="text-lg">🎾</span>
        </div>
        <div>
          <h1 className="font-black text-court-green text-lg leading-none">{titles[activePage] || "ACE Tennis Hub"}</h1>
          <p className="text-gray-400 text-xs">ACE Tennis Hub</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-court-cream px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {profile?.username || "En ligne"}
        </span>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 bg-court-blue rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden border-2 border-white"
          >
            {avatarPublicUrl
              ? <img src={avatarPublicUrl} alt="" className="w-full h-full object-cover" />
              : <span>{profile?.avatar_emoji || "🎾"}</span>}
          </button>
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 w-52">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-gray-800 text-sm">{profile?.username}</p>
                <p className="text-xs text-gray-400">{profile?.level}</p>
              </div>
              <button onClick={() => { onNavigate("profile"); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-court-cream transition-colors flex items-center gap-2">
                👤 Mon Profil
              </button>
              <button onClick={() => { onNavigate("friends"); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-court-cream transition-colors flex items-center gap-2">
                👥 Mes Amis
              </button>
              <button onClick={() => { onNavigate("watch"); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-court-cream transition-colors flex items-center gap-2">
                ⌚ Ma Montre
              </button>
              <button onClick={() => { onNavigate("rules"); setShowMenu(false); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-court-cream transition-colors flex items-center gap-2">
                📖 Règles du Tennis
              </button>
              <div className="border-t border-gray-100">
                <button onClick={() => { signOut(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                  🚪 Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function AppShell() {
  const [activePage, setActivePage] = useState("dashboard");
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="flex min-h-screen bg-court-cream">
      <div className="hidden lg:block flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Header activePage={activePage} onNavigate={setActivePage} />
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto w-full">
          <PageComponent onNavigate={setActivePage} />
        </main>
      </div>
      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}

function AppRouter() {
  const { session } = useAuth();
  const [view, setView] = useState("landing"); // "landing" | "auth"

  // session === undefined = still loading
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-court-green">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🎾</div>
          <p className="font-display text-3xl text-court-yellow">ACE Tennis Hub</p>
          <p className="text-white/50 text-sm mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  // Logged in → show app
  if (session) return <AppShell />;

  // Not logged in
  if (view === "auth") return <AuthPage onBack={() => setView("landing")} />;

  return <LandingPage onEnter={() => setView("auth")} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
