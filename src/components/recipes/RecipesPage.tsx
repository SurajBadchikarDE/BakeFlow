import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Recipe, RecipeIngredient } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Scale, 
  Clock, 
  DollarSign, 
  ChefHat, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const RecipesPage: React.FC = () => {
  const { 
    recipes, 
    ingredients, 
    addRecipe, 
    updateRecipe, 
    deleteRecipe, 
    products 
  } = useBakery();

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || '');
  const [scalingFactor, setScalingFactor] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New recipe form state
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newLinkedProduct, setNewLinkedProduct] = useState(products[0]?.id || '');
  const [newBatchYield, setNewBatchYield] = useState('1 x 1kg Cake');
  const [newServings, setNewServings] = useState(10);
  const [newPrepTime, setNewPrepTime] = useState(40);
  const [newBakeTime, setNewBakeTime] = useState(30);
  const [newPackagingCost, setNewPackagingCost] = useState(60);
  const [newLaborCost, setNewLaborCost] = useState(150);
  const [newOverheadCost, setNewOverheadCost] = useState(50);
  const [newInstructions, setNewInstructions] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>([]);

  // Selected recipe object
  const activeRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

  // Calculate scaled ingredient quantities & costs
  const scaledIngredients = activeRecipe ? activeRecipe.ingredients.map(ing => {
    // Look up live ingredient unit price
    const liveItem = ingredients.find(i => i.id === ing.ingredientId);
    const unitCost = liveItem ? liveItem.unitCost : ing.cost / ing.quantity;
    const scaledQty = Number((ing.quantity * scalingFactor).toFixed(3));
    const scaledCost = Math.round(scaledQty * unitCost);

    return {
      ...ing,
      scaledQty,
      scaledCost
    };
  }) : [];

  const scaledIngredientsCost = scaledIngredients.reduce((sum, item) => sum + item.scaledCost, 0);
  const scaledPackaging = activeRecipe ? Math.round(activeRecipe.packagingCost * scalingFactor) : 0;
  const scaledLabor = activeRecipe ? Math.round(activeRecipe.laborCost * scalingFactor) : 0;
  const scaledOverhead = activeRecipe ? Math.round(activeRecipe.overheadCost * scalingFactor) : 0;
  
  const totalScaledCost = scaledIngredientsCost + scaledPackaging + scaledLabor + scaledOverhead;
  const suggestedSellingPrice = activeRecipe ? Math.round(activeRecipe.recommendedSellingPrice * scalingFactor) : 0;
  const netProfit = Math.max(0, suggestedSellingPrice - totalScaledCost);
  const profitMarginPercent = suggestedSellingPrice > 0 ? Math.round((netProfit / suggestedSellingPrice) * 100) : 0;

  const handleAddIngredientRow = () => {
    if (ingredients.length === 0) return;
    const first = ingredients[0];
    setSelectedIngredients([
      ...selectedIngredients,
      {
        ingredientId: first.id,
        ingredientName: first.name,
        quantity: 0.1,
        unit: first.unit,
        cost: Math.round(0.1 * first.unitCost)
      }
    ]);
  };

  const handleCreateRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeName) return;

    const totalIngCost = selectedIngredients.reduce((sum, i) => sum + i.cost, 0);
    const totalCost = totalIngCost + newPackagingCost + newLaborCost + newOverheadCost;

    addRecipe({
      name: newRecipeName,
      linkedProductId: newLinkedProduct,
      batchYield: newBatchYield,
      servingsCount: Number(newServings),
      prepTimeMins: Number(newPrepTime),
      bakeTimeMins: Number(newBakeTime),
      ingredients: selectedIngredients,
      packagingCost: Number(newPackagingCost),
      laborCost: Number(newLaborCost),
      overheadCost: Number(newOverheadCost),
      totalEstimatedCost: totalCost,
      recommendedSellingPrice: Math.round(totalCost * 1.5),
      instructions: newInstructions
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Standardized Bakery Recipes & Yield Scaling</h2>
            <p className="text-xs text-cocoa-500">Auto-calculate ingredient quantities and real-time costs from live stock prices</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Recipe</span>
        </button>
      </div>

      {/* Main Grid: Recipe List (Left 4 cols) & Recipe Details + Scaler (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recipe Selection Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-cocoa-400 mb-3">
              Master Recipes ({recipes.length})
            </h3>
            <div className="space-y-2">
              {recipes.map(recipe => {
                const isSelected = (activeRecipe?.id || '') === recipe.id;

                return (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      setSelectedRecipeId(recipe.id);
                      setScalingFactor(1);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-cocoa-900 text-cream-50 border-cocoa-900 shadow-soft' 
                        : 'bg-cream-50/50 hover:bg-cream-100 text-cocoa-800 border-cream-200'
                    }`}
                  >
                    <div className="font-bold font-serif text-sm leading-snug">{recipe.name}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px] opacity-80">
                      <span>{recipe.batchYield}</span>
                      <span>₹{recipe.recommendedSellingPrice} Retail</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Recipe Inspection & Scaling (8 cols) */}
        {activeRecipe ? (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Card & Batch Scaler Controls */}
            <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-100 gap-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-cocoa-900 leading-snug">
                    {activeRecipe.name}
                  </h3>
                  <p className="text-xs text-cocoa-500 mt-0.5">
                    Standard Base: {activeRecipe.batchYield} · {activeRecipe.servingsCount} Servings
                  </p>
                </div>

                {/* Batch Scaler Buttons */}
                <div className="flex items-center gap-1.5 bg-cream-100 p-1 rounded-xl">
                  <span className="text-[10px] font-bold text-cocoa-500 uppercase px-2">Scale:</span>
                  {[0.5, 1, 1.5, 2, 3].map(factor => (
                    <button
                      key={factor}
                      onClick={() => setScalingFactor(factor)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        scalingFactor === factor
                          ? 'bg-cocoa-900 text-cream-50 shadow-xs'
                          : 'text-cocoa-700 hover:bg-cream-200'
                      }`}
                    >
                      {factor}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Specs Strip */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                  <span className="text-cocoa-400 text-[10px] block uppercase font-bold">Prep Time</span>
                  <span className="font-bold text-cocoa-900 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-peach-500" />
                    {activeRecipe.prepTimeMins} mins
                  </span>
                </div>

                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                  <span className="text-cocoa-400 text-[10px] block uppercase font-bold">Bake Time</span>
                  <span className="font-bold text-cocoa-900 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {activeRecipe.bakeTimeMins} mins
                  </span>
                </div>

                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                  <span className="text-cocoa-400 text-[10px] block uppercase font-bold">Scaled Yield</span>
                  <span className="font-bold text-cocoa-900 mt-0.5">
                    {Math.round(activeRecipe.servingsCount * scalingFactor)} Servings
                  </span>
                </div>

                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200">
                  <span className="text-cocoa-400 text-[10px] block uppercase font-bold">Net Margin</span>
                  <span className="font-bold text-emerald-700 mt-0.5">
                    {profitMarginPercent}% (₹{netProfit})
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
              <div className="p-4 border-b border-cream-100 flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-cocoa-900">
                  Required Ingredients ({scalingFactor}x Batch)
                </h4>
                <span className="text-xs font-semibold text-cocoa-600">
                  Ingredients Cost: ₹{scaledIngredientsCost}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-cream-50 border-b border-cream-200 text-cocoa-500 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-4">Ingredient Name</th>
                      <th className="py-2.5 px-4">Base Qty</th>
                      <th className="py-2.5 px-4 font-bold text-peach-700">Scaled Qty ({scalingFactor}x)</th>
                      <th className="py-2.5 px-4 text-right">Cost (Live ₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {scaledIngredients.map((item, idx) => (
                      <tr key={idx} className="hover:bg-cream-50/50">
                        <td className="py-3 px-4 font-semibold text-cocoa-900">{item.ingredientName}</td>
                        <td className="py-3 px-4 text-cocoa-500">{item.quantity} {item.unit}</td>
                        <td className="py-3 px-4 font-bold text-peach-600 font-mono">
                          {item.scaledQty} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-cocoa-800">
                          ₹{item.scaledCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comprehensive Cost & Profit Breakdown */}
            <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
              <h4 className="font-serif font-bold text-sm text-cocoa-900 mb-3 pb-2 border-b border-cream-100">
                Full Production Cost & Margin Calculation
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-2.5 bg-cream-50 rounded-lg">
                  <span className="text-cocoa-400 text-[10px]">Raw Ingredients</span>
                  <p className="font-bold text-cocoa-900 mt-0.5">₹{scaledIngredientsCost}</p>
                </div>
                <div className="p-2.5 bg-cream-50 rounded-lg">
                  <span className="text-cocoa-400 text-[10px]">Boxes & Packaging</span>
                  <p className="font-bold text-cocoa-900 mt-0.5">₹{scaledPackaging}</p>
                </div>
                <div className="p-2.5 bg-cream-50 rounded-lg">
                  <span className="text-cocoa-400 text-[10px]">Baker Labor</span>
                  <p className="font-bold text-cocoa-900 mt-0.5">₹{scaledLabor}</p>
                </div>
                <div className="p-2.5 bg-cream-50 rounded-lg">
                  <span className="text-cocoa-400 text-[10px]">Electricity & Utilities</span>
                  <p className="font-bold text-cocoa-900 mt-0.5">₹{scaledOverhead}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-cream-100 to-peach-50 border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-cocoa-500 text-[11px] block">Total Cost of Goods Sold (COGS)</span>
                  <span className="font-bold text-cocoa-900 text-lg">₹{totalScaledCost}</span>
                </div>
                <div>
                  <span className="text-cocoa-500 text-[11px] block">Suggested Retail Price</span>
                  <span className="font-bold text-peach-600 text-lg">₹{suggestedSellingPrice}</span>
                </div>
                <div>
                  <span className="text-cocoa-500 text-[11px] block">Estimated Net Profit</span>
                  <span className="font-bold text-emerald-700 text-lg">₹{netProfit} ({profitMarginPercent}%)</span>
                </div>
              </div>

              {activeRecipe.instructions && (
                <div className="mt-4 pt-3 border-t border-cream-100">
                  <span className="font-bold text-cocoa-800 text-xs block mb-1">Chef's Baking Notes & Instructions:</span>
                  <pre className="font-sans text-xs text-cocoa-600 whitespace-pre-wrap bg-cream-50 p-3 rounded-xl border border-cream-200 leading-relaxed">
                    {activeRecipe.instructions}
                  </pre>
                </div>
              )}
            </div>

          </div>
        ) : null}

      </div>

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-xl w-full p-6 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-serif font-bold text-base text-cocoa-900">Create New Recipe</h3>
              <button onClick={() => setShowAddModal(false)} className="text-cocoa-400 hover:text-cocoa-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecipeSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Recipe Name *</label>
                <input
                  type="text"
                  value={newRecipeName}
                  onChange={(e) => setNewRecipeName(e.target.value)}
                  placeholder="e.g. Belgian Truffle Cake (1kg Batch)"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Batch Yield</label>
                  <input
                    type="text"
                    value={newBatchYield}
                    onChange={(e) => setNewBatchYield(e.target.value)}
                    placeholder="e.g. 1 x 1kg Cake"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Servings Count</label>
                  <input
                    type="number"
                    value={newServings}
                    onChange={(e) => setNewServings(Number(e.target.value))}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  />
                </div>
              </div>

              {/* Ingredients list builder */}
              <div className="bg-cream-50 p-3 rounded-xl border border-cream-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cocoa-800">Ingredients Breakdown</span>
                  <button
                    type="button"
                    onClick={handleAddIngredientRow}
                    className="text-[10px] text-peach-600 font-bold hover:text-peach-700"
                  >
                    + Add Ingredient
                  </button>
                </div>

                {selectedIngredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={ing.ingredientId}
                      onChange={(e) => {
                        const found = ingredients.find(i => i.id === e.target.value);
                        if (found) {
                          const updated = [...selectedIngredients];
                          updated[idx] = {
                            ingredientId: found.id,
                            ingredientName: found.name,
                            quantity: ing.quantity,
                            unit: found.unit,
                            cost: Math.round(ing.quantity * found.unitCost)
                          };
                          setSelectedIngredients(updated);
                        }
                      }}
                      className="flex-1 p-1.5 bg-white border border-cream-300 rounded text-xs"
                    >
                      {ingredients.map(i => (
                        <option key={i.id} value={i.id}>{i.name} (₹{i.unitCost}/{i.unit})</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      step="0.01"
                      value={ing.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const found = ingredients.find(i => i.id === ing.ingredientId);
                        const updated = [...selectedIngredients];
                        updated[idx].quantity = val;
                        updated[idx].cost = found ? Math.round(val * found.unitCost) : 0;
                        setSelectedIngredients(updated);
                      }}
                      className="w-20 p-1.5 bg-white border border-cream-300 rounded text-xs"
                    />
                    <span className="text-[10px] text-cocoa-500 w-8">{ing.unit}</span>
                    <span className="text-xs font-bold text-cocoa-800 w-12 text-right">₹{ing.cost}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Packaging (₹)</label>
                  <input
                    type="number"
                    value={newPackagingCost}
                    onChange={(e) => setNewPackagingCost(Number(e.target.value))}
                    className="w-full p-2 bg-cream-50 border border-cream-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Labor (₹)</label>
                  <input
                    type="number"
                    value={newLaborCost}
                    onChange={(e) => setNewLaborCost(Number(e.target.value))}
                    className="w-full p-2 bg-cream-50 border border-cream-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Overhead (₹)</label>
                  <input
                    type="number"
                    value={newOverheadCost}
                    onChange={(e) => setNewOverheadCost(Number(e.target.value))}
                    className="w-full p-2 bg-cream-50 border border-cream-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Baking Instructions</label>
                <textarea
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Step by step mixing, temperature, oven timing..."
                  rows={2}
                  className="w-full p-2 bg-cream-50 border border-cream-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
