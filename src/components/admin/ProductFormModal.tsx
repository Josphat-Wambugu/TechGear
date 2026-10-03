import { useRef, useState, type FormEvent } from 'react';
import { Plus, Trash2, Upload, ImageOff } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import type { ProductCategory } from '@/types/product';
import type { NewProductInput } from '@/context/StoreDataContext';

const categories: ProductCategory[] = ['Laptops', 'Audio', 'Wearables', 'Monitors', 'Cameras', 'Accessories'];

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: NewProductInput) => void;
}

interface SpecRow {
  key: string;
  value: string;
}

const emptySpecRow: SpecRow = { key: '', value: '' };

export default function ProductFormModal({ isOpen, onClose, onSubmit }: ProductFormModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Accessories');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stockCount, setStockCount] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [extraImageUrls, setExtraImageUrls] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [specs, setSpecs] = useState<SpecRow[]>([{ ...emptySpecRow }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setName('');
    setBrand('');
    setCategory('Accessories');
    setPrice('');
    setOriginalPrice('');
    setStockCount('');
    setDescription('');
    setTags('');
    setImageUrl('');
    setImageDataUrl('');
    setExtraImageUrls('');
    setIsFeatured(false);
    setIsNew(true);
    setSpecs([{ ...emptySpecRow }]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateSpecRow = (idx: number, field: keyof SpecRow, value: string) => {
    setSpecs((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const addSpecRow = () => setSpecs((prev) => [...prev, { ...emptySpecRow }]);
  const removeSpecRow = (idx: number) => setSpecs((prev) => prev.filter((_, i) => i !== idx));

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (!brand.trim()) errs.brand = 'Brand is required';
    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) errs.price = 'Enter a valid price';
    const stockNum = Number(stockCount);
    if (stockCount === '' || isNaN(stockNum) || stockNum < 0) errs.stockCount = 'Enter a valid stock count';
    if (!imageDataUrl && !imageUrl.trim()) errs.image = 'Add an image URL or upload a photo';
    if (!description.trim()) errs.description = 'A short description helps customers decide';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const images = [imageDataUrl || imageUrl.trim()].concat(
      extraImageUrls
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean)
    );

    const specRecord: Record<string, string> = {};
    for (const row of specs) {
      if (row.key.trim() && row.value.trim()) specRecord[row.key.trim()] = row.value.trim();
    }

    const priceNum = Number(price);
    const originalPriceNum = originalPrice ? Number(originalPrice) : undefined;
    const stockNum = Number(stockCount);

    const input: NewProductInput = {
      name: name.trim(),
      brand: brand.trim(),
      category,
      price: priceNum,
      originalPrice: originalPriceNum && originalPriceNum > priceNum ? originalPriceNum : undefined,
      images,
      description: description.trim(),
      specs: specRecord,
      inStock: stockNum > 0,
      stockCount: stockNum,
      isFeatured,
      isNew,
      tags: tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };

    onSubmit(input);
    resetForm();
    onClose();
  };

  const previewImage = imageDataUrl || imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Product" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1 -mr-1">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Product Name" placeholder="AuraBuds Pro Wireless Earbuds" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
          <Input label="Brand" placeholder="Aura" value={brand} error={errors.brand} onChange={(e) => setBrand(e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Price (USD)"
            type="number"
            step="0.01"
            min="0"
            placeholder="179.99"
            value={price}
            error={errors.price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label="Original Price (optional)"
            type="number"
            step="0.01"
            min="0"
            placeholder="219.99"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>

        <Input
          label="Stock Count"
          type="number"
          min="0"
          placeholder="48"
          value={stockCount}
          error={errors.stockCount}
          onChange={(e) => setStockCount(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Active noise-cancelling wireless earbuds with adaptive sound..."
            className={`w-full bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200 resize-none ${
              errors.description ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''
            }`}
          />
          {errors.description && <p className="mt-1.5 text-xs text-rose-600">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Product Image</label>
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageOff size={20} className="text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="product-image-upload"
              />
              <label
                htmlFor="product-image-upload"
                className="inline-flex items-center gap-2 text-sm font-medium bg-slate-100/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
              >
                <Upload size={14} /> Upload a photo
              </label>
              <p className="text-xs text-slate-400 dark:text-slate-500">or paste an image URL</p>
              <Input
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) setImageDataUrl('');
                }}
              />
            </div>
          </div>
          {errors.image && <p className="mt-1.5 text-xs text-rose-600">{errors.image}</p>}
        </div>

        <Input
          label="Additional Image URLs (optional, comma-separated)"
          placeholder="https://..., https://..."
          value={extraImageUrls}
          onChange={(e) => setExtraImageUrls(e.target.value)}
        />

        <Input
          label="Tags (comma-separated)"
          placeholder="earbuds, wireless, anc"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Specifications</label>
            <button
              type="button"
              onClick={addSpecRow}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <Plus size={12} /> Add row
            </button>
          </div>
          <div className="space-y-2">
            {specs.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  placeholder="Battery Life"
                  value={row.key}
                  onChange={(e) => updateSpecRow(idx, 'key', e.target.value)}
                  className="flex-1 min-w-0 bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <input
                  placeholder="30 hours"
                  value={row.value}
                  onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                  className="flex-1 min-w-0 bg-slate-100/70 dark:bg-slate-800 border border-transparent rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors flex-shrink-0"
                  aria-label="Remove spec"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Mark as New
          </label>
        </div>

        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-slate-900 -mb-1 pb-1">
          <Button type="button" variant="outline" size="lg" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Add Product
          </Button>
        </div>
      </form>
    </Modal>
  );
}
