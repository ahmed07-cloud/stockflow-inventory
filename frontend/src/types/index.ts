export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type TransactionType = "Stock In" | "Stock Out";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minStock: number;
  description: string;
  totalStockIn: number;
  totalStockOut: number;
  status: StockStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: TransactionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  user: string;
  date: string;
}

export type NotificationType = "success" | "warning" | "error" | "info";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  phone: string;
}
