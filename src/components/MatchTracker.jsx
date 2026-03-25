import { useState } from "react";
import { useMatches, useFriendPlayers, useAddMatch } from "../hooks/useTennisData";
import { useAuth } from "../context/AuthContext";

const surfaces = [
  { id: "clay",  label: "Terre",  emoji: "🟫", color: "#C17B5A" },
  { id: "hard",  label: "Dur",    emoji: "🔵", color: "#1C55DB" },
  { id: "grass", label: "Gazon",  emoji: "🟢", color: "#1E4B33" },
];

// ─── Match card ───────────────────────────────────────────────────────────────
function MatchCard({ match }) {
  const p1 = match.player1;
  const p2 = match.player2;
  const surface = surfaces.find(s => s.id === match.surface) || surfaces[1];
  const isDouble = match.match_type === "double";

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: surface.color }}>
            {surface.emoji} {surface.label}
          </span>
          {isDouble && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-600">
              👥 Double
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {match.played_at?.slice(0, 10)} · {match.duration_min} min
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Team A */}
        <div className={`flex-1 text-center p-3 rounded-xl ${match.winner_id === match.player1_id ? "bg-green-50 border-2 border-green-400" : "bg-gray-50"}`}>
          <div className="text-2xl mb-1">{p1?.avatar_emoji || "🎾"}</div>
          <p className={`font-bold text-sm ${match.winner_id === match.player1_id ? "text-green-700" : "text-gray-600"}`}>
            {p1?.username || "?"}
          </p>
          {isDouble && match.player3_id && (
            <p className="text-xs text-gray-400 mt-0.5">+ partenaire</p>
          )}
          {match.winner_id === match.player1_id && (
            <span className="text-xs text-green-600 font-black">🏆 GAGNÉ</span>
          )}
        </div>

        {/* Score */}
        <div className="text-center flex-shrink-0 px-2">
          <div className="font-display text-2xl sm:text-3xl text-court-blue tracking-wider">{match.score}</div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">VS</div>
        </div>

        {/* Team B */}
        <div className={`flex-1 text-center p-3 rounded-xl ${match.winner_id === match.player2_id ? "bg-green-50 border-2 border-green-400" : "bg-gray-50"}`}>
          <div className="text-2xl mb-1">{p2?.avatar_emoji || "🎾"}</div>
          <p className={`font-bold text-sm ${match.winner_id === match.player2_id ? "text-green-700" : "text-gray-600"}`}>
            {p2?.username || "?"}
          </p>
          {isDouble && match.player4_id && (
            <p className="text-xs text-gray-400 mt-0.5">+ partenaire</p>
          )}
          {match.winner_id === match.player2_id && (
            <span className="text-xs text-green-600 font-black">🏆 GAGNÉ</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Player select ────────────────────────────────────────────────────────────
function PlayerSelect({ label, value, onChange, players, exclude = [], placeholder = "Choisir..." }) {
  const available = players.filter(p => !exclude.includes(p.user_id));
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <select
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-court-blue outline-none bg-white"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {available.map(p => (
          <option key={p.user_id} value={p.user_id}>{p.avatar_emoji} {p.username}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MatchTracker() {
  const { session, profile } = useAuth();
  const { matches, loading, refetch } = useMatches();
  const { players: friends, loading: loadingFriends } = useFriendPlayers();
  const { addMatch, loading: adding } = useAddMatch();

  const [showForm, setShowForm] = useState(false);
  const [matchType, setMatchType] = useState("simple"); // "simple" | "double"
  const [notification, setNotification] = useState(null);

  const emptyForm = {
    player2_id: "",
    player3_id: "", // my partner (double)
    player4_id: "", // their partner (double)
    score: "",
    winner_id: "",
    surface: "clay",
    duration_min: "90",
  };
  const [form, setForm] = useState(emptyForm);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMatchType("simple");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) { showNotif("⚠️ Tu dois être connecté."); return; }

    const isDouble = matchType === "double";
    if (!form.player2_id || !form.score || !form.winner_id) {
      showNotif("⚠️ Remplis tous les champs obligatoires.");
      return;
    }
    if (isDouble && (!form.player3_id || !form.player4_id)) {
      showNotif("⚠️ En double, choisis les 4 joueurs.");
      return;
    }

    try {
      await addMatch({
        player1_id: session.user.id,
        player2_id: form.player2_id,
        player3_id: isDouble ? form.player3_id : null,
        player4_id: isDouble ? form.player4_id : null,
        score: form.score,
        winner_id: form.winner_id,
        surface: form.surface,
        duration_min: Number(form.duration_min) || 90,
        match_type: matchType,
      });
      refetch();
      setShowForm(false);
      resetForm();
      showNotif("🎾 Match enregistré avec succès ! 🏆");
    } catch (err) {
      showNotif(`⚠️ ${err.message}`);
    }
  };

  // For "who won" selector
  const winnerOptions = matchType === "double"
    ? [
        { id: session?.user.id, label: `${profile?.avatar_emoji || "🎾"} ${profile?.username || "Moi"} (mon équipe)` },
        form.player2_id ? { id: form.player2_id, label: `${friends.find(p => p.user_id === form.player2_id)?.avatar_emoji || "🎾"} ${friends.find(p => p.user_id === form.player2_id)?.username || "?"} (leur équipe)` } : null,
      ].filter(Boolean)
    : [
        session && profile ? { id: session.user.id, label: `${profile.avatar_emoji || "🎾"} ${profile.username || "Moi"}` } : null,
        form.player2_id ? { id: form.player2_id, label: `${friends.find(p => p.user_id === form.player2_id)?.avatar_emoji || "🎾"} ${friends.find(p => p.user_id === form.player2_id)?.username || "?"}` } : null,
      ].filter(Boolean);

  const usedIds = [session?.user.id, form.player2_id, form.player3_id, form.player4_id].filter(Boolean);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Notification toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-court-green text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm animate-slide-up max-w-xs text-center">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-court-green">MES MATCHS</h2>
          <p className="text-gray-500 text-sm mt-1">{loading ? "…" : matches.length} matchs enregistrés</p>
        </div>
        <button
          onClick={() => { setShowForm(f => !f); if (showForm) resetForm(); }}
          className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2"
        >
          {showForm ? "✕ Annuler" : "+ Nouveau Match"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card border-2 border-court-blue animate-slide-up">
          <h3 className="font-bold text-court-green text-base mb-4 flex items-center gap-2">
            🎾 Nouveau match
            {friends.length === 0 && !loadingFriends && (
              <span className="text-xs text-orange-500 font-normal bg-orange-50 px-2 py-1 rounded-full">
                Ajoute des amis pour enregistrer des matchs !
              </span>
            )}
          </h3>

          {/* Match type toggle */}
          <div className="flex bg-court-cream rounded-2xl p-1 gap-1 mb-5">
            <button
              type="button"
              onClick={() => { setMatchType("simple"); setForm(f => ({ ...f, player3_id: "", player4_id: "", winner_id: "" })); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${matchType === "simple" ? "bg-white text-court-green shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              🎾 Simple (1 vs 1)
            </button>
            <button
              type="button"
              onClick={() => { setMatchType("double"); setForm(f => ({ ...f, winner_id: "" })); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${matchType === "double" ? "bg-white text-court-green shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              👥 Double (2 vs 2)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {matchType === "simple" ? (
              // ── Simple ──
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Toi</label>
                  <div className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-medium bg-court-cream text-gray-600">
                    {profile?.avatar_emoji} {profile?.username || "Moi"}
                  </div>
                </div>
                <PlayerSelect
                  label="Adversaire"
                  value={form.player2_id}
                  onChange={v => setForm(f => ({ ...f, player2_id: v, winner_id: "" }))}
                  players={friends}
                  exclude={[session?.user.id]}
                  placeholder="Choisis..."
                />
              </div>
            ) : (
              // ── Double ──
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-2xl p-3">
                  <p className="text-xs font-black text-court-blue uppercase tracking-wide mb-2">🟦 Mon équipe</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Toi</label>
                      <div className="w-full border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-medium bg-white text-gray-600">
                        {profile?.avatar_emoji} {profile?.username || "Moi"}
                      </div>
                    </div>
                    <PlayerSelect
                      label="Mon partenaire"
                      value={form.player3_id}
                      onChange={v => setForm(f => ({ ...f, player3_id: v }))}
                      players={friends}
                      exclude={[session?.user.id, form.player2_id, form.player4_id]}
                      placeholder="Partenaire..."
                    />
                  </div>
                </div>
                <div className="bg-red-50 rounded-2xl p-3">
                  <p className="text-xs font-black text-red-500 uppercase tracking-wide mb-2">🟥 Équipe adverse</p>
                  <div className="grid grid-cols-2 gap-3">
                    <PlayerSelect
                      label="Adversaire 1"
                      value={form.player2_id}
                      onChange={v => setForm(f => ({ ...f, player2_id: v, winner_id: "" }))}
                      players={friends}
                      exclude={[session?.user.id, form.player3_id, form.player4_id]}
                      placeholder="Joueur..."
                    />
                    <PlayerSelect
                      label="Adversaire 2"
                      value={form.player4_id}
                      onChange={v => setForm(f => ({ ...f, player4_id: v }))}
                      players={friends}
                      exclude={[session?.user.id, form.player2_id, form.player3_id]}
                      placeholder="Joueur..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Score */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Score</label>
                <input
                  type="text"
                  placeholder="6-4, 7-5"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-court-blue outline-none"
                  value={form.score}
                  onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Durée (min)</label>
                <input
                  type="number"
                  placeholder="90"
                  min="10"
                  max="300"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-court-blue outline-none"
                  value={form.duration_min}
                  onChange={e => setForm(f => ({ ...f, duration_min: e.target.value }))}
                />
              </div>
            </div>

            {/* Winner */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                {matchType === "double" ? "🏆 Équipe gagnante" : "🏆 Gagnant"}
              </label>
              <select
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-court-blue outline-none"
                value={form.winner_id}
                onChange={e => setForm(f => ({ ...f, winner_id: e.target.value }))}
                required
              >
                <option value="">Qui a gagné ?</option>
                {winnerOptions.map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Surface */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Surface</label>
              <div className="grid grid-cols-3 gap-2">
                {surfaces.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, surface: s.id }))}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      form.surface === s.id ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    style={form.surface === s.id ? { background: s.color } : {}}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={adding || friends.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {adding
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : "🎾 Enregistrer le match"}
            </button>
          </form>
        </div>
      )}

      {/* Match list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="card h-32 animate-pulse bg-gray-100" />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="text-6xl mb-4">🎾</div>
          <p className="text-gray-400 font-medium">Aucun match encore. Ajoute des amis et jouez !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => <MatchCard key={match.id} match={match} />)}
        </div>
      )}
    </div>
  );
}
