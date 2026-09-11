import type { Product } from "@/types";

export function computeStatus(quantity: number, minStock: number): Product["status"] {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= minStock) return "Low Stock";
  return "In Stock";
}

export function getStoredCurrency(): string {
  if (typeof window === "undefined") return "INR";
  try {
    const saved = window.localStorage.getItem("sf_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.currency || "INR";
    }
  } catch {
    // fallback
  }
  return "INR";
}

export function formatCurrency(amount: number, currencyCode?: string) {
  const currency = currencyCode || getStoredCurrency();
  const localeMap: Record<string, string> = {
    INR: "en-IN",
    USD: "en-US",
    EUR: "de-DE",
  };
  const locale = localeMap[currency] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(amount);
}

export function getInitials(name?: string): string {
  if (!name || typeof name !== "string") return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36).slice(-4)}`;
}

