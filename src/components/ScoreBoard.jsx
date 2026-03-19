import { useState } from "react";
import { usePlayers, useMatches } from "../hooks/useTennisData";
import { PlayerAvatar, TennisBall, NetPattern } from "./TennisIllustrations";

function WinRateBar({ wins, losses }) {
  const total = wins + losses;
  const pct = total > 0 ? Math.round((wins / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: pct >= 70 ? "#A8D84E" : pct >= 50 ? "#1C55DB" : "#FCA833" }} />
      </div>
      <span className="text-xs font-bold text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

function PlayerRow({ player, rank, isExpanded, onToggle }) {
  const rankMedal = ["🥇", "🥈", "🥉"];
  const colors = ["#1C55DB", "#1E4B33", "#FCA833", "#A8D84E", "#C17B5A", "#8B5CF6", "#EC4899"];
  const colorIdx = player.username?.charCodeAt(0) % colors.length || 0;
  const color = colors[colorIdx];

  return (
    <>
      <tr onClick={onToggle}
        className={`cursor-pointer transition-colors ${isExpanded ? "bg-court-blue/5" : "hover:bg-court-cream/50"}`}>
        <td className="px-4 py-3">
          {rank <= 3
            ? <span className="text-2xl">{rankMedal[rank - 1]}</span>
            : <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">{rank}</span>
          }
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <PlayerAvatar emoji={player.avatar_emoji || "🎾"} color={color} size={42} rank={rank} />
            <div>
              <p className="font-bold text-gray-800">{player.username}</p>
              <p className="text-xs text-gray-400">{player.level}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="text-xl font-black text-court-blue">{player.wins}</span>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="text-lg font-bold text-red-400">{player.losses}</span>
        </td>
        <td className="px-4 py-3">
          <WinRateBar wins={player.wins} losses={player.losses} />
        </td>
        <td className="px-4 py-3 text-center">
          {player.streak > 0 && (
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
              🔥 {player.streak}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          <span className="text-gray-400 text-sm">{isExpanded ? "▲" : "▼"}</span>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-court-blue/5 border-b border-court-blue/10">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-black text-court-green">{player.total_sets || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Sets gagnés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-court-orange">{(player.calories || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-court-blue">
                  {Math.floor((player.play_time_min || 0) / 60)}h{(player.play_time_min || 0) % 60}m
                </p>
                <p className="text-xs text-gray-500 mt-1">Temps de jeu</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-purple-500">{player.streak || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Série actuelle</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function ScoreBoard() {
  const { players, loading } = usePlayers();
  const { matches } = useMatches();
  const [sortBy, setSortBy] = useState("wins");
  const [expanded, setExpanded] = useState(null);

  const sorted = [...players].sort((a, b) => {
    if (sortBy === "wins") return b.wins - a.wins;
    if (sortBy === "winRate") {
      const rA = (a.wins + a.losses) > 0 ? a.wins / (a.wins + a.losses) : 0;
      const rB = (b.wins + b.losses) > 0 ? b.wins / (b.wins + b.losses) : 0;
      return rB - rA;
    }
    if (sortBy === "streak") return (b.streak || 0) - (a.streak || 0);
    return 0;
  });

  const leader = sorted[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-court-blue p-8 text-white">
        <NetPattern />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-court-yellow font-bold text-sm tracking-widest uppercase mb-2">SAISON PRINTEMPS 2026</p>
            <h2 className="font-display text-5xl">CLASSEMENT</h2>
            <p className="text-white/60 mt-1">{players.length} joueurs · {matches.length} matchs disputés</p>
          </div>
          {leader && (
            <div className="hidden md:flex flex-col items-center">
              <PlayerAvatar emoji={leader.avatar_emoji || "🎾"} color="#F6ED5B" size={64} rank={1} />
              <p className="text-court-yellow font-bold mt-2">{leader.username}</p>
              <p className="text-white/60 text-xs">{leader.wins} victoires</p>
            </div>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm text-gray-500 font-medium self-center mr-2">Trier par :</span>
        {[
          { key: "wins", label: "Victoires" },
          { key: "winRate", label: "Ratio V/D" },
          { key: "streak", label: "Série en cours" },
        ].map(s => (
          <button key={s.key} onClick={() => setSortBy(s.key)}
            className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
              sortBy === s.key ? "bg-court-blue text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-court-blue"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-12 text-center">
            <TennisBall size={50} animate />
            <p className="text-gray-400 mt-4">Aucun joueur encore. Inscris tes amis !</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-court-cream border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Joueur</th>
                  <th className="px-4 py-3 text-center text-xs font-black text-court-blue uppercase tracking-wider">V</th>
                  <th className="px-4 py-3 text-center text-xs font-black text-red-400 uppercase tracking-wider">D</th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider min-w-[120px]">Ratio</th>
                  <th className="px-4 py-3 text-center text-xs font-black text-orange-500 uppercase tracking-wider">Série</th>
                  <th className="px-4 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((player, i) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    rank={i + 1}
                    isExpanded={expanded === player.id}
                    onToggle={() => setExpanded(expanded === player.id ? null : player.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-court-yellow p-5 flex items-center gap-4">
        <span className="text-4xl">⚡</span>
        <div className="flex-1">
          <h4 className="font-black text-court-green text-lg">Défi de la semaine !</h4>
          <p className="text-court-green/70 text-sm">Qui marquera le plus de victoires ce weekend ? Ajoute tes matchs !</p>
        </div>
        <TennisBall size={40} animate />
      </div>
    </div>
  );
}
