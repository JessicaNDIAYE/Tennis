import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { usePlayers } from "../hooks/useTennisData";
import { PlayerAvatar } from "./TennisIllustrations";

const COLORS = ["#1C55DB", "#1E4B33", "#FCA833", "#A8D84E", "#C17B5A", "#8B5CF6", "#EC4899"];

function getColor(username) {
  return COLORS[(username?.charCodeAt(0) || 0) % COLORS.length];
}

function getAvatarUrl(p, supabaseUrl) {
  if (p?.avatar_url) return `${supabaseUrl}/storage/v1/object/public/avatars/${p.avatar_url}`;
  return null;
}

function PlayerRow({ player, rank, isFriend, onAdd, onRemove, supabaseUrl }) {
  const color = getColor(player.username);
  const avatarUrl = getAvatarUrl(player, supabaseUrl);
  const winRate = (player.wins + player.losses) > 0
    ? Math.round((player.wins / (player.wins + player.losses)) * 100)
    : 0;
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

  return (
    <div className="flex items-center gap-3 p-3.5 bg-court-cream rounded-2xl hover:bg-gray-100 transition-colors">
      <div className="w-10 text-center flex-shrink-0">
        {medal
          ? <span className="text-2xl">{medal}</span>
          : <span className="font-black text-gray-400 text-sm">#{rank}</span>}
      </div>
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-11 h-11 rounded-full object-cover border-2" style={{ borderColor: color }} />
        ) : (
          <PlayerAvatar emoji={player.avatar_emoji || "🎾"} color={color} size={44} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-800 truncate">{player.username}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}22`, color }}>
            {player.level}
          </span>
          <span className="text-xs text-gray-400">{player.wins}V · {player.losses}D · {winRate}%</span>
        </div>
      </div>
      {isFriend ? (
        <button
          onClick={() => onRemove(player.user_id)}
          className="flex-shrink-0 px-3 py-1.5 bg-red-50 text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
        >
          Retirer
        </button>
      ) : (
        <button
          onClick={() => onAdd(player.user_id)}
          className="flex-shrink-0 px-3 py-1.5 bg-court-blue text-white rounded-xl text-xs font-bold hover:bg-court-blue-dark transition-colors shadow-sm"
        >
          + Ajouter
        </button>
      )}
    </div>
  );
}

export default function FriendsPage() {
  const { session } = useAuth();
  const { players } = usePlayers();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendIds, setFriendIds] = useState(new Set());
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const loadFriends = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from("tennis_friendships")
      .select("user_id, friend_id")
      .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`);
    if (data) {
      setFriendIds(new Set(
        data.map(f => f.user_id === session.user.id ? f.friend_id : f.user_id)
      ));
    }
  }, [session]);

  useEffect(() => { loadFriends(); }, [loadFriends]);

  async function handleSearch(e) {
    const val = e.target.value;
    setSearch(val);
    if (val.trim().length < 2) { setSearchResults([]); return; }
    const { data } = await supabase
      .from("tennis_profiles")
      .select("*")
      .ilike("username", `%${val.trim()}%`)
      .neq("user_id", session.user.id)
      .limit(8);
    setSearchResults(data || []);
  }

  async function addFriend(friendUserId) {
    await supabase.from("tennis_friendships").insert({
      user_id: session.user.id,
      friend_id: friendUserId,
    });
    await loadFriends();
  }

  async function removeFriend(friendUserId) {
    await supabase.from("tennis_friendships").delete().or(
      `and(user_id.eq.${session.user.id},friend_id.eq.${friendUserId}),and(user_id.eq.${friendUserId},friend_id.eq.${session.user.id})`
    );
    await loadFriends();
  }

  // Rank map from players (sorted by wins desc)
  const rankMap = Object.fromEntries(players.map((p, i) => [p.user_id, i + 1]));

  // Friends with full profile data
  const friendPlayers = players
    .filter(p => friendIds.has(p.user_id))
    .sort((a, b) => (rankMap[a.user_id] || 999) - (rankMap[b.user_id] || 999));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-4xl text-court-green">AMIS</h2>
        <p className="text-gray-500 text-sm mt-1">
          {friendIds.size} ami{friendIds.size !== 1 ? "s" : ""} · vois leur classement en temps réel
        </p>
      </div>

      {/* Search */}
      <div className="card space-y-4">
        <h3 className="font-bold text-gray-700">🔍 Chercher un joueur</h3>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Tape un pseudo (min. 2 caractères)..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-court-blue"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map(p => (
              <PlayerRow
                key={p.user_id}
                player={p}
                rank={rankMap[p.user_id] || "?"}
                isFriend={friendIds.has(p.user_id)}
                onAdd={addFriend}
                onRemove={removeFriend}
                supabaseUrl={supabaseUrl}
              />
            ))}
          </div>
        )}

        {search.length >= 2 && searchResults.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-2">
            Aucun joueur trouvé pour « {search} »
          </p>
        )}
      </div>

      {/* Friends list */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-700">👥 Mes amis & classement</h3>
          {friendPlayers.length > 0 && (
            <span className="text-xs text-gray-400 bg-court-cream px-2 py-1 rounded-full font-medium">
              {friendPlayers.length} ami{friendPlayers.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {friendPlayers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-5xl mb-3">🎾</p>
            <p className="font-bold text-gray-500">Pas encore d'amis</p>
            <p className="text-gray-400 text-sm mt-1">Cherche un pseudo ci-dessus pour en ajouter !</p>
          </div>
        ) : (
          <div className="space-y-2">
            {friendPlayers.map(p => (
              <PlayerRow
                key={p.user_id}
                player={p}
                rank={rankMap[p.user_id] || "?"}
                isFriend={true}
                onAdd={addFriend}
                onRemove={removeFriend}
                supabaseUrl={supabaseUrl}
              />
            ))}
          </div>
        )}
      </div>

      {/* Top 3 friends podium */}
      {friendPlayers.length >= 2 && (
        <div className="card">
          <h3 className="font-bold text-gray-700 mb-4">🏆 Podium de mes amis</h3>
          <div className="flex items-end justify-center gap-4">
            {/* 2nd */}
            {friendPlayers[1] && (() => {
              const p = friendPlayers[1];
              const color = getColor(p.username);
              const avatarUrl = getAvatarUrl(p, supabaseUrl);
              return (
                <div className="flex flex-col items-center gap-2">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border-4 border-gray-300" />
                    : <PlayerAvatar emoji={p.avatar_emoji || "🎾"} color={color} size={56} />}
                  <p className="font-bold text-sm text-gray-700 max-w-[80px] text-center truncate">{p.username}</p>
                  <div className="w-20 bg-gray-200 rounded-t-xl flex items-center justify-center py-5">
                    <span className="text-2xl">🥈</span>
                  </div>
                </div>
              );
            })()}
            {/* 1st */}
            {friendPlayers[0] && (() => {
              const p = friendPlayers[0];
              const color = getColor(p.username);
              const avatarUrl = getAvatarUrl(p, supabaseUrl);
              return (
                <div className="flex flex-col items-center gap-2">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover border-4 border-court-yellow" />
                    : <PlayerAvatar emoji={p.avatar_emoji || "🎾"} color={color} size={64} rank={1} />}
                  <p className="font-black text-base text-gray-800 max-w-[90px] text-center truncate">{p.username}</p>
                  <div className="w-24 bg-court-yellow rounded-t-xl flex items-center justify-center py-8">
                    <span className="text-3xl">🥇</span>
                  </div>
                </div>
              );
            })()}
            {/* 3rd */}
            {friendPlayers[2] && (() => {
              const p = friendPlayers[2];
              const color = getColor(p.username);
              const avatarUrl = getAvatarUrl(p, supabaseUrl);
              return (
                <div className="flex flex-col items-center gap-2">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border-4 border-amber-600" />
                    : <PlayerAvatar emoji={p.avatar_emoji || "🎾"} color={color} size={48} />}
                  <p className="font-bold text-sm text-gray-700 max-w-[70px] text-center truncate">{p.username}</p>
                  <div className="w-16 bg-amber-600 rounded-t-xl flex items-center justify-center py-3">
                    <span className="text-xl">🥉</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
