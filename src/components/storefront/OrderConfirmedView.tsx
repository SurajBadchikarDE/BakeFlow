import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Copy, 
  ShoppingBag 
} from 'lucide-react';

export const OrderConfirmedView: React.FC = () => {
  const { 
    lastConfirmedOrderId, 
    orders, 
    setStorefrontTab, 
    setOrderTrackId, 
    settings 
  } = useBakery();

  const order = orders.find(o => o.id === lastConfirmedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-cocoa-500 mb-4">No order found.</p>
        <button
          onClick={() => setStorefrontTab('home')}
          className="px-4 py-2 bg-cocoa-900 text-cream-50 rounded-xl text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const openWhatsApp = () => {
    const cleanPhone = settings.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi Chef Ananya! 🎂 I just placed Order #${order.id} for ₹${order.totalAmount}. Requested date: ${order.requestedDate} (${order.deliveryTimeSlot}). Customer: ${order.customerName}. Sharing my order details for confirmation!`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    alert(`Order ID #${order.id} copied to clipboard!`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Confirmation Hero Card */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-elevated p-6 sm:p-10 text-center space-y-5">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-peach-600">
            Order Successfully Placed!
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-cocoa-900">
            Thank You, {order.customerName}! 💖
          </h1>
          <p className="text-xs text-cocoa-500 max-w-md mx-auto leading-relaxed">
            Your confections have been scheduled directly with Chef Ananya at {settings.businessName}.
          </p>
        </div>

        {/* Order Reference Pill */}
        <div className="inline-flex items-center gap-2 bg-cream-50 border border-cream-300 px-4 py-2 rounded-2xl">
          <span className="text-xs text-cocoa-500">Order Reference:</span>
          <span className="font-mono font-bold text-sm text-cocoa-900">{order.id}</span>
          <button 
            onClick={copyOrderId}
            className="p-1 hover:bg-cream-200 text-cocoa-600 rounded"
            title="Copy Order ID"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Schedule Summary Box */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-cream-200">
            <span className="font-bold text-cocoa-800">Fulfillment Schedule</span>
            <span className="capitalize font-bold text-peach-700">{order.deliveryType}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-cocoa-700">
            <div>
              <span className="text-cocoa-400 text-[10px] block">Date:</span>
              <span className="font-semibold">{order.requestedDate}</span>
            </div>
            <div>
              <span className="text-cocoa-400 text-[10px] block">Time Window:</span>
              <span className="font-semibold">{order.deliveryTimeSlot}</span>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="pt-2 border-t border-cream-200">
              <span className="text-cocoa-400 text-[10px] block">Delivery Location:</span>
              <span className="font-medium text-cocoa-800">{order.deliveryAddress}</span>
            </div>
          )}
        </div>

        {/* Deposit & UPI Box */}
        <div className="p-4 bg-peach-50 rounded-2xl border border-peach-200 text-left space-y-2 text-xs">
          <span className="font-bold text-peach-900 block">UPI Payment Instructions:</span>
          <p className="text-cocoa-700 leading-relaxed text-[11px]">
            Please transfer the advance deposit (₹{order.advancePaid || Math.round(order.totalAmount * 0.5)}) via GPay / PhonePe to official bakery UPI ID:
          </p>
          <div className="p-2 bg-white rounded-xl border border-peach-300 font-mono font-bold text-cocoa-900 text-center select-all text-sm">
            {settings.upiId}
          </div>
          <p className="text-[10px] text-cocoa-500 italic">
            * Once paid, click the button below to send your confirmation screenshot on WhatsApp!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={openWhatsApp}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Order Confirmation on WhatsApp</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setOrderTrackId(order.id);
                setStorefrontTab('order_track');
              }}
              className="flex-1 py-2.5 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold transition-colors"
            >
              Track Live Kitchen Status
            </button>
            <button
              onClick={() => setStorefrontTab('catalog')}
              className="px-4 py-2.5 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Browse More
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
