import { useState } from "react";

const RULES = [
  {
    id: "basics",
    emoji: "🎾",
    title: "Les bases",
    color: "#1C55DB",
    sections: [
      {
        subtitle: "Objectif du jeu",
        text: "Le tennis est un sport qui oppose deux joueurs (simple) ou deux paires (double). L'objectif est de renvoyer la balle dans le camp adverse de façon à ce que l'adversaire ne puisse pas la retourner valablement dans le tien.",
      },
      {
        subtitle: "Le terrain",
        text: "Un court de tennis mesure 23,77 m de long et 8,23 m de large en simple (10,97 m en double). Il est divisé en deux camps égaux par un filet de 91,4 cm de hauteur au centre (107 cm aux poteaux). Chaque camp comporte une zone de service (deux cases) et une zone de fond.",
      },
      {
        subtitle: "Les surfaces",
        items: [
          "🟤 Terre battue (clay) : balle lente, rebond haut — Roland-Garros",
          "🟢 Gazon (grass) : balle rapide, rebond bas — Wimbledon",
          "🔵 Dur (hard) : vitesse et rebond intermédiaires — US Open, Australian Open",
          "🔷 Moquette indoor : surfaces synthétiques utilisées en salle",
        ],
      },
    ],
  },
  {
    id: "scoring",
    emoji: "🔢",
    title: "Système de points",
    color: "#1E4B33",
    sections: [
      {
        subtitle: "Points dans un jeu",
        items: [
          "0 point → 0 (love)",
          "1 point gagné → 15",
          "2 points gagnés → 30",
          "3 points gagnés → 40",
          "4 points gagnés → Jeu (si écart ≥ 2 points à partir de 40)",
        ],
      },
      {
        subtitle: "Égalité (Deuce)",
        text: "Quand les deux joueurs sont à 40-40, on parle d'égalité (deuce). Il faut alors marquer 2 points consécutifs pour remporter le jeu. Le premier point gagné s'appelle « avantage » (AD) ; si tu perds le point suivant, on revient à l'égalité.",
      },
      {
        subtitle: "Jeux et sets",
        text: "Un set se joue en 6 jeux. Pour gagner un set, il faut atteindre 6 jeux avec au moins 2 jeux d'avance sur l'adversaire (ex: 6-4, 7-5). Si le score atteint 6-6, un tie-break est généralement joué pour départager.",
      },
      {
        subtitle: "Tie-break",
        text: "Le tie-break se joue en points (1, 2, 3…). Le premier à atteindre 7 points avec 2 points d'avance remporte le tie-break et le set 7-6. Le service alterne : 1 service pour le premier joueur, puis 2 services par joueur. On change de côté tous les 6 points.",
      },
      {
        subtitle: "Match",
        items: [
          "Format court (ATP 250, WTA) : meilleur des 3 sets",
          "Format long (Grand Chelem hommes) : meilleur des 5 sets",
          "Dernier set : souvent joué en avantage (sans tie-break) en Grand Chelem",
        ],
      },
    ],
  },
  {
    id: "service",
    emoji: "🎯",
    title: "Le service",
    color: "#FCA833",
    sections: [
      {
        subtitle: "Comment servir",
        text: "Au début de chaque point, le serveur se place derrière la ligne de fond, à droite (premier point) ou à gauche (deuxième point) de la marque centrale. Il doit lancer la balle en l'air et la frapper avant qu'elle ne touche le sol. La balle doit atterrir dans la case de service diagonalement opposée.",
      },
      {
        subtitle: "Premier et deuxième service",
        text: "Chaque point commence avec un premier service. En cas de faute, le serveur a droit à un second service. Deux fautes consécutives = double faute → le point est perdu.",
      },
      {
        subtitle: "Let",
        text: "Si la balle touche le filet et tombe quand même dans la case de service valide, on parle de let : le service est rejoué, sans pénalité. Il peut y avoir autant de lets que nécessaire.",
      },
      {
        subtitle: "As",
        text: "Un service que le receveur ne touche pas du tout s'appelle un ace. C'est un point direct pour le serveur.",
      },
      {
        subtitle: "Fautes de service",
        items: [
          "La balle tombe hors de la case de service cible",
          "La balle touche le filet et ne passe pas dans la case valide",
          "Le serveur marche dans le court avant de frapper (pied dans le court)",
          "La balle n'est pas lancée en l'air et frappée correctement",
        ],
      },
    ],
  },
  {
    id: "rally",
    emoji: "⚡",
    title: "L'échange (rallye)",
    color: "#8B5CF6",
    sections: [
      {
        subtitle: "Retour valide",
        text: "Après le service, les joueurs se renvoient la balle en alternance. Chaque coup doit passer au-dessus du filet et rebondir dans les limites du terrain adverse (en incluant les lignes). En double, la balle peut aller n'importe où dans le terrain, y compris les couloirs.",
      },
      {
        subtitle: "Rebond",
        text: "La balle a le droit de rebondir une seule fois dans ton camp avant que tu ne la frappes. Si elle rebondit deux fois, tu perds le point. Tu peux aussi frapper la balle avant qu'elle ne rebondisse (volée).",
      },
      {
        subtitle: "Les lignes",
        text: "Les balles qui touchent une ligne sont considérées BONNES (dans le terrain). En simple, les couloirs (les bandes supplémentaires sur les côtés) ne sont pas utilisés — sauf au service où seul l'espace entre les lignes de service compte.",
      },
      {
        subtitle: "Fautes pendant l'échange",
        items: [
          "La balle sort du terrain (longue ou large)",
          "La balle touche le filet et ne passe pas",
          "Tu frappes la balle deux fois d'affilée",
          "Tu touches le filet avec ta raquette, ton corps ou tes vêtements",
          "La balle touche ta personne (hors raquette) ou tes vêtements",
          "Tu touches la balle avant qu'elle ne passe le filet",
        ],
      },
    ],
  },
  {
    id: "special",
    emoji: "📜",
    title: "Règles spéciales",
    color: "#EC4899",
    sections: [
      {
        subtitle: "Gêne (hindrance)",
        text: "Si un joueur est gêné volontairement par son adversaire (cri, geste, obstruction), il peut demander un let (rejouer le point). Si la gêne est involontaire, le juge de chaise décide.",
      },
      {
        subtitle: "Balle filet pendant l'échange",
        text: "Si la balle touche le filet pendant l'échange ET retombe dans le camp adverse valide, le point continue normalement. Ce n'est pas un let comme au service.",
      },
      {
        subtitle: "Balle hors limites depuis le filet",
        text: "La balle peut contourner les poteaux (par l'extérieur du terrain) pour atterrir dans le camp adverse — c'est valide même si elle passe sous le niveau du filet, tant qu'elle ne touche pas le filet.",
      },
      {
        subtitle: "Challenge (Hawk-Eye)",
        text: "Dans les tournois équipés, chaque joueur a droit à 3 challenges par set (+ 1 en cas de tie-break). Si le challenge est gagné, il est conservé. S'il est perdu, il est retiré. Le système Hawk-Eye reconstruit la trajectoire de la balle en 3D.",
      },
      {
        subtitle: "Code de conduite",
        items: [
          "Pas de raquette fracassée, penalité de point ou de jeu",
          "Pas d'obscénités ni d'insultes envers l'arbitre ou l'adversaire",
          "Pas de délai excessif entre les points (20 secondes max en règle générale)",
          "Avertissement → perte de point → perte de jeu → disqualification",
        ],
      },
      {
        subtitle: "Appels de balle (auto-arbitrage)",
        text: "Sans arbitre (matchs amateurs), chaque joueur juge les balles de son propre camp. En cas de doute, la balle est déclarée bonne (dans). Un appel « out » doit être immédiat et clair.",
      },
    ],
  },
  {
    id: "equipment",
    emoji: "🏸",
    title: "Équipement",
    color: "#C17B5A",
    sections: [
      {
        subtitle: "La raquette",
        text: "La surface de frappe (tamis) ne peut pas dépasser 39,37 cm de long et 29,21 cm de large. Le tamis doit être uniforme — pas de trous, ni de décorations qui modifient le jeu. Il n'y a pas de poids minimum imposé officiellement.",
      },
      {
        subtitle: "La balle",
        text: "Une balle de tennis officielle pèse entre 56,7 g et 58,5 g, mesure entre 6,54 cm et 6,86 cm de diamètre. Elle est pressurisée avec de l'air ou de l'azote et recouverte de feutre. Les balles se dégradent et sont changées régulièrement en tournoi.",
      },
      {
        subtitle: "Tenue",
        text: "À Wimbledon, le blanc est obligatoire. Dans les autres tournois, la tenue doit être appropriée et conforme aux règles du sponsor du tournoi. Les chaussures doivent être adaptées à la surface.",
      },
    ],
  },
  {
    id: "glossary",
    emoji: "📖",
    title: "Glossaire tennis",
    color: "#A8D84E",
    sections: [
      {
        subtitle: "Termes de base",
        items: [
          "Ace : service gagnant non touché par le receveur",
          "Avantage (AD) : point après l'égalité",
          "Break : perdre son service (subir un break), ou le gagner",
          "Deuce : égalité à 40-40",
          "Double faute : deux fautes de service consécutives → perte du point",
          "Let : service à rejouer (balle sur le filet, retombée valide)",
          "Love : 0 point",
          "Tie-break : jeu décisif pour départager à 6-6",
          "Volée : frappe avant le rebond de la balle",
          "Lob : coup très haut par-dessus l'adversaire au filet",
          "Smash : coup puissant sur une balle haute",
          "Passing-shot : coup qui passe à côté d'un adversaire au filet",
          "Drop-shot : amorti court près du filet",
          "Slice : coup coupé qui fait reculer la balle après rebond",
          "Topspin : effet avant sur la balle — rebond plus haut et plus vite",
        ],
      },
      {
        subtitle: "Acteurs du match",
        items: [
          "Juge de chaise : arbitre principal en hauteur",
          "Juge de ligne : surveille les lignes",
          "Ramasseur de balles (ballboy/ballgirl) : récupère les balles",
          "Superviseur de tournoi : autorité en cas de litige règlementaire",
        ],
      },
    ],
  },
];

