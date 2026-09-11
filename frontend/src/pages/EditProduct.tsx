import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";
import { useInventory } from "@/context/InventoryContext";
import { EmptyState } from "@/components/EmptyState";

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct } = useInventory();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl">
        <EmptyState title="Product not found" description="The product you are trying to edit does not exist.">
          <button
            onClick={() => navigate("/products")}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to Products
          </button>
        </EmptyState>
      </div>
    );
  }

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
    await updateProduct(product.id, data);
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Edit Product" subtitle={`Update details for ${product.name}.`} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <ProductForm
          initial={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/products/${product.id}`)}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
