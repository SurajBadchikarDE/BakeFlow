import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Order } from '../../types';
import { 
  FileText, 
  Search, 
  Printer, 
  Download, 
  CheckCircle2, 
  Eye, 
  X 
} from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const { orders, settings, navigateToOrderDetail } = useBakery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Invoices & GST Receipts</h2>
            <p className="text-xs text-cocoa-500">Itemized bills with taxes, payment records and pickup instructions</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice or customer..."
            className="pl-8 pr-3 py-1.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
          />
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-cream-200 text-cocoa-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Date Issued</th>
                <th className="py-3 px-4">Grand Total</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-cream-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cocoa-900">
                    INV-{order.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cocoa-500">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-cocoa-900">
                    {order.customerName}
                  </td>
                  <td className="py-3.5 px-4 text-cocoa-500">
                    {order.createdAt.split('T')[0]}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cocoa-900">
                    ₹{order.totalAmount}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">
                    ₹{order.advancePaid}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">
                    ₹{order.remainingBalance}
                  </td>
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
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-cocoa-600" />
                        <span>Preview / Print</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Print & Preview Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-elevated relative my-8">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 text-cocoa-400 hover:text-cocoa-600 no-print text-sm font-bold p-2"
            >
              ✕ Close
            </button>

            {/* Printable Content */}
            <div id="printable-invoice" className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-cocoa-100 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-cocoa-900">{settings.businessName}</h2>
                  <p className="text-xs text-cocoa-600">{settings.tagline}</p>
                  <p className="text-xs text-cocoa-500 mt-1">{settings.pickupAddress}</p>
                  <p className="text-xs text-cocoa-500">Phone: {settings.phone} · UPI: {settings.upiId}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif font-bold text-xl text-peach-600">TAX INVOICE</span>
                  <p className="text-xs font-mono font-bold text-cocoa-900 mt-1">INV-{selectedInvoiceOrder.id}</p>
                  <p className="text-xs text-cocoa-500">Date: {selectedInvoiceOrder.createdAt.split('T')[0]}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-cocoa-400 font-bold uppercase text-[10px]">Customer:</span>
                  <p className="font-bold text-cocoa-900 mt-0.5">{selectedInvoiceOrder.customerName}</p>
                  <p className="text-cocoa-600">{selectedInvoiceOrder.customerPhone}</p>
                  {selectedInvoiceOrder.deliveryAddress && (
                    <p className="text-cocoa-600 mt-1">{selectedInvoiceOrder.deliveryAddress}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-cocoa-400 font-bold uppercase text-[10px]">Fulfillment:</span>
                  <p className="font-semibold text-cocoa-800 mt-0.5 capitalize">
                    {selectedInvoiceOrder.deliveryType} on {selectedInvoiceOrder.requestedDate}
                  </p>
                  <p className="text-cocoa-600">Slot: {selectedInvoiceOrder.deliveryTimeSlot}</p>
                </div>
              </div>

              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-cocoa-200 text-cocoa-600 uppercase text-[10px]">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {selectedInvoiceOrder.items.map(item => (
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
                  {selectedInvoiceOrder.customCakeDetails && (
                    <tr>
                      <td className="py-2">
                        <span className="font-bold text-cocoa-900">{selectedInvoiceOrder.customCakeDetails.cakeType}</span>
                        <span className="text-cocoa-500 text-[10px] block">
                          Flavor: {selectedInvoiceOrder.customCakeDetails.flavor} ({selectedInvoiceOrder.customCakeDetails.servings} Servings)
                        </span>
                      </td>
                      <td className="py-2 text-center">1</td>
                      <td className="py-2 text-right">₹{selectedInvoiceOrder.subtotal}</td>
                      <td className="py-2 text-right font-semibold">₹{selectedInvoiceOrder.subtotal}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="border-t border-cocoa-200 pt-3 space-y-1.5 text-xs text-right">
                <div className="flex justify-between">
                  <span className="text-cocoa-500">Subtotal:</span>
                  <span>₹{selectedInvoiceOrder.subtotal}</span>
                </div>
                {selectedInvoiceOrder.customizationCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-cocoa-500">Customization Charges:</span>
                    <span>₹{selectedInvoiceOrder.customizationCharges}</span>
                  </div>
                )}
                {selectedInvoiceOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-cocoa-500">Delivery Fee:</span>
                    <span>₹{selectedInvoiceOrder.deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-cocoa-500">Tax ({settings.taxRatePercent}%):</span>
                  <span>₹{selectedInvoiceOrder.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-cocoa-900 pt-1 border-t border-cream-200">
                  <span>Grand Total:</span>
                  <span>₹{selectedInvoiceOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span>Payments Received:</span>
                  <span>₹{selectedInvoiceOrder.advancePaid}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-600">
                  <span>Balance Due:</span>
                  <span>₹{selectedInvoiceOrder.remainingBalance}</span>
                </div>
              </div>

              <div className="bg-cream-100 p-3 rounded-xl text-[11px] text-cocoa-700">
                <p className="font-bold">Payment Instructions:</p>
                <p>Pay via UPI to: <strong>{settings.upiId}</strong></p>
                <p>{settings.bankDetails}</p>
                <p className="mt-1 text-[10px] text-cocoa-500">Thank you for ordering with {settings.businessName}!</p>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-cream-200 flex justify-end gap-3 no-print">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
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
