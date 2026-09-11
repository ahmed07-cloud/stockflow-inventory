import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  AlertTriangle,
  User,
  Settings,
  LogOut,
  Package2,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useInventory } from "@/context/InventoryContext";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

const mainNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/stock-in", label: "Stock In", icon: ArrowDownLeft },
  { to: "/stock-out", label: "Stock Out", icon: ArrowUpRight },
  { to: "/transactions", label: "Transactions", icon: History },
  { to: "/low-stock", label: "Low Stock", icon: AlertTriangle },
];

const accountNav = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ mobileOpen, onCloseMobile, onLogout }: SidebarProps) {
  const location = useLocation();
  const { products } = useInventory();
  const lowStockCount = products.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").length;

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const NavItem = ({
    to,
    label,
    icon: Icon,
    badge,
  }: {
    to: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }) => (
    <NavLink
      to={to}
      onClick={onCloseMobile}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
        isActive(to)
          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className={cn("h-5 w-5", isActive(to) ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            isActive(to) ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
          )}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900">StockFlow</h1>
              <p className="text-[10px] font-medium tracking-wide text-slate-500">INVENTORY TRACKING</p>
            </div>
          </NavLink>
          <button onClick={onCloseMobile} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                badge={item.to === "/low-stock" ? lowStockCount : undefined}
              />
            ))}
          </nav>

          <div className="mt-8">
            <p className="mb-2 px-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Account</p>
            <nav className="space-y-1">
              {accountNav.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
              <button
                onClick={onLogout}
                className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut className="h-5 w-5 text-slate-400 group-hover:text-rose-500" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-900">StockFlow</p>
            <p className="mt-0.5 text-[10px] text-slate-500">StockFlow v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
