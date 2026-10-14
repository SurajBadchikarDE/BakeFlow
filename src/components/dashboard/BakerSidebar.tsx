import React from 'react';
import { useBakery, BakerTab } from '../../context/BakeryContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Cake, 
  BookOpen, 
  Calculator, 
  Calendar, 
  Columns, 
  Package, 
  Users, 
  CreditCard, 
  FileText, 
  Receipt, 
  BarChart3, 
  Truck, 
  Bell, 
  Settings, 
  Sparkles,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface SidebarItem {
  id: BakerTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  isAction?: boolean;
}

export const BakerSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    bakerTab, 
    setBakerTab, 
    orders, 
    ingredients, 
    notifications,
    settings,
    setActiveRole
  } = useBakery();

  // Compute live badges
  const pendingOrdersCount = orders.filter(o => o.status === 'new' || o.status === 'pending_confirmation').length;
  const inKitchenCount = orders.filter(o => o.status === 'baking' || o.status === 'decorating' || o.status === 'in_preparation').length;
  const lowStockCount = ingredients.filter(i => i.currentStock <= i.minThreshold).length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navGroups: { group: string; items: SidebarItem[] }[] = [
    {
      group: "Core Kitchen & Orders",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { 
          id: 'orders', 
          label: 'Order Management', 
          icon: ShoppingBag, 
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: 'bg-peach-500 text-white'
        },
        { id: 'new_order', label: 'Create New Order', icon: PlusCircle, isAction: true },
        { 
          id: 'production_board', 
          label: 'Production Kanban', 
          icon: Columns, 
          badge: inKitchenCount > 0 ? `${inKitchenCount} active` : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { id: 'production_calendar', label: 'Baking Schedule', icon: Calendar },
      ]
    },
    {
      group: "Catalog & Recipes",
      items: [
        { id: 'products', label: 'Products & Menu', icon: Cake },
        { id: 'recipes', label: 'Recipes & Yield', icon: BookOpen },
        { id: 'cost_calculator', label: 'Cost Calculator', icon: Calculator },
        { 
          id: 'inventory', 
          label: 'Ingredient Stock', 
          icon: Package, 
          badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
          badgeColor: 'bg-red-100 text-red-700'
        },
      ]
    },
    {
      group: "Finances & Customers",
      items: [
        { id: 'customers', label: 'Customer CRM', icon: Users },
        { id: 'payments', label: 'Payment Ledger', icon: CreditCard },
        { id: 'invoices', label: 'Invoices & Receipts', icon: FileText },
        { id: 'expenses', label: 'Expenses Tracker', icon: Receipt },
        { id: 'reports', label: 'Financial Analytics', icon: BarChart3 },
      ]
    },
    {
      group: "Operations & Setup",
      items: [
        { id: 'delivery', label: 'Delivery & Pickup', icon: Truck },
        { 
          id: 'notifications', 
          label: 'WhatsApp & Alerts', 
          icon: Bell, 
          badge: unreadNotifs > 0 ? unreadNotifs : undefined,
          badgeColor: 'bg-peach-500 text-white'
        },
        { id: 'settings', label: 'Business Settings', icon: Settings },
        { id: 'onboarding', label: 'Onboarding Wizard', icon: Sparkles },
      ]
    }
  ];

  const handleSelectTab = (tab: BakerTab) => {
    setBakerTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-cocoa-950/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[38px] left-0 z-40 h-[100dvh] lg:h-[calc(100vh-38px)]
        w-64 bg-cream-50/90 backdrop-blur-md border-r border-cream-200/80
        flex flex-col transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Bakery Header Profile */}
        <div className="p-4 border-b border-cream-200/60 bg-white/50">
          <div className="flex items-center gap-3">
            <img 
              src={settings.logoUrl} 
              alt={settings.businessName}
              className="w-10 h-10 rounded-xl object-cover shadow-xs border border-cream-300"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-serif font-bold text-sm text-cocoa-900 truncate leading-snug">
                {settings.businessName}
              </h2>
              <p className="text-[11px] text-cocoa-600 truncate">
                {settings.bakerName}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] bg-cream-100/80 px-2.5 py-1.5 rounded-lg border border-cream-200">
            <span className="text-cocoa-600 font-medium">Kitchen Status:</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Accepting Orders
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-cocoa-400 px-3 mb-1">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = bakerTab === item.id || 
                    (item.id === 'orders' && bakerTab === 'order_detail') ||
                    (item.id === 'customers' && bakerTab === 'customer_detail');

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSelectTab(item.id)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all
                          ${isActive 
                            ? 'bg-cocoa-900 text-cream-50 shadow-soft font-semibold' 
                            : item.isAction
                            ? 'text-peach-700 hover:bg-peach-100/70'
                            : 'text-cocoa-700 hover:bg-cream-100/90 hover:text-cocoa-900'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-peach-300' : item.isAction ? 'text-peach-600' : 'text-cocoa-500'}`} />
                          <span>{item.label}</span>
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${item.badgeColor || 'bg-cream-200 text-cocoa-700'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Storefront Preview Link */}
        <div className="p-3 border-t border-cream-200/80 bg-white/40">
          <button
            onClick={() => setActiveRole('storefront')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-cocoa-800 bg-peach-50 hover:bg-peach-100 rounded-xl border border-peach-200 transition-colors"
          >
            <span className="flex items-center gap-2 text-peach-800">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Storefront</span>
            </span>
            <span className="text-[10px] bg-peach-200 text-peach-900 px-1.5 py-0.5 rounded font-mono">
              Live
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
