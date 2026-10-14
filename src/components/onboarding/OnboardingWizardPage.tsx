import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Store, 
  MapPin, 
  CreditCard, 
  Cake, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

export const OnboardingWizardPage: React.FC = () => {
  const { settings, updateSettings, setBakerTab, setActiveRole } = useBakery();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [bakerName, setBakerName] = useState(settings.bakerName);
  const [phone, setPhone] = useState(settings.phone);
  const [pickupAddress, setPickupAddress] = useState(settings.pickupAddress);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [minNoticeHours, setMinNoticeHours] = useState(settings.minNoticeHours);
  const [leadTimeDaysCustomCake, setLeadTimeDaysCustomCake] = useState(settings.leadTimeDaysCustomCake);
  const [acceptCustomOrders, setAcceptCustomOrders] = useState(settings.acceptCustomOrders);

  const handleFinish = () => {
    updateSettings({
      businessName,
      tagline,
      bakerName,
      phone,
      pickupAddress,
      upiId,
      minNoticeHours: Number(minNoticeHours),
      leadTimeDaysCustomCake: Number(leadTimeDaysCustomCake),
      acceptCustomOrders
    });

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setBakerTab('dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-peach-600" />
          <span>Baker Onboarding Setup</span>
        </div>
        <h2 className="font-serif font-bold text-2xl text-cocoa-900">
          Welcome to BakeFlow, Chef! 🎂
        </h2>
        <p className="text-xs text-cocoa-500 max-w-lg mx-auto">
          Let's set up your home bakery business profile in 4 quick steps to start taking online orders and managing daily production.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { num: 1, label: 'Identity' },
          { num: 2, label: 'Pickup & Delivery' },
          { num: 3, label: 'Payments' },
          { num: 4, label: 'Launch' },
        ].map(step => (
          <div 
            key={step.num}
            onClick={() => setCurrentStep(step.num)}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              currentStep === step.num 
                ? 'bg-cocoa-900 text-cream-50 border-cocoa-900 shadow-soft font-bold' 
                : currentStep > step.num
                ? 'bg-cream-100 text-cocoa-800 border-cream-300 font-semibold'
                : 'bg-white text-cocoa-400 border-cream-200 opacity-60'
            }`}
          >
            <span className="block text-[10px] uppercase">Step {step.num}</span>
            <span className="text-xs truncate block">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Step Card Body */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8 shadow-card space-y-6">
        
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
              <Store className="w-4 h-4 text-peach-500" />
              <span>Step 1: Bakery Identity & Contact</span>
            </h3>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Bakery Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Vanilla & Cocoa Artisan Bakes"
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 text-sm font-sans"
              />
            </div>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Tagline / Speciality</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Handcrafted Luxury Cakes & French Patisserie"
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Baker / Chef Name</label>
                <input
                  type="text"
                  value={bakerName}
                  onChange={(e) => setBakerName(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">WhatsApp / Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-peach-500" />
              <span>Step 2: Studio Pickup Address & Lead Times</span>
            </h3>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Pickup Studio Address</label>
              <textarea
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                rows={3}
                placeholder="Street address where customers come to pick up their cakes"
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Minimum Advance Notice (Hours)</label>
                <input
                  type="number"
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
                />
                <span className="text-[10px] text-cocoa-400 mt-0.5 block">Standard notice for menu items (e.g. 24h)</span>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Custom Cake Lead Time (Days)</label>
                <input
                  type="number"
                  value={leadTimeDaysCustomCake}
                  onChange={(e) => setLeadTimeDaysCustomCake(Number(e.target.value))}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
                />
                <span className="text-[10px] text-cocoa-400 mt-0.5 block">Days needed for themed/tier cakes (e.g. 3 days)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-peach-500" />
              <span>Step 3: UPI Payment Collection & Invoices</span>
            </h3>

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Official UPI ID (GPay / PhonePe / Paytm) *</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. ananya.baker@okaxis"
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-mono font-bold text-sm"
              />
              <span className="text-[10px] text-cocoa-400 mt-1 block">
                Customers will be presented with this UPI ID on checkout to pay advance deposits.
              </span>
            </div>

            <div className="bg-cream-50 p-3.5 rounded-xl border border-cream-200 space-y-2">
              <span className="font-bold text-cocoa-800 block text-xs">Default Ordering Policy</span>
              <p className="text-cocoa-600 text-[11px] leading-relaxed">
                By default, BakeFlow allows customers to either pay 50% advance deposit or 100% full payment upon placing orders online. Orders remain in "Pending Review" until you verify UPI receipt.
              </p>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs animate-in fade-in duration-200">
            <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
              <Cake className="w-4 h-4 text-peach-500" />
              <span>Step 4: Custom Cake Builder & Storefront Ready!</span>
            </h3>

            <div className="p-4 bg-peach-50 rounded-xl border border-peach-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptCustomOrders}
                  onChange={(e) => setAcceptCustomOrders(e.target.checked)}
                  className="rounded text-peach-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-cocoa-900 block text-sm">
                    Accept Bespoke Custom Cake Orders
                  </span>
                  <span className="text-[11px] text-cocoa-600">
                    Enable the 8-step interactive 3D/thematic cake builder on your customer storefront.
                  </span>
                </div>
              </label>
            </div>

            <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Everything is ready to launch!</span>
              </div>
              <p className="text-cocoa-600 text-xs">
                Your menu catalog is populated with 8 bestseller bakes, recipes, and live inventory. You can customize them anytime in the Baker Admin Workspace.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft transition-colors"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4 text-peach-300" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-peach-500 to-roseGold-500 hover:from-peach-600 hover:to-roseGold-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Setup & Open Dashboard</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
