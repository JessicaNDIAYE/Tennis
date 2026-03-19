import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { NetPattern } from "../components/TennisIllustrations";

// ─── Config ────────────────────────────────────────────────
const SUPABASE_FUNCTIONS_URL = "https://tvklioergzytwupzxfyi.supabase.co/functions/v1";
const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const STRAVA_SCOPES = "read,activity:read";

// ─── Device catalogue ──────────────────────────────────────
const DEVICES = [
  {
    id: "strava",
    name: "Strava",
    subtitle: "Connexion universelle — fonctionne avec toutes les montres",
    logo: StravaLogo,
    color: "#FC4C02",
    type: "oauth",
    features: ["Xiaomi Band (via Mi Fitness→Strava)", "Garmin (via Garmin Connect→Strava)", "Apple Watch", "Fitbit", "Polar", "Suunto"],
    how: [
      "Clique sur « Connecter Strava » ci-dessous",
      "Autorise ACE Tennis Hub dans ton compte Strava",
      "Tes activités Tennis seront importées automatiquement",
    ],
    note: "Strava est le lien universel — toutes les montres sportives peuvent synchroniser leurs données vers Strava.",
  },
  {
    id: "xiaomi",
    name: "Xiaomi Smart Band",
    subtitle: "Band 8 / 9 / 10 · Via Mi Fitness → Strava",
    logo: XiaomiLogo,
    color: "#FF6900",
    type: "guide",
    features: ["Fréquence cardiaque", "Calories", "Durée de séance", "Notifications push"],
    how: [
      "Ouvre l'app Mi Fitness sur ton téléphone",
      "Va dans Profil → Applications connectées",
      "Sélectionne Strava et autorise la connexion",
      "Lance l'activité Tennis sur ton bracelet avant de jouer",
      "Les données sont envoyées à Strava puis importées ici",
    ],
    note: "Mi Fitness n'a pas d'API publique — la synchro Strava est la méthode officielle.",
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    subtitle: "Forerunner 255 · Fenix · Venu · epix",
    logo: GarminLogo,
    color: "#007CC3",
    type: "guide",
    features: ["Détection automatique des coups", "Fréquence cardiaque", "GPS précis", "VO2 max", "Statistiques tennis avancées"],
    how: [
      "Ouvre Garmin Connect sur ton téléphone",
      "Menu → Applications Connectées → Strava → Connecter",
      "Lance l'activité Tennis depuis ta montre",
      "Après la séance, les données vont automatiquement dans Strava puis ici",
    ],
    note: "La Garmin Forerunner 255 a un profil Tennis intégré avec stats de coups. Super compatible !",
  },
  {
    id: "apple",
    name: "Apple Watch",
    subtitle: "Series 6+ · Ultra · SE",
    logo: AppleLogo,
    color: "#1C1C1E",
    type: "guide",
    features: ["Fréquence cardiaque", "Calories", "ECG", "Température", "Strava native"],
    how: [
      "Installe l'app Strava sur ton iPhone et Apple Watch",
      "Lance un entraînement Strava directement depuis la montre",
      "Ou utilise l'app Workout puis laisse Strava lire Apple Health",
      "Les activités Tennis sont importées automatiquement ici",
    ],
    note: "Apple Watch fonctionne parfaitement avec Strava nativement.",
  },
];

// ─── SVG Logos ─────────────────────────────────────────────
function StravaLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#FC4C02" />
      <path d="M13 22 L17 14 L21 22 M15 19.5 L19 19.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function XiaomiLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#FF6900" />
      <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">Mi</text>
    </svg>
  );
}

function GarminLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#007CC3" />
      <text x="16" y="21" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">GARMIN</text>
    </svg>
  );
}

function AppleLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#1C1C1E" />
      <path d="M20 10 Q21 7 19 6 Q17 8 17 10 Q19 10 20 10Z" fill="white" />
      <path d="M22 12 Q24 12 25 14 Q26 17 25 20 Q24 23 22 24 Q21 22 18 22 Q15 22 14 24 Q12 23 11 20 Q10 17 11 14 Q12 12 14 12 Q16 13 18 13 Q20 13 22 12Z"
        fill="white" />
    </svg>
  );
}

