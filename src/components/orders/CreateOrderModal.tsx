import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { OrderItem, PaymentMethod } from '../../types';
import { X, Plus, Trash2, Calendar, Clock, DollarSign, User } from 'lucide-react';

export const CreateOrderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    products, 
    customers, 
    createOrder, 
    settings, 
    navigateToOrderDetail 
  } = useBakery();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [requestedDate, setRequestedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(settings.pickupTimeSlots[0] || '12:00 PM - 02:30 PM');
  const [allergyNotes, setAllergyNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Selected order items
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [currentProductId, setCurrentProductId] = useState(products[0]?.id || '');
  const [currentVariantIdx, setCurrentVariantIdx] = useState(0);
  const [currentQty, setCurrentQty] = useState(1);
  const [currentEggless, setCurrentEggless] = useState(true);
  const [currentInstructions, setCurrentInstructions] = useState('');

  // Financials
  const [advancePaid, setAdvancePaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customizationFee, setCustomizationFee] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discount, setDiscount] = useState(0);

  if (!isOpen) return null;

  // Selected product object
  const currentProd = products.find(p => p.id === currentProductId);
  const currentVariant = currentProd?.variants[currentVariantIdx] || currentProd?.variants[0];

  const handleAddItem = () => {
    if (!currentProd || !currentVariant) return;

    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId: currentProd.id,
      productName: currentProd.name,
      variantName: currentVariant.name,
      quantity: currentQty,
      unitPrice: currentVariant.price,
      totalPrice: currentVariant.price * currentQty,
      isEggless: currentEggless,
      specialInstructions: currentInstructions,
      image: currentProd.images[0]
    };

    setSelectedItems([...selectedItems, newItem]);
    setCurrentInstructions('');
    setCurrentQty(1);
  };

  const handleRemoveItem = (idx: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== idx));
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = Math.round((subtotal + customizationFee - discount) * (settings.taxRatePercent / 100));
  const totalAmount = Math.max(0, subtotal + customizationFee + deliveryFee - discount + tax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Please enter customer name and phone number.");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please add at least one product item to the order.");
      return;
    }

    const order = createOrder({
      customerName,
      customerPhone,
      customerEmail,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
      deliveryTimeSlot,
      requestedDate,
      items: selectedItems,
      subtotal,
      customizationCharges: customizationFee,
      deliveryFee,
      discount,
      advancePaid,
      paymentMethod,
      allergyNotes,
      internalBakerNotes: internalNotes,
      status: 'confirmed'
    });

    onClose();
    navigateToOrderDetail(order.id);
  };

  // Quick autofill from existing customer
  const handleSelectCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    const cust = customers.find(c => c.id === custId);
    if (cust) {
      setCustomerName(cust.name);
      setCustomerPhone(cust.phone);
      setCustomerEmail(cust.email);
      if (cust.addresses.length > 0) {
        setDeliveryAddress(cust.addresses[0]);
        setDeliveryType('delivery');
      }
      setAllergyNotes(cust.dietaryPreferences);
    }
  };

  return (
    <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-cream-200 max-w-2xl w-full p-6 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cream-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-cocoa-900">Create Direct / Walk-in Order</h3>
            <p className="text-xs text-cocoa-500">Record an order received via WhatsApp, phone, or in person</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream-100 rounded-lg text-cocoa-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Customer Selection or Entry */}
          <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cocoa-800">1. Customer Information</span>
              <select 
                onChange={handleSelectCustomer}
                className="bg-white border border-cream-300 rounded-lg px-2 py-1 text-[11px] text-cocoa-700"
              >
                <option value="">Select Existing Customer (Optional)</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priyank Sen"
                  required
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900 font-sans"
                />
              </div>
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98860 12345"
                  required
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900 font-sans"
                />
              </div>
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="priyank@email.com"
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Fulfillment details */}
          <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-3">
            <span className="font-bold text-cocoa-800 block">2. Fulfillment Schedule</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Type</label>
                <select
                  value={deliveryType}
                  onChange={(e) => {
                    const val = e.target.value as 'pickup' | 'delivery';
                    setDeliveryType(val);
                    setDeliveryFee(val === 'delivery' ? 80 : 0);
                  }}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                >
                  <option value="pickup">Studio Pickup</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Requested Date</label>
                <input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Time Slot</label>
                <select
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                >
                  {settings.pickupTimeSlots.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Apartment, Street, Landmark, Area..."
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                />
              </div>
            )}
          </div>

          {/* Add Product Items */}
          <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-3">
            <span className="font-bold text-cocoa-800 block">3. Add Products to Order</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Product</label>
                <select
                  value={currentProductId}
                  onChange={(e) => {
                    setCurrentProductId(e.target.value);
                    setCurrentVariantIdx(0);
                  }}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Size / Variant</label>
                <select
                  value={currentVariantIdx}
                  onChange={(e) => setCurrentVariantIdx(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                >
                  {currentProd?.variants.map((v, i) => (
                    <option key={i} value={i}>{v.name} (₹{v.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={currentQty}
                  onChange={(e) => setCurrentQty(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={currentInstructions}
                onChange={(e) => setCurrentInstructions(e.target.value)}
                placeholder="Inscription message or notes (e.g. 'Happy 25th Birthday')"
                className="flex-1 p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900 text-xs"
              />
              <label className="flex items-center gap-1.5 text-cocoa-700 font-semibold cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={currentEggless}
                  onChange={(e) => setCurrentEggless(e.target.checked)}
                  className="rounded text-peach-500"
                />
                <span>Eggless</span>
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-2 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 text-peach-300" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Added Items List */}
            {selectedItems.length > 0 && (
              <div className="mt-2 space-y-1.5 pt-2 border-t border-cream-200">
                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-cream-200">
                    <div>
                      <span className="font-bold text-cocoa-900">{item.quantity}x {item.productName}</span>
                      <span className="text-cocoa-500 ml-1">({item.variantName}) {item.isEggless && '· Eggless'}</span>
                      {item.specialInstructions && <p className="text-[10px] text-cocoa-600 italic">"{item.specialInstructions}"</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-cocoa-900">₹{item.totalPrice}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Advance Payment */}
          <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-3">
            <span className="font-bold text-cocoa-800 block">4. Financials & Advance Payment</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Customization Fee (₹)</label>
                <input
                  type="number"
                  value={customizationFee}
                  onChange={(e) => setCustomizationFee(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Discount (₹)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                />
              </div>
              <div>
                <label className="text-[10px] text-cocoa-500 font-bold uppercase block mb-1">Advance Received (₹)</label>
                <input
                  type="number"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900 font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-cocoa-500">Total Calculation: </span>
                <span className="font-bold text-cocoa-900 text-sm">₹{totalAmount}</span>
                <span className="text-[11px] text-cocoa-400 ml-1">(inc. ₹{tax} tax)</span>
              </div>
              <div>
                <span className="text-cocoa-500">Remaining Balance: </span>
                <span className="font-bold text-rose-600 text-sm">₹{Math.max(0, totalAmount - advancePaid)}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Confirm & Create Order
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
