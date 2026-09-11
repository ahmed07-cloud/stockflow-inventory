import { useState } from "react";
import { User, Mail, Phone, ShieldCheck, Pencil } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getInitials } from "@/lib/inventory";

export function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
    setOpen(false);
    addToast("Profile updated successfully.", "success");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Profile" subtitle="Your account information." />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-slate-900">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.role}</p>
            <button
              onClick={() => {
                setForm({
                  name: user?.name || "",
                  email: user?.email || "",
                  phone: user?.phone || "",
                });
                setOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <ProfileItem icon={User} label="Full Name" value={user?.name || "—"} />
          <ProfileItem icon={Mail} label="Email" value={user?.email || "—"} />
          <ProfileItem icon={Phone} label="Phone" value={user?.phone || "—"} />
          <ProfileItem icon={ShieldCheck} label="Role" value={user?.role || "—"} />
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Profile"
        description="Update your account details."
        footer={
          <>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-profile-form"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