function RuleSection({ section }) {
  return (
    <div className="space-y-2">
      <h4 className="font-bold text-gray-700 text-sm">{section.subtitle}</h4>
      {section.text && <p className="text-gray-600 text-sm leading-relaxed">{section.text}</p>}
      {section.items && (
        <ul className="space-y-1.5">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600">
              <span className="text-gray-400 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RuleCard({ rule, isOpen, onToggle }) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 text-left"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
          style={{ background: `${rule.color}22` }}
        >
          {rule.emoji}
        </div>
        <div className="flex-1">
          <h3 className="font-black text-gray-800 text-base">{rule.title}</h3>
          <p className="text-xs text-gray-400">{rule.sections.length} section{rule.sections.length > 1 ? "s" : ""}</p>
        </div>
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-all ${isOpen ? "rotate-45" : ""}`}
          style={{ background: rule.color }}
        >
          +
        </div>
      </button>

      {isOpen && (
        <div className="mt-5 pt-5 border-t border-gray-100 space-y-5 animate-slide-up">
          {rule.sections.map((section, i) => (
            <RuleSection key={i} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RulesPage() {
  const [openId, setOpenId] = useState("basics");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-4xl text-court-green">RÈGLES DU TENNIS</h2>
        <p className="text-gray-500 text-sm mt-1">Tout ce que tu dois savoir pour jouer et arbitrer</p>
      </div>

      {/* Quick tip */}
      <div className="bg-court-green text-white rounded-2xl p-5 flex gap-4 items-start">
        <span className="text-3xl flex-shrink-0">💡</span>
        <div>
          <p className="font-bold mb-1">Le principe fondamental</p>
          <p className="text-court-cream/80 text-sm leading-relaxed">
            Le tennis se joue en points → jeux → sets → match. Pour gagner un point, fais tomber la balle dans le camp adverse de façon à ce que ton adversaire ne puisse pas la retourner valablement.
          </p>
        </div>
      </div>

      {/* Rules accordion */}
      <div className="space-y-3">
        {RULES.map(rule => (
          <RuleCard
            key={rule.id}
            rule={rule}
            isOpen={openId === rule.id}
            onToggle={() => setOpenId(openId === rule.id ? null : rule.id)}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          Règles basées sur le règlement officiel ITF (International Tennis Federation) · 2024
        </p>
      </div>
    </div>
  );
}
