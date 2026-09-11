import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Modal } from "./Modal";
import { useAuth } from "@/context/AuthContext";

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={() => setLogoutOpen(true)}
      />
      <Header onMenuClick={() => setMobileOpen(true)} />
      <main className="min-h-screen pt-16 lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Logout"
        description="Are you sure you want to logout?"
        footer={
          <>
            <button
              onClick={() => setLogoutOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
            >
              Logout
            </button>
          </>
        }
      />
    </div>
  );
}