// ─── Strava Activity Card ───────────────────────────────────
function StravaActivityCard({ activity }) {
  const typeEmoji = { Tennis: "🎾", Run: "🏃", Ride: "🚴", Swim: "🏊", Other: "⚡" };
  const emoji = typeEmoji[activity.sport_type] || typeEmoji.Other;
  const duration = Math.floor(activity.elapsed_time / 60);
  return (
    <div className="flex items-center gap-4 p-3 bg-court-cream rounded-xl border border-white">
      <div className="w-10 h-10 rounded-xl bg-[#FC4C02]/10 flex items-center justify-center text-xl flex-shrink-0">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm truncate">{activity.name}</p>
        <p className="text-xs text-gray-400">
          {new Date(activity.start_date_local).toLocaleDateString("fr-FR")} · {duration} min
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="font-black text-court-orange text-sm">{Math.round(activity.calories || 0)}</p>
          <p className="text-xs text-gray-400">kcal</p>
        </div>
        <div>
          <p className="font-black text-red-500 text-sm">{activity.average_heartrate ? Math.round(activity.average_heartrate) : "–"}</p>
          <p className="text-xs text-gray-400">bpm</p>
        </div>
        <div>
          <p className="font-black text-court-blue text-sm">{activity.max_heartrate ? Math.round(activity.max_heartrate) : "–"}</p>
          <p className="text-xs text-gray-400">max</p>
        </div>
      </div>
    </div>
  );
}

