import { cn } from "@/utils/cn";
import type { StockStatus, TransactionType } from "@/types";

interface StatusBadgeProps {
  status: StockStatus | TransactionType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    "In Stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "Low Stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
    "Out of Stock": "bg-rose-50 text-rose-700 ring-rose-600/20",
    "Stock In": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "Stock Out": "bg-rose-50 text-rose-700 ring-rose-600/20",
  };

  const dot: Record<string, string> = {
    "In Stock": "bg-emerald-500",
    "Low Stock": "bg-amber-500",
    "Out of Stock": "bg-rose-500",
    "Stock In": "bg-emerald-500",
    "Stock Out": "bg-rose-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles[status] || "bg-slate-100 text-slate-700 ring-slate-600/20",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[status] || "bg-slate-500")} />
      {status}
    </span>
  );
}
