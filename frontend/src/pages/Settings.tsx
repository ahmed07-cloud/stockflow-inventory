import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Bell, Lock, LogOut } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/utils/cn";

export function Settings() {
  const { logout, changePassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [appName, setAppName] = useState("StockFlow");
  const [currency, setCurrency] = useState("INR");
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [outOfStockAlerts, setOutOfStockAlerts] = useState(true);
  const [defaultMinStock, setDefaultMinStock] = useState("10");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sf_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppName(parsed.appName ?? "StockFlow");
        setCurrency(parsed.currency ?? "INR");
        setLowStockAlerts(parsed.lowStockAlerts ?? true);
        setOutOfStockAlerts(parsed.outOfStockAlerts ?? true);
        setDefaultMinStock(parsed.defaultMinStock ?? "10");
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sf_settings",
      JSON.stringify({ appName, currency, lowStockAlerts, outOfStockAlerts, defaultMinStock })
    );
    // Dispatch a storage event so same-window components can respond to settings change
    window.dispatchEvent(new Event("storage"));
  }, [appName, currency, lowStockAlerts, outOfStockAlerts, defaultMinStock]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!passwordForm.current) return setPasswordError("Current password is required.");
    if (passwordForm.new.length < 6) return setPasswordError("New password must be at least 6 characters.");
    if (passwordForm.new !== passwordForm.confirm) return setPasswordError("New passwords do not match.");

    const result = changePassword(passwordForm.current, passwordForm.new);
    if (!result.success) {
      return setPasswordError(result.error || "Current password is incorrect.");
    }

    setPasswordOpen(false);
    setPasswordForm({ current: "", new: "", confirm: "" });
    addToast("Password changed successfully.", "success");
  };

  const handleLogout = () => {
    logout();
    setLogoutOpen(false);
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" subtitle="Manage application preferences." />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Section icon={Building2} title="General">
          <SettingField label="Application Name">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </SettingField>
          <SettingField label="Currency">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </SettingField>
        </Section>

        <Section icon={Bell} title="Inventory" className="mt-8">
          <Toggle
            label="Low Stock Alerts"
            description="Notify when products reach their minimum stock level."
            checked={lowStockAlerts}
            onChange={setLowStockAlerts}
          />
          <Toggle
            label="Out-of-Stock Alerts"
            description="Notify when products run out of stock."
            checked={outOfStockAlerts}
            onChange={setOutOfStockAlerts}
          />
          <SettingField label="Default Minimum Stock">
            <input
              type="number"
              min="0"
              value={defaultMinStock}
              onChange={(e) => setDefaultMinStock(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </SettingField>
        </Section>

        <Section icon={Lock} title="Account" className="mt-8">
          <button
            onClick={() => setPasswordOpen(true)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Change Password
          </button>
          <button
            onClick={() => setLogoutOpen(true)}
            className="ml-3 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <LogOut className="mr-2 inline h-4 w-4" />
            Logout
          </button>
        </Section>
      </div>

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

      <Modal
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          setPasswordError("");
          setPasswordForm({ current: "", new: "", confirm: "" });
        }}
        title="Change Password"
        description="Update your account password."
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setPasswordOpen(false);
                setPasswordError("");
                setPasswordForm({ current: "", new: "", confirm: "" });
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="change-password-form"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Change Password
            </button>
          </>
        }
      >
        <form id="change-password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              required
              value={passwordForm.new}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, new: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </div>
          {passwordError && <p className="text-sm text-rose-600">{passwordError}</p>}
        </form>
      </Modal>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition",
          checked ? "bg-indigo-600" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}
