import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  MessageCircle, 
  Calendar, 
  RotateCw, 
  Tag, 
  Cake, 
  CheckCircle2 
} from 'lucide-react';

export const CustomerDetailView: React.FC = () => {
  const { 
    selectedCustomerId, 
    customers, 
    orders, 
    setBakerTab, 
    navigateToOrderDetail,
    settings 
  } = useBakery();

  const customer = customers.find(c => c.id === selectedCustomerId);

  if (!customer) {
    return (
      <div className="bg-white rounded-2xl border border-cream-200 p-12 text-center shadow-soft">
        <p className="text-sm text-cocoa-500 mb-4">No customer selected.</p>
        <button
          onClick={() => setBakerTab('customers')}
          className="px-4 py-2 bg-cocoa-900 text-cream-50 rounded-xl text-xs font-semibold"
        >
          Return to Customers
        </button>
      </div>
    );
  }

  // Find customer's past orders
  const customerOrders = orders.filter(o => 
    o.customerPhone.replace(/\D/g, '') === customer.phone.replace(/\D/g, '') ||
    o.customerName.toLowerCase() === customer.name.toLowerCase()
  );

  const avgOrderValue = customerOrders.length > 0 
    ? Math.round(customer.totalSpent / customerOrders.length) 
    : 0;

  const openWhatsApp = () => {
    const cleanPhone = customer.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${customer.name}! Chef Ananya here from ${settings.businessName}. Hope you enjoyed your previous bakes! Let us know if you need anything special for your upcoming celebrations.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBakerTab('customers')}
            className="p-2 bg-white hover:bg-cream-100 text-cocoa-800 rounded-xl border border-cream-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-cocoa-900">{customer.name}</h2>
              <div className="flex gap-1">
                {customer.tags.map((t, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-peach-100 text-peach-800 uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-cocoa-500 mt-0.5">
              Customer since {customer.createdAt} · {customer.orderCount} lifetime orders
            </p>
          </div>
        </div>

        <button
          onClick={openWhatsApp}
          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp Customer</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Total Lifetime Spend</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{customer.totalSpent}
          </span>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">High Value Customer</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Total Orders</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            {customerOrders.length || customer.orderCount}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Completed purchases</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Average Order Value</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{avgOrderValue}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Per transaction</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Dietary Profile</span>
          <span className="font-serif font-bold text-sm text-peach-700 mt-1 block truncate">
            {customer.dietaryPreferences}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Preferred preparation</p>
        </div>
      </div>

      {/* Grid: Profile Details & Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Info Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3.5 text-xs">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 pb-2 border-b border-cream-100">
              Contact & Addresses
            </h3>

            <div>
              <span className="text-cocoa-400 text-[10px] block uppercase font-bold">Phone Number</span>
              <a href={`tel:${customer.phone}`} className="font-semibold text-peach-600 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                {customer.phone}
              </a>
            </div>

            {customer.email && (
              <div>
                <span className="text-cocoa-400 text-[10px] block uppercase font-bold">Email Address</span>
                <span className="font-medium text-cocoa-800 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-cocoa-400" />
                  {customer.email}
                </span>
              </div>
            )}

            <div>
              <span className="text-cocoa-400 text-[10px] block uppercase font-bold">Saved Delivery Addresses</span>
              {customer.addresses.length === 0 ? (
                <p className="text-cocoa-400 mt-0.5 italic">No address on file (Pickup customer)</p>
              ) : (
                customer.addresses.map((addr, idx) => (
                  <p key={idx} className="mt-1 bg-cream-50 p-2 rounded-lg border border-cream-200 text-cocoa-700 leading-relaxed">
                    {addr}
                  </p>
                ))
              )}
            </div>

            {customer.notes && (
              <div className="pt-2 border-t border-cream-100">
                <span className="text-cocoa-400 text-[10px] block uppercase font-bold mb-1">Baker Private Notes</span>
                <p className="bg-cream-100 p-2.5 rounded-lg text-cocoa-800 italic">
                  "{customer.notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Orders List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
          <h3 className="font-serif font-bold text-sm text-cocoa-900 pb-2 border-b border-cream-100 mb-4">
            Order History ({customerOrders.length})
          </h3>

          <div className="space-y-3">
            {customerOrders.length === 0 ? (
              <p className="text-xs text-cocoa-400 text-center py-8">No past orders found for this customer.</p>
            ) : (
              customerOrders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => navigateToOrderDetail(order.id)}
                  className="p-3.5 rounded-xl border border-cream-200 hover:border-peach-300 bg-cream-50/40 hover:bg-peach-50/20 transition-all flex items-center justify-between cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-cream-200 flex items-center justify-center font-bold font-mono text-[11px] text-cocoa-900">
                      #{order.id.slice(-3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cocoa-900">{order.id}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          order.status === 'completed' ? 'bg-cocoa-100 text-cocoa-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-cocoa-600 mt-0.5">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ') || 'Custom Cake'}
                      </p>
                      <span className="text-[10px] text-cocoa-400 block mt-0.5">
                        Scheduled: {order.requestedDate} ({order.deliveryTimeSlot.split(' - ')[0]})
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-cocoa-900 text-sm">₹{order.totalAmount}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5 capitalize">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
