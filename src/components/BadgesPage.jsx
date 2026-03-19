import { badges, players } from "../data/mockData";
import { BadgeFrame, TennisBall, NetPattern } from "./TennisIllustrations";

const rarityConfig = {
  common: { label: "Commun", color: "#6B7280", bg: "#F3F4F6" },
  uncommon: { label: "Peu commun", color: "#1C55DB", bg: "#EFF6FF" },
  rare: { label: "Rare", color: "#FCA833", bg: "#FFF7ED" },
  epic: { label: "Épique", color: "#8B5CF6", bg: "#F5F3FF" },
  legendary: { label: "Légendaire", color: "#EC4899", bg: "#FDF2F8" },
};

function BadgeCard({ badge }) {
  const earnedBy = players.filter(p => p.badges.includes(badge.id));
  const rarity = rarityConfig[badge.rarity];

  return (
    <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Rarity tag */}
      <div className="flex justify-between items-start mb-4">
        <span
          className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
          style={{ background: rarity.bg, color: rarity.color }}
        >
          {rarity.label}
        </span>
        <span className="text-xs text-gray-400">{earnedBy.length}/{players.length}</span>
      </div>

      {/* Badge icon */}
      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <BadgeFrame color={badge.color} borderColor={badge.border} size={72} rarity={badge.rarity}>
          {badge.icon}
        </BadgeFrame>
      </div>

      {/* Info */}
      <h3 className="font-black text-gray-800 text-center text-base mb-1">{badge.name}</h3>
      <p className="text-xs text-gray-500 text-center mb-4">{badge.description}</p>

      {/* Earned by */}
      {earnedBy.length > 0 ? (
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Obtenu par :</p>
          <div className="flex flex-wrap gap-2">
            {earnedBy.map(p => (
              <span key={p.id} className="text-xs font-medium px-2 py-1 bg-court-cream rounded-full"
                style={{ borderLeft: `3px solid ${p.color}` }}>
                {p.avatar} {p.name.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-300 text-center italic">Personne ne l'a encore obtenu...</p>
      )}
    </div>
  );
}

function PlayerBadgeSummary({ player }) {
  const earnedBadges = player.badges.map(id => badges[id]).filter(Boolean);
  return (
    <div className="card flex items-center gap-4">
      <div className="text-3xl">{player.avatar}</div>
      <div className="flex-1">
        <p className="font-bold text-gray-800">{player.name.split(" ")[0]}</p>
        <p className="text-xs text-gray-400">{earnedBadges.length} badge{earnedBadges.length > 1 ? "s" : ""}</p>
      </div>
      <div className="flex gap-1">
        {earnedBadges.slice(0, 5).map(b => (
          <span key={b.id} className="text-lg" title={b.name}>{b.icon}</span>
        ))}
        {earnedBadges.length > 5 && <span className="text-xs text-gray-400 self-center">+{earnedBadges.length - 5}</span>}
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const allBadges = Object.values(badges);
  const byRarity = ["legendary", "epic", "rare", "uncommon", "common"];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-court-orange p-8 text-white">
        <NetPattern />
        <div className="relative z-10 flex items-center gap-4">
          <div>
            <p className="font-bold text-sm tracking-widest uppercase opacity-70 mb-2">COLLECTION</p>
            <h2 className="font-display text-5xl">BADGES 🎖️</h2>
            <p className="mt-2 opacity-70">{allBadges.length} badges à débloquer dans cette saison</p>
          </div>
          <div className="ml-auto animate-float">
            <TennisBall size={70} />
          </div>
        </div>
      </div>

      {/* Player summaries */}
      <div>
        <h3 className="font-bold text-court-green text-lg mb-3">🎖️ Collection par joueur</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...players].sort((a, b) => b.badges.length - a.badges.length).map(p => (
            <PlayerBadgeSummary key={p.id} player={p} />
          ))}
        </div>
      </div>

      {/* Badges by rarity */}
      {byRarity.map(rarity => {
        const rarityBadges = allBadges.filter(b => b.rarity === rarity);
        const cfg = rarityConfig[rarity];
        return (
          <div key={rarity}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-black text-lg" style={{ color: cfg.color }}>
                {cfg.label.toUpperCase()}
              </h3>
              <div className="flex-1 h-0.5 rounded-full" style={{ background: `${cfg.color}40` }} />
              <span className="text-xs font-bold" style={{ color: cfg.color }}>{rarityBadges.length} badge{rarityBadges.length > 1 ? "s" : ""}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {rarityBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
