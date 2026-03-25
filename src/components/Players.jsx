import { useState } from "react";
import { useFriendPlayers, useMatches, useBadges } from "../hooks/useTennisData";
import { PlayerAvatar } from "./TennisIllustrations";
import { TennisBall } from "./TennisIllustrations";
import { BadgeSVGById } from "./BadgeSVGs";
import { useAuth } from "../context/AuthContext";

function PlayerCard({ player, onClick, isSelected, userBadgeMap, allBadges, supabaseUrl }) {
  const winRate = (player.wins + player.losses) > 0
    ? Math.round((player.wins / (player.wins + player.losses)) * 100) : 0;
  const earnedBadges = (userBadgeMap[player.user_id] || [])
    .map(id => allBadges.find(b => b.id === id)).filter(Boolean);

  const colors = ["#1C55DB", "#1E4B33", "#FCA833", "#A8D84E", "#C17B5A", "#8B5CF6", "#EC4899"];
  const colorIdx = player.username?.charCodeAt(0) % colors.length || 0;
  const color = colors[colorIdx];
  const avatarUrl = player.avatar_url
    ? `${supabaseUrl}/storage/v1/object/public/avatars/${player.avatar_url}`
    : null;

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden
        ${isSelected ? "ring-4 ring-court-blue shadow-xl -translate-y-1" : ""}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{ background: color }} />
      <div className="flex items-center gap-4 mt-2 mb-4">
        {avatarUrl
          ? <img src={avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border-4 flex-shrink-0" style={{ borderColor: color }} />
          : <PlayerAvatar emoji={player.avatar_emoji || "🎾"} color={color} size={56} />}
        <div>
          <h3 className="font-black text-gray-800 text-lg leading-none">{player.username}</h3>
          <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full mt-1"
            style={{ background: `${color}22`, color }}>
            {player.level}
          </span>
        </div>
      </div>
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
      {player.streak > 0 && (
        <div className="flex items-center gap-2 mb-3 bg-orange-50 px-3 py-2 rounded-xl">
          <span>🔥</span>
          <span className="text-sm font-bold text-orange-600">{player.streak} victoires consécutives</span>
        </div>
      )}
      <div className="flex items-center gap-1 flex-wrap">
        {earnedBadges.slice(0, 4).map(b => <BadgeSVGById key={b.id} id={b.id} size={36} />)}
        {earnedBadges.length > 4 && <span className="text-xs text-gray-400 font-bold">+{earnedBadges.length - 4}</span>}
        {earnedBadges.length === 0 && <span className="text-xs text-gray-300 italic">Pas encore de badges</span>}
      </div>
    </div>
  );
}

function PlayerDetail({ player, playerMatches, allBadges, badgeIds, supabaseUrl }) {
  const earnedBadges = badgeIds.map(id => allBadges.find(b => b.id === id)).filter(Boolean);
  const colors = ["#1C55DB", "#1E4B33", "#FCA833", "#A8D84E", "#C17B5A", "#8B5CF6", "#EC4899"];
  const colorIdx = player.username?.charCodeAt(0) % colors.length || 0;
  const color = colors[colorIdx];
  const avatarUrl = player.avatar_url
    ? `${supabaseUrl}/storage/v1/object/public/avatars/${player.avatar_url}`
    : null;

  return (
    <div className="card border-2 border-court-blue animate-slide-up">
      <div className="flex items-start gap-4 mb-5">
        {avatarUrl
          ? <img src={avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-4 flex-shrink-0" style={{ borderColor: color }} />
          : <PlayerAvatar emoji={player.avatar_emoji || "🎾"} color={color} size={80} />}
        <div className="flex-1">
          <h2 className="font-black text-2xl text-gray-800">{player.username}</h2>
          <p className="text-gray-400 text-sm mb-3">{player.level}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-base font-black text-court-green">{Math.floor((player.play_time_min || 0) / 60)}h{(player.play_time_min || 0) % 60}m</p>
              <p className="text-xs text-gray-400">Temps</p>
            </div>
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-base font-black text-court-orange">{(player.calories || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400">Calories</p>
            </div>
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-base font-black text-court-blue">{player.total_sets || 0}</p>
              <p className="text-xs text-gray-400">Sets gagnés</p>
            </div>
            <div className="text-center bg-court-cream rounded-xl p-2">
              <p className="text-base font-black text-purple-500">{earnedBadges.length}</p>
              <p className="text-xs text-gray-400">Badges</p>
            </div>
          </div>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-3">🎖️ Badges</h4>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(b => (
              <div key={b.id} className="flex flex-col items-center gap-1">
                <BadgeSVGById id={b.id} size={48} />
                <span className="text-xs text-gray-500 text-center max-w-[56px] leading-tight">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {playerMatches.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-3">🎾 Derniers matchs</h4>
          <div className="space-y-2">
            {playerMatches.slice(0, 5).map((m, i) => {
              const isP1 = m.player1_id === player.user_id;
              const opp = isP1 ? m.player2 : m.player1;
              const won = m.winner_id === player.user_id;
              return (
                <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl text-sm
                  ${won ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <div className="flex items-center gap-2">
                    <span>{won ? "✅" : "❌"}</span>
                    <span className="font-medium">vs {opp?.username || "?"}</span>
                    {m.match_type === "double" && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-bold">D</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-court-blue">{m.score}</span>
                    <span className="text-gray-400 text-xs">{m.played_at?.slice(0, 10)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Players({ onNavigate }) {
  const { session } = useAuth();
  const { players, loading } = useFriendPlayers();
  const { matches } = useMatches();
  const { allBadges } = useBadges();
  const [selected, setSelected] = useState(null);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const getBadgeIds = (player) => {
    const ids = [];
    if (player.wins >= 1)  ids.push("first_win");
    if (player.wins >= 5)  ids.push("five_wins");
    if (player.wins >= 10) ids.push("ten_wins");
    if (player.wins >= 20) ids.push("twenty_wins");
    if (player.streak >= 3) ids.push("streak3");
    if (player.streak >= 5) ids.push("streak5");
    return ids;
  };

  const userBadgeMap = Object.fromEntries(players.map(p => [p.user_id, getBadgeIds(p)]));
  const selectedPlayer = players.find(p => p.user_id === selected);
  const playerMatches = selected
    ? matches.filter(m => m.player1_id === selected || m.player2_id === selected)
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-court-green">JOUEURS</h2>
          <p className="text-gray-500 text-sm mt-1">{players.length} ami{players.length !== 1 ? "s" : ""} dans ta liste</p>
        </div>
      </div>

      {selectedPlayer && (
        <PlayerDetail
          player={selectedPlayer}
          playerMatches={playerMatches}
          allBadges={allBadges}
          badgeIds={userBadgeMap[selectedPlayer.user_id] || []}
          supabaseUrl={supabaseUrl}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="card h-56 animate-pulse bg-gray-100" />)}
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-16 card">
          <TennisBall size={60} animate />
          <p className="text-gray-500 font-bold mt-4">Tu n'as pas encore d'amis</p>
          <p className="text-gray-400 text-sm mt-1">Ajoute des amis depuis la page Amis pour les voir ici</p>
          <button
            onClick={() => onNavigate?.("friends")}
            className="mt-4 btn-primary text-sm px-5 py-2.5 inline-flex"
          >
            👥 Aller aux Amis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              isSelected={selected === player.user_id}
              onClick={() => setSelected(selected === player.user_id ? null : player.user_id)}
              userBadgeMap={userBadgeMap}
              allBadges={allBadges}
              supabaseUrl={supabaseUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
