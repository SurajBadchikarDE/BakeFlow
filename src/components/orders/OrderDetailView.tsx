import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { OrderStatus, PaymentMethod } from '../../types';
import { 
  ArrowLeft, 
  Printer, 
  CreditCard, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Save, 
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const OrderDetailView: React.FC = () => {
  const { 
    selectedOrderId, 
    orders, 
    updateOrderStatus, 
    updateOrderProductionStage, 
    recordPayment, 
    setBakerTab,
    settings 
  } = useBakery();

  const order = orders.find(o => o.id === selectedOrderId);

  const [internalNote, setInternalNote] = useState(order?.internalBakerNotes || '');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoicePrint, setShowInvoicePrint] = useState(false);

  // Payment form state
  const [payAmount, setPayAmount] = useState(order?.remainingBalance || 0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('Payment collected');

  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center shadow-soft">
        <p className="text-sm text-cocoa-500 mb-4">No order selected or order was removed.</p>
        <button
          onClick={() => setBakerTab('orders')}
          className="px-4 py-2 bg-cocoa-900 text-cream-50 rounded-xl text-xs font-semibold"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  // Status progression workflow
  const statusSteps: OrderStatus[] = [
    'new',
    'confirmed',
    'scheduled',
    'baking',
    'decorating',
    'ready',
    'completed'
  ];

  const currentStepIndex = statusSteps.indexOf(order.status as OrderStatus);

  const handleNextStatus = () => {
    if (currentStepIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentStepIndex + 1];
      updateOrderStatus(order.id, nextStatus, `Advanced to ${nextStatus}`);
    }
  };

  const handleSaveNotes = () => {
    // In our context we can update order or use notification
    order.internalBakerNotes = internalNote;
    alert("Internal baker notes saved!");
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }
    recordPayment(order.id, {
      orderId: order.id,
      amount: Number(payAmount),
      method: payMethod,
      transactionRef: payRef || `UPI-${Date.now().toString().slice(-6)}`,
      notes: payNotes,
      date: new Date().toISOString().split('T')[0]
    });
    setShowPaymentModal(false);
  };

  const openWhatsApp = () => {
    const cleanPhone = order.customerPhone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${order.customerName}! This is ${settings.bakerName} from ${settings.businessName}. Your order #${order.id} status is now: ${order.status.replace('_', ' ').toUpperCase()}. Delivery/Pickup date: ${order.requestedDate} (${order.deliveryTimeSlot}). Total: ₹${order.totalAmount}, Balance: ₹${order.remainingBalance}.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBakerTab('orders')}
            className="p-2 bg-white hover:bg-cream-100 text-cocoa-800 rounded-xl border border-cream-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-cocoa-900 font-mono">
                Order #{order.id}
              </h2>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                order.status === 'completed'
                  ? 'bg-cocoa-100 text-cocoa-800'
                  : order.status === 'ready'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'baking' || order.status === 'decorating'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-cocoa-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()} · Due: {order.requestedDate} ({order.deliveryTimeSlot})
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={openWhatsApp}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Customer</span>
          </button>

          <button
            onClick={() => setShowInvoicePrint(true)}
            className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 border border-cream-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-cocoa-600" />
            <span>Print Invoice</span>
          </button>

          {order.remainingBalance > 0 && (
            <button
              onClick={() => {
                setPayAmount(order.remainingBalance);
                setShowPaymentModal(true);
              }}
              className="px-3.5 py-1.5 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Workflow Stage Progression Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cream-100">
          <div>
            <h3 className="font-serif font-bold text-sm text-cocoa-900">Order Lifecycle & Production Workflow</h3>
            <p className="text-xs text-cocoa-500 mt-0.5">Track and progress this order through the kitchen stages</p>
          </div>

          {currentStepIndex < statusSteps.length - 1 && (
            <button
              onClick={handleNextStatus}
              className="self-start md:self-auto px-4 py-2 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold shadow-soft flex items-center gap-2 transition-all transform active:scale-95"
            >
              <span>Advance to "{statusSteps[currentStepIndex + 1]?.replace('_', ' ').toUpperCase()}"</span>
              <ChevronRight className="w-4 h-4 text-peach-300" />
            </button>
          )}
        </div>

        {/* Stepper bubbles */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {statusSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={step} 
                onClick={() => updateOrderStatus(order.id, step, `Manual stage change to ${step}`)}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-peach-500 text-white border-peach-600 shadow-md scale-102' 
                    : isCompleted
                    ? 'bg-cream-100 text-cocoa-700 border-cream-300'
                    : 'bg-white text-cocoa-400 border-cream-200 opacity-60'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                  Step {idx + 1}
                </div>
                <div className="text-xs font-bold capitalize leading-tight">
                  {step.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Details (Left 7 cols) & Financials/Log (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Customer & Ordered Items */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer & Fulfillment Info */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 mb-4 pb-2 border-b border-cream-100">
              Customer & Delivery Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-cocoa-400 text-[11px] block">Customer Name</span>
                <span className="font-bold text-cocoa-900 text-sm block mt-0.5">{order.customerName}</span>
                
                <span className="text-cocoa-400 text-[11px] block mt-3">Contact Number</span>
                <a href={`tel:${order.customerPhone}`} className="text-peach-600 font-semibold flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  {order.customerPhone}
                </a>

                {order.customerEmail && (
                  <>
                    <span className="text-cocoa-400 text-[11px] block mt-3">Email</span>
                    <span className="text-cocoa-700 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-cocoa-400" />
                      {order.customerEmail}
                    </span>
                  </>
                )}
              </div>

              <div>
                <span className="text-cocoa-400 text-[11px] block">Fulfillment Type</span>
                <span className="font-semibold text-cocoa-800 capitalize block mt-0.5">
                  {order.deliveryType === 'delivery' ? '🚗 Direct Home Delivery' : '🏪 In-Store Studio Pickup'}
                </span>

                <span className="text-cocoa-400 text-[11px] block mt-3">Scheduled Date & Slot</span>
                <span className="font-semibold text-cocoa-900 block mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-peach-500" />
                  {order.requestedDate} ({order.deliveryTimeSlot})
                </span>

                {order.deliveryType === 'delivery' && (
                  <>
                    <span className="text-cocoa-400 text-[11px] block mt-3">Delivery Address</span>
                    <p className="text-cocoa-700 mt-0.5 bg-cream-50 p-2 rounded-lg border border-cream-200">
                      {order.deliveryAddress || 'No address provided'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Allergy or Dietary Alert */}
            {order.allergyNotes && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Dietary / Allergy Warning: </span>
                  <span>{order.allergyNotes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Ordered Products / Custom Cake Details */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 mb-4 pb-2 border-b border-cream-100">
              Ordered Confections
            </h3>

            {/* If Custom Cake */}
            {order.customCakeDetails && (
              <div className="mb-4 p-4 rounded-xl bg-peach-50/50 border border-peach-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-peach-900 text-sm">🎂 Bespoke Custom Cake Specification</span>
                  <span className="text-xs bg-peach-200 text-peach-900 px-2 py-0.5 rounded-full font-bold">
                    {order.customCakeDetails.servings} Servings
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-cocoa-400 text-[10px]">Type & Occasion:</span>
                    <p className="font-semibold text-cocoa-800">{order.customCakeDetails.cakeType} · {order.customCakeDetails.occasion}</p>
                  </div>
                  <div>
                    <span className="text-cocoa-400 text-[10px]">Flavor & Filling:</span>
                    <p className="font-semibold text-cocoa-800">{order.customCakeDetails.flavor} ({order.customCakeDetails.filling})</p>
                  </div>
                  <div>
                    <span className="text-cocoa-400 text-[10px]">Frosting & Colors:</span>
                    <p className="font-semibold text-cocoa-800">{order.customCakeDetails.frosting} · {order.customCakeDetails.themeColors}</p>
                  </div>
                  <div>
                    <span className="text-cocoa-400 text-[10px]">Cake Inscription:</span>
                    <p className="font-bold text-peach-700">"{order.customCakeDetails.inscription}"</p>
                  </div>
                </div>

                {order.customCakeDetails.referenceImages.length > 0 && (
                  <div>
                    <span className="text-cocoa-400 text-[10px] block mb-1.5">Customer Reference Photos:</span>
                    <div className="flex gap-2">
                      {order.customCakeDetails.referenceImages.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt="Reference" 
                          className="w-20 h-20 rounded-lg object-cover border border-cream-300"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Standard Products Table */}
            {order.items.length > 0 && (
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="p-3 rounded-xl border border-cream-200 flex items-start justify-between gap-3 bg-cream-50/30">
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-cream-200" />
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-cocoa-900">{item.productName}</h4>
                        <p className="text-[11px] text-cocoa-500">
                          {item.variantName} {item.isEggless && '· Eggless'}
                        </p>
                        {item.specialInstructions && (
                          <p className="text-[11px] text-cocoa-600 mt-1 italic">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-cocoa-500">{item.quantity} × ₹{item.unitPrice}</span>
                      <div className="font-bold text-xs text-cocoa-900 mt-0.5">₹{item.totalPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internal Baker Notes */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-cream-100">
              <h3 className="font-serif font-bold text-sm text-cocoa-900">Private Baker Notes</h3>
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Private notes (driver contact, sponge resting time, gold leaf placement, packaging instructions)..."
              rows={3}
              className="w-full p-3 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            />
          </div>

        </div>

        {/* Right Column (5 cols): Payment Ledger & Status Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Payment & Balance Summary Card */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 mb-3 pb-2 border-b border-cream-100">
              Financial Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-cocoa-600">
                <span>Items Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.customizationCharges > 0 && (
                <div className="flex justify-between text-cocoa-600">
                  <span>Customization / Art Fee</span>
                  <span>₹{order.customizationCharges}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-cocoa-600">
                  <span>Delivery Charges</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Applied</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-cocoa-600">
                <span>Tax ({settings.taxRatePercent}%)</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="pt-2 border-t border-cream-200 flex justify-between font-bold text-sm text-cocoa-900">
                <span>Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Advance and remaining balance */}
            <div className="mt-4 p-3 rounded-xl bg-cream-100/70 border border-cream-200 space-y-2 text-xs">
              <div className="flex justify-between text-cocoa-700">
                <span>Total Paid</span>
                <span className="font-bold text-emerald-700">₹{order.advancePaid}</span>
              </div>
              <div className="flex justify-between text-cocoa-700 font-bold">
                <span>Remaining Balance</span>
                <span className={order.remainingBalance > 0 ? 'text-rose-600 text-sm' : 'text-emerald-700'}>
                  ₹{order.remainingBalance}
                </span>
              </div>
            </div>

            {order.remainingBalance > 0 && (
              <button
                onClick={() => {
                  setPayAmount(order.remainingBalance);
                  setShowPaymentModal(true);
                }}
                className="mt-4 w-full py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                + Record Balance Payment (₹{order.remainingBalance})
              </button>
            )}
          </div>

          {/* Payment History Records */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-cream-100">
              <h3 className="font-serif font-bold text-sm text-cocoa-900">Recorded Payments</h3>
              <span className="text-[10px] text-cocoa-400 font-medium">{order.payments.length} transaction(s)</span>
            </div>

            {order.payments.length === 0 ? (
              <p className="text-xs text-cocoa-400 text-center py-4">No payments recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {order.payments.map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl border border-cream-200 bg-cream-50/50 text-xs">
                    <div className="flex justify-between items-center font-bold text-cocoa-900">
                      <span>₹{p.amount} ({p.method.toUpperCase()})</span>
                      <span className="text-[10px] text-cocoa-400 font-mono">{p.receiptNumber}</span>
                    </div>
                    <div className="text-[11px] text-cocoa-500 mt-0.5">
                      Ref: {p.transactionRef} · {p.date}
                    </div>
                    {p.notes && (
                      <div className="text-[10px] text-cocoa-600 italic mt-0.5">{p.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status History Audit Log */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 mb-3 pb-2 border-b border-cream-100">
              Status Change Audit Log
            </h3>
            <div className="space-y-3">
              {order.statusHistory.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-peach-500 shrink-0 mt-1"></span>
                  <div>
                    <span className="font-bold text-cocoa-900 capitalize">{h.status.replace('_', ' ')}</span>
                    <span className="text-cocoa-400 text-[10px] ml-2">{h.timestamp}</span>
                    {h.note && <p className="text-[11px] text-cocoa-600 mt-0.5">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-md w-full p-6 shadow-elevated">
            <h3 className="font-serif font-bold text-base text-cocoa-900 mb-1">
              Record Payment for #{order.id}
            </h3>
            <p className="text-xs text-cocoa-500 mb-4">
              Current balance outstanding: <strong className="text-rose-600">₹{order.remainingBalance}</strong>
            </p>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-cocoa-700 block mb-1">Amount to Record (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  max={order.remainingBalance}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-cocoa-700 block mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="cash">Cash on Delivery / Pickup</option>
                  <option value="bank_transfer">Direct Bank Transfer / NEFT</option>
                  <option value="card">Card Payment / POS</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-cocoa-700 block mb-1">Transaction Reference / UTR</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UPI/628941038291"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                />
              </div>

              <div>
                <label className="font-semibold text-cocoa-700 block mb-1">Payment Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Remaining balance cleared upon pickup"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Confirm & Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showInvoicePrint && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-elevated relative my-8">
            <button
              onClick={() => setShowInvoicePrint(false)}
              className="absolute top-4 right-4 text-cocoa-400 hover:text-cocoa-600 no-print text-sm font-bold p-2"
            >
              ✕ Close
            </button>

            {/* Printable Content Area */}
            <div id="printable-invoice" className="space-y-6">
              
              {/* Bakery Header */}
              <div className="flex justify-between items-start border-b border-cocoa-100 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-cocoa-900">{settings.businessName}</h2>
                  <p className="text-xs text-cocoa-600">{settings.tagline}</p>
                  <p className="text-xs text-cocoa-500 mt-1">{settings.pickupAddress}</p>
                  <p className="text-xs text-cocoa-500">Phone: {settings.phone} · UPI: {settings.upiId}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-lg text-peach-600">INVOICE</span>
                  <p className="text-xs font-mono font-bold text-cocoa-900 mt-1">INV-{order.id}</p>
                  <p className="text-xs text-cocoa-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Billed to */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-cocoa-400 font-bold uppercase text-[10px]">Billed To:</span>
                  <p className="font-bold text-cocoa-900 mt-0.5">{order.customerName}</p>
                  <p className="text-cocoa-600">{order.customerPhone}</p>
                  {order.deliveryAddress && <p className="text-cocoa-600 mt-1">{order.deliveryAddress}</p>}
                </div>
                <div className="text-right">
                  <span className="text-cocoa-400 font-bold uppercase text-[10px]">Fulfillment Details:</span>
                  <p className="font-semibold text-cocoa-800 mt-0.5 capitalize">{order.deliveryType} on {order.requestedDate}</p>
                  <p className="text-cocoa-600">Slot: {order.deliveryTimeSlot}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-cocoa-200 text-cocoa-600 uppercase text-[10px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td className="py-2">
                        <span className="font-bold text-cocoa-900">{item.productName}</span>
                        <span className="text-cocoa-500 text-[10px] block">{item.variantName} {item.isEggless && '(Eggless)'}</span>
                      </td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">₹{item.unitPrice}</td>
                      <td className="py-2 text-right font-semibold">₹{item.totalPrice}</td>
                    </tr>
                  ))}
                  {order.customCakeDetails && (
                    <tr>
                      <td className="py-2">
                        <span className="font-bold text-cocoa-900">{order.customCakeDetails.cakeType}</span>
                        <span className="text-cocoa-500 text-[10px] block">
                          Flavor: {order.customCakeDetails.flavor} ({order.customCakeDetails.servings} Servings)
                        </span>
                      </td>
                      <td className="py-2 text-center">1</td>
                      <td className="py-2 text-right">₹{order.subtotal}</td>
                      <td className="py-2 text-right font-semibold">₹{order.subtotal}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-cocoa-200 pt-3 space-y-1.5 text-xs text-right">
                <div className="flex justify-between">
                  <span className="text-cocoa-500">Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.customizationCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-cocoa-500">Customization Charges:</span>
                    <span>₹{order.customizationCharges}</span>
                  </div>
                )}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-cocoa-500">Delivery Fee:</span>
                    <span>₹{order.deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-cocoa-500">Tax ({settings.taxRatePercent}%):</span>
                  <span>₹{order.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-cocoa-900 pt-1 border-t border-cream-200">
                  <span>Grand Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span>Amount Paid:</span>
                  <span>₹{order.advancePaid}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-600">
                  <span>Balance Due:</span>
                  <span>₹{order.remainingBalance}</span>
                </div>
              </div>

              {/* Payment instructions */}
              <div className="bg-cream-100 p-3 rounded-xl text-[11px] text-cocoa-700">
                <p className="font-bold">Payment Instructions:</p>
                <p>Pay via UPI to: <strong>{settings.upiId}</strong></p>
                <p>{settings.bankDetails}</p>
                <p className="mt-1 text-[10px] text-cocoa-500">Thank you for supporting our artisan bakery!</p>
              </div>
            </div>

            {/* Print trigger button */}
            <div className="mt-6 pt-4 border-t border-cream-200 flex justify-end gap-3 no-print">
              <button
                onClick={() => setShowInvoicePrint(false)}
                className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
