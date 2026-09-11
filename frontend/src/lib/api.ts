export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products/`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function createProduct(product: any) {
  const response = await fetch(`${API_URL}/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
}

export async function updateProduct(id: number, product: any) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
}

export async function stockIn(
  productId: number,
  quantity: number,
  reason: string,
  notes: string
) {
  const response = await fetch(`${API_URL}/inventory/stock-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      quantity,
      reason,
      notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Stock in failed");
  }

  return response.json();
}

export async function stockOut(
  productId: number,
  quantity: number,
  reason: string,
  notes: string
) {
  const response = await fetch(`${API_URL}/inventory/stock-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      quantity,
      reason,
      notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Stock out failed");
  }

  return response.json();
}

export async function getTransactions() {
  const response = await fetch(`${API_URL}/transactions/`);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/dashboard/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }

  return response.json();
}

export async function getRecentTransactions() {
  const response = await fetch(
    `${API_URL}/dashboard/recent-transactions`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recent transactions");
  }

  return response.json();
}