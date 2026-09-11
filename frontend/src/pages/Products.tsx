import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { useInventory } from "@/context/InventoryContext";
import { formatCurrency } from "@/lib/inventory";
import { categories } from "@/data/demo";
import { cn } from "@/utils/cn";

export function Products() {
  const { products, deleteProduct } = useInventory();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("name-asc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      const matchesStatus = status === "All" || p.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    data = [...data].sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "qty-asc":
          return a.quantity - b.quantity;
        case "qty-desc":
          return b.quantity - a.quantity;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return data;
  }, [products, search, category, status, sort]);

  const hasFilters = search || category !== "All" || status !== "All";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStatus("All");
    setSort("name-asc");
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Products" subtitle="Manage and monitor your inventory items.">
        <Link
          to="/products/add"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </PageHeader>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
              >
                <option value="All">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
              >
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="qty-asc">Qty: Low to High</option>
                <option value="qty-desc">Qty: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="py-3 font-medium text-slate-900">
                    <Link to={`/products/${p.id}`} className="hover:text-indigo-600 hover:underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 text-slate-500">{p.sku}</td>
                  <td className="py-3 text-slate-600">{p.category}</td>
                  <td className="py-3 text-slate-900">
                    {p.quantity} {p.unit}
                  </td>
                  <td className="py-3 text-slate-900">{formatCurrency(p.price)}</td>
                  <td className="py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === p.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                            <ActionItem
                              icon={Eye}
                              label="View"
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/products/${p.id}`);
                              }}
                            />
                            <ActionItem
                              icon={Pencil}
                              label="Edit"
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/products/${p.id}/edit`);
                              }}
                            />
                            <ActionItem
                              icon={ArrowDownLeft}
                              label="Stock In"
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/stock-in?product=${p.id}`);
                              }}
                            />
                            <ActionItem
                              icon={ArrowUpRight}
                              label="Stock Out"
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/stock-out?product=${p.id}`);
                              }}
                            />
                            <div className="my-1 border-t border-slate-100" />
                            <ActionItem
                              icon={Trash2}
                              label="Delete"
                              danger
                              onClick={() => {
                                setOpenMenuId(null);
                                setDeleteId(p.id);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="mt-6">
            {hasFilters ? (
              <EmptyState
                title="No matching products found"
                description="No products match your active search or filter criteria."
              >
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear all filters
                </button>
              </EmptyState>
            ) : (
              <EmptyState
                title="No products yet"
                description="Add your first product to start tracking inventory."
              >
                <Link
                  to="/products/add"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>
              </EmptyState>
            )}
          </div>
        )}
      </div>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product?"
        description="Are you sure you want to delete this product? This action cannot be undone."
        footer={
          <>
            <button
              onClick={() => setDeleteId(null)}
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

function ActionItem({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition",
        danger
          ? "text-rose-600 hover:bg-rose-50"
          : "text-slate-700 hover:bg-slate-50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
