import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { NetPattern } from "../components/TennisIllustrations";

const DEVICE_TYPES = [
  {
    id: "xiaomi_band",
    name: "Xiaomi Smart Band",
    subtitle: "Band 8 / 9 / 10",
    icon: "📿",
    platform: "android",
    health_platform: "mi_fitness",
    color: "#FF6900",
    description: "Synchronise via l'app Mi Fitness sur Android. Les données de fréquence cardiaque et calories sont récupérées automatiquement après chaque match.",
    steps: [
      "Installe Mi Fitness sur ton téléphone Android",
      "Associe ton Xiaomi Band dans l'app",
      "Autorise le partage de données sportives",
      "Lance l'activité Tennis sur le bracelet avant de jouer",
    ],
    features: ["Fréquence cardiaque", "Calories", "Durée", "Notifications push"],
    compatible: true,
  },
  {
    id: "apple_watch",
    name: "Apple Watch",
    subtitle: "Series 6+ · Ultra",
    icon: "⌚",
    platform: "ios",
    health_platform: "health_kit",
    color: "#1C1C1E",
    description: "Connecte via HealthKit sur iPhone. Les données de Santé Apple (calories, FC, durée) sont importées directement dans ACE Tennis Hub.",
    steps: [
      "Ouvre l'app Santé sur ton iPhone",
      "Va dans Sources → ACE Tennis Hub",
      "Autorise l'accès aux données sportives",
      "Lance un entraînement Tennis depuis la montre",
    ],
    features: ["Fréquence cardiaque", "Calories", "GPS", "ECG", "Notifications push"],
    compatible: true,
  },
  {
    id: "wear_os",
    name: "Wear OS",
    subtitle: "Google / Samsung / Pixel Watch",
    icon: "🔵",
    platform: "android",
    health_platform: "google_fit",
    color: "#4285F4",
    description: "Synchronise via Google Fit. Compatible avec toutes les montres Wear OS 3.0+ incluant les Samsung Galaxy Watch et Google Pixel Watch.",
    steps: [
      "Installe Google Fit sur ton téléphone",
      "Associe ta montre Wear OS",
      "Lance l'activité Tennis depuis la montre",
      "Les données se synchronisent automatiquement",
    ],
    features: ["Fréquence cardiaque", "Calories", "GPS", "Steps", "Notifications"],
    compatible: true,
  },
  {
    id: "garmin",
    name: "Garmin",
    subtitle: "Forerunner · Fenix · Venu",
    icon: "🟢",
    platform: "android",
    health_platform: "garmin_connect",
    color: "#007CC3",
    description: "Synchronise via Garmin Connect. Les montres Garmin ont un excellent suivi tennis avec détection automatique des coups.",
    steps: [
      "Installe Garmin Connect sur ton téléphone",
      "Associe ta montre Garmin",
      "Configure le profil Tennis dans l'app",
      "Les données se synchronisent après la séance",
    ],
    features: ["Détection des coups", "Fréquence cardiaque", "GPS précis", "VO2 max"],
    compatible: true,
  },
  {
    id: "fitbit",
    name: "Fitbit / Google Pixel Watch",
    subtitle: "Sense · Versa · Inspire",
    icon: "💜",
    platform: "android",
    health_platform: "fitbit_api",
    color: "#00B0B9",
    description: "Compatible via l'API Fitbit. Récupère tes données de fréquence cardiaque et calories après chaque séance.",
    steps: [
      "Installe l'app Fitbit sur ton téléphone",
      "Lance une activité sport depuis la montre",
      "Synchronise dans l'app Fitbit",
      "ACE Tennis Hub importe les données",
    ],
    features: ["Fréquence cardiaque", "Calories", "Durée du sommeil"],
    compatible: true,
  },
  {
    id: "other",
    name: "Autre appareil",
    subtitle: "Polar · Suunto · Withings...",
    icon: "📱",
    platform: "web",
    health_platform: "other",
    color: "#6B7280",
    description: "Pour les autres montres, tu peux entrer manuellement tes données de fréquence cardiaque et calories lors de l'ajout d'un match.",
    steps: [
      "Consulte les données dans l'app de ta montre",
      "Note ta fréquence cardiaque et calories",
      "Entre ces données lors de l'ajout d'un match",
      "Ton profil se mettra à jour automatiquement",
    ],
    features: ["Saisie manuelle des données"],
    compatible: false,
  },
];

