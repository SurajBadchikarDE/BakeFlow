import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { OrderStatus, PaymentStatus } from '../../types';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  Flame, 
  Truck, 
  AlertCircle,
  MessageCircle,
  MoreVertical,
  Calendar,
  X
} from 'lucide-react';

export const OrdersPage: React.FC<{ onOpenNewOrder: () => void }> = ({ onOpenNewOrder }) => {
  const { 
    orders, 
    updateOrderStatus, 
    navigateToOrderDetail, 
    exportToCsv,
    settings 
  } = useBakery();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Status groupings for tabs
  const tabCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'new' || o.status === 'pending_confirmation').length,
    active: orders.filter(o => o.status === 'confirmed' || o.status === 'scheduled' || o.status === 'in_preparation' || o.status === 'baking' || o.status === 'decorating').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled' || o.status === 'rejected').length
  };

  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (activeTab === 'pending' && !(order.status === 'new' || order.status === 'pending_confirmation')) return false;
    if (activeTab === 'active' && !(order.status === 'confirmed' || order.status === 'scheduled' || order.status === 'in_preparation' || order.status === 'baking' || order.status === 'decorating')) return false;
    if (activeTab === 'ready' && order.status !== 'ready') return false;
    if (activeTab === 'completed' && order.status !== 'completed') return false;
    if (activeTab === 'cancelled' && !(order.status === 'cancelled' || order.status === 'rejected')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      const matchItems = order.items.some(i => i.productName.toLowerCase().includes(q));
      if (!matchId && !matchName && !matchPhone && !matchItems) return false;
    }

    // Payment filter
    if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter) return false;

    // Delivery type filter
    if (deliveryFilter !== 'all' && order.deliveryType !== deliveryFilter) return false;

    // Date filter
    if (dateFilter && order.requestedDate !== dateFilter) return false;

    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
      case 'pending_confirmation':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Awaiting Confirm</span>;
      case 'confirmed':
      case 'scheduled':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Confirmed</span>;
      case 'in_preparation':
      case 'baking':
        return <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">In Baking</span>;
      case 'decorating':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Decorating</span>;
      case 'ready':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ready for Pickup</span>;
      case 'completed':
        return <span className="bg-cocoa-100 text-cocoa-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Completed</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-cream-200 text-cocoa-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{status}</span>;
    }
  };

  const openWhatsAppCustomer = (phone: string, orderId: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${name}! This is ${settings.bakerName} from ${settings.businessName} regarding your order #${orderId}. Let us know if you have any questions!`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-5">
      
      {/* Top Filter Tabs Bar */}
      <div className="bg-white rounded-2xl border border-cream-200 p-2 shadow-soft flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'all', label: 'All Orders', count: tabCounts.all },
            { id: 'pending', label: 'Pending Review', count: tabCounts.pending, color: 'text-amber-600' },
            { id: 'active', label: 'In Kitchen', count: tabCounts.active, color: 'text-orange-600' },
            { id: 'ready', label: 'Ready for Pickup', count: tabCounts.ready, color: 'text-emerald-600' },
            { id: 'completed', label: 'Completed', count: tabCounts.completed },
            { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-cocoa-900 text-cream-50 shadow-xs' 
                  : 'text-cocoa-600 hover:bg-cream-100 hover:text-cocoa-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-cocoa-800 text-peach-200' : 'bg-cream-200 text-cocoa-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCsv('orders')}
            className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold border border-cream-300 transition-colors flex items-center gap-1.5"
            title="Download orders CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenNewOrder}
            className="px-3 py-1.5 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Create Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, item, phone..."
              className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cocoa-400 hover:text-cocoa-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            >
              <option value="all">All Payment Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Fully Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Delivery Type Filter */}
          <div>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            >
              <option value="all">All Fulfillment Types</option>
              <option value="pickup">Customer Pickup</option>
              <option value="delivery">Home Delivery</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            />
          </div>

        </div>

        {(searchQuery || paymentFilter !== 'all' || deliveryFilter !== 'all' || dateFilter) && (
          <div className="mt-3 pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-cocoa-600">
            <span>Showing {filteredOrders.length} of {orders.length} total orders</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setPaymentFilter('all');
                setDeliveryFilter('all');
                setDateFilter('');
              }}
              className="text-peach-600 hover:text-peach-700 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-cream-200 text-cocoa-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Fulfillment Schedule</th>
                <th className="py-3 px-4">Ordered Items & Requests</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Kitchen Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-cocoa-400">
                    No orders found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-cream-50/70 transition-colors">
                    
                    {/* Order ID */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => navigateToOrderDetail(order.id)}
                        className="font-bold text-cocoa-900 hover:text-peach-600 font-mono text-xs"
                      >
                        {order.id}
                      </button>
                      <div className="text-[10px] text-cocoa-400 mt-0.5">
                        {order.createdAt.split('T')[0]}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-cocoa-900">{order.customerName}</div>
                      <div className="text-[11px] text-cocoa-500 font-mono mt-0.5">{order.customerPhone}</div>
                      {order.allergyNotes && (
                        <div className="text-[10px] text-amber-700 font-medium mt-0.5 flex items-center gap-0.5">
                          ⚠️ {order.allergyNotes}
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-cocoa-900">{order.requestedDate}</div>
                      <div className="text-[11px] text-cocoa-500 mt-0.5 capitalize flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-peach-500"></span>
                        {order.deliveryType} · {order.deliveryTimeSlot.split(' - ')[0]}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      {order.customCakeDetails ? (
                        <div>
                          <span className="font-semibold text-peach-700">🎂 Custom Cake Design</span>
                          <p className="text-[11px] text-cocoa-600 truncate">{order.customCakeDetails.cakeType} ({order.customCakeDetails.flavor})</p>
                          <p className="text-[10px] text-cocoa-400 truncate">"{order.customCakeDetails.inscription}"</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-cocoa-800 truncate">
                            {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                          </p>
                          {order.items[0]?.specialInstructions && (
                            <p className="text-[10px] text-cocoa-400 truncate mt-0.5">
                              "{order.items[0].specialInstructions}"
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-cocoa-900 text-xs">₹{order.totalAmount}</div>
                      {order.remainingBalance > 0 ? (
                        <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                          Bal: ₹{order.remainingBalance}
                        </div>
                      ) : (
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          Fully Cleared
                        </div>
                      )}
                    </td>

                    {/* Payment status badge */}
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : order.paymentStatus === 'partially_paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus.replace('_', ' ')}
                      </span>
                      <div className="text-[10px] text-cocoa-400 uppercase mt-0.5">
                        {order.paymentMethod || 'upi'}
                      </div>
                    </td>

                    {/* Kitchen Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus, `Status updated via orders table`)}
                        className="text-[11px] font-semibold bg-cream-50 border border-cream-300 rounded-lg px-2 py-1 text-cocoa-800 focus:outline-none focus:border-peach-500"
                      >
                        <option value="new">New</option>
                        <option value="pending_confirmation">Pending Confirm</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_preparation">In Prep</option>
                        <option value="baking">Baking</option>
                        <option value="decorating">Decorating</option>
                        <option value="ready">Ready for Pickup</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openWhatsAppCustomer(order.customerPhone, order.id, order.customerName)}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                          title="Message customer on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigateToOrderDetail(order.id)}
                          className="px-2.5 py-1 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination / summary */}
        <div className="p-4 bg-cream-50/70 border-t border-cream-100 flex items-center justify-between text-xs text-cocoa-500">
          <span>Displaying {filteredOrders.length} records</span>
          <span className="font-medium text-cocoa-700">BakeFlow Real-Time Order Management</span>
        </div>
      </div>

    </div>
  );
};
