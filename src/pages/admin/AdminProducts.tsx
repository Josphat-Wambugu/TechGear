import { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { useStoreData } from '@/hooks/useStoreData';
import { formatCurrency } from '@/utils/formatCurrency';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import ProductFormModal from '@/components/admin/ProductFormModal';

export default function AdminProducts() {
  const { products, addProduct, removeProduct } = useStoreData();
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{products.length} products in catalog</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowForm(true)}>
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Package size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No products yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add your first product to get started.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2fr_0.9fr_0.7fr_0.7fr_0.6fr_auto] gap-3 px-5 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_0.9fr_0.7fr_0.7fr_0.6fr_auto] gap-3 px-5 py-3 text-sm items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{p.brand}</p>
                  </div>
                </div>
                <span className="hidden sm:block text-slate-600 dark:text-slate-400">{p.category}</span>
                <span className="hidden sm:block font-medium text-slate-900 dark:text-white">
                  {formatCurrency(p.price)}
                </span>
                <span className="hidden sm:block text-slate-600 dark:text-slate-400">{p.stockCount}</span>
                <span className="hidden sm:block">
                  <Badge variant={p.inStock ? 'emerald' : 'slate'}>{p.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
                </span>
                <button
                  onClick={() => removeProduct(p.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors justify-self-end"
                  aria-label={`Remove ${p.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProductFormModal isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={addProduct} />
    </div>
  );
}
