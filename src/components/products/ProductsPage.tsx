import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Product, ProductVariant } from '../../types';
import { 
  Cake, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Tag,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export const ProductsPage: React.FC<{ onOpenAddProduct: () => void }> = ({ onOpenAddProduct }) => {
  const { 
    products, 
    updateProduct, 
    deleteProduct, 
    toggleProductAvailability,
    navigateToStorefrontProduct 
  } = useBakery();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', label: 'All Pastries' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'cupcakes', label: 'Cupcakes' },
    { id: 'brownies', label: 'Brownies' },
    { id: 'cheesecakes', label: 'Cheesecakes' },
    { id: 'dessert_boxes', label: 'Gift Boxes' },
  ];

  const filteredProducts = products.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Actions Bar */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-cocoa-900 text-cream-50 shadow-xs'
                  : 'text-cocoa-600 hover:bg-cream-100 hover:text-cocoa-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="pl-8 pr-3 py-1.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            />
          </div>

          <button
            onClick={onOpenAddProduct}
            className="px-3.5 py-1.5 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map(product => {
          const profitMargin = product.price > 0 && product.estimatedIngredientCost > 0
            ? Math.round(((product.price - product.estimatedIngredientCost) / product.price) * 100)
            : 60;

          return (
            <div 
              key={product.id}
              className={`bg-white rounded-2xl border ${product.isAvailable ? 'border-cream-200' : 'border-cream-200 opacity-60'} overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col group`}
            >
              {/* Product Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-cream-100">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="bg-cocoa-900/80 backdrop-blur-xs text-cream-100 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                    {product.category}
                  </span>
                  {product.isEgglessAvailable && (
                    <span className="bg-emerald-800/80 backdrop-blur-xs text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      🌱 Eggless Avail.
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => toggleProductAvailability(product.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md transition-colors ${
                      product.isAvailable 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-cocoa-700 text-white'
                    }`}
                    title="Toggle active availability on storefront"
                  >
                    {product.isAvailable ? 'In Stock' : 'Hidden'}
                  </button>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif font-bold text-sm text-cocoa-900 group-hover:text-peach-700 transition-colors leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-xs text-cocoa-500 line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Variants pill list */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {product.variants.slice(0, 3).map((v, i) => (
                      <span key={i} className="text-[10px] bg-cream-100 text-cocoa-700 px-2 py-0.5 rounded-md font-medium">
                        {v.name}: ₹{v.price}
                      </span>
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-[10px] text-cocoa-400">+{product.variants.length - 3} more</span>
                    )}
                  </div>
                </div>

                {/* Economics bar */}
                <div className="pt-3 border-t border-cream-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-cocoa-400 text-[10px] block">Retail Price</span>
                      <span className="font-bold text-cocoa-900 text-sm">₹{product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-[10px] text-cocoa-400 line-through ml-1">₹{product.compareAtPrice}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-cocoa-400 text-[10px] block">Est. Cost / Margin</span>
                      <span className="font-semibold text-cocoa-800">₹{product.estimatedIngredientCost}</span>
                      <span className="text-[10px] text-emerald-600 font-bold ml-1">({profitMargin}%)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 gap-1">
                    <button
                      onClick={() => navigateToStorefrontProduct(product.id)}
                      className="text-[11px] text-cocoa-600 hover:text-peach-600 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Storefront View</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-1.5 hover:bg-cream-100 text-cocoa-600 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${product.name}" from catalog?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-lg w-full p-6 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-serif font-bold text-base text-cocoa-900">
                Edit Product: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-cocoa-400 hover:text-cocoa-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Est. Ingredient Cost (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.estimatedIngredientCost}
                    onChange={(e) => setEditingProduct({ ...editingProduct, estimatedIngredientCost: Number(e.target.value) })}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans text-xs"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-cocoa-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isEgglessAvailable}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isEgglessAvailable: e.target.checked })}
                    className="rounded text-peach-500"
                  />
                  <span>Eggless Option Available</span>
                </label>

                <label className="flex items-center gap-1.5 text-cocoa-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="rounded text-peach-500"
                  />
                  <span>Publish In Stock</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
