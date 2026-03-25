import { useState, useEffect } from "react";
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
import GroupsPage from "./components/GroupsPage";
import NotificationsPanel from "./components/NotificationsPanel";

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
  groups: GroupsPage,
  rules: RulesPage,
  profile: ProfilePage,
};

const navItems = [
  { id: "dashboard",  icon: "🏠", label: "Accueil" },
  { id: "scoreboard", icon: "🏆", label: "Classement" },
  { id: "matches",    icon: "🎾", label: "Matchs" },
  { id: "players",    icon: "👥", label: "Joueurs" },
  { id: "friends",    icon: "❤️", label: "Amis" },
  { id: "groups",     icon: "🤝", label: "Groupes" },
  { id: "badges",     icon: "🎖️", label: "Badges" },
  { id: "tips",       icon: "💡", label: "Conseils" },
  { id: "news",       icon: "📰", label: "Actus" },
  { id: "watch",      icon: "⌚", label: "Montre" },
  { id: "rules",      icon: "📖", label: "Règles" },
  { id: "profile",    icon: "👤", label: "Profil" },
];

// Bottom 5 most-used items for mobile nav
const mobileNavItems = ["dashboard", "scoreboard", "matches", "friends", "profile"];

// ─── Mobile drawer (full nav overlay) ─────────────────────────────────────────
function MobileDrawer({ activePage, onNavigate, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 lg:hidden"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-court-green z-50 flex flex-col overflow-y-auto shadow-2xl lg:hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <p className="font-display text-2xl text-court-yellow tracking-wide">Tennis Hub</p>
            <p className="text-court-cream/50 text-xs font-medium tracking-widest uppercase">Printemps 2026</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-0.5">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${isActive
                    ? "bg-court-yellow text-court-green font-black shadow-md"
                    : "text-court-cream/70 hover:bg-white/10 hover:text-court-cream font-medium"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
                {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-court-green" />}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
function MobileNav({ activePage, onNavigate }) {
  const items = navItems.filter(n => mobileNavItems.includes(n.id));
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-court-green border-t border-white/10 flex lg:hidden z-40">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold transition-colors
            ${activePage === item.id ? "text-court-yellow" : "text-white/50"}`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Setup username banner ────────────────────────────────────────────────────
function SetupBanner({ onNavigate, onDismiss }) {
  return (
    <div className="bg-court-yellow border-b-2 border-court-green px-4 py-3 flex items-center gap-3">
      <span className="text-xl flex-shrink-0">👋</span>
      <p className="text-court-green text-sm font-bold flex-1">
        Bienvenue ! Change ton pseudo pour que tes amis te trouvent.
      </p>
      <button
        onClick={() => { onNavigate("profile"); onDismiss(); }}
        className="bg-court-green text-white text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0 hover:bg-green-900 transition-colors"
      >
        Modifier →
      </button>
      <button onClick={onDismiss} className="text-court-green/50 hover:text-court-green text-lg flex-shrink-0">✕</button>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ activePage, onNavigate, onOpenDrawer }) {
  const { profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const titles = {
    dashboard: "Tableau de Bord", scoreboard: "Classement", matches: "Mes Matchs",
    players: "Joueurs", badges: "Badges", tips: "Conseils", news: "Actualités",
    watch: "Ma Montre", friends: "Amis", groups: "Groupes", rules: "Règles du Tennis", profile: "Mon Profil",
  };

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const avatarPublicUrl = profile?.avatar_url
    ? `${supabaseUrl}/storage/v1/object/public/avatars/${profile.avatar_url}`
    : null;

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    const handler = () => setShowMenu(false);
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, [showMenu]);

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          onClick={onOpenDrawer}
          className="w-9 h-9 bg-court-green rounded-xl flex items-center justify-center lg:hidden flex-shrink-0"
          aria-label="Menu"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 1H17M1 7H17M1 13H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="font-black text-court-green text-base sm:text-lg leading-none truncate">
            {titles[activePage] || "ACE Tennis Hub"}
          </h1>
          <p className="text-gray-400 text-xs hidden sm:block">ACE Tennis Hub</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-court-cream px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {profile?.username || "En ligne"}
        </span>
        <NotificationsPanel />
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(m => !m); }}
            className="w-9 h-9 bg-court-blue rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden border-2 border-white"
          >
            {avatarPublicUrl
              ? <img src={avatarPublicUrl} alt="" className="w-full h-full object-cover" />
              : <span>{profile?.avatar_emoji || "🎾"}</span>}
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 w-52"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-gray-800 text-sm">{profile?.username}</p>
                <p className="text-xs text-gray-400">{profile?.level}</p>
              </div>
              {[
                { id: "profile", icon: "👤", label: "Mon Profil" },
                { id: "friends", icon: "❤️", label: "Mes Amis" },
                { id: "watch",   icon: "⌚", label: "Ma Montre" },
                { id: "rules",   icon: "📖", label: "Règles du Tennis" },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-court-cream transition-colors flex items-center gap-2"
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <div className="border-t border-gray-100">
                <button
                  onClick={() => { signOut(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
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

// ─── App shell ────────────────────────────────────────────────────────────────
function AppShell() {
  const { profile, session } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const PageComponent = pages[activePage] || Dashboard;

  // Show banner if username looks like an auto-generated email prefix
  const emailPrefix = session?.user?.email?.split("@")[0] || "";
  const isAutoUsername = profile?.username === emailPrefix || profile?.username?.startsWith(emailPrefix + "_") || false;
  const showSetupBanner = !bannerDismissed && profile && isAutoUsername;

  return (
    <div className="flex min-h-screen bg-court-cream">
      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <MobileDrawer
          activePage={activePage}
          onNavigate={setActivePage}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activePage={activePage}
          onNavigate={setActivePage}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
        {showSetupBanner && (
          <SetupBanner
            onNavigate={setActivePage}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 max-w-5xl mx-auto w-full">
          <PageComponent onNavigate={setActivePage} />
        </main>
      </div>

      <MobileNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
function AppRouter() {
  const { session } = useAuth();
  const [view, setView] = useState("landing");

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

  if (session) return <AppShell />;
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
