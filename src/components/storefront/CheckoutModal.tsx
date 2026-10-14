import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  ArrowRight,
  Info
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    cartTotal, 
    clearCart, 
    createOrder, 
    settings, 
    setStorefrontTab, 
    setLastConfirmedOrderId 
  } = useBakery();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Default date = tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [requestedDate, setRequestedDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState(settings.pickupTimeSlots[0] || '12:00 PM - 02:30 PM');

  // Advance vs Full Payment Choice
  const [paymentOption, setPaymentOption] = useState<'advance' | 'full'>('advance');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [allergyNotes, setAllergyNotes] = useState('');

  if (!isOpen || cart.length === 0) return null;

  const currentZone = settings.deliveryZones[selectedZoneIdx] || settings.deliveryZones[0];
  const deliveryFee = deliveryType === 'delivery' ? (currentZone?.fee || 80) : 0;
  const tax = Math.round(cartTotal * (settings.taxRatePercent / 100));
  const grandTotal = cartTotal + deliveryFee + tax;

  const payableNow = paymentOption === 'advance' ? Math.round(grandTotal * 0.5) : grandTotal;
  const remainingBalance = grandTotal - payableNow;

  const copyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Please provide your name and WhatsApp contact number.");
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      alert("Please enter your complete delivery address.");
      return;
    }

    const orderItems = cart.map(item => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId: item.product.id,
      productName: item.product.name,
      variantName: item.variant.name,
      flavor: item.selectedFlavor,
      quantity: item.quantity,
      unitPrice: item.variant.price,
      totalPrice: item.variant.price * item.quantity,
      isEggless: item.isEggless,
      specialInstructions: item.specialInstructions,
      image: item.product.images[0]
    }));

    const newOrder = createOrder({
      customerName,
      customerPhone,
      customerEmail,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
      deliveryTimeSlot: timeSlot,
      requestedDate,
      items: orderItems,
      subtotal: cartTotal,
      customizationCharges: 0,
      deliveryFee,
      discount: 0,
      tax,
      advancePaid: payableNow,
      paymentMethod: 'upi',
      allergyNotes,
      status: 'confirmed',
      internalBakerNotes: `Storefront online order. Deposit of ₹${payableNow} selected via UPI.`
    });

    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 }
    });

    clearCart();
    onClose();
    setLastConfirmedOrderId(newOrder.id);
    setStorefrontTab('order_confirmed');
  };

  return (
    <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-cream-200 max-w-2xl w-full p-6 sm:p-8 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cream-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-cocoa-900">Complete Your Bakery Order</h3>
            <p className="text-xs text-cocoa-500">Fast & seamless checkout directly with Chef Ananya's kitchen</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream-100 rounded-lg text-cocoa-400 hover:text-cocoa-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="mt-5 space-y-5 text-xs">
          
          {/* Customer Details */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-3">
            <span className="font-bold text-cocoa-800 text-xs block">1. Contact Information</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maya Iyer"
                  required
                  className="w-full p-2.5 bg-white border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98860 12345"
                  required
                  className="w-full p-2.5 bg-white border border-cream-300 rounded-xl text-cocoa-900 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-cocoa-700 block mb-1">Email (For receipt confirmation)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="maya@gmail.com"
                  className="w-full p-2.5 bg-white border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Fulfillment details */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-3">
            <span className="font-bold text-cocoa-800 text-xs block">2. Delivery or Studio Pickup</span>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 p-3 rounded-xl border font-bold text-center transition-all ${
                  deliveryType === 'pickup' 
                    ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' 
                    : 'bg-white border-cream-300 text-cocoa-700'
                }`}
              >
                🏪 Studio Pickup (Free)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`flex-1 p-3 rounded-xl border font-bold text-center transition-all ${
                  deliveryType === 'delivery' 
                    ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' 
                    : 'bg-white border-cream-300 text-cocoa-700'
                }`}
              >
                🚗 Bangalore Delivery
              </button>
            </div>

            {deliveryType === 'delivery' ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Select Delivery Zone</label>
                  <select
                    value={selectedZoneIdx}
                    onChange={(e) => setSelectedZoneIdx(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  >
                    {settings.deliveryZones.map((z, idx) => (
                      <option key={idx} value={idx}>{z.zone} (+₹{z.fee})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Complete Delivery Address *</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House/Apartment #, Wing, Street, Landmark, Area, Pin code..."
                    rows={2}
                    required
                    className="w-full p-2.5 bg-white border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-cream-200 text-cocoa-700">
                <span className="font-bold block text-cocoa-900">Studio Address:</span>
                <p className="mt-0.5">{settings.pickupAddress}</p>
                <p className="text-[10px] text-cocoa-400 mt-1">Pick up directly from Chef Ananya's kitchen chiller.</p>
              </div>
            )}

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Requested Date</label>
                <input
                  type="date"
                  min={tomorrowStr}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-cream-300 rounded-xl text-cocoa-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Preferred Time Window</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-white border border-cream-300 rounded-xl text-cocoa-900"
                >
                  {settings.pickupTimeSlots.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method & Deposit Choice */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-3">
            <span className="font-bold text-cocoa-800 text-xs block">3. Payment & Deposit Preference</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentOption('advance')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentOption === 'advance' 
                    ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' 
                    : 'bg-white border-cream-200 text-cocoa-700'
                }`}
              >
                <span className="font-bold block text-sm">Pay 50% Deposit Now</span>
                <span className="text-peach-700 font-bold text-sm block mt-0.5">₹{payableNow}</span>
                <span className="text-[10px] text-cocoa-400 block mt-0.5">Bal: ₹{remainingBalance} on pickup</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('full')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentOption === 'full' 
                    ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' 
                    : 'bg-white border-cream-200 text-cocoa-700'
                }`}
              >
                <span className="font-bold block text-sm">Pay 100% Full Amount</span>
                <span className="text-emerald-700 font-bold text-sm block mt-0.5">₹{payableNow}</span>
                <span className="text-[10px] text-cocoa-400 block mt-0.5">Zero balance remaining</span>
              </button>
            </div>

            {/* UPI ID display */}
            <div className="p-3 bg-white rounded-xl border border-cream-200 space-y-2">
              <span className="text-cocoa-500 text-[10px] uppercase font-bold block">
                Official Bakery UPI Address (GPay / PhonePe / Paytm):
              </span>
              <div className="flex items-center justify-between bg-cream-50 p-2.5 rounded-lg border border-cream-200">
                <span className="font-mono font-bold text-cocoa-900 text-sm select-all">
                  {settings.upiId}
                </span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="px-2.5 py-1 bg-white hover:bg-cream-100 text-cocoa-700 rounded-md font-semibold text-[11px] border border-cream-300 flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                </button>
              </div>
              <p className="text-[10px] text-cocoa-400">
                Once submitted, you'll be shown the complete invoice with an instant WhatsApp link to send your payment screenshot.
              </p>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex justify-between text-cocoa-600">
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)} bakes)</span>
              <span>₹{cartTotal}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-cocoa-600">
                <span>Delivery Charge</span>
                <span>₹{deliveryFee}</span>
              </div>
            )}
            <div className="flex justify-between text-cocoa-600">
              <span>Tax ({settings.taxRatePercent}%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-cocoa-900 pt-2 border-t border-cream-200">
              <span>Total Order Amount</span>
              <span>₹{grandTotal}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-peach-700 bg-peach-50 p-2.5 rounded-xl border border-peach-200">
              <span>Deposit Due Now via UPI</span>
              <span className="text-base">₹{payableNow}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-peach-500 to-roseGold-500 hover:from-peach-600 hover:to-roseGold-600 text-white rounded-2xl text-sm font-bold shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <span>Place Order · Pay ₹{payableNow} Deposit</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
