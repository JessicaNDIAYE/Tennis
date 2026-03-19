import { useBadges, usePlayers } from "../hooks/useTennisData";
import { BadgeFrame, TennisBall, NetPattern } from "./TennisIllustrations";

const rarityConfig = {
  common:    { label: "Commun",      color: "#6B7280", bg: "#F3F4F6" },
  uncommon:  { label: "Peu commun",  color: "#1C55DB", bg: "#EFF6FF" },
  rare:      { label: "Rare",        color: "#FCA833", bg: "#FFF7ED" },
  epic:      { label: "Épique",      color: "#8B5CF6", bg: "#F5F3FF" },
  legendary: { label: "Légendaire",  color: "#EC4899", bg: "#FDF2F8" },
};

function BadgeCard({ badge, earnedByCount, totalPlayers }) {
  const rarity = rarityConfig[badge.rarity] || rarityConfig.common;
  return (
    <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
          style={{ background: rarity.bg, color: rarity.color }}>
          {rarity.label}
        </span>
        <span className="text-xs text-gray-400">{earnedByCount}/{totalPlayers}</span>
      </div>

      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <BadgeFrame color={badge.color} borderColor={badge.border_color} size={72} rarity={badge.rarity}>
          {badge.icon}
        </BadgeFrame>
      </div>

      <h3 className="font-black text-gray-800 text-center text-base mb-1">{badge.name}</h3>
      <p className="text-xs text-gray-500 text-center">{badge.description}</p>
    </div>
  );
}

function PlayerBadgeSummary({ player, badgeIds, allBadges }) {
  const earnedBadges = badgeIds.map(id => allBadges.find(b => b.id === id)).filter(Boolean);
  return (
    <div className="card flex items-center gap-4">
      <div className="text-3xl">{player.avatar_emoji || "🎾"}</div>
      <div className="flex-1">
        <p className="font-bold text-gray-800">{player.username}</p>
        <p className="text-xs text-gray-400">{earnedBadges.length} badge{earnedBadges.length > 1 ? "s" : ""}</p>
      </div>
      <div className="flex gap-1">
        {earnedBadges.slice(0, 5).map(b => (
          <span key={b.id} className="text-lg" title={b.name}>{b.icon}</span>
        ))}
        {earnedBadges.length > 5 && (
          <span className="text-xs text-gray-400 self-center">+{earnedBadges.length - 5}</span>
        )}
        {earnedBadges.length === 0 && (
          <span className="text-xs text-gray-300 italic">–</span>
        )}
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const { allBadges, userBadgeIds } = useBadges();
  const { players } = usePlayers();

  const byRarity = ["legendary", "epic", "rare", "uncommon", "common"];

  // Simple badge attribution based on stats
  const getBadgeIds = (player) => {
    const ids = [];
    if (player.wins >= 1) ids.push("first_win");
    if (player.wins >= 5) ids.push("five_wins");
    if (player.wins >= 10) ids.push("ten_wins");
    if (player.wins >= 20) ids.push("twenty_wins");
    if (player.streak >= 3) ids.push("streak3");
    if (player.streak >= 5) ids.push("streak5");
    if (player.streak >= 10) ids.push("streak10");
    return ids;
  };

  const earnedCountPerBadge = Object.fromEntries(
    allBadges.map(b => [
      b.id,
      players.filter(p => getBadgeIds(p).includes(b.id)).length
    ])
  );

  const playerBadges = players.map(p => ({ player: p, badgeIds: getBadgeIds(p) }))
    .sort((a, b) => b.badgeIds.length - a.badgeIds.length);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-court-orange p-8 text-white">
        <NetPattern />
        <div className="relative z-10 flex items-center gap-4">
          <div>
            <p className="font-bold text-sm tracking-widest uppercase opacity-70 mb-2">COLLECTION</p>
            <h2 className="font-display text-5xl">BADGES 🎖️</h2>
            <p className="mt-2 opacity-70">{allBadges.length} badges à débloquer cette saison</p>
          </div>
          <div className="ml-auto animate-float">
            <TennisBall size={70} />
          </div>
        </div>
      </div>

      {/* Player summaries */}
      {players.length > 0 && (
        <div>
          <h3 className="font-bold text-court-green text-lg mb-3">🎖️ Collection par joueur</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {playerBadges.map(({ player, badgeIds }) => (
              <PlayerBadgeSummary key={player.id} player={player} badgeIds={badgeIds} allBadges={allBadges} />
            ))}
          </div>
        </div>
      )}

      {/* My badges */}
      {userBadgeIds.length > 0 && (
        <div className="card border-2 border-court-yellow">
          <h3 className="font-bold text-court-green mb-3 flex items-center gap-2">⭐ Mes badges débloqués</h3>
          <div className="flex flex-wrap gap-3">
            {userBadgeIds.map(id => {
              const b = allBadges.find(b => b.id === id);
              return b ? (
                <div key={id} className="flex flex-col items-center gap-1">
                  <BadgeFrame color={b.color} borderColor={b.border_color} size={52} rarity={b.rarity}>
                    {b.icon}
                  </BadgeFrame>
                  <span className="text-xs text-gray-500 text-center max-w-[60px] leading-tight">{b.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Badges by rarity */}
      {byRarity.map(rarity => {
        const rarityBadges = allBadges.filter(b => b.rarity === rarity);
        if (rarityBadges.length === 0) return null;
        const cfg = rarityConfig[rarity];
        return (
          <div key={rarity}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-black text-lg" style={{ color: cfg.color }}>
                {cfg.label.toUpperCase()}
              </h3>
              <div className="flex-1 h-0.5 rounded-full" style={{ background: `${cfg.color}40` }} />
              <span className="text-xs font-bold" style={{ color: cfg.color }}>{rarityBadges.length}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {rarityBadges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earnedByCount={earnedCountPerBadge[badge.id] || 0}
                  totalPlayers={players.length}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
