import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Product, ProductVariant } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

export const AddProductModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addProduct } = useBakery();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'cakes' | 'cupcakes' | 'brownies' | 'cheesecakes' | 'cookies' | 'dessert_boxes' | 'seasonal'>('cakes');
  const [price, setPrice] = useState(850);
  const [compareAtPrice, setCompareAtPrice] = useState(950);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80');
  const [isEgglessAvailable, setIsEgglessAvailable] = useState(true);
  const [estimatedCost, setEstimatedCost] = useState(320);
  const [prepTimeHours, setPrepTimeHours] = useState(3);

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([
    { name: "0.5 kg (Small)", weightKg: 0.5, servings: "3-4 persons", price: 550 },
    { name: "1.0 kg (Standard)", weightKg: 1.0, servings: "8-10 persons", price: 850 }
  ]);

  if (!isOpen) return null;

  const handleAddVariant = () => {
    setVariants([...variants, { name: "1.5 kg", weightKg: 1.5, servings: "12-15 persons", price: price + 400 }]);
  };

  const handleRemoveVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    addProduct({
      name,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      description,
      images: [imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80'],
      variants: variants.length > 0 ? variants : [{ name: "Standard", weightKg: 1.0, servings: "8 persons", price: Number(price) }],
      availableFlavors: ["Signature Classic", "Double Chocolate", "Vanilla Bean"],
      availableFillings: ["Chocolate Ganache", "Salted Caramel"],
      availableFrostings: ["Whipped Ganache", "Buttercream"],
      isEgglessAvailable,
      preparationTimeHours: Number(prepTimeHours),
      minAdvanceNoticeDays: 1,
      maxDailyQty: 8,
      isAvailable: true,
      isFeatured: false,
      estimatedIngredientCost: Number(estimatedCost),
      rating: 5.0,
      reviewCount: 1
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-cream-200 max-w-lg w-full p-6 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-cream-100">
          <h3 className="font-serif font-bold text-base text-cocoa-900">Add New Dessert to Menu</h3>
          <button onClick={onClose} className="text-cocoa-400 hover:text-cocoa-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          
          <div>
            <label className="font-bold text-cocoa-700 block mb-1">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alphonso Mango Bento Cake"
              required
              className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
              >
                <option value="cakes">Cakes</option>
                <option value="cupcakes">Cupcakes</option>
                <option value="brownies">Brownies</option>
                <option value="cheesecakes">Cheesecakes</option>
                <option value="dessert_boxes">Dessert / Gift Boxes</option>
                <option value="seasonal">Seasonal Specials</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Base Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Est. Ingredient Cost (₹)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
              />
            </div>
            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Kitchen Prep Time (Hours)</label>
              <input
                type="number"
                value={prepTimeHours}
                onChange={(e) => setPrepTimeHours(Number(e.target.value))}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-cocoa-700 block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Flavors, texture, ingredients, celebration recommendation..."
              rows={2}
              className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
            />
          </div>

          <div>
            <label className="font-bold text-cocoa-700 block mb-1">High-Res Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
            />
          </div>

          {/* Variants section */}
          <div className="bg-cream-50 p-3 rounded-xl border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cocoa-800">Sizes & Weight Variants</span>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-[10px] text-peach-600 font-bold hover:text-peach-700"
              >
                + Add Size
              </button>
            </div>
            <div className="space-y-1.5">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i].name = e.target.value;
                      setVariants(updated);
                    }}
                    placeholder="Size name"
                    className="flex-1 p-1.5 bg-white border border-cream-300 rounded text-xs"
                  />
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i].price = Number(e.target.value);
                      setVariants(updated);
                    }}
                    placeholder="Price"
                    className="w-20 p-1.5 bg-white border border-cream-300 rounded text-xs font-bold"
                  />
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(i)}
                      className="text-red-500 p-1 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-1.5 text-cocoa-800 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isEgglessAvailable}
                onChange={(e) => setIsEgglessAvailable(e.target.checked)}
                className="rounded text-peach-500"
              />
              <span>100% Eggless Option Available</span>
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-cream-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl font-bold shadow-xs"
            >
              Create Product
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
