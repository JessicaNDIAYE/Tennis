import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(user) {
    const { data } = await supabase
      .from("tennis_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
      return;
    }

    // No profile found — create one automatically (belt-and-suspenders with the DB trigger)
    const emailPrefix = user.email?.split("@")[0] || "Joueur";
    let username = emailPrefix;
    let suffix = 1;

    // Try to find a unique username
    while (true) {
      const { data: existing } = await supabase
        .from("tennis_profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();
      if (!existing) break;
      username = emailPrefix + suffix;
      suffix++;
    }

    const { data: newProfile } = await supabase
      .from("tennis_profiles")
      .insert({ user_id: user.id, username, avatar_emoji: "🎾", level: "Débutant" })
      .select()
      .single();

    setProfile(newProfile);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session?.user) await fetchProfile(session.user);
  }

  return (
    <AuthContext.Provider value={{ session, profile, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
