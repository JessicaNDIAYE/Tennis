import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage({ onBack }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ email: "", password: "", username: "", avatar: "🎾" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const avatars = ["🎾", "🏆", "⚡", "🔥", "🌟", "💫", "🎯", "👑"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          // Create tennis profile
          const { error: profileError } = await supabase
            .from("tennis_profiles")
            .insert({
              user_id: data.user.id,
              username: form.username || form.email.split("@")[0],
              avatar_emoji: form.avatar,
              level: "Débutant",
            });
          if (profileError && profileError.code !== "23505") throw profileError;

          // Award first badge (watch_sync excluded, first_win needs a win)
          // just the welcome — no badge yet, they earn them by playing

          setSuccess("Compte créé ! Vérifie ton email puis connecte-toi. 🎾");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
        // AuthContext will detect session change and redirect
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#F3EEE0' }}>

      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 relative overflow-hidden"
        style={{ background: '#1E4B33' }}>

        {/* Court lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-x-0 h-px" style={{ background: 'white', top: '30%' }} />
          <div className="absolute inset-x-0 h-px" style={{ background: 'white', top: '60%' }} />
          <div className="absolute inset-y-0 w-px" style={{ background: 'white', left: '50%' }} />
        </div>

        {/* Net */}
        <div className="absolute inset-x-0 h-5" style={{ top: '44%', background: 'rgba(40,20,0,0.7)' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute inset-y-0 w-px"
              style={{ left: `${(i + 1) * (100 / 21)}%`, background: 'rgba(80,40,0,0.5)' }} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="mb-8">
            <p className="font-display text-5xl text-court-yellow leading-none tracking-wide">ACE</p>
            <p className="text-white/50 text-sm tracking-widest uppercase mt-1">Tennis Hub</p>
          </div>

          <h2 className="font-black text-white text-3xl leading-tight mb-6">
            Rejoins tes<br />
            amis sur le<br />
            <span className="text-court-yellow">court. 🎾</span>
          </h2>

          <div className="space-y-4">
            {[
              { icon: '🏆', text: 'Classement en temps réel' },
              { icon: '⌚', text: 'Sync avec ta montre' },
              { icon: '🎖️', text: 'Badges & achievements' },
              { icon: '📰', text: 'Actualités & conseils' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-white/70 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Floating balls */}
          <div className="absolute bottom-10 right-8 text-6xl animate-float opacity-30">🎾</div>
          <div className="absolute top-10 right-12 text-4xl animate-float opacity-20" style={{ animationDelay: '1s' }}>🎾</div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md">

          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-court-green font-medium text-sm mb-8 transition-colors"
          >
            ← Retour à l'accueil
          </button>

          {/* Mode toggle */}
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-8">
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === "login" ? "bg-court-green text-white shadow" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === "signup" ? "bg-court-blue text-white shadow" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inscription
            </button>
          </div>

          <h1 className="font-display text-4xl text-court-green mb-2">
            {mode === "login" ? "BONJOUR !" : "BIENVENUE !"}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {mode === "login"
              ? "Connecte-toi pour accéder à ton tableau de bord."
              : "Crée ton profil et rejoins le groupe."
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">Pseudo</label>
                <input
                  type="text"
                  placeholder="TonPseudo"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium
                    focus:border-court-blue outline-none transition-colors bg-white"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                />
              </div>
            )}

            {/* Avatar (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">Choisis ton avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {avatars.map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setForm({ ...form, avatar: av })}
                      className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border-2 transition-all ${
                        form.avatar === av
                          ? "border-court-blue bg-court-blue/10 scale-110 shadow"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="ton@email.com"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium
                  focus:border-court-blue outline-none transition-colors bg-white"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">Mot de passe</label>
              <input
                type="password"
                placeholder={mode === "signup" ? "Minimum 6 caractères" : "••••••••"}
                required
                minLength={6}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium
                  focus:border-court-blue outline-none transition-colors bg-white"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl font-medium">
                ✅ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-black text-base py-4 rounded-2xl transition-all shadow-md
                hover:shadow-lg active:scale-95 flex items-center justify-center gap-2
                ${mode === "login"
                  ? "bg-court-green text-white hover:bg-court-blue"
                  : "bg-court-blue text-white hover:bg-court-blue-dark"
                }
                ${loading ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === "login" ? (
                <>Connexion 🎾</>
              ) : (
                <>Créer mon compte 🚀</>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            En continuant, tu acceptes les conditions d'utilisation de ACE Tennis Hub.
          </p>
        </div>
      </div>
    </div>
  );
}