function DeviceCard({ device, connected, onConnect, onDisconnect, loading }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`card transition-all duration-200 ${connected ? "border-2 border-court-green" : "hover:shadow-lg"}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: `${device.color}18` }}>
          {device.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-gray-800">{device.name}</h3>
            {connected && (
              <span className="flex items-center gap-1 text-xs font-bold text-court-green bg-court-green/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-court-green rounded-full animate-pulse" />
                Connecté
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">{device.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600 text-sm px-2"
          >
            {expanded ? "▲" : "▼"}
          </button>
          {connected ? (
            <button
              onClick={() => onDisconnect(device.id)}
              disabled={loading}
              className="text-sm font-bold px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              Déconnecter
            </button>
          ) : (
            <button
              onClick={() => onConnect(device)}
              disabled={loading}
              className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-colors"
              style={{ background: device.color }}
            >
              Connecter
            </button>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-3">
        {device.features.map(f => (
          <span key={f} className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {f}
          </span>
        ))}
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-up">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{device.description}</p>
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
            Comment connecter ?
          </h4>
          <ol className="space-y-2">
            {device.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function SimulatedSessionCard({ session }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-court-cream rounded-xl border border-white">
      <div className="w-10 h-10 rounded-xl bg-court-blue/10 flex items-center justify-center text-xl flex-shrink-0">
        ⌚
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm">Session Tennis</p>
        <p className="text-xs text-gray-400">{session.date} · {session.duration_min} min</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="font-black text-court-orange text-sm">{session.calories}</p>
          <p className="text-xs text-gray-400">kcal</p>
        </div>
        <div>
          <p className="font-black text-red-500 text-sm">{session.avg_heart_rate}</p>
          <p className="text-xs text-gray-400">bpm</p>
        </div>
        <div>
          <p className="font-black text-court-blue text-sm">{session.max_heart_rate}</p>
          <p className="text-xs text-gray-400">max</p>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  const { session } = useAuth();
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [loadingDevice, setLoadingDevice] = useState(null);
  const [notification, setNotification] = useState(null);

  // Simulated past sessions for demo
  const mockSessions = [
    { date: "2026-03-18", duration_min: 75, calories: 420, avg_heart_rate: 142, max_heart_rate: 178 },
    { date: "2026-03-15", duration_min: 90, calories: 510, avg_heart_rate: 155, max_heart_rate: 185 },
    { date: "2026-03-12", duration_min: 60, calories: 335, avg_heart_rate: 138, max_heart_rate: 170 },
  ];

  useEffect(() => {
    if (!session) return;
    supabase
      .from("tennis_watch_devices")
      .select("*")
      .eq("user_id", session.user.id)
      .then(({ data }) => {
        if (data) setConnectedDevices(data);
      });
  }, [session]);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleConnect = async (device) => {
    if (!session) return;
    setLoadingDevice(device.id);
    try {
      const { data, error } = await supabase
        .from("tennis_watch_devices")
        .insert({
          user_id: session.user.id,
          device_type: device.id,
          device_name: `${device.name} — ${device.subtitle}`,
          platform: device.platform,
          health_platform: device.health_platform,
          is_connected: true,
          last_sync: new Date().toISOString(),
          notifications_enabled: true,
        })
        .select()
        .single();

      if (error) throw error;
      setConnectedDevices(prev => [...prev, data]);

      // Award badge if first device
      if (connectedDevices.length === 0) {
        await supabase.from("tennis_user_badges").insert({
          user_id: session.user.id,
          badge_id: "watch_sync",
        }).select();
        showNotif(`✅ ${device.name} connecté ! Badge "Tech Player" débloqué ⌚🎖️`);
      } else {
        showNotif(`✅ ${device.name} connecté avec succès !`);
      }
    } catch (err) {
      showNotif(`⚠️ Erreur : ${err.message}`);
    } finally {
      setLoadingDevice(null);
    }
  };

  const handleDisconnect = async (deviceType) => {
    if (!session) return;
    setLoadingDevice(deviceType);
    try {
      await supabase
        .from("tennis_watch_devices")
        .delete()
        .eq("user_id", session.user.id)
        .eq("device_type", deviceType);

      setConnectedDevices(prev => prev.filter(d => d.device_type !== deviceType));
      showNotif("🔌 Appareil déconnecté.");
    } finally {
      setLoadingDevice(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-court-green text-white px-6 py-4 rounded-2xl shadow-xl font-bold animate-slide-up max-w-sm">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 text-white"
        style={{ background: 'linear-gradient(135deg, #1C1C1E, #2D2D2F)' }}>
        <NetPattern />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm tracking-widest uppercase text-court-yellow opacity-80 mb-2">
              SYNC & HEALTH
            </p>
            <h2 className="font-display text-5xl">MONTRES & BRACELETS</h2>
            <p className="mt-2 text-white/60">
              Connecte ton wearable pour importer tes stats automatiquement après chaque match.
            </p>
          </div>
          <div className="hidden md:block text-7xl animate-bounce-slow">⌚</div>
        </div>
      </div>

      {/* Connected devices summary */}
      {connectedDevices.length > 0 && (
        <div className="card border-2 border-court-green">
          <h3 className="font-bold text-court-green text-base mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-court-green rounded-full animate-pulse" />
            {connectedDevices.length} appareil{connectedDevices.length > 1 ? "s" : ""} connecté{connectedDevices.length > 1 ? "s" : ""}
          </h3>
          <div className="flex flex-wrap gap-3">
            {connectedDevices.map(d => {
              const device = DEVICE_TYPES.find(dt => dt.id === d.device_type);
              return (
                <div key={d.id} className="flex items-center gap-2 px-3 py-2 bg-court-green/10 rounded-xl">
                  <span>{device?.icon}</span>
                  <span className="text-sm font-bold text-court-green">{device?.name}</span>
                  <span className="w-1.5 h-1.5 bg-court-green rounded-full animate-pulse" />
                </div>
              );
            })}
          </div>

          {/* Last sessions */}
          <div className="mt-5">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
              Dernières sessions synchronisées
            </h4>
            <div className="space-y-2">
              {mockSessions.map((s, i) => (
                <SimulatedSessionCard key={i} session={s} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="card bg-court-blue text-white border-0">
        <h3 className="font-black text-lg mb-3 flex items-center gap-2">⚡ Comment ça marche ?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "1", icon: "⌚", text: "Connecte ta montre dans cette page" },
            { step: "2", icon: "🎾", text: "Lance l'activité Tennis sur ta montre avant de jouer" },
            { step: "3", icon: "📊", text: "Tes stats apparaissent dans ton profil automatiquement" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <span className="text-xl">{s.icon}</span>
                <p className="text-white/80 text-sm mt-1">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device list */}
      <div>
        <h3 className="font-bold text-court-green text-lg mb-4">
          Appareils compatibles
        </h3>
        <div className="space-y-4">
          {DEVICE_TYPES.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              connected={connectedDevices.some(d => d.device_type === device.id)}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              loading={loadingDevice === device.id}
            />
          ))}
        </div>
      </div>

      {/* Notification info box */}
      <div className="rounded-2xl border-2 border-dashed border-court-blue/30 p-5 flex items-start gap-4 bg-court-blue/5">
        <span className="text-3xl">🔔</span>
        <div>
          <h4 className="font-black text-court-green text-base mb-1">Notifications vers ta montre</h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Une fois connecté, ta montre reçoit automatiquement les notifications de match :
            résultats, badges débloqués, alertes de défi hebdomadaire. Les notifications
            passent via ton téléphone — aucune app à installer sur la montre elle-même.
          </p>
        </div>
      </div>
    </div>
  );
}
