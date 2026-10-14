import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Upload, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle,
  Cake,
  Palette,
  Heart
} from 'lucide-react';

export const CustomCakeBuilder: React.FC = () => {
  const { 
    settings, 
    createOrder, 
    setStorefrontTab, 
    setLastConfirmedOrderId 
  } = useBakery();

  const [step, setStep] = useState(1);

  // Step 1: Type & Occasion
  const [cakeType, setCakeType] = useState('Tiered Designer Cake');
  const [occasion, setOccasion] = useState('Birthday Celebration');

  // Step 2: Size & Servings
  const [servings, setServings] = useState(18);
  const [tierCount, setTierCount] = useState(1);

  // Step 3: Flavors, Fillings & Frosting
  const [flavor, setFlavor] = useState('Belgian Dark Chocolate Ganache');
  const [filling, setFilling] = useState('Nutella & Roasted Hazelnuts');
  const [frosting, setFrosting] = useState('Smooth Semi-Fondant & Buttercream');
  const [isEggless, setIsEggless] = useState(true);

  // Step 4: Theme, Colors & Decorations
  const [themeName, setThemeName] = useState('Floral Botanical & Pastel Gold');
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([
    'Handmade French Macarons',
    'Edible 24K Gold Leaf Flakes'
  ]);

  // Step 5: Inscription & Notes
  const [inscription, setInscription] = useState('Happy Birthday Sneha!');
  const [specialNotes, setSpecialNotes] = useState('Less sweet cream, pastel blush pink and ivory aesthetic.');
  const [allergyNotice, setAllergyNotice] = useState('Eggless only');

  // Step 6: Reference Photo
  const [referencePhotoUrl, setReferencePhotoUrl] = useState(
    'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80'
  );

  // Step 7: Delivery or Pickup & Date
  const minCustomDate = new Date(Date.now() + (settings.leadTimeDaysCustomCake * 86400000))
    .toISOString().split('T')[0];

  const [requestedDate, setRequestedDate] = useState(minCustomDate);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(settings.pickupTimeSlots[0] || '12:00 PM - 02:30 PM');

  // Customer Contact Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Decoration options with incremental prices
  const decorationOptions = [
    { name: 'Handmade French Macarons', price: 250 },
    { name: 'Edible 24K Gold Leaf Flakes', price: 180 },
    { name: 'Fresh Organic Floral Bouquet', price: 350 },
    { name: 'Custom Acrylic Calligraphy Charm', price: 200 },
    { name: 'Hand-sculpted Fondant Figurine', price: 450 },
    { name: 'Glitter Drip & Sprinkles', price: 120 }
  ];

  // Dynamic Price Calculation
  let basePrice = 1200; // Base for 1kg
  if (servings > 12) basePrice += (servings - 12) * 90;
  if (tierCount === 2) basePrice += 600;
  if (tierCount === 3) basePrice += 1400;

  const decoTotal = selectedDecorations.reduce((sum, d) => {
    const found = decorationOptions.find(o => o.name === d);
    return sum + (found ? found.price : 0);
  }, 0);

  const estimatedSubtotal = basePrice + decoTotal;
  const estimatedTax = Math.round(estimatedSubtotal * (settings.taxRatePercent / 100));
  const estimatedTotal = estimatedSubtotal + estimatedTax;

  const toggleDecoration = (deco: string) => {
    if (selectedDecorations.includes(deco)) {
      setSelectedDecorations(selectedDecorations.filter(d => d !== deco));
    } else {
      setSelectedDecorations([...selectedDecorations, deco]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Please enter your name and phone number so the baker can contact you.");
      return;
    }

    const order = createOrder({
      customerName,
      customerPhone,
      customerEmail,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
      deliveryTimeSlot,
      requestedDate,
      items: [],
      customCakeDetails: {
        cakeType,
        occasion,
        servings,
        sizeWeight: `${(servings * 0.1).toFixed(1)} kg (${tierCount}-Tier)`,
        flavor,
        filling,
        frosting,
        themeColors: themeName,
        decorations: selectedDecorations,
        inscription,
        allergies: allergyNotice,
        referenceImages: referencePhotoUrl ? [referencePhotoUrl] : [],
        estimatedCost: estimatedSubtotal
      },
      subtotal: estimatedSubtotal,
      customizationCharges: decoTotal,
      deliveryFee: deliveryType === 'delivery' ? 120 : 0,
      discount: 0,
      tax: estimatedTax,
      advancePaid: 0,
      status: 'pending_confirmation',
      allergyNotes: allergyNotice,
      internalBakerNotes: `Custom cake inquiry submitted via online builder. Date: ${requestedDate}.`
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setLastConfirmedOrderId(order.id);
    setStorefrontTab('order_confirmed');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-peach-600" />
          <span>Bespoke Confection Studio</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-cocoa-900">
          Design Your Dream Celebration Cake
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-500 max-w-lg mx-auto">
          Customize every layer, flavor, theme and decoration. Instant live price estimate with direct baker quote confirmation.
        </p>
      </div>

      {/* 8-Step Stepper Strip */}
      <div className="bg-white rounded-2xl border border-cream-200 p-3 shadow-soft overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] text-xs">
          {[
            { num: 1, label: 'Occasion' },
            { num: 2, label: 'Size' },
            { num: 3, label: 'Flavors' },
            { num: 4, label: 'Theme' },
            { num: 5, label: 'Message' },
            { num: 6, label: 'Photos' },
            { num: 7, label: 'Schedule' },
            { num: 8, label: 'Review' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold transition-all ${
                step === s.num
                  ? 'bg-peach-500 text-white shadow-xs'
                  : step > s.num
                  ? 'bg-cream-100 text-cocoa-700'
                  : 'text-cocoa-400 opacity-60'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">
                {s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Steps (7 cols) & Live Estimation Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Container (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-cream-200 shadow-card p-6 md:p-8 space-y-6">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 1: Cake Type & Occasion
              </h3>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1.5">What is the celebration?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Birthday Celebration', 'Wedding & Reception', 'Milestone Anniversary', 'Baby Shower', 'Farewell / Graduation', 'Corporate Celebration'].map(occ => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                        occasion === occ ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' : 'bg-cream-50/50 border-cream-200 text-cocoa-800'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1.5">Select Cake Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Tiered Designer Cake', 'Semi-Naked Floral Cake', 'Sculpted Fondant 3D Cake', 'Korean Aesthetic Bento Style', 'Mirror Glaze Modern Cake'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCakeType(type)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                        cakeType === type ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' : 'bg-cream-50/50 border-cream-200 text-cocoa-800'
                      }`}
                    >
                      <span className="font-bold block">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 2: Guest Count, Size & Tiers
              </h3>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1.5">
                  How many guests will be served? ({servings} Persons)
                </label>
                <input
                  type="range"
                  min="6"
                  max="50"
                  step="2"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full accent-peach-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-cocoa-400 mt-1">
                  <span>Intimate (6-10 pax)</span>
                  <span>Party (18-25 pax)</span>
                  <span>Grand Feast (35-50 pax)</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1.5">Number of Tiers</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 1, label: 'Single Tier', desc: 'Up to 15 pax' },
                    { count: 2, label: '2-Tier Grand', desc: '15 to 30 pax (+₹600)' },
                    { count: 3, label: '3-Tier Royal', desc: '30+ pax (+₹1400)' },
                  ].map(t => (
                    <button
                      key={t.count}
                      type="button"
                      onClick={() => setTierCount(t.count)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        tierCount === t.count ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs font-bold' : 'bg-cream-50/50 border-cream-200 text-cocoa-800'
                      }`}
                    >
                      <span className="block font-bold">{t.label}</span>
                      <span className="text-[10px] text-cocoa-500 mt-0.5 block">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 3: Flavors, Fillings & Frosting
              </h3>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1.5">Sponge Flavor</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Belgian Dark Chocolate Ganache',
                    'Classic Red Velvet with Cream Cheese',
                    'Lotus Biscoff Caramel Swirl',
                    'Madagascar Vanilla Bean & Berry',
                    'Fresh Alphonso Mango Passion (Seasonal)',
                    'Rich Hazelnut Praline'
                  ].map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlavor(f)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        flavor === f ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' : 'bg-cream-50/50 border-cream-200 text-cocoa-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Gourmet Core Filling</label>
                  <select
                    value={filling}
                    onChange={(e) => setFilling(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  >
                    <option value="Nutella & Roasted Hazelnuts">Nutella & Roasted Hazelnuts</option>
                    <option value="Salted Caramel Crunch">Salted Caramel Crunch</option>
                    <option value="Wild Raspberry Coulis">Wild Raspberry Coulis</option>
                    <option value="Dark Chocolate Mousse">Dark Chocolate Mousse</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Outer Frosting Finish</label>
                  <select
                    value={frosting}
                    onChange={(e) => setFrosting(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  >
                    <option value="Smooth Semi-Fondant & Buttercream">Smooth Semi-Fondant & Buttercream</option>
                    <option value="Whipped Dark Chocolate Ganache">Whipped Dark Chocolate Ganache</option>
                    <option value="Swiss Meringue Buttercream">Swiss Meringue Buttercream</option>
                    <option value="Silky Cream Cheese">Silky Cream Cheese</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-cocoa-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEggless}
                    onChange={(e) => setIsEggless(e.target.checked)}
                    className="rounded text-peach-500 w-4 h-4"
                  />
                  <span>🌱 100% Pure Vegetarian / Eggless Preparation</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 4: Design Theme & Artisan Decorations
              </h3>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Theme Palette Description</label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="e.g. Vintage Victorian Pastel Pink and Gold"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-2">Select Artisan Add-on Toppers</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {decorationOptions.map(deco => {
                    const isSelected = selectedDecorations.includes(deco.name);

                    return (
                      <div
                        key={deco.name}
                        onClick={() => toggleDecoration(deco.name)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' : 'bg-cream-50/50 border-cream-200 text-cocoa-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-peach-500 border-peach-500 text-white' : 'border-cream-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span className="font-semibold">{deco.name}</span>
                        </div>
                        <span className="font-bold text-cocoa-900">+₹{deco.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 5: Cake Inscription & Special Requests
              </h3>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">
                  Piped Cake Plaque Message
                </label>
                <input
                  type="text"
                  value={inscription}
                  onChange={(e) => setInscription(e.target.value)}
                  placeholder="e.g. 'Happy 30th Birthday Siddharth!'"
                  maxLength={45}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans text-sm font-bold"
                />
                <span className="text-[10px] text-cocoa-400 block text-right mt-0.5">{inscription.length}/45 chars</span>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Allergy or Dietary Restrictions</label>
                <input
                  type="text"
                  value={allergyNotice}
                  onChange={(e) => setAllergyNotice(e.target.value)}
                  placeholder="e.g. Strict peanut allergy, no gelatine"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Additional Design Instructions</label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  rows={3}
                  placeholder="Tell Chef Ananya about color preferences, font lettering, or favorite elements..."
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 6: Reference Photo Upload / Link
              </h3>
              <p className="text-cocoa-500">Provide an inspiration photo URL so our pastry team can match your vision:</p>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Inspiration Image URL</label>
                <input
                  type="text"
                  value={referencePhotoUrl}
                  onChange={(e) => setReferencePhotoUrl(e.target.value)}
                  placeholder="Paste Pinterest / Instagram / Web image URL"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              {referencePhotoUrl && (
                <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200">
                  <span className="text-[10px] font-bold uppercase text-cocoa-400 block mb-2">Image Preview:</span>
                  <img 
                    src={referencePhotoUrl} 
                    alt="Custom Cake Reference"
                    className="w-full h-48 rounded-xl object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 7: Delivery or Pickup Date & Time
              </h3>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-bold">Advance Notice Notice: </span>
                <span>Custom tier cakes require a minimum of {settings.leadTimeDaysCustomCake} days advance notice.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Required Completion Date</label>
                  <input
                    type="date"
                    min={minCustomDate}
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Time Slot</label>
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  >
                    {settings.pickupTimeSlots.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Fulfillment Mode</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex-1 p-3 rounded-xl border text-center font-bold transition-all ${
                      deliveryType === 'pickup' ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' : 'bg-cream-50 border-cream-200 text-cocoa-700'
                    }`}
                  >
                    🏪 Studio Pickup (Indiranagar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex-1 p-3 rounded-xl border text-center font-bold transition-all ${
                      deliveryType === 'delivery' ? 'bg-peach-50 border-peach-500 text-peach-900 shadow-xs' : 'bg-cream-50 border-cream-200 text-cocoa-700'
                    }`}
                  >
                    🚗 Direct Cab Delivery (+₹120)
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Delivery Address in Bangalore</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Complete apartment, street, landmark, area name..."
                    rows={2}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Final Review & Customer Contact */}
          {step === 8 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <h3 className="font-serif font-bold text-base text-cocoa-900 pb-2 border-b border-cream-100">
                Step 8: Contact Details & Submit Quote Request
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Siddharth Rao"
                    required
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  />
                </div>

                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98860 12345"
                    required
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Email (For receipt & updates)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="siddharth@gmail.com"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 text-cocoa-600 leading-relaxed text-[11px]">
                Upon submission, Chef Ananya will review your design specifications, verify bakery capacity for {requestedDate}, and message you on WhatsApp to confirm the advance deposit.
              </div>
            </div>
          )}

          {/* Step Navigation Buttons */}
          <div className="pt-4 border-t border-cream-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft transition-colors"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4 text-peach-300" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-peach-500 to-roseGold-500 hover:from-peach-600 hover:to-roseGold-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Custom Cake Order</span>
              </button>
            )}
          </div>

        </div>

        {/* Live Estimate & Summary Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          
          <div className="bg-gradient-to-br from-cream-100 to-peach-50 rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <span className="font-serif font-bold text-sm text-cocoa-900">Custom Cake Summary</span>
              <span className="text-[10px] bg-peach-500 text-white font-bold px-2.5 py-0.5 rounded-full">
                Live Estimate
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-cocoa-500">Style & Occasion:</span>
                <span className="font-bold text-cocoa-900 text-right">{cakeType} ({occasion})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-500">Servings & Weight:</span>
                <span className="font-bold text-cocoa-900">{servings} Pax · {tierCount} Tier(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-500">Flavor:</span>
                <span className="font-semibold text-cocoa-800 text-right max-w-[180px] truncate">{flavor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-500">Dietary:</span>
                <span className="font-semibold text-emerald-700">{isEggless ? '🌱 Eggless' : '🥚 With Egg'}</span>
              </div>
              {selectedDecorations.length > 0 && (
                <div>
                  <span className="text-cocoa-500 text-[11px] block">Artisan Toppers:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDecorations.map((d, i) => (
                      <span key={i} className="text-[10px] bg-white text-cocoa-700 px-2 py-0.5 rounded-md border border-cream-200 font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {inscription && (
                <div className="pt-2 border-t border-cream-200">
                  <span className="text-cocoa-500 text-[10px] block uppercase font-bold">Cake Plaque Message:</span>
                  <span className="font-bold text-peach-700 text-xs italic">"{inscription}"</span>
                </div>
              )}
            </div>

            {/* Total price computation */}
            <div className="pt-4 border-t border-cream-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-cocoa-600">
                <span>Base Cake & Servings:</span>
                <span>₹{basePrice}</span>
              </div>
              {decoTotal > 0 && (
                <div className="flex justify-between text-cocoa-600">
                  <span>Toppers & Artisan Art:</span>
                  <span>₹{decoTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-cocoa-600">
                <span>Tax ({settings.taxRatePercent}%):</span>
                <span>₹{estimatedTax}</span>
              </div>
              <div className="pt-2 border-t border-cream-300 flex justify-between items-baseline font-bold text-sm text-cocoa-900">
                <span>Estimated Price:</span>
                <span className="font-serif font-bold text-2xl text-peach-600">₹{estimatedTotal}</span>
              </div>
              <p className="text-[10px] text-cocoa-400 text-right">
                ≈ ₹{Math.round(estimatedTotal / servings)} per guest serving
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
