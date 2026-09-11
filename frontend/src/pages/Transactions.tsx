import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Calendar, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { useInventory } from "@/context/InventoryContext";
import { formatDateTime } from "@/lib/inventory";
import { cn } from "@/utils/cn";

const tabs = ["All", "Stock In", "Stock Out"] as const;

export function Transactions() {
  const { transactions, products } = useInventory();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"All" | "Stock In" | "Stock Out">("All");
  const [productFilter, setProductFilter] = useState("All");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = (t.productName || "").toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "All" || t.type === type;
      const matchesProduct = productFilter === "All" || t.productId === productFilter;
      const matchesDate =
        !date ||
        (() => {
          const d = new Date(t.date);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}` === date;
        })();
      return matchesSearch && matchesType && matchesProduct && matchesDate;
    });
  }, [transactions, search, type, productFilter, date]);

  const hasFilters = search || type !== "All" || productFilter !== "All" || date;
  const clearFilters = () => {
    setSearch("");
    setType("All");
    setProductFilter("All");
    setDate("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="View all inventory stock movements." />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setType(tab)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition",
                  type === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                >
                  <option value="All">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                />
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm font-medium text-slate-500 hover:text-indigo-600">
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Previous Stock</th>
                <th className="pb-3 font-medium">New Stock</th>
                <th className="pb-3 font-medium">Reason</th>
                <th className="pb-3 font-medium">User</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="py-3 text-slate-600">{formatDateTime(t.date)}</td>
                  <td className="py-3 font-medium text-slate-900">
                    <Link to={`/products/${t.productId}`} className="hover:text-indigo-600 hover:underline">
                      {t.productName}
                    </Link>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={t.type} />
                  </td>
                  <td className="py-3 text-slate-900">{t.quantity}</td>
                  <td className="py-3 text-slate-600">{t.previousStock}</td>
                  <td className="py-3 text-slate-900">{t.newStock}</td>
                  <td className="py-3 text-slate-600">{t.reason}</td>
                  <td className="py-3 text-slate-600">{t.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="mt-6">
            {hasFilters ? (
              <EmptyState
                title="No matching transactions"
                description="No stock movement records match your search or filters."
              >
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear all filters
                </button>
              </EmptyState>
            ) : (
              <EmptyState title="No transactions yet" description="Stock movements will appear here once recorded." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
