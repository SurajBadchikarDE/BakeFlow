import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Customer } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  MessageCircle, 
  Phone, 
  Mail, 
  Tag, 
  Cake, 
  Eye, 
  X,
  Calendar
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { 
    customers, 
    addCustomer, 
    navigateToCustomerDetail, 
    exportToCsv,
    settings 
  } = useBakery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New customer form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dietary, setDietary] = useState('Eggless only preferred');
  const [tagsInput, setTagsInput] = useState('New Customer');
  const [notes, setNotes] = useState('');

  const allTags = ['all', 'VIP', 'Repeat', 'Corporate', 'Eggless Lover', 'New Customer'];

  const filteredCustomers = customers.filter(c => {
    if (selectedTag !== 'all' && !c.tags.includes(selectedTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newCust = addCustomer({
      name,
      phone,
      email,
      addresses: address ? [address] : [],
      dietaryPreferences: dietary,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      notes
    });

    setShowAddModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${name}! Greetings from ${settings.bakerName} at ${settings.businessName}. We are taking cake pre-orders for this weekend! Let us know if we can bake something sweet for you.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTag === tag
                  ? 'bg-cocoa-900 text-cream-50 shadow-xs'
                  : 'text-cocoa-600 hover:bg-cream-100 hover:text-cocoa-900'
              }`}
            >
              {tag === 'all' ? 'All Customers' : tag}
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
              placeholder="Search by name, phone..."
              className="pl-8 pr-3 py-1.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            />
          </div>

          <button
            onClick={() => exportToCsv('customers')}
            className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold border border-cream-300 transition-colors flex items-center gap-1.5"
            title="Download customers CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Customer</span>
          </button>
        </div>

      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-cream-200 text-cocoa-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Dietary Preferences</th>
                <th className="py-3 px-4">Segment Tags</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-cream-50/60 transition-colors">
                  
                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => navigateToCustomerDetail(customer.id)}
                      className="font-bold text-cocoa-900 hover:text-peach-600 text-xs text-left"
                    >
                      {customer.name}
                    </button>
                    {customer.importantOccasion && (
                      <div className="text-[10px] text-peach-600 font-medium mt-0.5">
                        🎉 {customer.importantOccasion}
                      </div>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-cocoa-700">
                    <div>{customer.phone}</div>
                    <div className="text-[10px] text-cocoa-400 font-sans">{customer.email}</div>
                  </td>

                  {/* Dietary */}
                  <td className="py-3.5 px-4 text-cocoa-600 max-w-[200px] truncate">
                    {customer.dietaryPreferences}
                  </td>

                  {/* Tags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            tag === 'VIP' 
                              ? 'bg-amber-100 text-amber-800' 
                              : tag === 'Repeat'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-cream-100 text-cocoa-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Spend */}
                  <td className="py-3.5 px-4 font-bold text-cocoa-900">
                    ₹{customer.totalSpent}
                  </td>

                  {/* Orders count */}
                  <td className="py-3.5 px-4 font-semibold text-cocoa-700">
                    {customer.orderCount} order(s)
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openWhatsApp(customer.phone, customer.name)}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigateToCustomerDetail(customer.id)}
                        className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Profile
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-md w-full p-6 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-serif font-bold text-base text-cocoa-900">Add Customer Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-cocoa-400 hover:text-cocoa-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meera Nair"
                  required
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98860 12345"
                    required
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="meera@gmail.com"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, Street, Area, City"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Dietary Preferences & Allergies</label>
                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="e.g. Strictly Eggless, No nuts"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="VIP, Repeat, Corporate"
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
