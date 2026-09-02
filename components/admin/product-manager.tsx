"use client";

import { Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(
    () => ({
      inventory: products.reduce((sum, product) => sum + product.stock, 0),
      averageDiscount: Math.round(products.reduce((sum, product) => sum + product.discount, 0) / products.length)
    }),
    [products]
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title"));
    const payload = {
      title,
      slug: String(formData.get("slug")) || slugify(title),
      brand: String(formData.get("brand")),
      category: String(formData.get("category")),
      description: String(formData.get("description")),
      images: [String(formData.get("image"))],
      price: Number(formData.get("price")),
      mrp: Number(formData.get("mrp")),
      discount: Number(formData.get("discount")),
      stock: Number(formData.get("stock")),
      rating: editing?.rating ?? 4.2,
      reviewCount: editing?.reviewCount ?? 0,
      tags: String(formData.get("tags"))
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isPrime: true,
      isFeatured: formData.get("isFeatured") === "on"
    };

    try {
      const response = await fetch(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to save product.");
      }

      const saved: Product = data.product;
      setProducts((items) => (editing ? items.map((item) => (item.id === editing.id ? saved : item)) : [saved, ...items]));
      setEditing(null);
      form.reset();
      toast.success(editing ? "Product updated" : "Product added", {
        description: "Saved to the database — visible on the storefront immediately."
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(product: Product) {
    const previous = products;
    setProducts((items) => items.filter((item) => item.id !== product.id));

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete product.");
      toast.success("Product removed", { description: "Removed from the database." });
    } catch (error) {
      setProducts(previous);
      toast.error(error instanceof Error ? error.message : "Unable to delete product.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Products", products.length],
          ["Inventory", stats.inventory],
          ["Avg discount", `${stats.averageDiscount}%`]
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-black uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black tracking-normal text-slate-950 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <form key={editing?.id ?? "new-product"} onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-normal text-slate-950 dark:text-white">{editing ? "Edit product" : "Add product"}</h2>
          {editing && (
            <button type="button" onClick={() => setEditing(null)} className="text-sm font-bold text-amazon-teal">
              Cancel edit
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="title" defaultValue={editing?.title} required placeholder="Title" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="slug" defaultValue={editing?.slug} placeholder="Slug" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="brand" defaultValue={editing?.brand} required placeholder="Brand" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <select name="category" defaultValue={editing?.category ?? categories[0]} className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10">
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input name="price" type="number" defaultValue={editing?.price} required placeholder="Price" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="mrp" type="number" defaultValue={editing?.mrp} required placeholder="MRP" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="discount" type="number" defaultValue={editing?.discount ?? 10} required placeholder="Discount %" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="stock" type="number" defaultValue={editing?.stock ?? 20} required placeholder="Stock" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="image" type="url" defaultValue={editing?.images[0]} required placeholder="Image URL" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10 md:col-span-2" />
          <input name="tags" defaultValue={editing?.tags.join(", ")} placeholder="Tags, comma separated" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10 md:col-span-2" />
          <textarea name="description" defaultValue={editing?.description} required placeholder="Description" className="min-h-24 rounded-md border border-slate-200 bg-transparent p-3 outline-none focus:border-amazon-orange dark:border-white/10 md:col-span-2" />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input name="isFeatured" type="checkbox" defaultChecked={editing?.isFeatured} className="h-4 w-4 accent-amazon-orange" />
          Feature on homepage
        </label>
        <Button type="submit" className="mt-5" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {editing ? "Update product" : "Add product"}
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-white/10">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 font-bold text-slate-950 dark:text-white">{product.title}</td>
                  <td className="px-4 py-4">{product.category}</td>
                  <td className="px-4 py-4">{formatPrice(product.price)}</td>
                  <td className="px-4 py-4">{product.stock}</td>
                  <td className="px-4 py-4">{product.isFeatured ? <Badge tone="success">Featured</Badge> : <Badge>Live</Badge>}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditing(product)} className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Edit product">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => deleteProduct(product)} className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label="Delete product">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
