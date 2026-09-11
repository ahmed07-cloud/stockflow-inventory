import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/inventory";
import { NotificationDropdown } from "./NotificationDropdown";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:left-64 lg:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-xs font-medium text-slate-400">Welcome back</p>
        <p className="text-sm font-semibold text-slate-900">{user?.name || "Admin"}</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationDropdown />
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
          title="View profile"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {getInitials(user?.name)}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-900">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-slate-500">{user?.role || "Staff"}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </Link>
      </div>
    </header>
  );
}
