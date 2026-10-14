import React, { useState } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  DollarSign, 
  Sparkles, 
  PieChart, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export const CostCalculatorPage: React.FC = () => {
  // Configurable inputs
  const [cakeName, setCakeName] = useState('2-Tier Floral Celebration Cake');
  const [servings, setServings] = useState(20);
  const [weightKg, setWeightKg] = useState(2.0);

  // Raw Materials
  const [spongeCost, setSpongeCost] = useState(280);
  const [ganacheCost, setGanacheCost] = useState(450);
  const [decorationsCost, setDecorationsCost] = useState(300); // gold leaf, flowers, topper

  // Packaging
  const [boxCost, setBoxCost] = useState(85);
  const [boardCost, setBoardCost] = useState(45);
  const [ribbonAccessoriesCost, setRibbonAccessoriesCost] = useState(30);

  // Labor & Overheads
  const [laborHours, setLaborHours] = useState(3.5);
  const [hourlyWage, setHourlyWage] = useState(200); // ₹200/hr for home baker
  const [studioOverhead, setStudioOverhead] = useState(120); // electricity, gas, cleaning

  // Desired profit margin %
  const [desiredMarginPercent, setDesiredMarginPercent] = useState(45);

  // Computed values
  const totalRawIngredients = spongeCost + ganacheCost + decorationsCost;
  const totalPackaging = boxCost + boardCost + ribbonAccessoriesCost;
  const totalLabor = Math.round(laborHours * hourlyWage);
  const totalOverhead = studioOverhead;

  const totalCostOfProduction = totalRawIngredients + totalPackaging + totalLabor + totalOverhead;

  // Selling Price = Cost / (1 - Margin/100)
  const suggestedSellingPrice = Math.round(totalCostOfProduction / (1 - (desiredMarginPercent / 100)));
  const netProfit = suggestedSellingPrice - totalCostOfProduction;
  const costPerServing = Math.round(suggestedSellingPrice / servings);

  const resetDefaults = () => {
    setCakeName('2-Tier Floral Celebration Cake');
    setServings(20);
    setWeightKg(2.0);
    setSpongeCost(280);
    setGanacheCost(450);
    setDecorationsCost(300);
    setBoxCost(85);
    setBoardCost(45);
    setRibbonAccessoriesCost(30);
    setLaborHours(3.5);
    setHourlyWage(200);
    setStudioOverhead(120);
    setDesiredMarginPercent(45);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Cake Costing & Pricing Calculator</h2>
            <p className="text-xs text-cocoa-500">Accurately account for ingredients, packaging, baker labor & studio overhead</p>
          </div>
        </div>

        <button
          onClick={resetDefaults}
          className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Calculator</span>
        </button>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Cake Profile */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 pb-2 border-b border-cream-100">
              1. Cake Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-cocoa-700 block mb-1">Cake Name / Design Title</label>
                <input
                  type="text"
                  value={cakeName}
                  onChange={(e) => setCakeName(e.target.value)}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg text-cocoa-900 font-sans"
                />
              </div>
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Servings Count</label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg text-cocoa-900"
                />
              </div>
            </div>
          </div>

          {/* Raw Ingredients Cost */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cream-100">
              <h3 className="font-serif font-bold text-sm text-cocoa-900">
                2. Ingredients & Materials
              </h3>
              <span className="font-bold text-xs text-cocoa-900">Subtotal: ₹{totalRawIngredients}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Sponge Ingredients (₹)</label>
                <input
                  type="number"
                  value={spongeCost}
                  onChange={(e) => setSpongeCost(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
                <span className="text-[10px] text-cocoa-400 mt-0.5 block">Flour, butter, sugar, eggs</span>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Ganache & Frosting (₹)</label>
                <input
                  type="number"
                  value={ganacheCost}
                  onChange={(e) => setGanacheCost(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
                <span className="text-[10px] text-cocoa-400 mt-0.5 block">Chocolate, cream, cheese</span>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Decorations & Art (₹)</label>
                <input
                  type="number"
                  value={decorationsCost}
                  onChange={(e) => setDecorationsCost(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
                <span className="text-[10px] text-cocoa-400 mt-0.5 block">Gold leaf, flowers, topper</span>
              </div>
            </div>
          </div>

          {/* Packaging & Presentation */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cream-100">
              <h3 className="font-serif font-bold text-sm text-cocoa-900">
                3. Luxury Packaging
              </h3>
              <span className="font-bold text-xs text-cocoa-900">Subtotal: ₹{totalPackaging}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Cake Box (₹)</label>
                <input
                  type="number"
                  value={boxCost}
                  onChange={(e) => setBoxCost(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Masonite Board (₹)</label>
                <input
                  type="number"
                  value={boardCost}
                  onChange={(e) => setBoardCost(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Ribbon, Tag & Candle (₹)</label>
                <input
                  type="number"
                  value={ribbonAccessoriesCost}
                  onChange={(e) => setRibbonAccessoriesCost(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Labor & Studio Overheads */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cream-100">
              <h3 className="font-serif font-bold text-sm text-cocoa-900">
                4. Labor & Kitchen Overheads
              </h3>
              <span className="font-bold text-xs text-cocoa-900">Subtotal: ₹{totalLabor + totalOverhead}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Labor Time (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={laborHours}
                  onChange={(e) => setLaborHours(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Baker Hourly Rate (₹/hr)</label>
                <input
                  type="number"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Studio Utility Overhead (₹)</label>
                <input
                  type="number"
                  value={studioOverhead}
                  onChange={(e) => setStudioOverhead(Number(e.target.value))}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-lg"
                />
                <span className="text-[10px] text-cocoa-400 mt-0.5 block">Electricity, gas, cleaning</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Output Column (5 cols): Live Price & Profit Summary */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Profit Result Card */}
          <div className="bg-gradient-to-br from-cocoa-900 to-cocoa-950 text-cream-50 rounded-2xl p-6 shadow-elevated space-y-5">
            
            <div>
              <span className="text-peach-300 font-bold uppercase tracking-wider text-[10px]">
                Recommended Pricing
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-white">
                  ₹{suggestedSellingPrice}
                </span>
                <span className="text-xs text-cream-300">Retail Quote</span>
              </div>
              <p className="text-xs text-cream-300 mt-1">
                ₹{costPerServing} per serving ({servings} servings)
              </p>
            </div>

            {/* Margin Slider */}
            <div className="bg-cocoa-800/80 p-3.5 rounded-xl border border-cocoa-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cream-200 font-medium">Desired Net Profit Margin:</span>
                <span className="font-bold text-peach-300 text-sm">{desiredMarginPercent}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                value={desiredMarginPercent}
                onChange={(e) => setDesiredMarginPercent(Number(e.target.value))}
                className="w-full accent-peach-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-cocoa-400">
                <span>20% (Low)</span>
                <span>45% (Recommended)</span>
                <span>75% (Luxury Custom)</span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-2 text-xs border-t border-cocoa-800 pt-4">
              <div className="flex justify-between text-cream-300">
                <span>Ingredients & Materials:</span>
                <span>₹{totalRawIngredients}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Packaging:</span>
                <span>₹{totalPackaging}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Baker Labor ({laborHours} hrs):</span>
                <span>₹{totalLabor}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Studio Overheads:</span>
                <span>₹{totalOverhead}</span>
              </div>
              
              <div className="pt-2 border-t border-cocoa-800 flex justify-between font-bold text-cream-100">
                <span>Total Cost of Production:</span>
                <span>₹{totalCostOfProduction}</span>
              </div>

              <div className="flex justify-between font-bold text-emerald-400 text-sm pt-1">
                <span>Estimated Net Profit:</span>
                <span>₹{netProfit} ({desiredMarginPercent}%)</span>
              </div>
            </div>

          </div>

          {/* Pricing Strategy Advice */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-2.5 text-xs">
            <h4 className="font-serif font-bold text-cocoa-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-peach-500" />
              <span>Pro Baker Pricing Advice</span>
            </h4>
            <p className="text-cocoa-600 leading-relaxed">
              Home bakers frequently undercharge by neglecting their own skilled labor hours. Never quote based on raw ingredient costs alone!
            </p>
            <ul className="space-y-1 text-cocoa-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Include at least 40% margin to cover testing & wear-and-tear.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Charge extra ₹300-₹500 for intricate fondant figurines or gold leaf.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
