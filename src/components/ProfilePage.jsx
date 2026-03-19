import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { PlayerAvatar } from "./TennisIllustrations";

const EMOJIS = ["🎾", "🏆", "⚡", "🔥", "🌟", "💫", "🎯", "👑", "🦾", "💪", "🚀", "🎪", "😎", "🐆", "🦅"];
const COLORS = ["#1C55DB", "#1E4B33", "#FCA833", "#A8D84E", "#C17B5A", "#8B5CF6", "#EC4899"];

export default function ProfilePage() {
  const { profile, session, refreshProfile } = useAuth();
  const [tab, setTab] = useState("profile");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState({
    username: profile?.username || "",
    avatar_emoji: profile?.avatar_emoji || "🎾",
  });
  const [pwForm, setPwForm] = useState({ new: "", confirm: "" });
  const fileRef = useRef();

  const colorIdx = profile?.username?.charCodeAt(0) % COLORS.length || 0;
  const color = COLORS[colorIdx];
  const avatarPublicUrl = profile?.avatar_url
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}`
    : null;

  const winRate = (profile?.wins + profile?.losses) > 0
    ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100)
    : 0;

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    setMsg(null);
    const ext = file.name.split(".").pop().toLowerCase();
    const filePath = `${session.user.id}/avatar.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (!error) {
      await supabase
        .from("tennis_profiles")
        .update({ avatar_url: filePath })
        .eq("user_id", session.user.id);
      await refreshProfile();
      setMsg({ ok: true, text: "Photo de profil mise à jour !" });
    } else {
      setMsg({ ok: false, text: "Erreur lors de l'upload : " + error.message });
    }
    setUploading(false);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!form.username.trim()) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("tennis_profiles")
      .update({ username: form.username.trim(), avatar_emoji: form.avatar_emoji })
      .eq("user_id", session.user.id);
    if (!error) {
      await refreshProfile();
      setMsg({ ok: true, text: "Profil sauvegardé !" });
    } else {
      setMsg({ ok: false, text: error.message });
    }
    setSaving(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (pwForm.new !== pwForm.confirm) {
      setMsg({ ok: false, text: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (pwForm.new.length < 6) {
      setMsg({ ok: false, text: "Le mot de passe doit faire au moins 6 caractères." });
      return;
    }
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password: pwForm.new });
    if (!error) {
      setMsg({ ok: true, text: "Mot de passe changé avec succès !" });
      setPwForm({ new: "", confirm: "" });
    } else {
      setMsg({ ok: false, text: error.message });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      <div>
        <h2 className="font-display text-4xl text-court-green">MON PROFIL</h2>
        <p className="text-gray-500 text-sm mt-1">Personnalise ton compte</p>
      </div>

      {/* Avatar card */}
      <div className="card">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {avatarPublicUrl ? (
              <img
                src={avatarPublicUrl}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4 shadow-lg"
                style={{ borderColor: color }}
              />
            ) : (
              <PlayerAvatar emoji={profile?.avatar_emoji || "🎾"} color={color} size={96} />
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-9 h-9 bg-court-blue text-white rounded-full flex items-center justify-center text-base shadow-md hover:bg-court-blue-dark transition-colors border-2 border-white"
              title="Changer la photo"
            >
              {uploading ? "⏳" : "📷"}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div className="text-center">
            <p className="font-black text-xl text-gray-800">{profile?.username}</p>
            <span
              className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full mt-1"
              style={{ background: `${color}22`, color }}
            >
              {profile?.level}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <div className="bg-court-cream rounded-xl p-3 text-center">
            <p className="text-xl font-black text-court-blue">{profile?.wins || 0}</p>
            <p className="text-xs text-gray-500">Victoires</p>
          </div>
          <div className="bg-court-cream rounded-xl p-3 text-center">
            <p className="text-xl font-black text-red-400">{profile?.losses || 0}</p>
            <p className="text-xs text-gray-500">Défaites</p>
          </div>
          <div className="bg-court-cream rounded-xl p-3 text-center">
            <p className="text-xl font-black text-court-green">{winRate}%</p>
            <p className="text-xs text-gray-500">Ratio</p>
          </div>
          <div className="bg-court-cream rounded-xl p-3 text-center">
            <p className="text-xl font-black text-orange-400">{profile?.streak || 0}</p>
            <p className="text-xs text-gray-500">Série</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-court-cream rounded-2xl p-1 gap-1">
        <button
          onClick={() => { setTab("profile"); setMsg(null); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "profile" ? "bg-white text-court-green shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
        >
          ✏️ Modifier le profil
        </button>
        <button
          onClick={() => { setTab("password"); setMsg(null); }}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "password" ? "bg-white text-court-green shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
        >
          🔑 Mot de passe
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${msg.ok ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
          {msg.ok ? "✅ " : "❌ "}{msg.text}
        </div>
      )}

      {/* Profile form */}
      {tab === "profile" && (
        <form onSubmit={handleSaveProfile} className="card space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Pseudo</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-court-blue"
              minLength={3}
              maxLength={20}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-3">Avatar Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, avatar_emoji: em }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2
                    ${form.avatar_emoji === em
                      ? "border-court-blue bg-court-blue/10 scale-110 shadow-md"
                      : "border-transparent bg-court-cream hover:bg-gray-100"}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Sauvegarde..." : "💾 Sauvegarder le profil"}
          </button>
        </form>
      )}

      {/* Password form */}
      {tab === "password" && (
        <form onSubmit={handleChangePassword} className="card space-y-5">
          <p className="text-sm text-gray-400">Tu peux changer ton mot de passe à tout moment.</p>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={pwForm.new}
              onChange={e => setPwForm(f => ({ ...f, new: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-court-blue"
              placeholder="Au moins 6 caractères"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-court-blue"
              placeholder="Répète le nouveau mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-court-green text-white font-bold py-3 px-6 rounded-xl hover:bg-green-900 transition-colors shadow-md active:scale-95"
          >
            {saving ? "Changement en cours..." : "🔑 Changer le mot de passe"}
          </button>
        </form>
      )}
    </div>
  );
}
