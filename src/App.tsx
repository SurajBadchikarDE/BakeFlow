import React, { useState } from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { HeaderBanner } from './components/common/HeaderBanner';

// Baker Dashboard Components
import { BakerSidebar } from './components/dashboard/BakerSidebar';
import { BakerTopBar } from './components/dashboard/BakerTopBar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { OrdersPage } from './components/orders/OrdersPage';
import { OrderDetailView } from './components/orders/OrderDetailView';
import { CreateOrderModal } from './components/orders/CreateOrderModal';
import { ProductsPage } from './components/products/ProductsPage';
import { AddProductModal } from './components/products/AddProductModal';
import { RecipesPage } from './components/recipes/RecipesPage';
import { CostCalculatorPage } from './components/recipes/CostCalculatorPage';
import { ProductionBoardPage } from './components/production/ProductionBoardPage';
import { ProductionCalendarPage } from './components/production/ProductionCalendarPage';
import { InventoryPage } from './components/inventory/InventoryPage';
import { CustomersPage } from './components/customers/CustomersPage';
import { CustomerDetailView } from './components/customers/CustomerDetailView';
import { PaymentsPage } from './components/finances/PaymentsPage';
import { InvoicesPage } from './components/finances/InvoicesPage';
import { ExpensesPage } from './components/finances/ExpensesPage';
import { FinancialReportsPage } from './components/finances/FinancialReportsPage';
import { DeliveryPickupPage } from './components/delivery/DeliveryPickupPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { BusinessSettingsPage } from './components/settings/BusinessSettingsPage';
import { OnboardingWizardPage } from './components/onboarding/OnboardingWizardPage';

// Customer Storefront Components
import { StorefrontNavbar } from './components/storefront/StorefrontNavbar';
import { StorefrontHero } from './components/storefront/StorefrontHero';
import { StorefrontCatalog } from './components/storefront/StorefrontCatalog';
import { StorefrontProductDetail } from './components/storefront/StorefrontProductDetail';
import { CustomCakeBuilder } from './components/storefront/CustomCakeBuilder';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderConfirmedView } from './components/storefront/OrderConfirmedView';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';
import { StorefrontFooter } from './components/storefront/StorefrontFooter';

// Auth Modal
import { AuthModal } from './components/auth/AuthModal';

// Home extras (Testimonials & FAQ)
import { Star, ShieldCheck, Heart, Sparkles, HelpCircle } from 'lucide-react';

