import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ProductVariant } from '../../types';
import { 
  ArrowLeft, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';

interface StorefrontProductDetailProps {
  onOpenCart: () => void;
}

export const StorefrontProductDetail: React.FC<StorefrontProductDetailProps> = ({ onOpenCart }) => {
  const { 
    selectedStorefrontProductId, 
    products, 
    setStorefrontTab, 
    addToCart 
  } = useBakery();

  const product = products.find(p => p.id === selectedStorefrontProductId) || products[0];

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [isEggless, setIsEggless] = useState(true);
  const [selectedFlavor, setSelectedFlavor] = useState(product?.availableFlavors[0] || 'Signature');
  const [inscription, setInscription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-cocoa-500 mb-4">Product not found.</p>
        <button
          onClick={() => setStorefrontTab('catalog')}
          className="px-4 py-2 bg-cocoa-900 text-cream-50 rounded-xl text-xs font-semibold"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const selectedVariant: ProductVariant = product.variants[selectedVariantIdx] || product.variants[0] || {
    name: "Standard",
    weightKg: 1.0,
    servings: "8-10 persons",
    price: product.price
  };

  const totalPrice = selectedVariant.price * quantity;

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedVariant,
      quantity,
      isEggless,
      selectedFlavor,
      inscription
    );

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onOpenCart();
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Back button */}
      <button
        onClick={() => setStorefrontTab('catalog')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa-700 hover:text-peach-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bakery Menu</span>
      </button>

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Photos (6 cols) */}
        <div className="md:col-span-6 space-y-3">
          
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 shadow-soft">
            <img 
              src={product.images[activeImageIdx] || product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-3 left-3 bg-peach-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                ★ Chef's Special
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx ? 'border-peach-500 shadow-xs' : 'border-cream-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Chef's Promise Box */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 text-xs space-y-2 text-cocoa-700">
            <span className="font-bold text-cocoa-900 block font-serif">Chef Ananya's Promise</span>
            <p className="leading-relaxed text-[11px]">
              Every cake is baked completely from scratch on the day of delivery. We use 100% dairy butter, organic castor sugar, and zero premixes.
            </p>
          </div>
        </div>

        {/* Right Column: Customization & Add to Cart (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cocoa-400">
                {product.category}
              </span>
              <span className="text-cocoa-300">·</span>
              <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating || 4.9}</span>
                <span className="text-cocoa-400 font-normal">({product.reviewCount || 35} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-cocoa-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-cocoa-600 mt-2.5 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Size / Variant Picker */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-cocoa-800 block">
              1. Select Size & Servings:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedVariantIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedVariantIdx === idx
                      ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs'
                      : 'bg-white border-cream-200 text-cocoa-800 hover:bg-cream-50'
                  }`}
                >
                  <span className="font-bold block leading-tight">{v.name}</span>
                  <span className="text-[10px] text-cocoa-500 block mt-0.5">{v.servings}</span>
                  <span className="font-bold text-cocoa-900 text-sm block mt-1">₹{v.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary & Flavor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {product.isEgglessAvailable && (
              <div>
                <label className="font-bold text-cocoa-800 block mb-1">Dietary Preference</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEggless(true)}
                    className={`flex-1 py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                      isEggless ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-white border-cream-200 text-cocoa-600'
                    }`}
                  >
                    🌱 100% Eggless
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEggless(false)}
                    className={`flex-1 py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                      !isEggless ? 'bg-amber-50 border-amber-500 text-amber-900' : 'bg-white border-cream-200 text-cocoa-600'
                    }`}
                  >
                    🥚 With Egg
                  </button>
                </div>
              </div>
            )}

            {product.availableFlavors.length > 0 && (
              <div>
                <label className="font-bold text-cocoa-800 block mb-1">Flavor Variation</label>
                <select
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                >
                  {product.availableFlavors.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Inscription Message Input */}
          <div className="space-y-1 text-xs">
            <label className="font-bold text-cocoa-800 block">
              Cake Board Inscription / Message (Optional)
            </label>
            <input
              type="text"
              value={inscription}
              onChange={(e) => setInscription(e.target.value)}
              placeholder="e.g. 'Happy 30th Birthday Siddharth!'"
              maxLength={40}
              className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
            />
            <span className="text-[10px] text-cocoa-400 block text-right">{inscription.length}/40 characters</span>
          </div>

          {/* Quantity & Add to Cart Action Strip */}
          <div className="pt-4 border-t border-cream-100 flex items-center justify-between gap-4">
            
            {/* Quantity Counter */}
            <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 hover:bg-white text-cocoa-700 rounded-lg transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 font-bold text-sm text-cocoa-900 font-mono">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 hover:bg-white text-cocoa-700 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main CTA */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
                addedSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-cocoa-900 hover:bg-cocoa-800 text-cream-50'
              }`}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-peach-300" />
                  <span>Add to Cart · ₹{totalPrice}</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
