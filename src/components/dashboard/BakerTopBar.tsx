import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Menu, 
  PlusCircle, 
  PackagePlus, 
  Receipt, 
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';

interface BakerTopBarProps {
  onToggleSidebar: () => void;
  onOpenNewOrder: () => void;
  onOpenAddProduct: () => void;
  onOpenAddExpense: () => void;
}

export const BakerTopBar: React.FC<BakerTopBarProps> = ({
  onToggleSidebar,
  onOpenNewOrder,
  onOpenAddProduct,
  onOpenAddExpense
}) => {
  const { bakerTab, exportToCsv, setBakerTab } = useBakery();

  const getPageTitle = () => {
    switch (bakerTab) {
      case 'dashboard': return { title: "Bakery Operations Overview", subtitle: "Real-time kitchen orders, baking schedule & financial metrics" };
      case 'orders': return { title: "Order Management", subtitle: "Track, confirm, prepare, and dispatch orders" };
      case 'order_detail': return { title: "Order Details & Fulfillment", subtitle: "Status workflow, payment ledger & customer communications" };
      case 'new_order': return { title: "Create Walk-in / Direct Order", subtitle: "Manually log a custom or standard order" };
      case 'production_board': return { title: "Kitchen Production Board", subtitle: "Visual Kanban workflow from sponge preparation to packaging" };
      case 'production_calendar': return { title: "Baking & Delivery Calendar", subtitle: "Daily, weekly and monthly fulfillment schedule" };
      case 'products': return { title: "Product & Menu Catalog", subtitle: "Manage pastry offerings, sizes, pricing and inventory links" };
      case 'recipes': return { title: "Recipe & Batch Management", subtitle: "Ingredients scaling, yield calculator and baking procedures" };
      case 'cost_calculator': return { title: "Cake Cost & Profit Margin Calculator", subtitle: "Calculate ingredient cost, labor, overheads and retail price" };
      case 'inventory': return { title: "Ingredient & Stock Inventory", subtitle: "Track stocks, thresholds, costs, and generate shopping lists" };
      case 'customers': return { title: "Customer Relationship Management", subtitle: "Customer profiles, order frequency, preferences and tags" };
      case 'customer_detail': return { title: "Customer Profile & History", subtitle: "Lifetime spend, past orders, and custom notes" };
      case 'payments': return { title: "Payment Ledger & Transactions", subtitle: "UPI, cash, bank transfer logs, advances and balances" };
      case 'invoices': return { title: "Invoices & GST Receipts", subtitle: "Generate, preview and print professional receipts" };
      case 'expenses': return { title: "Bakery Expense Tracker", subtitle: "Log raw materials, electricity, packaging and marketing costs" };
      case 'reports': return { title: "Financial Reports & Business Analytics", subtitle: "Gross sales, COGS, net profit margin and bestselling treats" };
      case 'delivery': return { title: "Delivery & Pickup Logistics", subtitle: "Pickup time slots, delivery zones, driver assignments" };
      case 'notifications': return { title: "WhatsApp Templates & Alerts", subtitle: "Instant customer WhatsApp notification templates and alerts" };
      case 'settings': return { title: "Bakery Settings & Brand Profile", subtitle: "Configure store details, lead time, UPI ID and tax rates" };
      case 'onboarding': return { title: "Baker Onboarding Wizard", subtitle: "4-step quick launch setup for your home baking business" };
      default: return { title: "Baker Admin", subtitle: "" };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-cream-200/80 px-4 lg:px-6 py-3.5 sticky top-[38px] z-30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Title & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg border border-cream-300 text-cocoa-700 hover:bg-cream-100"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif font-bold text-lg md:text-xl text-cocoa-900 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-cocoa-500 hidden sm:block mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Quick Expense */}
          <button
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold border border-cream-300 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-cocoa-600" />
            <span className="hidden md:inline">+ Expense</span>
          </button>

          {/* Quick Product */}
          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold border border-cream-300 transition-colors"
          >
            <PackagePlus className="w-3.5 h-3.5 text-cocoa-600" />
            <span className="hidden md:inline">+ Product</span>
          </button>

          {/* Export button based on context */}
          {(bakerTab === 'orders' || bakerTab === 'inventory' || bakerTab === 'customers' || bakerTab === 'expenses') && (
            <button
              onClick={() => {
                if (bakerTab === 'orders') exportToCsv('orders');
                else if (bakerTab === 'inventory') exportToCsv('inventory');
                else if (bakerTab === 'customers') exportToCsv('customers');
                else if (bakerTab === 'expenses') exportToCsv('expenses');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl text-xs font-medium border border-cream-300 transition-colors"
              title="Export current view data as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}

          {/* Create Order Primary Action */}
          <button
            onClick={onOpenNewOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-semibold shadow-soft hover:shadow-card transition-all transform active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-peach-300" />
            <span>+ New Order</span>
          </button>

        </div>

      </div>
    </header>
  );
};
