import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Search, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Flame, 
  Package, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, orderTrackId, setOrderTrackId, settings } = useBakery();

  const [inputQuery, setInputQuery] = useState(orderTrackId || 'BF-2026-101');
  const [activeOrder, setActiveOrder] = useState(
    orders.find(o => o.id === (orderTrackId || 'BF-2026-101')) || orders[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputQuery.trim().toLowerCase();
    const found = orders.find(o => 
      o.id.toLowerCase() === clean || 
      o.customerPhone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );

    if (found) {
      setActiveOrder(found);
      setOrderTrackId(found.id);
    } else {
      alert(`No order found with ID or Phone number "${inputQuery}". Try "BF-2026-101" or "+91 99001 54321".`);
    }
  };

  const trackingMilestones = [
    { key: 'new', label: 'Order Received', desc: 'Order logged into system' },
    { key: 'confirmed', label: 'Confirmed & Scheduled', desc: 'Advance verified & date locked' },
    { key: 'baking', label: 'In Baking', desc: 'Sponges in deck ovens' },
    { key: 'decorating', label: 'Art & Decorating', desc: 'Ganache, flowers & piping' },
    { key: 'ready', label: 'Ready for Pickup', desc: 'Chilled, boxed & tagged' },
    { key: 'completed', label: 'Delivered / Completed', desc: 'Celebration delivered!' }
  ];

  const getActiveMilestoneIndex = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending_confirmation':
        return 0;
      case 'confirmed':
      case 'scheduled':
        return 1;
      case 'in_preparation':
      case 'baking':
        return 2;
      case 'decorating':
        return 3;
      case 'ready':
        return 4;
      case 'completed':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = activeOrder ? getActiveMilestoneIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-cocoa-900">
          Live Bakery Order Tracking
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-500 max-w-md mx-auto">
          Enter your order reference code (e.g. BF-2026-101) or registered phone number to track live progress.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. BF-2026-101 or 9900154321"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-cream-300 rounded-xl text-xs text-cocoa-900 font-mono font-bold focus:outline-none focus:border-peach-500 shadow-soft"
              required
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold shadow-soft transition-colors"
          >
            Track
          </button>
        </form>
      </div>

      {activeOrder && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-card p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cream-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-cocoa-900">Order #{activeOrder.id}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-peach-100 text-peach-800">
                  {activeOrder.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-cocoa-500 mt-1">
                Customer: <strong>{activeOrder.customerName}</strong> · Scheduled for: <strong>{activeOrder.requestedDate} ({activeOrder.deliveryTimeSlot})</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-cocoa-400 block">Total Amount</span>
              <span className="font-serif font-bold text-xl text-cocoa-900">₹{activeOrder.totalAmount}</span>
              {activeOrder.remainingBalance > 0 ? (
                <span className="text-[11px] text-rose-600 font-bold block mt-0.5">
                  Bal. Due on Pickup: ₹{activeOrder.remainingBalance}
                </span>
              ) : (
                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                  Fully Cleared ✓
                </span>
              )}
            </div>
          </div>

          {/* Milestone Stepper */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-cocoa-900">Live Kitchen Stage</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {trackingMilestones.map((m, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={m.key}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                        : 'bg-cream-50/40 border-cream-200 text-cocoa-400 opacity-60'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center font-bold text-xs mb-1.5 font-mono">
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-3 h-3 rounded-full bg-peach-500 animate-ping" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="font-bold text-xs block leading-tight">{m.label}</span>
                    <span className="text-[9px] opacity-75 block mt-1 leading-tight">{m.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 space-y-3">
            <span className="font-bold text-cocoa-900 text-xs block font-serif">
              Order Timeline Updates:
            </span>
            <div className="space-y-2 text-xs">
              {activeOrder.statusHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-peach-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-bold text-cocoa-900 capitalize">{h.status.replace('_', ' ')}</span>
                    <span className="text-[10px] text-cocoa-400 ml-2 font-mono">{h.timestamp}</span>
                    {h.note && <p className="text-[11px] text-cocoa-600 mt-0.5">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered items review */}
          <div className="pt-2 border-t border-cream-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-cocoa-400 block text-[10px] uppercase font-bold">Ordered Bakes:</span>
              <p className="font-semibold text-cocoa-800 mt-0.5">
                {activeOrder.items.map(i => `${i.quantity}x ${i.productName}`).join(', ') || 'Custom Cake'}
              </p>
            </div>

            <button
              onClick={() => {
                const cleanPhone = settings.phone.replace(/\D/g, '');
                window.open(`https://wa.me/${cleanPhone}?text=Hi%20Chef%20Ananya!%20Checking%20in%20on%20my%20order%20%23${activeOrder.id}.`, '_blank');
              }}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Contact Baker on WhatsApp</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
