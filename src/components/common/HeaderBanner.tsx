import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Sparkles, 
  Store, 
  LayoutDashboard, 
  RotateCcw, 
  Bell, 
  Search, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const HeaderBanner: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    settings, 
    resetToDemoData, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    setBakerTab,
    orders,
    products,
    customers,
    navigateToOrderDetail,
    navigateToCustomerDetail,
    navigateToStorefrontProduct
  } = useBakery();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = notifications.filter(n => !n.read);

  // Filter search results
  const filteredOrders = searchQuery.trim() 
    ? orders.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery)
      ).slice(0, 4)
    : [];

  const filteredProducts = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredCustomers = searchQuery.trim()
    ? customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
      ).slice(0, 3)
    : [];

  return (
    <>
      {/* Top Universal Mode & Control Bar */}
      <header className="bg-cocoa-900 text-cream-100 text-xs py-2 px-4 sticky top-0 z-50 shadow-md border-b border-cocoa-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Branding & Current Mode Status */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-serif font-bold text-sm tracking-wide text-peach-300">
              🎂 BakeFlow
            </span>
            <span className="hidden sm:inline-block text-cocoa-400">|</span>
            <span className="inline-flex items-center gap-1.5 bg-cocoa-800/80 px-2.5 py-0.5 rounded-full text-cream-200 text-[11px] font-medium border border-cocoa-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {activeRole === 'baker' ? 'Baker Admin Workspace' : 'Customer Online Storefront'}
            </span>
            <span className="hidden md:inline text-cocoa-400 text-[11px]">
              {settings.businessName}
            </span>
          </div>

          {/* Center / Right: Global Actions */}
          <div className="flex items-center gap-2">
            
            {/* Global Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-1.5 bg-cocoa-800 hover:bg-cocoa-700 text-cream-200 px-3 py-1 rounded-md text-[11px] transition-colors border border-cocoa-700"
              title="Search orders, products, or customers"
            >
              <Search className="w-3.5 h-3.5 text-peach-300" />
              <span className="hidden sm:inline">Quick Search...</span>
              <kbd className="hidden md:inline bg-cocoa-900/80 px-1.5 py-0.2 rounded text-[10px] text-cocoa-300 font-mono">⌘K</kbd>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 bg-cocoa-800 hover:bg-cocoa-700 text-cream-200 rounded-md transition-colors border border-cocoa-700"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-cream-200" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-peach-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-cocoa-900 rounded-xl shadow-elevated border border-cream-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-cream-100">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-cocoa-900">
                      <Bell className="w-3.5 h-3.5 text-peach-500" />
                      Notifications ({unreadNotifications.length} unread)
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-peach-600 hover:text-peach-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-cocoa-400 text-center py-4">No notifications</p>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.type === 'order') {
                              setActiveRole('baker');
                              setBakerTab('orders');
                            } else if (n.type === 'inventory') {
                              setActiveRole('baker');
                              setBakerTab('inventory');
                            }
                            setShowNotifications(false);
                          }}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-cream-50 text-cocoa-700' : 'bg-peach-50/70 border border-peach-200/60 text-cocoa-900'
                          } hover:bg-cream-100`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-[11px] text-cocoa-900">{n.title}</span>
                            <span className="text-[10px] text-cocoa-400 whitespace-nowrap">{n.date.split(' ')[1] || n.date}</span>
                          </div>
                          <p className="text-[11px] text-cocoa-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-2 mt-2 border-t border-cream-100 text-center">
                    <button
                      onClick={() => {
                        setActiveRole('baker');
                        setBakerTab('notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs text-peach-600 hover:text-peach-700 font-semibold"
                    >
                      View all notifications & templates →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (window.confirm("Reset all data back to the realistic Bangalore artisan bakery demo? Any custom test changes will be refreshed.")) {
                  resetToDemoData();
                }
              }}
              className="flex items-center gap-1 bg-cocoa-800 hover:bg-cocoa-700 text-cream-300 hover:text-cream-100 px-2.5 py-1 rounded-md text-[11px] transition-colors border border-cocoa-700"
              title="Reset all data to sample home bakery dataset"
            >
              <RotateCcw className="w-3 h-3 text-peach-300" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>

            {/* Main Role Toggle Button */}
            {activeRole === 'baker' ? (
              <button
                onClick={() => setActiveRole('storefront')}
                className="flex items-center gap-1.5 bg-gradient-to-r from-peach-500 to-roseGold-500 hover:from-peach-600 hover:to-roseGold-600 text-white font-semibold px-3 py-1 rounded-md shadow-sm text-xs transition-all transform hover:scale-[1.02]"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Customer Storefront</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveRole('baker')}
                className="flex items-center gap-1.5 bg-cocoa-700 hover:bg-cocoa-600 text-cream-50 font-semibold px-3 py-1 rounded-md shadow-sm text-xs border border-cocoa-600 transition-all transform hover:scale-[1.02]"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-peach-300" />
                <span>Baker Dashboard</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-elevated border border-cream-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Input Header */}
            <div className="p-4 border-b border-cream-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-cocoa-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders (BF-2026-101), products, customers by name or phone..."
                autoFocus
                className="w-full text-sm outline-none text-cocoa-900 placeholder:text-cocoa-400 font-sans"
              />
              <button 
                onClick={() => { setShowSearchModal(false); setSearchQuery(''); }}
                className="p-1 hover:bg-cream-100 rounded-lg text-cocoa-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Body */}
            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              {!searchQuery.trim() ? (
                <div className="py-6 text-center text-xs text-cocoa-400">
                  <p className="font-medium text-cocoa-600">Start typing to search across BakeFlow...</p>
                  <p className="mt-1">Try "Truffle", "Sneha", "BF-2026", "Red Velvet", or "99001"</p>
                </div>
              ) : (
                <>
                  {/* Orders */}
                  {filteredOrders.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-cocoa-500 uppercase tracking-wider mb-2">Orders</h4>
                      <div className="space-y-1.5">
                        {filteredOrders.map(o => (
                          <div
                            key={o.id}
                            onClick={() => {
                              navigateToOrderDetail(o.id);
                              setShowSearchModal(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-peach-50/70 border border-cream-100 hover:border-peach-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div>
                              <span className="font-bold text-cocoa-900">{o.id}</span>
                              <span className="text-cocoa-500 ml-2">· {o.customerName} ({o.customerPhone})</span>
                              <div className="text-[11px] text-cocoa-600 mt-0.5">
                                {o.items.map(i => i.productName).join(', ') || 'Custom Cake Order'}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-cocoa-900">₹{o.totalAmount}</span>
                              <div className="text-[10px] text-peach-600 capitalize">{o.status.replace('_', ' ')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {filteredProducts.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-cocoa-500 uppercase tracking-wider mb-2">Products</h4>
                      <div className="space-y-1.5">
                        {filteredProducts.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              navigateToStorefrontProduct(p.id);
                              setShowSearchModal(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-peach-50/70 border border-cream-100 hover:border-peach-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                              <div>
                                <span className="font-bold text-cocoa-900">{p.name}</span>
                                <div className="text-[10px] text-cocoa-500 capitalize">{p.category} · Starts ₹{p.price}</div>
                              </div>
                            </div>
                            <span className="text-[11px] text-peach-600 font-medium">View in Catalog →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customers */}
                  {filteredCustomers.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-cocoa-500 uppercase tracking-wider mb-2">Customers</h4>
                      <div className="space-y-1.5">
                        {filteredCustomers.map(c => (
                          <div
                            key={c.id}
                            onClick={() => {
                              navigateToCustomerDetail(c.id);
                              setShowSearchModal(false);
                            }}
                            className="p-2.5 rounded-xl hover:bg-peach-50/70 border border-cream-100 hover:border-peach-200 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div>
                              <span className="font-bold text-cocoa-900">{c.name}</span>
                              <span className="text-cocoa-500 ml-2">· {c.phone}</span>
                              <div className="text-[10px] text-cocoa-500 mt-0.5">{c.orderCount} orders · ₹{c.totalSpent} spent</div>
                            </div>
                            <span className="text-[11px] text-peach-600 font-medium">View Profile →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredOrders.length === 0 && filteredProducts.length === 0 && filteredCustomers.length === 0 && (
                    <div className="py-8 text-center text-xs text-cocoa-400">
                      No matching records found for "{searchQuery}".
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-cream-50 px-4 py-2 text-[11px] text-cocoa-400 flex items-center justify-between border-t border-cream-100">
              <span>Press ESC to close</span>
              <span>BakeFlow Universal Search</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
