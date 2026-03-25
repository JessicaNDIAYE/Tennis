import { useState, useEffect, useRef } from "react";
import { useNotifications } from "../hooks/useTennisData";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

const TYPE_ICONS = {
  friend_added: "👥",
  group_invite: "🎾",
  match_added: "🏆",
};

export default function NotificationsPanel() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open && unreadCount > 0) {
      setTimeout(markAllRead, 1500); // mark read after 1.5s
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="w-9 h-9 bg-court-cream rounded-full flex items-center justify-center relative hover:bg-gray-200 transition-colors"
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 Q17 2 18 8 L19 16 L5 16 L6 8 Q7 2 12 2Z"
            stroke="#1E4B33" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M9 16 Q9 19 12 19 Q15 19 15 16" stroke="#1E4B33" strokeWidth="1.8" fill="none" />
          <circle cx="12" cy="2" r="1.5" fill="#1E4B33" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 w-80 max-h-96 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="font-black text-gray-800 text-sm">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-court-blue hover:underline font-medium"
              >
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-3xl mb-2">🔔</p>
                <p className="text-gray-400 text-sm">Pas encore de notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors
                    ${!n.is_read ? "bg-blue-50/60" : ""}`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type] || "📢"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 bg-court-blue rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