const StorefrontHomeExtras: React.FC = () => {
  const { setStorefrontTab } = useBakery();

  const testimonials = [
    {
      name: "Radhika Kulkarni",
      role: "Indiranagar, Bangalore",
      comment: "Chef Ananya made our daughter's 1st birthday so memorable! The 2-tier Belgian Chocolate cake was not only a showstopper but tasted heavenly. The ganache was so silky and not overly sweet.",
      rating: 5,
      cake: "2-Tier Truffle Cake"
    },
    {
      name: "Karan Singhal",
      role: "HSR Layout, Bangalore",
      comment: "We order the Fudgy Walnut Brownies for every office celebration. Hands down the best brownies in Bengaluru—dense, crackly top, and loaded with Kashmiri walnuts.",
      rating: 5,
      cake: "Belgian Walnut Brownies"
    },
    {
      name: "Pooja & Siddharth",
      role: "Bellandur, Bangalore",
      comment: "The Custom Cake Builder on the website is brilliant. We customized our anniversary cake down to the exact color palette and flowers. Arrived right on time in an AC cab safely!",
      rating: 5,
      cake: "Lotus Biscoff Dream Cake"
    }
  ];

  const faqs = [
    {
      q: "How much advance notice do I need to place an order?",
      a: "Standard cakes and brownie boxes require 24 hours advance notice. Multi-tier or sculpted custom cakes require a minimum of 3 days so we can source fresh flowers and handcraft figurines."
    },
    {
      q: "Do you offer 100% vegetarian / eggless options?",
      a: "Yes! Over 80% of our menu is available in 100% pure vegetarian (eggless) preparations. We use premium dairy whipping cream, yogurt and condensed milk emulsions to keep the sponge ultra moist."
    },
    {
      q: "How does delivery work in Bangalore?",
      a: "We deliver across Bengaluru via air-conditioned delivery cabs (Dunzo / Porter) with specialized cake holders to ensure your delicate cake arrives in pristine condition."
    },
    {
      q: "What payment methods are supported?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm), Direct Bank Transfer, and Card payments. For custom orders, you can pay a 50% advance deposit to lock your date and clear the balance upon delivery."
    }
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Featured Catalog Preview */}
      <StorefrontCatalog />

      {/* Testimonials */}
      <section className="bg-cream-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-cream-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-peach-600">
              Celebration Stories
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cocoa-900">
              Loved by 500+ Dessert Enthusiasts in Bangalore
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-cocoa-700 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>
                <div className="pt-3 border-t border-cream-100">
                  <span className="font-bold text-xs text-cocoa-900 block">{t.name}</span>
                  <span className="text-[10px] text-cocoa-400 block">{t.role} · Ordered {t.cake}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-peach-600">Got Questions?</span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cocoa-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft space-y-1.5 text-xs">
              <h3 className="font-bold text-cocoa-900 text-sm">{faq.q}</h3>
              <p className="text-cocoa-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { 
    activeRole, 
    bakerTab, 
    storefrontTab, 
    setBakerTab 
  } = useBakery();

  // Modal controls
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A1510] font-sans">
      
      {/* Universal Top Header Banner */}
      <HeaderBanner />

      {activeRole === 'baker' ? (
        /* BAKER DASHBOARD EXPERIENCE */
        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* Sidebar */}
          <BakerSidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />

          {/* Main Baker Content View */}
          <div className="flex-1 flex flex-col min-w-0">
            
            <BakerTopBar 
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onOpenNewOrder={() => setIsNewOrderOpen(true)}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            />

            <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
              {bakerTab === 'dashboard' && (
                <DashboardOverview 
                  onOpenNewOrder={() => setIsNewOrderOpen(true)}
                  onOpenAddProduct={() => setIsAddProductOpen(true)}
                  onOpenAddExpense={() => setIsAddExpenseOpen(true)}
                />
              )}
              {bakerTab === 'orders' && (
                <OrdersPage onOpenNewOrder={() => setIsNewOrderOpen(true)} />
              )}
              {bakerTab === 'order_detail' && <OrderDetailView />}
              {bakerTab === 'new_order' && (
                <div className="py-4">
                  <CreateOrderModal 
                    isOpen={true} 
                    onClose={() => setBakerTab('orders')} 
                  />
                </div>
              )}
              {bakerTab === 'production_board' && <ProductionBoardPage />}
              {bakerTab === 'production_calendar' && <ProductionCalendarPage />}
              {bakerTab === 'products' && (
                <ProductsPage onOpenAddProduct={() => setIsAddProductOpen(true)} />
              )}
              {bakerTab === 'recipes' && <RecipesPage />}
              {bakerTab === 'cost_calculator' && <CostCalculatorPage />}
              {bakerTab === 'inventory' && <InventoryPage />}
              {bakerTab === 'customers' && <CustomersPage />}
              {bakerTab === 'customer_detail' && <CustomerDetailView />}
              {bakerTab === 'payments' && <PaymentsPage />}
              {bakerTab === 'invoices' && <InvoicesPage />}
              {bakerTab === 'expenses' && <ExpensesPage onOpenAddExpense={() => setIsAddExpenseOpen(true)} />}
              {bakerTab === 'reports' && <FinancialReportsPage />}
              {bakerTab === 'delivery' && <DeliveryPickupPage />}
              {bakerTab === 'notifications' && <NotificationsPage />}
              {bakerTab === 'settings' && <BusinessSettingsPage />}
              {bakerTab === 'onboarding' && <OnboardingWizardPage />}
            </main>

          </div>

        </div>
      ) : (
        /* CUSTOMER STOREFRONT EXPERIENCE */
        <div className="flex-1 flex flex-col">
          
          <StorefrontNavbar onOpenCart={() => setIsCartOpen(true)} />

          <main className="flex-1">
            {storefrontTab === 'home' && (
              <>
                <StorefrontHero />
                <StorefrontHomeExtras />
              </>
            )}
            {storefrontTab === 'catalog' && (
              <div className="py-6">
                <StorefrontCatalog />
              </div>
            )}
            {storefrontTab === 'product_detail' && (
              <StorefrontProductDetail onOpenCart={() => setIsCartOpen(true)} />
            )}
            {storefrontTab === 'custom_cake' && <CustomCakeBuilder />}
            {storefrontTab === 'order_confirmed' && <OrderConfirmedView />}
            {storefrontTab === 'order_track' && <OrderTrackingView />}
          </main>

          <StorefrontFooter />

        </div>
      )}

      {/* Global Modals */}
      <CreateOrderModal 
        isOpen={isNewOrderOpen} 
        onClose={() => setIsNewOrderOpen(false)} 
      />

      <AddProductModal 
        isOpen={isAddProductOpen} 
        onClose={() => setIsAddProductOpen(false)} 
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <AppContent />
    </BakeryProvider>
  );
}
