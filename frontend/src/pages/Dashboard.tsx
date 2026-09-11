import { Package, Boxes, AlertTriangle, CircleOff, TrendingUp, ArrowRight, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useInventory } from "@/context/InventoryContext";
import { formatDate, formatCurrency } from "@/lib/inventory";
import { Link } from "react-router-dom";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

export function Dashboard() {
  const { products, transactions } = useInventory();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
  const lowStock = products.filter((p) => p.status === "Low Stock").length;
  const outOfStock = products.filter((p) => p.status === "Out of Stock").length;

  const movementData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const dayTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= date && transactionDate < nextDate;
    });

    return {
      name: date.toLocaleDateString("en-IN", { weekday: "short" }),
      stockIn: dayTransactions
        .filter((transaction) => transaction.type === "Stock In")
        .reduce((sum, transaction) => sum + transaction.quantity, 0),
      stockOut: dayTransactions
        .filter((transaction) => transaction.type === "Stock Out")
        .reduce((sum, transaction) => sum + transaction.quantity, 0),
    };
  });

  const categoryData = products.reduce<{ name: string; value: number }[]>((acc, product) => {
    const existing = acc.find((item) => item.name === product.category);
    if (existing) {
      existing.value += product.quantity;
    } else {
      acc.push({ name: product.category, value: product.quantity });
    }
    return acc;
  }, []);

  const recentTransactions = transactions.slice(0, 5);
  const lowStockAlerts = products
    .filter((p) => p.status === "Low Stock" || p.status === "Out of Stock")
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your inventory" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle="Active catalog items"
          icon={Package}
          indicatorClassName="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          subtitle="Units across warehouse"
          icon={Boxes}
          indicatorClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          subtitle="Total valuation"
          icon={DollarSign}
          indicatorClassName="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Low Stock"
          value={lowStock}
          subtitle="Items below minimum"
          icon={AlertTriangle}
          indicatorClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          subtitle="Needs immediate restock"
          icon={CircleOff}
          indicatorClassName="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Stock Movement</h3>
              <p className="text-xs text-slate-500">Weekly stock in vs stock out</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" /> In
              </span>
              <span className="flex items-center gap-1 text-rose-600">
                <TrendingUp className="h-3.5 w-3.5 rotate-180" /> Out
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movementData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="stockIn" name="Stock In" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Inventory by Category</h3>
          <p className="text-xs text-slate-500">Distribution by quantity</p>
          <div className="h-72">
            {categoryData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No category data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
              <p className="text-xs text-slate-500">Latest stock movements</p>
            </div>
            <Link
              to="/transactions"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Quantity</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">User</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-sm text-slate-500">
                      No recent transactions.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 font-medium text-slate-900">
                        <Link to={`/products/${t.productId}`} className="hover:text-indigo-600 hover:underline">
                          {t.productName}
                        </Link>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={t.type} />
                      </td>
                      <td className="py-3 text-slate-600">{t.quantity}</td>
                      <td className="py-3 text-slate-500">{formatDate(t.date)}</td>
                      <td className="py-3 text-slate-600">{t.user}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Low Stock Alerts</h3>
              <p className="text-xs text-slate-500">Products needing attention</p>
            </div>
            <Link
              to="/low-stock"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockAlerts.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">Inventory looks healthy.</p>
            ) : (
              lowStockAlerts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div>
                    <Link
                      to={`/products/${p.id}`}
                      className="text-sm font-medium text-slate-900 hover:text-indigo-600 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      Current: {p.quantity} · Min: {p.minStock}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
