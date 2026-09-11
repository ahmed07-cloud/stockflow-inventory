import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Modal } from "@/components/Modal";
import { API_URL } from "@/lib/api";

export function Login() {
  const [email, setEmail] = useState("admin@stockflow.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const remembered = localStorage.getItem(
      "sf_remembered_email"
    );

    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login?email=${encodeURIComponent(
          email.trim()
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            "Invalid email or password."
        );
        setLoading(false);
        return;
      }

      const result = login(
        email.trim(),
        password
      );

      if (result.success) {
        if (remember) {
          localStorage.setItem(
            "sf_remembered_email",
            email.trim()
          );
        } else {
          localStorage.removeItem(
            "sf_remembered_email"
          );
        }

        localStorage.setItem(
          "sf_user",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");
      } else {
        setError(
          result.error ||
            "Login failed."
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Package2 className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              StockFlow
            </h1>

            <p className="text-xs text-slate-500">
              Inventory Tracking System
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-slate-900">
          Welcome Back
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Sign in to manage your inventory efficiently.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(
                    e.target.checked
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />

              Remember me
            </label>

            <button
              type="button"
              onClick={() =>
                setForgotOpen(true)
              }
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Forgot password?
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Demo Account
          </p>

          <p className="mt-1 text-sm text-slate-700">
            Email: admin@stockflow.com
          </p>

          <p className="text-sm text-slate-700">
            Password: admin123
          </p>
        </div>

      </div>

      <Modal
        open={forgotOpen}
        onClose={() =>
          setForgotOpen(false)
        }
        title="Reset Password"
        description="Password recovery instructions"
        footer={
          <button
            onClick={() =>
              setForgotOpen(false)
            }
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Got it
          </button>
        }
      >
        <div className="space-y-3 text-sm text-slate-600">

          <p>
            In this local inventory system,
            your credentials are verified
            through the backend database.
          </p>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="font-semibold text-slate-900">
              Default Demo Credentials:
            </p>

            <p className="mt-1 font-mono text-xs">
              Email: admin@stockflow.com
            </p>

            <p className="font-mono text-xs">
              Password: admin123
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Contact the administrator if
            you need to reset your password.
          </p>

        </div>
      </Modal>
    </div>
  );
}