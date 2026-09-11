import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowUpRight, Package, Calculator, FileWarning, StickyNote, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { useInventory } from "@/context/InventoryContext";

const reasons = ["Sold", "Used", "Damaged", "Expired", "Other"];

export function StockOut() {
  const { products, stockOut } = useInventory();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramProductId = searchParams.get("product") || "";
  const [productId, setProductId] = useState(paramProductId);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState(reasons[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (paramProductId && products.some((p) => p.id === paramProductId)) {
      setProductId(paramProductId);
    } else if (products.length > 0 && (!productId || !products.some((p) => p.id === productId))) {
      setProductId(products[0].id);
    }
  }, [paramProductId, products, productId]);

  const selected = useMemo(() => products.find((p) => p.id === productId), [products, productId]);

  const removing = Number(quantity);
  const validQuantity = Number.isFinite(removing) && removing > 0;
  const displayedRemoving = Number.isFinite(removing) ? removing : 0;
  const remaining = selected ? selected.quantity - displayedRemoving : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selected) return setError("Please select a product.");
    if (selected.quantity === 0) return setError("This product is out of stock.");
    if (quantity === "" || !validQuantity) return setError("Enter a valid quantity to remove.");
    if (removing > selected.quantity) return setError("Insufficient stock.");

    const result = await stockOut(selected.id, removing, reason, notes);
    if (result.success) {
      navigate("/products");
    } else {
      setError(result.error || "Unable to remove stock.");
    }
  };

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Stock Out" subtitle="Remove inventory due to sales, usage, damage or other reasons." />
        <EmptyState
          title="No products available"
          description="You need to add products to your inventory before recording stock removal."
        >
          <Link
            to="/products/add"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add First Product
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Stock Out" subtitle="Remove inventory due to sales, usage, damage or other reasons." />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Product</label>
              <div className="relative">
                <Package className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Available: {p.quantity} {p.unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Available Stock</label>
              <div className="relative">
                <Calculator className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value={selected ? `${selected.quantity} ${selected.unit}` : "—"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantity to Remove</label>
              <input
                type="number"
                min="1"
                max={selected?.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Reason</label>
              <div className="relative">
                <FileWarning className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                >
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
              <div className="relative">
                <StickyNote className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional notes..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                />
              </div>
            </div>
          </div>

          {selected && (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stock Calculation</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-900">
                <span className="text-sm">
                  Available Stock: <strong>{selected.quantity}</strong>
                </span>
                <span className="text-slate-400">−</span>
                <span className="text-sm">
                  Removing: <strong>{displayedRemoving}</strong>
                </span>
                <span className="text-slate-400">=</span>
                <span
                  className={`rounded-lg px-3 py-1 text-sm font-semibold ${
                    remaining < 0
                      ? "bg-rose-100 text-rose-700"
                      : remaining === 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  Remaining: {remaining}
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-700"
            >
              <ArrowUpRight className="h-4 w-4" />
              Remove Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
