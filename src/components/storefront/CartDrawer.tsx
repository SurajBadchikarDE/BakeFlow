import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Sparkles,
  Check
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, removeFromCart, updateCartQty, cartTotal, settings } = useBakery();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isOpen) return null;

  const discountAmount = couponApplied ? Math.round(cartTotal * 0.1) : 0;
  const taxAmount = Math.round((cartTotal - discountAmount) * (settings.taxRatePercent / 100));
  const finalTotal = Math.max(0, cartTotal - discountAmount + taxAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'FIRSTBAKE10') {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon. Try 'FIRSTBAKE10' for 10% off your first order!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-cocoa-950/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-elevated flex flex-col justify-between animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-peach-600" />
              <h2 className="font-serif font-bold text-base text-cocoa-900">Your Confection Cart</h2>
              <span className="text-xs bg-cream-100 text-cocoa-700 font-bold px-2 py-0.5 rounded-full font-mono">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-cream-100 rounded-lg text-cocoa-400 hover:text-cocoa-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-xs text-cocoa-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-cream-100 mx-auto flex items-center justify-center text-2xl">
                  🎂
                </div>
                <p className="font-medium text-cocoa-600 text-sm">Your cart is currently empty.</p>
                <p className="text-[11px] text-cocoa-400 max-w-xs mx-auto">
                  Browse our artisanal cakes, fudgy brownies, and gourmet cupcakes to add your favorites!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-cocoa-900 text-cream-50 rounded-xl font-bold"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-cream-200 bg-cream-50/40 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-cream-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-cocoa-900 leading-snug">{item.product.name}</h4>
                      <p className="text-[11px] text-cocoa-500 mt-0.5">
                        {item.variant.name} {item.isEggless && '· 🌱 Eggless'}
                      </p>
                      {item.specialInstructions && (
                        <p className="text-[10px] text-peach-700 italic mt-0.5">
                          Plaque: "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-cream-300 rounded-lg bg-white p-0.5">
                          <button
                            onClick={() => updateCartQty(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-cream-100 text-cocoa-700 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-xs text-cocoa-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-cream-100 text-cocoa-700 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between h-full space-y-2">
                    <span className="font-bold text-cocoa-900 text-sm">
                      ₹{item.variant.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 self-end p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50/70 space-y-3 text-xs">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon Code ('FIRSTBAKE10')"
                  disabled={couponApplied}
                  className="flex-1 p-2 bg-white border border-cream-300 rounded-xl text-cocoa-900 uppercase font-mono font-bold text-xs"
                />
                <button
                  type="submit"
                  disabled={couponApplied}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    couponApplied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-cocoa-900 text-cream-50 hover:bg-cocoa-800'
                  }`}
                >
                  {couponApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-cocoa-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (10% Off)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-cocoa-600">
                  <span>Tax ({settings.taxRatePercent}%)</span>
                  <span>₹{taxAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-cocoa-900 pt-1.5 border-t border-cream-200">
                  <span>Estimated Total</span>
                  <span className="font-serif font-bold text-lg text-peach-600">₹{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-peach-500 to-roseGold-500 hover:from-peach-600 hover:to-roseGold-600 text-white rounded-xl text-sm font-bold shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
