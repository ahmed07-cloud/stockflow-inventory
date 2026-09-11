import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";
import { useInventory } from "@/context/InventoryContext";

export function AddProduct() {
  const { addProduct } = useInventory();
  const navigate = useNavigate();

  const handleSubmit = async (data: {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    unit: string;
    price: number;
    minStock: number;
    description: string;
  }) => {
    await addProduct(data);
    navigate("/products");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Add Product" subtitle="Add a new item to your inventory." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm onSubmit={handleSubmit} onCancel={() => navigate("/products")} submitLabel="Add Product" />
      </div>
    </div>
  );
}
