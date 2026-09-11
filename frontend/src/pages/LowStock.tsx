import { useMemo } from "react";
import { ArrowDownLeft, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { useInventory } from "@/context/InventoryContext";
import { cn } from "@/utils/cn";

export function LowStock() {
  const { products } = useInventory();

  const alerts = useMemo(
    () => products.filter((p) => p.status === "Low Stock" || p.status === "Out of Stock").sort((a, b) => a.quantity - b.quantity),
    [products]
  );

  const lowCount = products.filter((p) => p.status === "Low Stock").length;
  const outCount = products.filter((p) => p.status === "Out of Stock").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Low Stock" subtitle="Products that need restocking." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Low Stock Products</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{lowCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Out of Stock</p>
          <p className="mt-2 text-3xl font-semibold text-rose-600">{outCount}</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          title="Inventory looks healthy"
          description="All products are above their minimum stock level."
          icon={<PackageCheck className="h-7 w-7" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alerts.map((p) => {
            const progress =
              p.minStock > 0
                ? Math.min(100, Math.max(0, Math.round((p.quantity / p.minStock) * 100)))
                : p.quantity > 0
                ? 100
                : 0;
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      to={`/products/${p.id}`}
                      className="text-base font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-slate-500">SKU: {p.sku}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      Current: <strong>{p.quantity}</strong> {p.unit}
                    </span>
                    <span className="text-slate-500">
                      Min: {p.minStock} {p.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        p.status === "Out of Stock" ? "bg-rose-500" : "bg-amber-500"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <Link
                    to={`/products/${p.id}`}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    View
                  </Link>
                  <Link
                    to={`/stock-in?product=${p.id}`}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-white transition",
                      p.status === "Out of Stock"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    )}
                  >
                    <ArrowDownLeft className="h-4 w-4" />
                    {p.status === "Out of Stock" ? "Add Stock" : "Restock"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
