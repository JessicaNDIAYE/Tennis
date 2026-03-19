import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tennis_profiles")
      .select("*")
      .order("wins", { ascending: false })
      .then(({ data }) => {
        setPlayers(data || []);
        setLoading(false);
      });
  }, []);

  return { players, loading };
}

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = () => {
    supabase
      .from("tennis_matches")
      .select(`
        *,
        player1:tennis_profiles!tennis_matches_player1_id_fkey(username, avatar_emoji, user_id),
        player2:tennis_profiles!tennis_matches_player2_id_fkey(username, avatar_emoji, user_id),
        winner:tennis_profiles!tennis_matches_winner_id_fkey(username, avatar_emoji, user_id)
      `)
      .order("played_at", { ascending: false })
      .then(({ data }) => {
        setMatches(data || []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchMatches(); }, []);

  return { matches, loading, refetch: fetchMatches };
}

export function useTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tennis_tips")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTips(data || []);
        setLoading(false);
      });
  }, []);

  return { tips, loading };
}

export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tennis_news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setNews(data || []);
        setLoading(false);
      });
  }, []);

  return { news, loading };
}

export function useBadges() {
  const { session } = useAuth();
  const [allBadges, setAllBadges] = useState([]);
  const [userBadgeIds, setUserBadgeIds] = useState([]);

  useEffect(() => {
    supabase.from("tennis_badges").select("*").then(({ data }) => setAllBadges(data || []));

    if (session) {
      supabase
        .from("tennis_user_badges")
        .select("badge_id, earned_at")
        .eq("user_id", session.user.id)
        .then(({ data }) => setUserBadgeIds((data || []).map(b => b.badge_id)));
    }
  }, [session]);

  return { allBadges, userBadgeIds };
}

export function useAddMatch() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const addMatch = async (matchData) => {
    if (!session) throw new Error("Non connecté");
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tennis_matches")
        .insert({
          player1_id: matchData.player1_id,
          player2_id: matchData.player2_id,
          score: matchData.score,
          winner_id: matchData.winner_id,
          surface: matchData.surface,
          duration_min: matchData.duration_min,
          match_type: matchData.match_type || "simple",
          played_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update winner stats
      const { data: winnerProfile } = await supabase
        .from("tennis_profiles")
        .select("wins, losses, streak, total_sets")
        .eq("user_id", matchData.winner_id)
        .single();

      if (winnerProfile) {
        const newWins = (winnerProfile.wins || 0) + 1;
        const newStreak = (winnerProfile.streak || 0) + 1;
        await supabase
          .from("tennis_profiles")
          .update({ wins: newWins, streak: newStreak })
          .eq("user_id", matchData.winner_id);

        // Auto-award badges
        const badgesToCheck = [
          { id: "first_win", condition: newWins >= 1 },
          { id: "five_wins", condition: newWins >= 5 },
          { id: "ten_wins", condition: newWins >= 10 },
          { id: "twenty_wins", condition: newWins >= 20 },
          { id: "streak3", condition: newStreak >= 3 },
          { id: "streak5", condition: newStreak >= 5 },
          { id: "streak10", condition: newStreak >= 10 },
        ];
        for (const b of badgesToCheck) {
          if (b.condition) {
            await supabase.from("tennis_user_badges")
              .insert({ user_id: matchData.winner_id, badge_id: b.id })
              .select()
              .then(() => {}); // ignore duplicate errors
          }
        }
      }

      // Update loser stats (reset streak)
      const loserId = matchData.player1_id === matchData.winner_id
        ? matchData.player2_id : matchData.player1_id;
      const { data: loserProfile } = await supabase
        .from("tennis_profiles")
        .select("losses")
        .eq("user_id", loserId)
        .single();
      if (loserProfile) {
        await supabase
          .from("tennis_profiles")
          .update({ losses: (loserProfile.losses || 0) + 1, streak: 0 })
          .eq("user_id", loserId);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  return { addMatch, loading };
}
