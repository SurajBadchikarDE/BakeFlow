import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Bell, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  DollarSign, 
  Clock 
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    settings 
  } = useBakery();

  const [activeTab, setActiveTab] = useState<'notifications' | 'templates'>('notifications');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Template test inputs
  const [testPhone, setTestPhone] = useState('+91 99001 54321');
  const [testCustomer, setTestCustomer] = useState('Sneha Krishnan');
  const [testOrderNum, setTestOrderNum] = useState('BF-2026-101');
  const [testAmount, setTestAmount] = useState(1470);
  const [testBalance, setTestBalance] = useState(470);

  // Editable templates
  const [templates, setTemplates] = useState([
    {
      id: 'tmpl-1',
      title: 'Order Received & Advance Payment Reminder',
      text: `Hello {customerName}! 🎂 We have received your cake order #{orderId} at {bakeryName}. Total amount is ₹{totalAmount}. To confirm your date, please transfer the 50% advance deposit to UPI: {upiId}. Kindly share screenshot once done. Thank you!`
    },
    {
      id: 'tmpl-2',
      title: 'Order Confirmed & Scheduled',
      text: `Great news {customerName}! 🍰 Your order #{orderId} is confirmed and scheduled for production on {date}. Chef Ananya will handcraft your delicious bakes fresh to order!`
    },
    {
      id: 'tmpl-3',
      title: 'Order Ready for Pickup / Out for Delivery',
      text: `Exciting update! 🎉 Your order #{orderId} is fresh out of the kitchen, boxed and ready for pickup at our Indiranagar studio ({pickupAddress}). Outstanding balance to clear: ₹{balance}. See you soon!`
    },
    {
      id: 'tmpl-4',
      title: 'Thank You & Celebration Feedback',
      text: `Thank you for celebrating with {bakeryName}, {customerName}! 💖 We hope everyone loved the cake. We would be overjoyed if you could tag us on Instagram {instagram} or share your feedback!`
    }
  ]);

  const copyTemplate = (tmplId: string, text: string) => {
    const populated = text
      .replace(/{customerName}/g, testCustomer)
      .replace(/{orderId}/g, testOrderNum)
      .replace(/{bakeryName}/g, settings.businessName)
      .replace(/{upiId}/g, settings.upiId)
      .replace(/{totalAmount}/g, testAmount.toString())
      .replace(/{balance}/g, testBalance.toString())
      .replace(/{pickupAddress}/g, settings.pickupAddress)
      .replace(/{date}/g, 'Tomorrow')
      .replace(/{instagram}/g, settings.instagramHandle);

    navigator.clipboard.writeText(populated);
    setCopiedId(tmplId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const launchWhatsApp = (text: string) => {
    const cleanPhone = testPhone.replace(/\D/g, '');
    const populated = text
      .replace(/{customerName}/g, testCustomer)
      .replace(/{orderId}/g, testOrderNum)
      .replace(/{bakeryName}/g, settings.businessName)
      .replace(/{upiId}/g, settings.upiId)
      .replace(/{totalAmount}/g, testAmount.toString())
      .replace(/{balance}/g, testBalance.toString())
      .replace(/{pickupAddress}/g, settings.pickupAddress)
      .replace(/{date}/g, 'Tomorrow')
      .replace(/{instagram}/g, settings.instagramHandle);

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(populated)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Tabs */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Communication & Alert Center</h2>
            <p className="text-xs text-cocoa-500">In-app notifications and copyable WhatsApp message templates</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-cream-100 p-1 rounded-xl flex items-center text-xs font-semibold">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-white text-cocoa-900 shadow-xs' : 'text-cocoa-600'}`}
          >
            System Alerts ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'templates' ? 'bg-white text-cocoa-900 shadow-xs' : 'text-cocoa-600'}`}
          >
            WhatsApp Templates
          </button>
        </div>
      </div>

      {activeTab === 'notifications' ? (
        /* Notifications List */
        <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-100">
            <h3 className="font-serif font-bold text-sm text-cocoa-900">
              Recent Alerts & Operational Activity
            </h3>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-peach-600 hover:text-peach-700"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-xs text-cocoa-400">No alerts logged.</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    n.read 
                      ? 'bg-cream-50/50 border-cream-200 text-cocoa-700 opacity-80' 
                      : 'bg-peach-50/70 border-peach-200 text-cocoa-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg border border-cream-200 shrink-0 mt-0.5">
                      {n.type === 'inventory' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {n.type === 'order' && <Package className="w-4 h-4 text-peach-600" />}
                      {n.type === 'payment' && <DollarSign className="w-4 h-4 text-emerald-600" />}
                      {n.type === 'production' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      {n.type === 'info' && <Bell className="w-4 h-4 text-cocoa-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-cocoa-900">{n.title}</span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-peach-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-cocoa-700 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-cocoa-400 shrink-0 font-mono">
                    {n.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* WhatsApp Message Templates Hub */
        <div className="space-y-6">
          
          {/* Quick test parameters */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 mb-3 pb-2 border-b border-cream-100">
              Customer Data for WhatsApp Preview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-cocoa-500 block uppercase mb-1">Customer Phone</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg text-cocoa-900 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-cocoa-500 block uppercase mb-1">Customer Name</label>
                <input
                  type="text"
                  value={testCustomer}
                  onChange={(e) => setTestCustomer(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg text-cocoa-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-cocoa-500 block uppercase mb-1">Order #</label>
                <input
                  type="text"
                  value={testOrderNum}
                  onChange={(e) => setTestOrderNum(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg text-cocoa-900 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-cocoa-500 block uppercase mb-1">Balance Due (₹)</label>
                <input
                  type="number"
                  value={testBalance}
                  onChange={(e) => setTestBalance(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg text-cocoa-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map(tmpl => (
              <div 
                key={tmpl.id}
                className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif font-bold text-sm text-cocoa-900">{tmpl.title}</h4>
                  </div>
                  <textarea
                    value={tmpl.text}
                    onChange={(e) => {
                      const updated = templates.map(t => t.id === tmpl.id ? { ...t, text: e.target.value } : t);
                      setTemplates(updated);
                    }}
                    rows={4}
                    className="w-full p-3 bg-cream-50 border border-cream-200 rounded-xl text-xs text-cocoa-800 font-sans leading-relaxed focus:outline-none focus:border-peach-500"
                  />
                </div>

                <div className="pt-2 border-t border-cream-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyTemplate(tmpl.id, tmpl.text)}
                    className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === tmpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cocoa-600" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => launchWhatsApp(tmpl.text)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
