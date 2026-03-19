import { useState } from "react";
import { players, matches as initialMatches } from "../data/mockData";

const surfaces = [
  { id: "clay", label: "Terre Battue", emoji: "🟫", color: "#C17B5A" },
  { id: "hard", label: "Dur", emoji: "🔵", color: "#1C55DB" },
  { id: "grass", label: "Gazon", emoji: "🟢", color: "#1E4B33" },
];

function MatchCard({ match, allPlayers }) {
  const p1 = allPlayers.find(p => p.id === match.player1);
  const p2 = allPlayers.find(p => p.id === match.player2);
  const winner = allPlayers.find(p => p.id === match.winner);
  const surface = surfaces.find(s => s.id === match.surface);

  return (
    <div className="card animate-slide-up hover:shadow-lg transition-shadow">
      {/* Surface badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: surface?.color }}>
          {surface?.emoji} {surface?.label}
        </span>
        <span className="text-xs text-gray-400">{match.date} · {match.duration} min</span>
      </div>

      {/* Players vs */}
      <div className="flex items-center gap-4">
        {/* Player 1 */}
        <div className={`flex-1 text-center p-3 rounded-xl ${match.winner === match.player1 ? "bg-court-green/10 border-2 border-court-green" : "bg-gray-50"}`}>
          <div className="text-3xl mb-1">{p1?.avatar}</div>
          <p className={`font-bold text-sm ${match.winner === match.player1 ? "text-court-green" : "text-gray-600"}`}>
            {p1?.name.split(" ")[0]}
          </p>
          {match.winner === match.player1 && <span className="text-xs text-court-green font-black">🏆 GAGNANT</span>}
        </div>

        {/* Score */}
        <div className="text-center flex-shrink-0">
          <div className="font-display text-3xl text-court-blue tracking-wider">{match.score}</div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Score</div>
        </div>

        {/* Player 2 */}
        <div className={`flex-1 text-center p-3 rounded-xl ${match.winner === match.player2 ? "bg-court-green/10 border-2 border-court-green" : "bg-gray-50"}`}>
          <div className="text-3xl mb-1">{p2?.avatar}</div>
          <p className={`font-bold text-sm ${match.winner === match.player2 ? "text-court-green" : "text-gray-600"}`}>
            {p2?.name.split(" ")[0]}
          </p>
          {match.winner === match.player2 && <span className="text-xs text-court-green font-black">🏆 GAGNANT</span>}
        </div>
      </div>
    </div>
  );
}

export default function MatchTracker() {
  const [allMatches, setAllMatches] = useState(initialMatches);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    player1: "",
    player2: "",
    score: "",
    winner: "",
    surface: "clay",
    duration: "",
    type: "simple",
  });

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.player1 || !form.player2 || form.player1 === form.player2 || !form.score || !form.winner) {
      showNotif("⚠️ Merci de remplir tous les champs !");
      return;
    }
    const newMatch = {
      id: allMatches.length + 1,
      date: new Date().toISOString().split("T")[0],
      player1: Number(form.player1),
      player2: Number(form.player2),
      score: form.score,
      winner: Number(form.winner),
      type: form.type,
      duration: Number(form.duration) || 60,
      surface: form.surface,
    };
    setAllMatches([newMatch, ...allMatches]);
    setShowForm(false);
    setForm({ player1: "", player2: "", score: "", winner: "", surface: "clay", duration: "", type: "simple" });
    const w = players.find(p => p.id === Number(form.winner));
    showNotif(`🎾 Match ajouté ! ${w?.name.split(" ")[0]} remporte la victoire !`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-court-green text-white px-6 py-4 rounded-2xl shadow-xl font-bold animate-slide-up">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-court-green">MES MATCHS</h2>
          <p className="text-gray-500 text-sm mt-1">{allMatches.length} matchs enregistrés</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? "✕ Annuler" : "+ Nouveau Match"}
        </button>
      </div>

      {/* Add Match Form */}
      {showForm && (
        <div className="card border-2 border-court-blue animate-slide-up">
          <h3 className="font-bold text-court-green text-lg mb-5 flex items-center gap-2">
            🎾 Ajouter un Match
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Players */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Joueur 1</label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-court-blue outline-none"
                  value={form.player1}
                  onChange={e => setForm({ ...form, player1: e.target.value, winner: "" })}
                >
                  <option value="">Sélectionner...</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Joueur 2</label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-court-blue outline-none"
                  value={form.player2}
                  onChange={e => setForm({ ...form, player2: e.target.value, winner: "" })}
                >
                  <option value="">Sélectionner...</option>
                  {players.filter(p => String(p.id) !== form.player1).map(p => (
                    <option key={p.id} value={p.id}>{p.avatar} {p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Score and winner */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Score (ex: 6-4, 7-5)</label>
                <input
                  type="text"
                  placeholder="6-4, 7-5"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:border-court-blue outline-none"
                  value={form.score}
                  onChange={e => setForm({ ...form, score: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Gagnant 🏆</label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:border-court-blue outline-none"
                  value={form.winner}
                  onChange={e => setForm({ ...form, winner: e.target.value })}
                >
                  <option value="">Qui a gagné ?</option>
                  {[form.player1, form.player2].filter(Boolean).map(id => {
                    const p = players.find(p => String(p.id) === id);
                    return p ? <option key={p.id} value={p.id}>{p.avatar} {p.name}</option> : null;
                  })}
                </select>
              </div>
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Surface</label>
              <div className="flex gap-3">
                {surfaces.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setForm({ ...form, surface: s.id })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      form.surface === s.id ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    style={form.surface === s.id ? { background: s.color, borderColor: s.color } : {}}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Durée (minutes)</label>
              <input
                type="number"
                placeholder="60"
                min="10"
                max="300"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-court-blue outline-none"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1">
                🎾 Enregistrer le match
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Matches list */}
      <div className="space-y-4">
        {allMatches.map(match => (
          <MatchCard key={match.id} match={match} allPlayers={players} />
        ))}
      </div>
    </div>
  );
}
