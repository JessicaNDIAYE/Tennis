import { useState } from "react";
import { useGroups, useFriendPlayers } from "../hooks/useTennisData";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { PlayerAvatar } from "./TennisIllustrations";

const EMOJIS = ["🎾", "🏆", "⚡", "🔥", "🌟", "💫", "🎯", "👑", "🦅", "🐆", "🚀", "⭐"];
const COLORS = ["#1C55DB", "#1E4B33", "#FCA833", "#A8D84E", "#C17B5A", "#8B5CF6", "#EC4899"];

function getColor(name) {
  return COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
}

// ─── Create group modal ───────────────────────────────────────────────────────
function CreateGroupModal({ friends, onClose, onCreated, supabaseUrl }) {
  const { session, profile } = useAuth();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎾");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function toggleFriend(uid) {
    setSelected(s => s.includes(uid) ? s.filter(x => x !== uid) : [...s, uid]);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    if (selected.length === 0) { setError("Ajoute au moins un membre."); return; }
    setSaving(true);
    setError(null);

    // Create group
    const { data: group, error: gErr } = await supabase
      .from("tennis_groups")
      .insert({ name: name.trim(), emoji, description: description.trim() || null, created_by: session.user.id })
      .select().single();

    if (gErr) { setError(gErr.message); setSaving(false); return; }

    // Add creator + selected friends as members
    const memberRows = [session.user.id, ...selected].map(uid => ({
      group_id: group.id,
      user_id: uid,
    }));
    await supabase.from("tennis_group_members").insert(memberRows);

    // Notify invited members
    for (const uid of selected) {
      await supabase.from("tennis_notifications").insert({
        user_id: uid,
        from_user_id: session.user.id,
        type: "group_invite",
        message: `${emoji} ${profile?.username || "Quelqu'un"} t'a ajouté au groupe « ${name.trim()} »`,
        data: { group_id: group.id },
      });
    }

    setSaving(false);
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-court-green text-lg">Créer un groupe</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
        </div>

        <form onSubmit={handleCreate} className="p-5 space-y-5">
          {/* Emoji picker */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Emoji du groupe</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(em => (
                <button
                  key={em} type="button"
                  onClick={() => setEmoji(em)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all
                    ${emoji === em ? "border-court-blue bg-court-blue/10 scale-110 shadow" : "border-transparent bg-court-cream"}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nom du groupe *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-court-blue outline-none"
              placeholder="Ex: Les Aces du dimanche"
              maxLength={40}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description (optionnel)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-court-blue outline-none"
              placeholder="Ex: On joue le dimanche matin"
              maxLength={100}
            />
          </div>

          {/* Members */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Membres à inviter * ({selected.length} sélectionné{selected.length > 1 ? "s" : ""})
            </label>
            {friends.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Ajoute des amis d'abord pour les inviter dans un groupe.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {friends.map(f => {
                  const color = getColor(f.username);
                  const avatarUrl = f.avatar_url ? `${supabaseUrl}/storage/v1/object/public/avatars/${f.avatar_url}` : null;
                  const isSelected = selected.includes(f.user_id);
                  return (
                    <label
                      key={f.user_id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border-2
                        ${isSelected ? "border-court-blue bg-blue-50" : "border-transparent bg-court-cream hover:bg-gray-100"}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFriend(f.user_id)}
                        className="w-4 h-4 accent-court-blue flex-shrink-0"
                      />
                      {avatarUrl
                        ? <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border-2 flex-shrink-0" style={{ borderColor: color }} />
                        : <PlayerAvatar emoji={f.avatar_emoji || "🎾"} color={color} size={36} />}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{f.username}</p>
                        <p className="text-xs text-gray-400">{f.wins}V · {f.losses}D</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">❌ {error}</p>}

          <button
            type="submit"
            disabled={saving || selected.length === 0}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {saving
              ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : `${emoji} Créer le groupe`}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Group card ───────────────────────────────────────────────────────────────
function GroupCard({ group, onLeave, isCreator, supabaseUrl }) {
  const [expanded, setExpanded] = useState(false);
  const color = getColor(group.name);

  return (
    <div className="card overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: color }} />
      <button className="w-full flex items-center gap-4 mt-1 text-left" onClick={() => setExpanded(e => !e)}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
          style={{ background: `${color}22` }}
        >
          {group.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-gray-800 truncate">{group.name}</h3>
          <p className="text-xs text-gray-400">{group.members?.length || 0} membre{(group.members?.length || 0) > 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isCreator && (
            <span className="text-xs bg-court-yellow text-court-green font-black px-2 py-0.5 rounded-full">Créateur</span>
          )}
          <span className={`text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
          {group.description && (
            <p className="text-sm text-gray-500 mb-4 italic">"{group.description}"</p>
          )}
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">Membres</h4>
          <div className="space-y-2 mb-4">
            {(group.members || []).map(m => {
              const c = getColor(m.username);
              const avatarUrl = m.avatar_url ? `${supabaseUrl}/storage/v1/object/public/avatars/${m.avatar_url}` : null;
              return (
                <div key={m.user_id} className="flex items-center gap-3 bg-court-cream rounded-xl p-2.5">
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border-2 flex-shrink-0" style={{ borderColor: c }} />
                    : <PlayerAvatar emoji={m.avatar_emoji || "🎾"} color={c} size={36} />}
                  <div className="flex-1">
                    <p className="font-bold text-sm text-gray-800">{m.username}</p>
                    <p className="text-xs text-gray-400">{m.wins || 0}V · {m.losses || 0}D</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => onLeave(group.id)}
            className="text-sm text-red-400 hover:text-red-500 font-bold transition-colors"
          >
            {isCreator ? "🗑️ Supprimer le groupe" : "🚪 Quitter le groupe"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GroupsPage() {
  const { session } = useAuth();
  const { groups, loading, refetch } = useGroups();
  const { players: friends } = useFriendPlayers();
  const [showCreate, setShowCreate] = useState(false);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  async function leaveGroup(groupId) {
    const group = groups.find(g => g.id === groupId);
    const isCreator = group?.created_by === session?.user.id;
    if (isCreator) {
      // Delete the whole group (cascade will remove members)
      await supabase.from("tennis_groups").delete().eq("id", groupId);
    } else {
      await supabase.from("tennis_group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", session.user.id);
    }
    refetch();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl text-court-green">GROUPES</h2>
          <p className="text-gray-500 text-sm mt-1">{groups.length} groupe{groups.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2"
        >
          + Créer un groupe
        </button>
      </div>

      {showCreate && (
        <CreateGroupModal
          friends={friends}
          onClose={() => setShowCreate(false)}
          onCreated={refetch}
          supabaseUrl={supabaseUrl}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-5xl mb-4">👥</p>
          <p className="font-bold text-gray-600 text-lg">Pas encore de groupes</p>
          <p className="text-gray-400 text-sm mt-1">Crée un groupe pour jouer ensemble</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 btn-primary text-sm px-5 py-2.5 inline-flex"
          >
            + Créer mon premier groupe
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              isCreator={group.created_by === session?.user.id}
              onLeave={leaveGroup}
              supabaseUrl={supabaseUrl}
            />
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="bg-court-green/10 border border-court-green/20 rounded-2xl p-4 flex gap-3">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div>
          <p className="font-bold text-court-green text-sm">Comment fonctionnent les groupes ?</p>
          <p className="text-gray-500 text-xs mt-1">
            Crée un groupe avec tes amis (2 à 10 personnes). Les membres reçoivent une notification. Tu peux quitter ou supprimer un groupe à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}
