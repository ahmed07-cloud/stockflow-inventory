import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowDownLeft, Package, Calculator, Truck, FileText, StickyNote, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { useInventory } from "@/context/InventoryContext";

export function StockIn() {
  const { products, stockIn } = useInventory();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramProductId = searchParams.get("product") || "";
  const [productId, setProductId] = useState(paramProductId);
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [reference, setReference] = useState("");
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

  const adding = Number(quantity);
  const validQuantity = Number.isFinite(adding) && adding > 0;
  const displayedAdding = Number.isFinite(adding) ? adding : 0;
  const newStock = selected ? selected.quantity + displayedAdding : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selected) return setError("Please select a product.");
    if (quantity === "" || !validQuantity) return setError("Enter a valid quantity to add.");

    const reasonText = supplier
      ? (reference ? `${supplier} (Ref: ${reference})` : supplier)
      : (reference ? `Ref: ${reference}` : "Stock In");

    await stockIn(selected.id, adding, reasonText, notes);
    navigate("/products");
  };

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Stock In" subtitle="Add incoming inventory to your products." />
        <EmptyState
          title="No products available"
          description="You need to add products to your inventory before recording incoming stock."
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
      <PageHeader title="Stock In" subtitle="Add incoming inventory to your products." />

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
                      {p.name} ({p.sku}) — Current: {p.quantity} {p.unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Current Stock</label>
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantity to Add</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Supplier / Source</label>
              <div className="relative">
                <Truck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="e.g. TechWorld Distributors"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Reference Number</label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. PO-2024-001"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                />
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
                  Current Stock: <strong>{selected.quantity}</strong>
                </span>
                <span className="text-slate-400">+</span>
                <span className="text-sm">
                  Adding: <strong>{displayedAdding}</strong>
                </span>
                <span className="text-slate-400">=</span>
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  New Stock: {newStock}
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
            >
              <ArrowDownLeft className="h-4 w-4" />
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
