import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Settings, 
  Save, 
  Store, 
  CreditCard, 
  Clock, 
  FileText, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export const BusinessSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useBakery();

  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Bakery Business Settings & Storefront Profile</h2>
            <p className="text-xs text-cocoa-500">Configure brand identity, UPI payment address, tax rates and ordering rules</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved!</span>
            </span>
          )}
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Business Profile & Branding */}
        <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
            <Store className="w-4 h-4 text-peach-500" />
            <span>1. Brand Identity & Public Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Bakery Business Name *</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                required
              />
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Head Pastry Chef Name</label>
              <input
                type="text"
                value={formData.bakerName}
                onChange={(e) => setFormData({ ...formData, bakerName: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Instagram Handle</label>
              <input
                type="text"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-cocoa-700 block mb-1">About the Baker / Brand Story</label>
              <textarea
                value={formData.aboutStory}
                onChange={(e) => setFormData({ ...formData, aboutStory: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Logo URL</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 text-xs font-sans"
              />
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Storefront Hero Cover Image URL</label>
              <input
                type="text"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 text-xs font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Studio Location */}
        <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
            2. Business Contact & Studio Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Official WhatsApp / Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-mono"
                required
              />
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Business Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-cocoa-700 block mb-1">Studio Address (For Invoices & Pickup)</label>
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Setup & Tax */}
        <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-peach-500" />
            <span>3. Payment QR & Financial Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Official UPI ID *</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. yourname@okaxis"
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-mono font-bold"
                required
              />
              <span className="text-[10px] text-cocoa-400 mt-0.5 block">Shown on checkout & invoices for GPay/PhonePe</span>
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Currency Code & Symbol</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-1/2 p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-mono font-bold"
                />
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-1/2 p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Applicable Tax Rate (%)</label>
              <input
                type="number"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
              />
              <span className="text-[10px] text-cocoa-400 mt-0.5 block">Default 5% GST for bakery/food items</span>
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-cocoa-700 block mb-1">Bank Account Details (Printed on Invoices)</label>
              <input
                type="text"
                value={formData.bankDetails}
                onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Operational Lead Times & Policies */}
        <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-peach-500" />
            <span>4. Production Lead Times & Policies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Standard Cake Notice (Hours)</label>
              <input
                type="number"
                value={formData.minNoticeHours}
                onChange={(e) => setFormData({ ...formData, minNoticeHours: Number(e.target.value) })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
              />
              <span className="text-[10px] text-cocoa-400 mt-0.5 block">Minimum hours notice required for orders</span>
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Custom Cake Lead Time (Days)</label>
              <input
                type="number"
                value={formData.leadTimeDaysCustomCake}
                onChange={(e) => setFormData({ ...formData, leadTimeDaysCustomCake: Number(e.target.value) })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
              />
              <span className="text-[10px] text-cocoa-400 mt-0.5 block">Lead time needed for tier/theme cakes</span>
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Daily Capacity Limit</label>
              <input
                type="number"
                value={formData.dailyOrderCapacity}
                onChange={(e) => setFormData({ ...formData, dailyOrderCapacity: Number(e.target.value) })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
              />
              <span className="text-[10px] text-cocoa-400 mt-0.5 block">Max orders per day before blocking dates</span>
            </div>

            <div className="sm:col-span-3">
              <label className="font-bold text-cocoa-700 block mb-1">Cancellation & Refund Policy</label>
              <textarea
                value={formData.cancellationPolicy}
                onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                rows={2}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold shadow-soft transition-all transform active:scale-95"
          >
            Save All Settings
          </button>
        </div>

      </form>

    </div>
  );
};
