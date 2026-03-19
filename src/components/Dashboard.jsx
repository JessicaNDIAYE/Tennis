import { players, matches, tips } from "../data/mockData";
import { TennisBall, TennisRacket, CourtDiagram, PlayerAvatar, WavyPattern, CheckerPattern } from "./TennisIllustrations";

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="card flex items-center gap-4" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: bg }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-court-green">{value}</p>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}

function RecentMatch({ match }) {
  const p1 = players.find(p => p.id === match.player1);
  const p2 = players.find(p => p.id === match.player2);
  const winner = players.find(p => p.id === match.winner);
  const surfaceColors = { clay: "#C17B5A", hard: "#1C55DB", grass: "#1E4B33" };
  const surfaceLabels = { clay: "Terre", hard: "Dur", grass: "Gazon" };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-court-cream/50 border border-white hover:bg-court-cream transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          style={{ background: surfaceColors[match.surface] }}>
          {surfaceLabels[match.surface]}
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <span className={match.winner === match.player1 ? "text-court-green font-black" : "text-gray-400"}>
              {p1?.name.split(" ")[0]}
            </span>
            <span className="text-gray-400 text-xs">vs</span>
            <span className={match.winner === match.player2 ? "text-court-green font-black" : "text-gray-400"}>
              {p2?.name.split(" ")[0]}
            </span>
          </div>
          <p className="text-xs text-gray-500">{match.date} · {match.duration} min</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono font-bold text-sm text-court-blue">{match.score}</p>
        <p className="text-xs text-court-orange font-medium">🏆 {winner?.name.split(" ")[0]}</p>
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);
  const leader = sortedPlayers[0];
  const totalMatches = matches.length;
  const totalCalories = players.reduce((acc, p) => acc + p.calories, 0);
  const totalHours = Math.floor(players.reduce((acc, p) => acc + p.playTime, 0) / 60);
  const todayTip = tips[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-court-green text-white p-8 min-h-[180px] flex items-center">
        <WavyPattern />
        <CheckerPattern />
        <div className="relative z-10 flex-1">
          <p className="text-court-yellow font-bold text-sm tracking-widest uppercase mb-2">
            Bonjour, Champion·ne ! 👋
          </p>
          <h2 className="font-display text-5xl text-white mb-1">Prêt·e à</h2>
          <h2 className="font-display text-5xl text-court-yellow mb-4">JOUER ?</h2>
          <div className="flex gap-3">
            <button onClick={() => onNavigate("matches")} className="btn-primary text-sm py-2.5 px-5">
              + Ajouter un match
            </button>
            <button onClick={() => onNavigate("scoreboard")} className="bg-white/10 border border-white/30 text-white text-sm py-2.5 px-5 rounded-xl hover:bg-white/20 transition-colors">
              Voir le classement
            </button>
          </div>
        </div>
        <div className="relative z-10 hidden md:block">
          <TennisRacket size={110} color="#1C55DB" />
        </div>
        <div className="absolute right-32 top-6 animate-float">
          <TennisBall size={50} />
        </div>
        <div className="absolute right-10 bottom-4 animate-bounce-slow opacity-50">
          <TennisBall size={30} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🎾" value={totalMatches} label="Matchs joués" color="#1C55DB" bg="#1C55DB22"/>
        <StatCard icon="🏆" value={leader.wins} label={`Record — ${leader.name.split(" ")[0]}`} color="#F6ED5B" bg="#F6ED5B33"/>
        <StatCard icon="🔥" value={`${totalCalories.toLocaleString()}`} label="Calories brûlées" color="#FCA833" bg="#FCA83322"/>
        <StatCard icon="⏱️" value={`${totalHours}h`} label="Temps de jeu" color="#A8D84E" bg="#A8D84E33"/>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard mini */}
        <div className="card lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-court-green text-lg flex items-center gap-2">
              🏆 Top Joueurs
            </h3>
            <button onClick={() => onNavigate("scoreboard")} className="text-court-blue text-xs font-semibold hover:underline">
              Tout voir →
            </button>
          </div>
          <div className="space-y-3">
            {sortedPlayers.slice(0, 5).map((player, i) => (
              <div key={player.id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                  ${i === 0 ? "bg-court-yellow text-court-green" :
                    i === 1 ? "bg-gray-200 text-gray-600" :
                    i === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {i + 1}
                </div>
                <PlayerAvatar emoji={player.avatar} color={player.color} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{player.name.split(" ")[0]}</p>
                  <p className="text-xs text-gray-400">{player.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-court-blue">{player.wins}V</p>
                  <p className="text-xs text-red-400">{player.losses}D</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent matches */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-court-green text-lg flex items-center gap-2">
              🎾 Matchs Récents
            </h3>
            <button onClick={() => onNavigate("matches")} className="text-court-blue text-xs font-semibold hover:underline">
              Tout voir →
            </button>
          </div>
          <div className="space-y-2">
            {matches.slice(0, 4).map(match => (
              <RecentMatch key={match.id} match={match} />
            ))}
          </div>
        </div>
      </div>

      {/* Tip of the day */}
      <div className="relative rounded-2xl overflow-hidden p-6 flex items-center gap-6"
        style={{ background: `linear-gradient(135deg, ${todayTip.color}, ${todayTip.color}bb)` }}>
        <div className="absolute inset-0 opacity-10">
          <CourtDiagram size={300} />
        </div>
        <div className="text-5xl">{todayTip.emoji}</div>
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              💡 CONSEIL DU JOUR
            </span>
            <span className="text-white/60 text-xs">{todayTip.level}</span>
          </div>
          <h4 className="text-white font-black text-xl mb-1">{todayTip.title}</h4>
          <p className="text-white/80 text-sm">{todayTip.description}</p>
        </div>
        <button
          onClick={() => onNavigate("tips")}
          className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors"
        >
          Plus de conseils →
        </button>
      </div>
    </div>
  );
}
