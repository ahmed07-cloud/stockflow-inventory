import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/utils/cn";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  error: "bg-rose-50 text-rose-800 border-rose-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info: "bg-indigo-50 text-indigo-800 border-indigo-200",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed left-1/2 top-4 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 space-y-3 sm:left-auto sm:right-4 sm:top-4 sm:translate-x-0">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all",
              styles[toast.type]
            )}
            role="alert"
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-md p-1 hover:bg-black/5"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
