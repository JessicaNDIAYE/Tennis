import { useState } from "react";
import { news } from "../data/mockData";
import { TennisBall, NetPattern } from "./TennisIllustrations";

const categories = ["Tous", "Grand Chelem", "Équipement", "Interview", "Actualité", "Tournoi"];

function NewsCard({ article, isFeatured }) {
  const [bookmarked, setBookmarked] = useState(false);

  if (isFeatured) {
    return (
      <div className="card col-span-full bg-court-green text-white relative overflow-hidden border-0">
        <NetPattern />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="text-7xl flex-shrink-0">{article.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {article.hot && (
                <span className="bg-court-yellow text-court-green text-xs font-black px-3 py-1 rounded-full animate-pulse">
                  🔥 À LA UNE
                </span>
              )}
              <span className="bg-white/20 text-white/80 text-xs font-bold px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-white/40 text-xs">{article.date}</span>
            </div>
            <h3 className="font-black text-2xl text-white mb-2">{article.title}</h3>
            <p className="text-white/70 leading-relaxed mb-4">{article.summary}</p>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-sm">📖 {article.readTime} de lecture</span>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`ml-auto px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  bookmarked ? "bg-court-yellow text-court-green" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {bookmarked ? "🔖 Sauvegardé" : "📌 Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 group">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-court-cream">
          {article.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {article.hot && (
              <span className="bg-orange-100 text-orange-600 text-xs font-black px-2 py-0.5 rounded-full">🔥 Hot</span>
            )}
            <span className="bg-court-cream text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">
              {article.category}
            </span>
          </div>
          <h3 className="font-black text-gray-800 text-base mb-1 group-hover:text-court-blue transition-colors leading-tight">
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.summary}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{article.date}</span>
              <span>·</span>
              <span>📖 {article.readTime}</span>
            </div>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="text-lg hover:scale-110 transition-transform"
            >
              {bookmarked ? "🔖" : "📌"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [category, setCategory] = useState("Tous");

  const filtered = news.filter(n => category === "Tous" || n.category === category);
  const hotCount = news.filter(n => n.hot).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-court-clay p-8 text-white">
        <NetPattern />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm tracking-widest uppercase opacity-70 mb-2">TENNIS WORLD</p>
            <h2 className="font-display text-5xl">ACTUALITÉS</h2>
            <p className="mt-2 opacity-70">{hotCount} articles chauds · Mis à jour aujourd'hui</p>
          </div>
          <div className="hidden md:block animate-bounce-slow">
            <TennisBall size={70} />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
              category === c
                ? "bg-court-clay text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:border-court-clay"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* News grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((article, i) => (
          <NewsCard key={article.id} article={article} isFeatured={i === 0 && category === "Tous"} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <TennisBall size={60} animate />
          <p className="text-gray-400 mt-4 font-medium">Aucun article dans cette catégorie...</p>
        </div>
      )}

      {/* Notification promo */}
      <div className="rounded-2xl border-2 border-dashed border-court-blue/30 p-5 flex items-center gap-4 bg-court-blue/5">
        <span className="text-4xl">🔔</span>
        <div className="flex-1">
          <h4 className="font-black text-court-green">Notifications ATP/WTA</h4>
          <p className="text-gray-500 text-sm">Reçois les résultats des tournois en direct sur ton téléphone et ta montre !</p>
        </div>
        <button className="btn-primary text-sm whitespace-nowrap">
          Activer
        </button>
      </div>
    </div>
  );
}
