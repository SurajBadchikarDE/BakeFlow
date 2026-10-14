import React from 'react';
import { useBakery, StorefrontTab } from '../../context/BakeryContext';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  MapPin, 
  Phone, 
  LayoutDashboard, 
  Clock, 
  Heart,
  Menu,
  X
} from 'lucide-react';

interface StorefrontNavbarProps {
  onOpenCart: () => void;
}

export const StorefrontNavbar: React.FC<StorefrontNavbarProps> = ({ onOpenCart }) => {
  const { 
    settings, 
    cart, 
    cartTotal, 
    storefrontTab, 
    setStorefrontTab, 
    setActiveRole 
  } = useBakery();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { id: StorefrontTab; label: string; badge?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Menu & Bakes' },
    { id: 'custom_cake', label: 'Custom Cake Builder', badge: 'Bespoke' },
    { id: 'order_track', label: 'Track Order' },
  ];

  const handleNavClick = (tab: StorefrontTab) => {
    setStorefrontTab(tab);
    setMobileMenuOpen(false);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-cream-200 sticky top-[38px] z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={settings.logoUrl} 
              alt={settings.businessName}
              className="w-10 h-10 rounded-full object-cover border-2 border-peach-200 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-serif font-bold text-base md:text-lg text-cocoa-900 group-hover:text-peach-700 transition-colors leading-tight block">
                {settings.businessName}
              </span>
              <span className="text-[10px] text-cocoa-400 hidden sm:block tracking-wide">
                Indiranagar, Bengaluru · By {settings.bakerName}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = storefrontTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-peach-600 bg-peach-50/80 font-bold'
                      : 'text-cocoa-700 hover:text-cocoa-900 hover:bg-cream-100/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] bg-peach-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons: Cart & Baker Mode */}
          <div className="flex items-center gap-2.5">
            
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 transition-all shadow-soft transform hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4 text-peach-300" />
              <span className="font-bold text-xs hidden sm:inline">
                {totalCartCount > 0 ? `₹${cartTotal}` : 'Cart'}
              </span>
              {totalCartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-peach-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Switch to Baker Admin */}
            <button
              onClick={() => setActiveRole('baker')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-cocoa-800 text-xs font-semibold border border-cream-300 transition-colors"
              title="Return to Baker Management Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cocoa-600" />
              <span>Baker Admin</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-cream-300 text-cocoa-700 hover:bg-cream-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                storefrontTab === link.id ? 'bg-peach-50 text-peach-700 font-bold' : 'text-cocoa-700 hover:bg-cream-100'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[9px] bg-peach-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {link.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-2 border-t border-cream-100">
            <button
              onClick={() => {
                setActiveRole('baker');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-cocoa-700 hover:bg-cream-100 rounded-xl flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-peach-600" />
              <span>Switch to Baker Admin Workspace</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
