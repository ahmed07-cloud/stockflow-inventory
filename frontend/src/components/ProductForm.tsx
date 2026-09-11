import { useState, useEffect } from "react";
import { categories, units } from "@/data/demo";
import { useInventory } from "@/context/InventoryContext";
import type { Product } from "@/types";

interface ProductFormProps {
  initial?: Product | null;
  onSubmit: (data: {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    unit: string;
    price: number;
    minStock: number;
    description: string;
  }) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function ProductForm({ initial, onSubmit, onCancel, submitLabel }: ProductFormProps) {
  const { products } = useInventory();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: categories[0],
    quantity: "",
    unit: units[0],
    price: "",
    minStock: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        sku: initial.sku,
        category: initial.category,
        quantity: String(initial.quantity),
        unit: initial.unit,
        price: String(initial.price),
        minStock: String(initial.minStock),
        description: initial.description,
      });
    }
  }, [initial]);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Product name is required.";

    const trimmedSku = form.sku.trim().toUpperCase();
    if (!trimmedSku) {
      next.sku = "SKU is required.";
    } else {
      const isDuplicate = products.some(
        (p) => p.sku.trim().toUpperCase() === trimmedSku && p.id !== initial?.id
      );
      if (isDuplicate) {
        next.sku = "A product with this SKU already exists.";
      }
    }

    if (!form.category) next.category = "Category is required.";
    if (form.quantity === "" || !Number.isFinite(Number(form.quantity)) || Number(form.quantity) < 0) next.quantity = "Enter a valid quantity.";
    if (!form.unit) next.unit = "Unit is required.";
    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) next.price = "Enter a valid price.";
    if (form.minStock === "" || !Number.isFinite(Number(form.minStock)) || Number(form.minStock) < 0) next.minStock = "Enter a valid minimum stock.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      price: Number(form.price),
      minStock: Number(form.minStock),
      description: form.description.trim(),
    });
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2 ${
      errors[field] ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500" : "border-slate-200"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Product Name" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Wireless Mouse"
            className={inputClass("name")}
          />
        </Field>
        <Field label="SKU" error={errors.sku}>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => update("sku", e.target.value)}
            placeholder="e.g. WM-001"
            className={inputClass("sku")}
          />
        </Field>
        <Field label="Category" error={errors.category}>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass("category")}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Unit" error={errors.unit}>
          <select value={form.unit} onChange={(e) => update("unit", e.target.value)} className={inputClass("unit")}>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Quantity" error={errors.quantity}>
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            placeholder="0"
            className={inputClass("quantity")}
          />
        </Field>
        <Field label="Price" error={errors.price}>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="0.00"
            className={inputClass("price")}
          />
        </Field>
        <Field label="Minimum Stock Level" error={errors.minStock}>
          <input
            type="number"
            min="0"
            value={form.minStock}
            onChange={(e) => update("minStock", e.target.value)}
            placeholder="10"
            className={inputClass("minStock")}
          />
        </Field>
        <Field label="Description" className="md:col-span-2" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Short product description..."
            className={inputClass("description")}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
