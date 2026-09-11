import { PackageOpen } from "lucide-react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm",
        className
      )}
    >
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {icon ?? <PackageOpen className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
