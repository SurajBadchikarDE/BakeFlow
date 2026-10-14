import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { PaymentMethod, PaymentRecord } from '../../types';
import { 
  CreditCard, 
  Search, 
  Download, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { orders, navigateToOrderDetail } = useBakery();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Flatten all payments across all orders
  const allPayments: (PaymentRecord & { customerName: string })[] = [];
  orders.forEach(order => {
    order.payments.forEach(p => {
      allPayments.push({
        ...p,
        customerName: order.customerName
      });
    });
  });

  // Sort by date descending
  allPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Aggregate stats
  const totalCollected = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalReceivables = orders.reduce((sum, o) => sum + o.remainingBalance, 0);
  
  const upiTotal = allPayments.filter(p => p.method === 'upi').reduce((sum, p) => sum + p.amount, 0);
  const bankTotal = allPayments.filter(p => p.method === 'bank_transfer').reduce((sum, p) => sum + p.amount, 0);
  const cashTotal = allPayments.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = allPayments.filter(p => {
    if (methodFilter !== 'all' && p.method !== methodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.orderId.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.receiptNumber.toLowerCase().includes(q) ||
        (p.transactionRef && p.transactionRef.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Total Revenue Collected</span>
          <span className="font-serif font-bold text-2xl text-emerald-700 mt-1 block">
            ₹{totalCollected}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">{allPayments.length} transactions logged</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Outstanding Receivables</span>
          <span className="font-serif font-bold text-2xl text-rose-600 mt-1 block">
            ₹{totalReceivables}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Pending pickup balance</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">UPI & QR Volume</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{upiTotal}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">GPay, PhonePe, Paytm</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Bank & Cash Volume</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{bankTotal + cashTotal}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Direct IMPS & Cash</p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['all', 'upi', 'bank_transfer', 'cash', 'card'].map(m => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all uppercase ${
                methodFilter === m
                  ? 'bg-cocoa-900 text-cream-50 shadow-xs'
                  : 'text-cocoa-600 hover:bg-cream-100 hover:text-cocoa-900'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search receipt, UTR ref, order #..."
            className="pl-8 pr-3 py-1.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
          />
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-cream-200 text-cocoa-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Order ID & Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">UTR / Transaction Ref</th>
                <th className="py-3 px-4">Date Recorded</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-right">View Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cocoa-900">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-cocoa-900">{p.customerName}</span>
                    <span className="text-[10px] text-cocoa-400 block font-mono">{p.orderId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-cream-100 text-cocoa-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                      {p.method.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-cocoa-600">
                    {p.transactionRef || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-cocoa-500">
                    {p.date}
                  </td>
                  <td className="py-3.5 px-4 text-cocoa-600 italic max-w-[180px] truncate">
                    {p.notes || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-700 text-sm">
                    +₹{p.amount}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigateToOrderDetail(p.orderId)}
                      className="text-peach-600 hover:text-peach-700 font-semibold"
                    >
                      Order →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
