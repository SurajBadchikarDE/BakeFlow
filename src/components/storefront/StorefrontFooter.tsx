import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

export const StorefrontFooter: React.FC = () => {
  const { settings, setActiveRole, setStorefrontTab } = useBakery();

  return (
    <footer className="bg-cocoa-950 text-cream-200 text-xs border-t border-cocoa-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand & Chef Bio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={settings.logoUrl} 
                alt={settings.businessName}
                className="w-12 h-12 rounded-full object-cover border-2 border-peach-400"
              />
              <div>
                <span className="font-serif font-bold text-lg text-white block leading-tight">
                  {settings.businessName}
                </span>
                <span className="text-[11px] text-peach-300">
                  {settings.tagline}
                </span>
              </div>
            </div>

            <p className="text-cocoa-300 leading-relaxed text-xs">
              {settings.aboutStory}
            </p>

            <div className="flex items-center gap-2 pt-1 text-peach-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instagram: {settings.instagramHandle}</span>
            </div>
          </div>

          {/* Studio Location & Timings (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Studio & Collection Hours
            </h4>

            <div className="space-y-2 text-cocoa-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-peach-400 shrink-0 mt-0.5" />
                <span>{settings.pickupAddress}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-peach-400 shrink-0" />
                <span>Pickup Slots: 10:00 AM – 08:30 PM (Mon – Sun)</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-peach-400 shrink-0" />
                <span>WhatsApp: {settings.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-peach-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Explore & Policies
            </h4>

            <ul className="space-y-1.5 text-cocoa-300">
              <li>
                <button onClick={() => setStorefrontTab('catalog')} className="hover:text-peach-300 transition-colors">
                  Full Menu & Bestsellers
                </button>
              </li>
              <li>
                <button onClick={() => setStorefrontTab('custom_cake')} className="hover:text-peach-300 transition-colors">
                  Custom Cake Builder
                </button>
              </li>
              <li>
                <button onClick={() => setStorefrontTab('order_track')} className="hover:text-peach-300 transition-colors">
                  Track Existing Order
                </button>
              </li>
              <li className="pt-2">
                <button 
                  onClick={() => setActiveRole('baker')}
                  className="px-3 py-1.5 bg-cocoa-800 hover:bg-cocoa-700 text-peach-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-cocoa-700 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Baker Admin Workspace</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-cocoa-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-cocoa-400 text-[11px]">
          <p>© 2026 {settings.businessName}. Powered by BakeFlow Platform.</p>
          <div className="flex items-center gap-4">
            <span>Handmade with 100% Pure Butter & Callebaut Chocolate</span>
            <span>·</span>
            <span className="text-peach-400 font-semibold">Indiranagar, Bengaluru</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
