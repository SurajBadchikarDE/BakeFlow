import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Product } from '../../types';
import { 
  Search, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  SlidersHorizontal,
  Check
} from 'lucide-react';

export const StorefrontCatalog: React.FC = () => {
  const { products, navigateToStorefrontProduct } = useBakery();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [priceSort, setPriceSort] = useState<'default' | 'low_to_high' | 'high_to_low'>('default');

  const categories = [
    { id: 'all', label: 'All Delicacies' },
    { id: 'cakes', label: 'Artisan Cakes' },
    { id: 'cupcakes', label: 'Cupcake Bouquets' },
    { id: 'brownies', label: 'Fudgy Brownies' },
    { id: 'cheesecakes', label: 'NY Cheesecakes' },
    { id: 'dessert_boxes', label: 'Gift Boxes' },
  ];

  let filtered = products.filter(p => {
    if (!p.isAvailable) return false;
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (egglessOnly && !p.isEgglessAvailable) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  if (priceSort === 'low_to_high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high_to_low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title & Category Bar */}
      <div className="space-y-4 text-center">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cocoa-900">
          Our Handcrafted Menu & Fresh Bakes
        </h2>
        <p className="text-xs sm:text-sm text-cocoa-500 max-w-lg mx-auto">
          Baked fresh in small batches daily. Select your favorite delicacy to choose sizes, flavors, and customize your special message.
        </p>

        {/* Filter Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-cocoa-900 text-cream-50 shadow-soft'
                  : 'bg-white text-cocoa-700 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cakes, flavors, brownies..."
            className="w-full pl-8 pr-3 py-1.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
          />
        </div>

        {/* Eggless toggle & sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <label className="flex items-center gap-2 text-cocoa-800 font-semibold cursor-pointer bg-cream-50 px-3 py-1.5 rounded-xl border border-cream-200">
            <input
              type="checkbox"
              checked={egglessOnly}
              onChange={(e) => setEgglessOnly(e.target.checked)}
              className="rounded text-peach-500 w-3.5 h-3.5"
            />
            <span>🌱 100% Eggless Only</span>
          </label>

          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value as any)}
            className="px-3 py-1.5 bg-cream-50 border border-cream-200 rounded-xl text-cocoa-800 font-medium text-xs focus:outline-none"
          >
            <option value="default">Featured First</option>
            <option value="low_to_high">Price: Low to High</option>
            <option value="high_to_low">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(product => (
          <div 
            key={product.id}
            onClick={() => navigateToStorefrontProduct(product.id)}
            className="bg-white rounded-3xl border border-cream-200 shadow-soft hover:shadow-card hover:border-peach-300 overflow-hidden transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative h-52 overflow-hidden bg-cream-100">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.isFeatured && (
                  <span className="bg-peach-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    ★ Bestseller
                  </span>
                )}
                {product.isEgglessAvailable && (
                  <span className="bg-white/95 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    🌱 Eggless
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-cocoa-900 shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-current" />
                <span>{product.rating || 4.9}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cocoa-400 block mb-0.5">
                  {product.category}
                </span>
                <h3 className="font-serif font-bold text-base text-cocoa-900 group-hover:text-peach-700 transition-colors leading-snug line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-cocoa-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Bottom Price & Button */}
              <div className="pt-3 border-t border-cream-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cocoa-400 block">Starting from</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif font-bold text-base text-cocoa-900">₹{product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-cocoa-400 line-through">₹{product.compareAtPrice}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToStorefrontProduct(product.id);
                  }}
                  className="px-3 py-1.5 bg-cocoa-900 group-hover:bg-peach-500 text-cream-50 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
