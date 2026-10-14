import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Heart, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export const StorefrontHero: React.FC = () => {
  const { settings, setStorefrontTab } = useBakery();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100/80 via-cream-50 to-white py-12 md:py-20 border-b border-cream-200">
      
      {/* Decorative Warm Bakery Blur Spots */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-peach-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-roseGold-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-peach-100/90 border border-peach-200/80 text-peach-900 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-peach-600 animate-spin" />
              <span>Bangalore's Finest Handcrafted Home Bakery</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-cocoa-900 leading-[1.15] tracking-tight">
              Luxury Artisanal Cakes & French Patisserie,{' '}
              <span className="italic font-normal text-peach-600 underline decoration-peach-300 decoration-wavy decoration-1 underline-offset-8">
                Made for Magic.
              </span>
            </h1>

            <p className="text-sm md:text-base text-cocoa-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Every creation is freshly baked to order using 100% pure butter, genuine Callebaut Belgian chocolate, and Madagascar bourbon vanilla. Zero preservatives, 100% handcrafted love.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setStorefrontTab('catalog')}
                className="w-full sm:w-auto px-6 py-3.5 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-sm font-bold shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span>Explore Bestsellers Menu</span>
                <ArrowRight className="w-4 h-4 text-peach-300" />
              </button>

              <button
                onClick={() => setStorefrontTab('custom_cake')}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-peach-500 to-roseGold-500 hover:from-peach-600 hover:to-roseGold-600 text-white rounded-xl text-sm font-bold shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Bespoke Custom Cake</span>
              </button>
            </div>

            {/* Social Proof & Trust Badges */}
            <div className="pt-4 border-t border-cream-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-cocoa-700">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-cocoa-900">4.9/5.0</span>
                <span className="text-cocoa-400">(320+ Happy Celebrations)</span>
              </div>

              <span className="hidden sm:inline text-cream-300">|</span>

              <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Eggless Options</span>
              </div>

              <span className="hidden sm:inline text-cream-300">|</span>

              <div className="flex items-center gap-1 text-cocoa-600 font-semibold">
                <Clock className="w-4 h-4 text-peach-500" />
                <span>Same-Day & Scheduled Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Visual Image Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Showcase Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=80"
                  alt="Belgian Chocolate Truffle Cake"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                
                {/* Floating Price Tag */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-cream-200">
                  <span className="text-[10px] uppercase font-bold text-peach-600 block">Chef's Signature</span>
                  <span className="font-serif font-bold text-sm text-cocoa-900">Belgian Chocolate Truffle Cake</span>
                  <span className="text-xs font-bold text-cocoa-800 block mt-0.5">Starts ₹850</span>
                </div>
              </div>

              {/* Secondary Floating Card */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-elevated border border-cream-200 max-w-[200px] hidden sm:block animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍓</span>
                  <div>
                    <span className="font-bold text-xs text-cocoa-900 block leading-tight">Korean Bento Cakes</span>
                    <span className="text-[10px] text-peach-600 font-semibold">Only ₹499</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
