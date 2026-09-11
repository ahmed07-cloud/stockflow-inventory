import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { demoNotifications, demoUser } from "@/data/demo";
import { computeStatus } from "@/lib/inventory";
import { useToast } from "@/context/ToastContext";

import type {
  Product,
  Transaction,
  Notification,
} from "@/types";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  stockIn as apiStockIn,
  stockOut as apiStockOut,
  getTransactions,
} from "@/lib/api";

interface InventoryContextValue {
  products: Product[];
  transactions: Transaction[];
  notifications: Notification[];

  addProduct: (
    product: Omit<
      Product,
      "id" | "status" | "totalStockIn" | "totalStockOut" | "createdAt"
    >
  ) => Promise<void>;

  updateProduct: (
    id: string,
    updates: Partial<Product>
  ) => Promise<void>;

  deleteProduct: (
    id: string
  ) => Promise<void>;

  stockIn: (
    productId: string,
    quantity: number,
    reason: string,
    notes: string
  ) => Promise<void>;

  stockOut: (
    productId: string,
    quantity: number,
    reason: string,
    notes: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;

  unreadCount: number;
  currentUser: typeof demoUser;
}

const InventoryContext = createContext<
  InventoryContextValue | undefined
>(undefined);

export function InventoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { addToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [notifications, setNotifications] =
    useState<Notification[]>(demoNotifications);

  const [currentUser] = useState(demoUser);

  const loadProducts = async (): Promise<Product[]> => {
    try {
      const data = await getProducts();

      const formattedProducts: Product[] = data.map(
        (product: any) => ({
          id: String(product.id),
          name: product.name,
          sku: product.sku,
          category: product.category,
          quantity: product.quantity,
          unit: product.unit,
          price: product.price,
          minStock: product.min_stock,
          description: product.description || "",
          status: computeStatus(
            product.quantity,
            product.min_stock
          ),
          totalStockIn: 0,
          totalStockOut: 0,
          createdAt:
            product.created_at ||
            new Date().toISOString(),
        })
      );

      setProducts(formattedProducts);
      return formattedProducts;
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );

      addToast(
        "Could not load products from backend.",
        "error"
      );
      return [];
    }
  };

  const loadTransactions = async (currentProducts?: Product[]) => {
    try {
      const data = await getTransactions();
      const productList = currentProducts || products;

      const formattedTransactions: Transaction[] =
        data.map((transaction: any) => {
          const matchedProduct = productList.find(
            (p) => String(p.id) === String(transaction.product_id)
          );
          return {
            id: String(transaction.id),
            productId: String(
              transaction.product_id
            ),
            productName: matchedProduct
              ? matchedProduct.name
              : `Product #${transaction.product_id}`,
            type:
              transaction.type === "IN"
                ? "Stock In"
                : "Stock Out",
            quantity: transaction.quantity,
            previousStock:
              transaction.previous_stock,
            newStock:
              transaction.new_stock,
            reason:
              transaction.reason || "",
            notes:
              transaction.notes || "",
            user: transaction.user || "Admin",
            date:
              transaction.created_at ||
              new Date().toISOString(),
          };
        });

      setTransactions(
        formattedTransactions
      );
    } catch (error) {
      console.error(
        "Failed to load transactions:",
        error
      );
    }
  };

  useEffect(() => {
    const init = async () => {
      const prods = await loadProducts();
      await loadTransactions(prods);
    };
    init();
  }, []);

  const addProduct = async (
    product: Omit<
      Product,
      "id" | "status" | "totalStockIn" | "totalStockOut" | "createdAt"
    >
  ) => {
    try {
      await createProduct({
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        unit: product.unit,
        price: product.price,
        min_stock: product.minStock,
        description: product.description || "",
      });

      const prods = await loadProducts();
      await loadTransactions(prods);

      addToast(
        `${product.name} was added successfully.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to add product:",
        error
      );

      addToast(
        "Could not add product.",
        "error"
      );
    }
  };

  const updateProductHandler = async (
    id: string,
    updates: Partial<Product>
  ) => {
    try {
      const existingProduct =
        products.find(
          (product) =>
            String(product.id) === String(id)
        );

      if (!existingProduct) {
        throw new Error(
          "Product not found"
        );
      }

      await updateProduct(
        Number(id),
        {
          name:
            updates.name ??
            existingProduct.name,

          sku:
            updates.sku ??
            existingProduct.sku,

          category:
            updates.category ??
            existingProduct.category,

          quantity:
            updates.quantity ??
            existingProduct.quantity,

          unit:
            updates.unit ??
            existingProduct.unit,

          price:
            updates.price ??
            existingProduct.price,

          min_stock:
            updates.minStock ??
            existingProduct.minStock,

          description:
            updates.description ??
            existingProduct.description ??
            "",
        }
      );

      await loadProducts();

      addToast(
        "Product updated successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to update product:",
        error
      );

      addToast(
        "Could not update product.",
        "error"
      );
    }
  };

  const deleteProductHandler = async (
    id: string
  ) => {
    try {
      await deleteProduct(Number(id));

      const prods = await loadProducts();
      await loadTransactions(prods);

      addToast(
        "Product deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      addToast(
        "Could not delete product.",
        "error"
      );
    }
  };

  const stockIn = async (
    productId: string,
    quantity: number,
    reason: string,
    notes: string
  ) => {
    try {
      await apiStockIn(
        Number(productId),
        quantity,
        reason,
        notes
      );

      const prods = await loadProducts();
      await loadTransactions(prods);

      addToast(
        `${quantity} items added successfully.`,
        "success"
      );
    } catch (error: any) {
      console.error(
        "Stock in failed:",
        error
      );

      addToast(
        error.message ||
          "Could not add stock.",
        "error"
      );
    }
  };

  const stockOut = async (
    productId: string,
    quantity: number,
    reason: string,
    notes: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      await apiStockOut(
        Number(productId),
        quantity,
        reason,
        notes
      );

      const prods = await loadProducts();
      await loadTransactions(prods);

      addToast(
        `${quantity} items removed successfully.`,
        "success"
      );

      return {
        success: true,
      };
    } catch (error: any) {
      console.error(
        "Stock out failed:",
        error
      );

      const errorMessage =
        error.message ||
        "Could not remove stock.";

      addToast(
        errorMessage,
        "error"
      );

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const markNotificationRead = (
    id: string
  ) => {
    setNotifications(
      (previous) =>
        previous.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
    );
  };

  const markAllNotificationsRead =
    () => {
      setNotifications(
        (previous) =>
          previous.map((notification) => ({
            ...notification,
            read: true,
          }))
      );
    };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const value: InventoryContextValue = {
    products,
    transactions,
    notifications,
    addProduct,
    updateProduct:
      updateProductHandler,
    deleteProduct:
      deleteProductHandler,
    stockIn,
    stockOut,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    unreadCount,
    currentUser,
  };

  return (
    <InventoryContext.Provider
      value={value}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context =
    useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventory must be used inside InventoryProvider"
    );
  }

  return context;
}