import { useState } from "react";
import { useTips } from "../hooks/useTennisData";
import { TennisBall, TennisRacket, WavyPattern } from "./TennisIllustrations";
import ArticleModal from "./ArticleModal";

const categories = ["Tous", "Technique", "Tactique", "Service", "Mental", "Fitness"];
const levels = ["Tous niveaux", "Débutant", "Intermédiaire", "Avancé"];

function TipCard({ tip, isFeatured, onRead }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  if (isFeatured) {
    return (
      <div
        className="relative rounded-3xl overflow-hidden p-8 text-white col-span-full cursor-pointer hover:scale-[1.01] transition-transform"
        style={{ background: `linear-gradient(135deg, ${tip.color}, ${tip.color}99)` }}
        onClick={onRead}
      >
        <WavyPattern />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="text-7xl flex-shrink-0">{tip.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full animate-pulse">
                ✨ Conseil du Jour
              </span>
              <span className="bg-white/10 text-white/70 text-xs font-bold px-3 py-1 rounded-full">{tip.category}</span>
              <span className="bg-white/10 text-white/70 text-xs font-bold px-3 py-1 rounded-full">{tip.level}</span>
            </div>
            <h3 className="font-black text-2xl text-white mb-2">{tip.title}</h3>
            <p className="text-white/80 leading-relaxed mb-4">{tip.summary}</p>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm">⏱ {tip.duration_min} min</span>
              <button
                onClick={e => { e.stopPropagation(); onRead(); }}
                className="ml-auto bg-white text-gray-800 font-black px-5 py-2 rounded-xl text-sm hover:bg-court-yellow transition-colors"
              >
                📖 Lire l'article complet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col">
      <div className="h-1.5 rounded-t-xl -mx-5 -mt-5 mb-4 rounded-t-2xl" style={{ background: tip.color }} />
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${tip.color}22` }}>
          {tip.emoji}
        </div>
        <div className="flex-1">
          <div className="flex gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${tip.color}22`, color: tip.color }}>
              {tip.category}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {tip.level}
            </span>
          </div>
          <h3 className="font-black text-gray-800 text-base group-hover:text-court-blue transition-colors">
            {tip.title}
          </h3>
        </div>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{tip.summary}</p>
      <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-gray-100">
        <span className="text-gray-400">⏱ {tip.duration_min} min</span>
        <div className="flex gap-2 items-center">
          <button onClick={() => setLiked(!liked)} className="text-lg hover:scale-110 transition-transform">
            {liked ? "❤️" : "🤍"}
          </button>
          <button onClick={() => setSaved(!saved)} className="text-lg hover:scale-110 transition-transform">
            {saved ? "🔖" : "📌"}
          </button>
          <button
            onClick={onRead}
            className="ml-2 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ background: tip.color }}
          >
            Lire →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TipsPage() {
  const { tips, loading } = useTips();
  const [category, setCategory] = useState("Tous");
  const [level, setLevel] = useState("Tous niveaux");
  const [selectedTip, setSelectedTip] = useState(null);

  const filtered = tips.filter(t =>
    (category === "Tous" || t.category === category) &&
    (level === "Tous niveaux" || t.level === level || t.level === "Tous niveaux")
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {selectedTip && (
        <ArticleModal article={selectedTip} type="tip" onClose={() => setSelectedTip(null)} />
      )}

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 flex items-center gap-6"
        style={{ background: "linear-gradient(135deg, #1E4B33, #2D6B4A)" }}>
        <WavyPattern />
        <div className="relative z-10 flex-1">
          <p className="text-court-yellow font-bold text-sm tracking-widest uppercase mb-2">ENTRAÎNEMENT</p>
          <h2 className="font-display text-5xl text-white">CONSEILS DU JOUR</h2>
          <p className="text-white/60 mt-2">Articles complets rédigés par des coachs — clique pour lire</p>
        </div>
        <div className="relative z-10 hidden md:block animate-float">
          <TennisRacket size={90} color="#F6ED5B" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`text-sm font-bold px-3 py-1.5 rounded-xl transition-all ${
                category === c ? "bg-court-green text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-court-green"
              }`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap sm:ml-auto">
          {levels.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                level === l ? "bg-court-blue text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-court-blue"
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Tips grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card h-52 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tip, i) => (
            <TipCard
              key={tip.id}
              tip={tip}
              isFeatured={i === 0 && category === "Tous" && level === "Tous niveaux"}
              onRead={() => setSelectedTip(tip)}
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <TennisBall size={60} animate />
          <p className="text-gray-400 mt-4 font-medium">Aucun conseil pour ces filtres...</p>
          <button onClick={() => { setCategory("Tous"); setLevel("Tous niveaux"); }}
            className="mt-3 text-court-blue font-bold text-sm hover:underline">
            Réinitialiser les filtres
          </button>
        </div>
      )}

      <div className="rounded-2xl bg-court-yellow p-6 flex items-center gap-4">
        <span className="text-4xl">💪</span>
        <div>
          <h4 className="font-black text-court-green text-lg">Défi entraînement !</h4>
          <p className="text-court-green/70 text-sm">
            Lis le conseil du jour et essaie-le pendant ta prochaine séance. Partage tes progrès avec tes amis !
          </p>
        </div>
      </div>
    </div>
  );
}
