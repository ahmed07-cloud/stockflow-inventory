import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";
import { cn } from "@/utils/cn";
import type { NotificationType } from "@/types";

const typeStyles: Record<NotificationType, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
  info: "bg-indigo-500",
};

export function NotificationDropdown() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications } = useInventory();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  markAllNotificationsRead();
                }}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Mark all read"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => clearAllNotifications()}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50",
                    !n.read && "bg-slate-50/60"
                  )}
                >
                  <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", typeStyles[n.type])} />
                  <div className="flex-1">
                    <p className={cn("text-sm", !n.read ? "font-medium text-slate-900" : "text-slate-600")}>
                      {n.message}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
