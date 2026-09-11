import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Package,
  Calendar,
  Hash,
  Tag,
  Boxes,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { useInventory } from "@/context/InventoryContext";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/inventory";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { products, transactions, deleteProduct } = useInventory();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const product = products.find((p) => p.id === id);
  const productTransactions = transactions.filter((t) => t.productId === id).sort((a, b) => +new Date(b.date) - +new Date(a.date));

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState title="Product not found" description="The requested product does not exist.">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </EmptyState>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteProduct(product.id);
    setDeleteOpen(false);
    navigate("/products");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          to="/products"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <PageHeader title={product.name} subtitle={`SKU: ${product.sku}`}>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/products/${product.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            <Link
              to={`/stock-in?product=${product.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <ArrowDownLeft className="h-4 w-4" />
              Stock In
            </Link>
            <Link
              to={`/stock-out?product=${product.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              <ArrowUpRight className="h-4 w-4" />
              Stock Out
            </Link>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </PageHeader>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Product Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem icon={Package} label="Name" value={product.name} />
            <InfoItem icon={Hash} label="SKU" value={product.sku} />
            <InfoItem icon={Tag} label="Category" value={product.category} />
            <InfoItem icon={Boxes} label="Current Stock" value={`${product.quantity} ${product.unit}`} />
            <InfoItem icon={AlertCircle} label="Minimum Stock" value={`${product.minStock} ${product.unit}`} />
            <InfoItem icon={Tag} label="Price" value={formatCurrency(product.price)} />
            <InfoItem icon={Calendar} label="Created Date" value={formatDate(product.createdAt)} />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <StatusBadge status={product.status} />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs font-medium text-slate-500">Description</p>
            <p className="mt-1 text-sm text-slate-700">{product.description || "No description provided."}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Stock Summary</h3>
          <div className="mt-4 grid gap-3">
            <SummaryCard label="Total Stock In" value={`${product.totalStockIn || 0} ${product.unit}`} color="emerald" />
            <SummaryCard label="Total Stock Out" value={`${product.totalStockOut || 0} ${product.unit}`} color="rose" />
            <SummaryCard label="Current Stock" value={`${product.quantity} ${product.unit}`} color="indigo" />
            <SummaryCard label="Total Stock Value" value={formatCurrency(product.quantity * product.price)} color="violet" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Transaction History</h3>
        {productTransactions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No transactions recorded for this product.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Quantity</th>
                  <th className="pb-3 font-medium">Previous Stock</th>
                  <th className="pb-3 font-medium">New Stock</th>
                  <th className="pb-3 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {productTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3 text-slate-600">{formatDateTime(t.date)}</td>
                    <td className="py-3">
                      <StatusBadge status={t.type} />
                    </td>
                    <td className="py-3 text-slate-900">{t.quantity}</td>
                    <td className="py-3 text-slate-600">{t.previousStock}</td>
                    <td className="py-3 text-slate-900">{t.newStock}</td>
                    <td className="py-3 text-slate-600">{t.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Product?"
        description="Are you sure you want to delete this product? This action cannot be undone."
        footer={
          <>
            <button
              onClick={() => setDeleteOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
            >
              Delete Product
            </button>
          </>
        }
      />
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "emerald" | "rose" | "indigo" | "violet";
}) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-purple-50 text-purple-700",
  };

  return (
    <div className={`flex items-center justify-between rounded-xl p-4 ${styles[color]}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}
