import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Expense } from '../../types';
import { 
  Receipt, 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  Tag, 
  PieChart, 
  DollarSign, 
  X,
  Calendar
} from 'lucide-react';

export const ExpensesPage: React.FC<{ onOpenAddExpense?: () => void }> = () => {
  const { expenses, addExpense, deleteExpense, exportToCsv } = useBakery();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New expense form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'ingredients' | 'packaging' | 'electricity' | 'equipment' | 'marketing' | 'delivery' | 'misc'>('ingredients');
  const [amount, setAmount] = useState(1500);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');

  const categories = [
    { id: 'all', label: 'All Expenses' },
    { id: 'ingredients', label: 'Ingredients & Dairy' },
    { id: 'packaging', label: 'Boxes & Ribbon' },
    { id: 'electricity', label: 'Utilities & Power' },
    { id: 'marketing', label: 'Instagram Ads' },
    { id: 'delivery', label: 'Delivery / Dunzo' },
    { id: 'misc', label: 'Miscellaneous' },
  ];

  const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter(e => {
    if (activeCategory !== 'all' && e.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.description.toLowerCase().includes(q) || (e.vendor && e.vendor.toLowerCase().includes(q));
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    addExpense({
      date,
      category,
      amount: Number(amount),
      paymentMethod,
      description,
      vendor
    });

    setShowAddModal(false);
    setDescription('');
    setVendor('');
    setAmount(1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Total Monthly Expenses</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{totalMonthlyExpenses}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Across {expenses.length} recorded purchases</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Raw Ingredients Share</span>
          <span className="font-serif font-bold text-2xl text-peach-700 mt-1 block">
            ₹{expenses.filter(e => e.category === 'ingredients').reduce((sum, e) => sum + e.amount, 0)}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Chocolate, butter, cream</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Packaging & Utilities</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{expenses.filter(e => e.category === 'packaging' || e.category === 'electricity').reduce((sum, e) => sum + e.amount, 0)}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Boxes, electricity bills</p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-cocoa-900 text-cream-50 shadow-xs'
                  : 'text-cocoa-600 hover:bg-cream-100 hover:text-cocoa-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor, description..."
              className="pl-8 pr-3 py-1.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            />
          </div>

          <button
            onClick={() => exportToCsv('expenses')}
            className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold border border-cream-300 transition-colors flex items-center gap-1.5"
            title="Download expenses CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Log Expense</span>
          </button>
        </div>

      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-cream-200 text-cocoa-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor / Payee</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-cream-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-cocoa-600">
                    {expense.date}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-cocoa-900">
                    {expense.description}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-cream-100 text-cocoa-700 px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-cocoa-700">
                    {expense.vendor || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-cocoa-600">
                    {expense.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-rose-700 text-sm">
                    -₹{expense.amount}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm("Remove this expense record?")) {
                          deleteExpense(expense.id);
                        }
                      }}
                      className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-md w-full p-6 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-serif font-bold text-base text-cocoa-900">Log Bakery Business Expense</h3>
              <button onClick={() => setShowAddModal(false)} className="text-cocoa-400 hover:text-cocoa-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Expense Description *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Amul Butter 5kg purchase from distributor"
                  required
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  >
                    <option value="ingredients">Raw Ingredients & Dairy</option>
                    <option value="packaging">Boxes, Boards & Ribbons</option>
                    <option value="electricity">Electricity / Gas / Power</option>
                    <option value="equipment">Bakery Equipment & Tools</option>
                    <option value="marketing">Marketing & Meta Ads</option>
                    <option value="delivery">Delivery Partner / Dunzo</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  >
                    <option value="UPI">UPI (GPay / PhonePe)</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Card">Business Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. Karnataka Dairy Hub"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
