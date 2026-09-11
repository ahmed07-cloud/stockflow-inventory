import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { ToastProvider } from "@/context/ToastContext";
import { Layout } from "@/components/Layout";
import { ToastContainer } from "@/components/ToastContainer";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Products } from "@/pages/Products";
import { AddProduct } from "@/pages/AddProduct";
import { EditProduct } from "@/pages/EditProduct";
import { ProductDetails } from "@/pages/ProductDetails";
import { StockIn } from "@/pages/StockIn";
import { StockOut } from "@/pages/StockOut";
import { Transactions } from "@/pages/Transactions";
import { LowStock } from "@/pages/LowStock";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";

function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
          <Route path="/stock-in" element={<StockIn />} />
          <Route path="/stock-out" element={<StockOut />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/low-stock" element={<LowStock />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <InventoryProvider>
            <AppRoutes />
          </InventoryProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}
