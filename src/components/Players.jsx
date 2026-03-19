import { useState } from "react";
import { players, badges, matches } from "../data/mockData";
import { PlayerAvatar, BadgeFrame, TennisRacket } from "./TennisIllustrations";

function PlayerCard({ player, onClick, isSelected }) {
  const winRate = Math.round((player.wins / (player.wins + player.losses)) * 100);
  const rank = [...players].sort((a, b) => b.wins - a.wins).findIndex(p => p.id === player.id) + 1;

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden
        ${isSelected ? "ring-4 ring-court-blue shadow-xl -translate-y-1" : ""}`}
    >
      {/* Color stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{ background: player.color }} />

      {/* Rank */}
      {rank <= 3 && (
        <div className="absolute top-4 right-4">
          {["🥇", "🥈", "🥉"][rank - 1]}
        </div>
      )}

      {/* Avatar & name */}
      <div className="flex items-center gap-4 mt-2 mb-4">
        <PlayerAvatar emoji={player.avatar} color={player.color} size={56} />
        <div>
          <h3 className="font-black text-gray-800 text-lg leading-none">{player.name}</h3>
          <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full mt-1"
            style={{ background: `${player.color}22`, color: player.color }}>
            {player.level}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-court-cream rounded-xl p-2 text-center">
          <p className="text-xl font-black text-court-blue">{player.wins}</p>
          <p className="text-xs text-gray-500 font-medium">Victoires</p>
        </div>
        <div className="bg-court-cream rounded-xl p-2 text-center">
          <p className="text-xl font-black text-red-400">{player.losses}</p>
          <p className="text-xs text-gray-500 font-medium">Défaites</p>
        </div>
        <div className="bg-court-cream rounded-xl p-2 text-center">
          <p className="text-xl font-black" style={{ color: winRate >= 70 ? "#1E4B33" : winRate >= 50 ? "#1C55DB" : "#FCA833" }}>
            {winRate}%
          </p>
          <p className="text-xs text-gray-500 font-medium">Ratio</p>
        </div>
      </div>

      {/* Streak */}
      {player.streak > 0 && (
        <div className="flex items-center gap-2 mb-4 bg-orange-50 px-3 py-2 rounded-xl">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-bold text-orange-600">{player.streak} victoires consécutives !</span>
        </div>
      )}

      {/* Badges preview */}
      <div className="flex items-center gap-2 flex-wrap">
        {player.badges.slice(0, 4).map(bId => {
          const b = badges[bId];
          return b ? (
            <BadgeFrame key={bId} color={b.color} borderColor={b.border} size={36} rarity={b.rarity}>
              {b.icon}
            </BadgeFrame>
          ) : null;
        })}
        {player.badges.length > 4 && (
          <span className="text-xs text-gray-400 font-bold">+{player.badges.length - 4}</span>
        )}
      </div>
    </div>
  );
}

function PlayerDetail({ player }) {
  const playerMatches = matches.filter(m => m.player1 === player.id || m.player2 === player.id);
  const opponents = playerMatches.map(m => {
    const oppId = m.player1 === player.id ? m.player2 : m.player1;
    const opp = players.find(p => p.id === oppId);
    const won = m.winner === player.id;
    return { opp, won, score: m.score, date: m.date };
  });

  return (
    <div className="card border-2 border-court-blue animate-slide-up">
      <div className="flex items-start gap-5 mb-6">
        <PlayerAvatar emoji={player.avatar} color={player.color} size={72} />
        <div className="flex-1">
          <h2 className="font-black text-2xl text-gray-800">{player.name}</h2>
          <p className="text-gray-400 text-sm mb-3">{player.level}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-lg font-black text-court-green">{Math.floor(player.playTime / 60)}h{player.playTime % 60}m</p>
              <p className="text-xs text-gray-400">Temps total</p>
            </div>
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-lg font-black text-court-orange">{player.calories.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Calories</p>
            </div>
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-lg font-black text-court-blue">{player.totalSets}</p>
              <p className="text-xs text-gray-400">Sets gagnés</p>
            </div>
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-lg font-black text-purple-500">{player.badges.length}</p>
              <p className="text-xs text-gray-400">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* All badges */}
      <div className="mb-5">
        <h4 className="font-bold text-gray-600 text-sm uppercase tracking-wider mb-3">🎖️ Badges obtenus</h4>
        <div className="flex flex-wrap gap-3">
          {player.badges.map(bId => {
            const b = badges[bId];
            return b ? (
              <div key={bId} className="flex flex-col items-center gap-1">
                <BadgeFrame color={b.color} borderColor={b.border} size={52} rarity={b.rarity}>
                  {b.icon}
                </BadgeFrame>
                <span className="text-xs text-gray-500 text-center max-w-[60px] leading-tight">{b.name}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Match history */}
      <div>
        <h4 className="font-bold text-gray-600 text-sm uppercase tracking-wider mb-3">🎾 Historique des matchs</h4>
        <div className="space-y-2">
          {opponents.map((o, i) => (
            <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl text-sm
              ${o.won ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center gap-2">
                <span>{o.won ? "✅" : "❌"}</span>
                <span className="font-medium">vs {o.opp?.name.split(" ")[0]}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-court-blue">{o.score}</span>
                <span className="text-gray-400 text-xs">{o.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Players() {
  const [selected, setSelected] = useState(null);
  const selectedPlayer = players.find(p => p.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-court-green">JOUEURS</h2>
          <p className="text-gray-500 text-sm mt-1">{players.length} joueurs dans le groupe</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Clique sur un profil pour les détails</span>
        </div>
      </div>

      {/* Player detail */}
      {selectedPlayer && <PlayerDetail player={selectedPlayer} />}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            isSelected={selected === player.id}
            onClick={() => setSelected(selected === player.id ? null : player.id)}
          />
        ))}
      </div>
    </div>
  );
}
