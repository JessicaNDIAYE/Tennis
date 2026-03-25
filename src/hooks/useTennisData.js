import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

// All players (for scoreboard etc.)
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

// Only friends' profiles
export function useFriendPlayers() {
  const { session } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!session) return;
    // Get friend IDs
    const { data: friendships } = await supabase
      .from("tennis_friendships")
      .select("user_id, friend_id")
      .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`);

    const friendIds = (friendships || []).map(f =>
      f.user_id === session.user.id ? f.friend_id : f.user_id
    );

    if (friendIds.length === 0) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("tennis_profiles")
      .select("*")
      .in("user_id", friendIds)
      .order("wins", { ascending: false });

    setPlayers(data || []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetch(); }, [fetch]);

  return { players, loading, refetch: fetch };
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

// Notifications
export function useNotifications() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifs = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from("tennis_notifications")
      .select(`*, from_profile:tennis_profiles!tennis_notifications_from_user_id_fkey(username, avatar_emoji)`)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    setNotifications(data || []);
  }, [session]);

  useEffect(() => {
    fetchNotifs();
    if (!session) return;
    // Real-time subscription
    const channel = supabase
      .channel("notifications:" + session.user.id)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "tennis_notifications",
        filter: `user_id=eq.${session.user.id}`,
      }, () => fetchNotifs())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [session, fetchNotifs]);

  const markAllRead = async () => {
    if (!session) return;
    await supabase
      .from("tennis_notifications")
      .update({ is_read: true })
      .eq("user_id", session.user.id)
      .eq("is_read", false);
    setNotifications(n => n.map(x => ({ ...x, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  return { notifications, unreadCount, markAllRead, refetch: fetchNotifs };
}

// Groups
export function useGroups() {
  const { session } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    if (!session) return;
    // Get groups where I'm a member or creator
    const { data: memberRows } = await supabase
      .from("tennis_group_members")
      .select("group_id")
      .eq("user_id", session.user.id);

    const memberGroupIds = (memberRows || []).map(r => r.group_id);

    const { data } = await supabase
      .from("tennis_groups")
      .select("*")
      .or(`created_by.eq.${session.user.id}${memberGroupIds.length ? `,id.in.(${memberGroupIds.join(",")})` : ""}`);

    // Fetch members for each group
    if (data && data.length > 0) {
      const groupIds = data.map(g => g.id);
      const { data: members } = await supabase
        .from("tennis_group_members")
        .select("group_id, user_id, tennis_profiles(username, avatar_emoji, wins, losses)")
        .in("group_id", groupIds);

      const membersMap = {};
      (members || []).forEach(m => {
        if (!membersMap[m.group_id]) membersMap[m.group_id] = [];
        membersMap[m.group_id].push({ user_id: m.user_id, ...m.tennis_profiles });
      });

      setGroups(data.map(g => ({ ...g, members: membersMap[g.id] || [] })));
    } else {
      setGroups([]);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  return { groups, loading, refetch: fetchGroups };
}

export function useAddMatch() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const addMatch = async (matchData) => {
    if (!session) throw new Error("Non connecté");
    setLoading(true);
    try {
      const isDouble = matchData.match_type === "double";

      const { data, error } = await supabase
        .from("tennis_matches")
        .insert({
          player1_id: matchData.player1_id,
          player2_id: matchData.player2_id,
          player3_id: matchData.player3_id || null,
          player4_id: matchData.player4_id || null,
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

      // Determine winners and losers
      const teamAWins = matchData.winner_id === matchData.player1_id;
      const winners = isDouble
        ? [matchData.player1_id, matchData.player3_id].filter(Boolean)
        : [matchData.winner_id];
      const losers = isDouble
        ? [matchData.player2_id, matchData.player4_id].filter(Boolean)
        : [matchData.player1_id === matchData.winner_id ? matchData.player2_id : matchData.player1_id];

      // Update winners
      for (const wId of winners) {
        const { data: wp } = await supabase
          .from("tennis_profiles")
          .select("wins, streak")
          .eq("user_id", wId)
          .single();
        if (wp) {
          const newWins = (wp.wins || 0) + 1;
          const newStreak = (wp.streak || 0) + 1;
          await supabase
            .from("tennis_profiles")
            .update({ wins: newWins, streak: newStreak })
            .eq("user_id", wId);

          const badgesToCheck = [
            { id: "first_win",   condition: newWins >= 1 },
            { id: "five_wins",   condition: newWins >= 5 },
            { id: "ten_wins",    condition: newWins >= 10 },
            { id: "twenty_wins", condition: newWins >= 20 },
            { id: "streak3",     condition: newStreak >= 3 },
            { id: "streak5",     condition: newStreak >= 5 },
            { id: "streak10",    condition: newStreak >= 10 },
          ];
          for (const b of badgesToCheck) {
            if (b.condition) {
              await supabase.from("tennis_user_badges")
                .insert({ user_id: wId, badge_id: b.id })
                .then(() => {});
            }
          }
        }
      }

      // Update losers
      for (const lId of losers) {
        const { data: lp } = await supabase
          .from("tennis_profiles")
          .select("losses")
          .eq("user_id", lId)
          .single();
        if (lp) {
          await supabase
            .from("tennis_profiles")
            .update({ losses: (lp.losses || 0) + 1, streak: 0 })
            .eq("user_id", lId);
        }
      }

      // Notify opponents that a match was added
      const notifTargets = isDouble
        ? [matchData.player2_id, matchData.player3_id, matchData.player4_id].filter(Boolean)
        : [matchData.player1_id === session.user.id ? matchData.player2_id : matchData.player1_id];

      for (const targetId of notifTargets) {
        if (targetId !== session.user.id) {
          await supabase.from("tennis_notifications").insert({
            user_id: targetId,
            from_user_id: session.user.id,
            type: "match_added",
            message: `🎾 Un match a été enregistré avec toi.`,
          });
        }
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  return { addMatch, loading };
}
