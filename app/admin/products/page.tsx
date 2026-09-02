import { AdminShell } from "@/components/admin/admin-shell";
import { ProductManager } from "@/components/admin/product-manager";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Products"
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <AdminShell title="Products">
      <ProductManager initialProducts={products} />
    </AdminShell>
  );
}
