"use client";

import type { Address } from "@prisma/client";
import { Home, MapPin, Star, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const emptyForm = { fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startEdit(address: Address) {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(editingId ? `/api/addresses/${editingId}` : "/api/addresses", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to save address.");
      }

      const saved: Address = data.address;
      setAddresses((items) => {
        const withoutSaved = items.filter((item) => item.id !== saved.id);
        const next = saved.isDefault ? withoutSaved.map((item) => ({ ...item, isDefault: false })) : withoutSaved;
        return [saved, ...next];
      });
      resetForm();
      toast.success(editingId ? "Address updated" : "Address added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save address.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteAddress(id: string) {
    const previous = addresses;
    setAddresses((items) => items.filter((item) => item.id !== id));

    try {
      const response = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete address.");
      toast.success("Address removed");
    } catch (error) {
      setAddresses(previous);
      toast.error(error instanceof Error ? error.message : "Unable to delete address.");
    }
  }

  async function makeDefault(id: string) {
    const previous = addresses;
    setAddresses((items) => items.map((item) => ({ ...item, isDefault: item.id === id })));

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true })
      });
      if (!response.ok) throw new Error("Unable to update default address.");
    } catch (error) {
      setAddresses(previous);
      toast.error(error instanceof Error ? error.message : "Unable to update default address.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-xl font-black tracking-normal">
          <MapPin className="h-5 w-5 text-amazon-orange" />
          Saved addresses
        </h2>

        {addresses.length === 0 ? (
          <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">No saved addresses yet. Add one to speed up checkout.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <article key={address.id} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                <div className="flex items-start justify-between">
                  <Home className="h-5 w-5 text-amazon-teal" />
                  {address.isDefault && (
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amazon-orange dark:bg-white/10">
                      Default
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-black">{address.fullName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-1 text-xs text-slate-500">{address.phone}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <button type="button" onClick={() => startEdit(address)} className="font-bold text-amazon-teal">
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button type="button" onClick={() => makeDefault(address.id)} className="inline-flex items-center gap-1 font-bold text-amazon-teal">
                      <Star className="h-3.5 w-3.5" />
                      Set default
                    </button>
                  )}
                  <button type="button" onClick={() => deleteAddress(address.id)} className="inline-flex items-center gap-1 font-bold text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-xl font-black tracking-normal">{editingId ? "Edit address" : "Add address"}</h2>
        <div className="mt-4 space-y-3">
          {(
            [
              ["fullName", "Full name"],
              ["phone", "Mobile number"],
              ["line1", "Address line 1"],
              ["line2", "Address line 2 (optional)"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"]
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
              <input
                required={key !== "line2"}
                value={form[key]}
                onChange={(event) => setForm((f) => ({ ...f, [key]: event.target.value }))}
                className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? "Saving…" : editingId ? "Update address" : "Save address"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
