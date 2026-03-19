import { useEffect } from "react";

// Simple markdown-to-HTML renderer (headings, bold, tables, lists, paragraphs)
function renderMarkdown(text) {
  if (!text) return "";

  const lines = text.split("\n");
  const html = [];
  let inList = false;
  let inOl = false;
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length < 2) {
      html.push(`<p>${tableRows.map(r => r.join(" | ")).join("<br/>")}</p>`);
      tableRows = [];
      inTable = false;
      return;
    }
    const [header, , ...body] = tableRows;
    html.push(`<div class="overflow-x-auto my-4"><table class="w-full text-sm border-collapse">
      <thead><tr>${header.map(h => `<th class="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-bold text-gray-700">${h}</th>`).join("")}</tr></thead>
      <tbody>${body.map(r => `<tr>${r.map(c => `<td class="border border-gray-200 px-3 py-2 text-gray-600">${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table></div>`);
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Table row
    if (line.startsWith("|")) {
      inTable = true;
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (inList && !line.startsWith("- ")) {
      html.push("</ul>");
      inList = false;
    }
    if (inOl && !/^\d+\./.test(line)) {
      html.push("</ol>");
      inOl = false;
    }

    // Headings
    if (line.startsWith("### ")) {
      html.push(`<h3 class="font-black text-gray-800 text-base mt-5 mb-2">${fmt(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h2 class="font-black text-court-green text-xl mt-6 mb-3 pb-2 border-b border-gray-100">${fmt(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      html.push(`<h1 class="font-display text-4xl text-court-green mb-4">${line.slice(2)}</h1>`);
    }
    // Unordered list
    else if (line.startsWith("- ")) {
      if (!inList) { html.push('<ul class="list-none space-y-1.5 my-3">'); inList = true; }
      html.push(`<li class="flex items-start gap-2 text-gray-600"><span class="text-court-blue mt-0.5">•</span><span>${fmt(line.slice(2))}</span></li>`);
    }
    // Ordered list
    else if (/^\d+\./.test(line)) {
      const match = line.match(/^(\d+)\.\s*(.*)/);
      if (match) {
        if (!inOl) { html.push('<ol class="space-y-2 my-3">'); inOl = true; }
        html.push(`<li class="flex items-start gap-3 text-gray-600">
          <span class="w-6 h-6 rounded-full bg-court-blue/10 text-court-blue font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">${match[1]}</span>
          <span>${fmt(match[2])}</span>
        </li>`);
      }
    }
    // Empty line
    else if (line.trim() === "") {
      html.push('<div class="h-2"></div>');
    }
    // Paragraph
    else {
      html.push(`<p class="text-gray-600 leading-relaxed">${fmt(line)}</p>`);
    }
  }

  if (inList) html.push("</ul>");
  if (inOl) html.push("</ol>");
  if (inTable) flushTable();

  return html.join("\n");
}

function fmt(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-court-blue">$1</code>');
}

export default function ArticleModal({ article, type, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const accentColor = article.color || (type === "news" ? "#C17B5A" : "#1C55DB");
  const title = article.title;
  const content = article.content;
  const meta = type === "news"
    ? `${article.category} · ${article.read_time_min} min de lecture · ${article.published_at?.slice(0, 10) || ""}`
    : `${article.category} · ${article.level} · ⏱ ${article.duration_min} min`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Color header */}
        <div className="relative rounded-t-3xl overflow-hidden p-8 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}>
          <div className="flex items-start gap-4">
            <span className="text-5xl flex-shrink-0">{article.emoji}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {type === "news" && article.is_hot && (
                  <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full">🔥 À LA UNE</span>
                )}
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{article.category}</span>
              </div>
              <h2 className="font-black text-white text-xl leading-tight">{title}</h2>
              <p className="text-white/60 text-xs mt-2">{meta}</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">ACE Tennis Hub · {new Date().getFullYear()}</p>
          <button
            onClick={onClose}
            className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-colors"
            style={{ background: accentColor }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