// ─── Device Guide Card ─────────────────────────────────────
function DeviceCard({ device, isConnected, stravaConnected }) {
  const [expanded, setExpanded] = useState(false);
  const Logo = device.logo;
  const isStrava = device.id === "strava";

  return (
    <div className={`card transition-all ${isConnected && isStrava ? "border-2 border-[#FC4C02]/60" : ""}`}>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-shrink-0"><Logo size={40} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black text-gray-800">{device.name}</h3>
            {isConnected && isStrava && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#FC4C02] bg-[#FC4C02]/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#FC4C02] rounded-full animate-pulse" />
                Connecté
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs">{device.subtitle}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)}
          className="text-gray-400 text-xs px-2 flex-shrink-0">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {device.features.map(f => (
          <span key={f} className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {f}
          </span>
        ))}
      </div>

      {/* Note */}
      {!isStrava && (
        <div className="flex items-start gap-2 bg-court-blue/5 border border-court-blue/20 rounded-xl px-3 py-2 text-xs text-court-blue mb-2">
          <span className="flex-shrink-0 mt-0.5">💡</span>
          <span>{device.note}</span>
        </div>
      )}

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 animate-slide-up">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Comment faire ?</h4>
          <ol className="space-y-2">
            {device.how.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {device.note && isStrava && (
            <p className="text-xs text-gray-400 italic mt-3 pl-9">{device.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main WatchPage ─────────────────────────────────────────
export default function WatchPage() {
  const { session } = useAuth();
  const [stravaIntegration, setStravaIntegration] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [notification, setNotification] = useState(null);
  const [importing, setImporting] = useState(false);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Check URL params for Strava OAuth callback result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stravaStatus = params.get("strava");
    if (stravaStatus === "connected") {
      showNotif("✅ Strava connecté ! Tes activités sont maintenant synchronisées 🎾");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (stravaStatus === "error") {
      showNotif("⚠️ Erreur lors de la connexion Strava. Réessaie.");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (stravaStatus === "misconfigured") {
      showNotif("⚠️ Strava n'est pas encore configuré sur ce serveur. Contacte l'admin.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Load existing integration
  useEffect(() => {
    if (!session) return;
    supabase
      .from("tennis_integrations")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("provider", "strava")
      .single()
      .then(({ data }) => {
        if (data?.is_active) setStravaIntegration(data);
      });
  }, [session]);

  // Load Strava activities when integration exists
  useEffect(() => {
    if (!stravaIntegration?.access_token) return;
    fetchStravaActivities(stravaIntegration.access_token);
  }, [stravaIntegration]);

  const fetchStravaActivities = async (token) => {
    setLoadingActivities(true);
    try {
      const res = await fetch(
        "https://www.strava.com/api/v3/athlete/activities?per_page=10&page=1",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 401) {
        // Token expired — show reconnect prompt
        setStravaIntegration(prev => prev ? { ...prev, expired: true } : null);
        return;
      }
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } finally {
      setLoadingActivities(false);
    }
  };

  const connectStrava = () => {
    if (!session) return;
    if (!STRAVA_CLIENT_ID) {
      showNotif("⚠️ VITE_STRAVA_CLIENT_ID non configuré dans .env — voir le guide ci-dessous.");
      return;
    }
    const redirectUri = encodeURIComponent(`${SUPABASE_FUNCTIONS_URL}/strava-oauth`);
    const state = encodeURIComponent(session.user.id);
    const url = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${STRAVA_SCOPES}&state=${state}&approval_prompt=force`;
    window.location.href = url;
  };

  const disconnectStrava = async () => {
    if (!session) return;
    await supabase
      .from("tennis_integrations")
      .delete()
      .eq("user_id", session.user.id)
      .eq("provider", "strava");
    setStravaIntegration(null);
    setActivities([]);
    showNotif("🔌 Strava déconnecté.");
  };

  const importActivities = async () => {
    if (!stravaIntegration || activities.length === 0) return;
    setImporting(true);
    let count = 0;
    for (const act of activities) {
      const { error } = await supabase.from("tennis_watch_sessions").upsert({
        user_id: session.user.id,
        strava_activity_id: act.id,
        strava_name: act.name,
        sport_type: act.sport_type,
        calories: act.calories || null,
        avg_heart_rate: act.average_heartrate ? Math.round(act.average_heartrate) : null,
        max_heart_rate: act.max_heartrate ? Math.round(act.max_heartrate) : null,
        duration_min: Math.round(act.elapsed_time / 60),
        started_at: act.start_date_local,
        ended_at: null,
      }, { onConflict: "strava_activity_id" });
      if (!error) count++;
    }
    setImporting(false);

    // Update calories/time on user profile
    const totalCalories = activities.reduce((acc, a) => acc + (a.calories || 0), 0);
    const totalMin = activities.reduce((acc, a) => acc + Math.round(a.elapsed_time / 60), 0);
    await supabase.from("tennis_profiles")
      .update({ calories: totalCalories, play_time_min: totalMin })
      .eq("user_id", session.user.id);

    showNotif(`✅ ${count} activités importées dans ton profil !`);
  };

  const isConnected = !!stravaIntegration && !stravaIntegration.expired;
  const tenisActivities = activities.filter(a =>
    a.sport_type === "Tennis" || a.name?.toLowerCase().includes("tennis")
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-court-green text-white px-6 py-4 rounded-2xl shadow-xl font-bold animate-slide-up max-w-sm">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 text-white"
        style={{ background: "linear-gradient(135deg, #1C1C1E, #2D2D2F)" }}>
        <NetPattern />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm tracking-widest uppercase opacity-70 text-[#FC4C02] mb-2">
              SPORT DATA SYNC
            </p>
            <h2 className="font-display text-5xl">MONTRES & APPLIS</h2>
            <p className="mt-2 text-white/60">
              Connecte Strava pour importer automatiquement tes séances depuis n'importe quelle montre.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <StravaLogo size={56} />
            {isConnected && (
              <span className="text-xs text-[#FC4C02] font-bold">Connecté</span>
            )}
          </div>
        </div>
      </div>

      {/* Strava Connect / Status box */}
      <div className={`card ${isConnected ? "border-2 border-[#FC4C02]/40" : ""}`}>
        <div className="flex items-center gap-5">
          <StravaLogo size={52} />
          <div className="flex-1">
            <h3 className="font-black text-xl text-gray-800">
              {isConnected ? `Connecté en tant que ${stravaIntegration.athlete_name || "toi"}` : "Connecter Strava"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {isConnected
                ? `Dernière sync : ${stravaIntegration.last_sync?.slice(0, 10) || "–"} · ${activities.length} activités récentes trouvées`
                : "La connexion universelle — fonctionne avec Xiaomi Band, Garmin, Apple Watch et tous les autres."
              }
            </p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {isConnected ? (
              <>
                <button
                  onClick={() => fetchStravaActivities(stravaIntegration.access_token)}
                  disabled={loadingActivities}
                  className="btn-primary text-sm py-2"
                >
                  {loadingActivities ? "⏳" : "🔄 Actualiser"}
                </button>
                <button
                  onClick={disconnectStrava}
                  className="text-sm font-bold px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Déconnecter
                </button>
              </>
            ) : (
              <button
                onClick={connectStrava}
                className="font-black text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                style={{ background: "#FC4C02" }}
              >
                <StravaLogo size={20} />
                Connecter Strava
              </button>
            )}
          </div>
        </div>

        {/* Token expired warning */}
        {stravaIntegration?.expired && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
            ⚠️ Ta session Strava a expiré. Reconnecte-toi pour actualiser les données.
          </div>
        )}

        {/* No client ID warning */}
        {!STRAVA_CLIENT_ID && !isConnected && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600">
            <p className="font-bold mb-1">⚙️ Configuration requise</p>
            <p>Pour activer Strava, ajoute <code className="bg-gray-200 px-1 rounded">VITE_STRAVA_CLIENT_ID</code> dans ton fichier <code className="bg-gray-200 px-1 rounded">.env</code>.</p>
            <p className="mt-1">Crée une app Strava sur <strong>strava.com/settings/api</strong>, puis copie le Client ID.</p>
            <p className="mt-1">Set aussi <code className="bg-gray-200 px-1 rounded">STRAVA_CLIENT_SECRET</code> comme secret dans Supabase Edge Functions.</p>
          </div>
        )}
      </div>

      {/* Strava activities */}
      {isConnected && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <StravaLogo size={22} />
              Activités récentes Strava
              {tenisActivities.length > 0 && (
                <span className="bg-[#FC4C02]/10 text-[#FC4C02] text-xs font-black px-2 py-0.5 rounded-full">
                  {tenisActivities.length} tennis
                </span>
              )}
            </h3>
            {activities.length > 0 && (
              <button
                onClick={importActivities}
                disabled={importing}
                className="btn-secondary text-sm py-2"
              >
                {importing ? "⏳ Import..." : "⬇️ Importer dans mon profil"}
              </button>
            )}
          </div>

          {loadingActivities ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🎾</p>
              <p className="text-sm">Aucune activité trouvée. Lance une séance tennis puis actualise !</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map(act => (
                <StravaActivityCard key={act.id} activity={act} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Device guides */}
      <div>
        <h3 className="font-bold text-court-green text-lg mb-4">
          Guides par appareil
        </h3>
        <div className="space-y-4">
          {DEVICES.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              isConnected={isConnected && device.id === "strava"}
              stravaConnected={isConnected}
            />
          ))}
        </div>
      </div>

      {/* How it works globally */}
      <div className="card bg-court-blue text-white border-0">
        <h3 className="font-black text-lg mb-4 flex items-center gap-2">⚡ Principe de fonctionnement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: "1", icon: "⌚", text: "Lance l'activité Tennis sur ta montre" },
            { step: "2", icon: "📱", text: "Ta montre synchro avec Garmin Connect ou Mi Fitness" },
            { step: "3", icon: "🏃", text: "Garmin/Mi Fitness envoie vers Strava (config 1 fois)" },
            { step: "4", icon: "🎾", text: "ACE Tennis Hub importe depuis Strava → ton profil se met à jour" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <span className="text-xl">{s.icon}</span>
                <p className="text-white/80 text-xs mt-1">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
