import { useState } from "react";
import { useMatches, usePlayers, useAddMatch } from "../hooks/useTennisData";
import { useAuth } from "../context/AuthContext";

const surfaces = [
  { id: "clay", label: "Terre Battue", emoji: "🟫", color: "#C17B5A" },
  { id: "hard", label: "Dur", emoji: "🔵", color: "#1C55DB" },
  { id: "grass", label: "Gazon", emoji: "🟢", color: "#1E4B33" },
];

function MatchCard({ match }) {
  const p1 = match.player1;
  const p2 = match.player2;
  const winner = match.winner;
  const surface = surfaces.find(s => s.id === match.surface) || surfaces[1];

  return (
    <div className="card animate-slide-up hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: surface.color }}>
          {surface.emoji} {surface.label}
        </span>
        <span className="text-xs text-gray-400">{match.played_at?.slice(0, 10)} · {match.duration_min} min</span>
      </div>
      <div className="flex items-center gap-4">
        <div className={`flex-1 text-center p-3 rounded-xl ${match.winner_id === match.player1_id ? "bg-court-green/10 border-2 border-court-green" : "bg-gray-50"}`}>
          <div className="text-3xl mb-1">{p1?.avatar_emoji || "🎾"}</div>
          <p className={`font-bold text-sm ${match.winner_id === match.player1_id ? "text-court-green" : "text-gray-600"}`}>
            {p1?.username || "?"}
          </p>
          {match.winner_id === match.player1_id && <span className="text-xs text-court-green font-black">🏆 GAGNANT</span>}
        </div>
        <div className="text-center flex-shrink-0">
          <div className="font-display text-3xl text-court-blue tracking-wider">{match.score}</div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Score</div>
        </div>
        <div className={`flex-1 text-center p-3 rounded-xl ${match.winner_id === match.player2_id ? "bg-court-green/10 border-2 border-court-green" : "bg-gray-50"}`}>
          <div className="text-3xl mb-1">{p2?.avatar_emoji || "🎾"}</div>
          <p className={`font-bold text-sm ${match.winner_id === match.player2_id ? "text-court-green" : "text-gray-600"}`}>
            {p2?.username || "?"}
          </p>
          {match.winner_id === match.player2_id && <span className="text-xs text-court-green font-black">🏆 GAGNANT</span>}
        </div>
      </div>
    </div>
  );
}

export default function MatchTracker() {
  const { session, profile } = useAuth();
  const { matches, loading, refetch } = useMatches();
  const { players } = usePlayers();
  const { addMatch, loading: adding } = useAddMatch();

  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    player2_id: "", score: "", winner_id: "", surface: "clay", duration_min: "60",
  });

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) { showNotif("⚠️ Tu dois être connecté pour ajouter un match."); return; }
    if (!form.player2_id || !form.score || !form.winner_id) {
      showNotif("⚠️ Merci de remplir tous les champs !");
      return;
    }
    try {
      await addMatch({
        player1_id: session.user.id,
        player2_id: form.player2_id,
        score: form.score,
        winner_id: form.winner_id,
        surface: form.surface,
        duration_min: Number(form.duration_min) || 60,
      });
      refetch();
      setShowForm(false);
      setForm({ player2_id: "", score: "", winner_id: "", surface: "clay", duration_min: "60" });
      const winner = players.find(p => p.user_id === form.winner_id);
      showNotif(`🎾 Match enregistré ! ${winner?.username || "Joueur"} remporte la victoire ! 🏆`);
    } catch (err) {
      showNotif(`⚠️ ${err.message}`);
    }
  };

  const otherPlayers = players.filter(p => p.user_id !== session?.user.id);
  const player1Player = profile;

  return (
    <div className="space-y-6 animate-fade-in">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-court-green text-white px-6 py-4 rounded-2xl shadow-xl font-bold animate-slide-up max-w-sm">
          {notification}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-court-green">MES MATCHS</h2>
          <p className="text-gray-500 text-sm mt-1">{loading ? "…" : matches.length} matchs enregistrés</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? "✕ Annuler" : "+ Nouveau Match"}
        </button>
      </div>

      {showForm && (
        <div className="card border-2 border-court-blue animate-slide-up">
          <h3 className="font-bold text-court-green text-lg mb-5 flex items-center gap-2">🎾 Ajouter un Match</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Players */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Toi (Joueur 1)</label>
                <div className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium bg-gray-50 text-gray-500">
                  {player1Player?.avatar_emoji} {player1Player?.username || "Moi"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Adversaire (Joueur 2)</label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-court-blue outline-none"
                  value={form.player2_id}
                  onChange={e => setForm({ ...form, player2_id: e.target.value, winner_id: "" })}
                  required
                >
                  <option value="">Sélectionner...</option>
                  {otherPlayers.map(p => (
                    <option key={p.id} value={p.user_id}>{p.avatar_emoji} {p.username}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Score (ex: 6-4, 7-5)</label>
                <input type="text" placeholder="6-4, 7-5"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-court-blue outline-none"
                  value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Gagnant 🏆</label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-court-blue outline-none"
                  value={form.winner_id} onChange={e => setForm({ ...form, winner_id: e.target.value })} required>
                  <option value="">Qui a gagné ?</option>
                  {[
                    session && profile ? { user_id: session.user.id, username: profile.username, avatar_emoji: profile.avatar_emoji } : null,
                    form.player2_id ? otherPlayers.find(p => p.user_id === form.player2_id) : null
                  ].filter(Boolean).map(p => (
                    <option key={p.user_id} value={p.user_id}>{p.avatar_emoji} {p.username}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Surface</label>
              <div className="flex gap-3">
                {surfaces.map(s => (
                  <button key={s.id} type="button" onClick={() => setForm({ ...form, surface: s.id })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      form.surface === s.id ? "text-white border-transparent" : "border-gray-200 text-gray-600"
                    }`}
                    style={form.surface === s.id ? { background: s.color } : {}}>
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Durée (minutes)</label>
              <input type="number" placeholder="60" min="10" max="300"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-court-blue outline-none"
                value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} />
            </div>

            <button type="submit" disabled={adding} className="btn-primary w-full flex items-center justify-center gap-2">
              {adding
                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : "🎾 Enregistrer le match"
              }
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="card h-36 animate-pulse bg-gray-100" />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="text-6xl mb-4">🎾</div>
          <p className="text-gray-400 font-medium">Aucun match encore. Soyez les premiers à jouer !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => <MatchCard key={match.id} match={match} />)}
        </div>
      )}
    </div>
  );
}
