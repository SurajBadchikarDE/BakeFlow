import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Ingredient } from '../../types';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  ShoppingCart, 
  Download, 
  Edit2, 
  Trash2, 
  PlusCircle, 
  MinusCircle, 
  X, 
  Check, 
  Copy,
  Calendar
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { 
    ingredients, 
    addIngredient, 
    updateIngredient, 
    adjustIngredientStock, 
    deleteIngredient, 
    exportToCsv 
  } = useBakery();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<Ingredient | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Restock purchase');

  // Add Ingredient form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'dairy' | 'flour_grains' | 'sugars' | 'chocolate' | 'flavorings' | 'packaging' | 'decorations'>('dairy');
  const [newUnit, setNewUnit] = useState<'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'box'>('kg');
  const [newCurrentStock, setNewCurrentStock] = useState(5);
  const [newMinThreshold, setNewMinThreshold] = useState(2);
  const [newUnitCost, setNewUnitCost] = useState(500);
  const [newSupplier, setNewSupplier] = useState('');
  const [newExpiry, setNewExpiry] = useState('');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'chocolate', label: 'Chocolate' },
    { id: 'dairy', label: 'Dairy & Butter' },
    { id: 'flour_grains', label: 'Flour & Grains' },
    { id: 'sugars', label: 'Sugars' },
    { id: 'packaging', label: 'Boxes & Packaging' },
    { id: 'flavorings', label: 'Flavorings' },
  ];

  const lowStockItems = ingredients.filter(i => i.currentStock <= i.minThreshold);
  const totalValuation = ingredients.reduce((sum, i) => sum + (i.currentStock * i.unitCost), 0);

  const filteredItems = ingredients.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (showLowStockOnly && item.currentStock > item.minThreshold) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.supplier.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem || adjustDelta === 0) return;
    adjustIngredientStock(adjustingItem.id, adjustDelta, adjustReason);
    setAdjustingItem(null);
    setAdjustDelta(0);
  };

  const handleCreateIngredientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addIngredient({
      name: newName,
      category: newCategory,
      unit: newUnit,
      currentStock: Number(newCurrentStock),
      minThreshold: Number(newMinThreshold),
      unitCost: Number(newUnitCost),
      purchasePrice: Number(newCurrentStock) * Number(newUnitCost),
      supplier: newSupplier || "Local Distributor",
      lastRestocked: new Date().toISOString().split('T')[0],
      expiryDate: newExpiry || undefined
    });

    setShowAddModal(false);
    setNewName('');
  };

  // Copy shopping list text
  const copyShoppingList = () => {
    let text = `🛒 BAKERY RESTOCK SHOPPING LIST (${new Date().toLocaleDateString()})\n\n`;
    lowStockItems.forEach(item => {
      const needed = Math.max(1, (item.minThreshold * 2) - item.currentStock);
      text += `• ${item.name}: Order ${needed.toFixed(1)} ${item.unit} (Current: ${item.currentStock} ${item.unit}) - Est. ₹${Math.round(needed * item.unitCost)}\n`;
    });
    navigator.clipboard.writeText(text);
    alert("Shopping list copied to clipboard! Ready to paste into WhatsApp or notes.");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Total Items */}
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Tracked Inventory</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif font-bold text-2xl text-cocoa-900">{ingredients.length}</span>
            <span className="text-xs text-cocoa-400">items</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1">Across 7 categories</p>
        </div>

        {/* Low Stock Warning */}
        <div 
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            lowStockItems.length > 0 
              ? 'bg-amber-50/70 border-amber-300 shadow-soft' 
              : 'bg-white border-cream-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-amber-900 text-xs font-bold block">Below Reorder Level</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif font-bold text-2xl text-amber-600">{lowStockItems.length}</span>
            <span className="text-xs text-amber-800">needs restock</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">Click to filter table</p>
        </div>

        {/* Total Stock Valuation */}
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Total Stock Valuation</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-serif font-bold text-2xl text-cocoa-900">₹{Math.round(totalValuation)}</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1">At purchase unit costs</p>
        </div>

        {/* Shopping List Trigger */}
        <div 
          onClick={() => setShowShoppingListModal(true)}
          className="bg-gradient-to-br from-peach-50 to-cream-100 p-4 rounded-2xl border border-peach-200 shadow-soft cursor-pointer hover:border-peach-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-peach-900 text-xs font-bold">Auto Shopping List</span>
            <ShoppingCart className="w-4 h-4 text-peach-600" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-peach-700 block mt-1">
              {lowStockItems.length} Items to Reorder
            </span>
            <span className="text-[10px] text-peach-800 font-semibold mt-0.5 block">
              Generate & Copy List →
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setShowLowStockOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id && !showLowStockOnly
                  ? 'bg-cocoa-900 text-cream-50 shadow-xs'
                  : 'text-cocoa-600 hover:bg-cream-100 hover:text-cocoa-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cocoa-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredient or supplier..."
              className="pl-8 pr-3 py-1.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 focus:outline-none focus:border-peach-500 font-sans"
            />
          </div>

          <button
            onClick={() => exportToCsv('inventory')}
            className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold border border-cream-300 transition-colors flex items-center gap-1.5"
            title="Download inventory CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Item</span>
          </button>
        </div>

      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-cream-200 text-cocoa-600 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Ingredient / Material</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Min. Threshold</th>
                <th className="py-3 px-4">Unit Cost (₹)</th>
                <th className="py-3 px-4">Supplier & Source</th>
                <th className="py-3 px-4">Last Restocked</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredItems.map(item => {
                const isLow = item.currentStock <= item.minThreshold;

                return (
                  <tr key={item.id} className="hover:bg-cream-50/60 transition-colors">
                    
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-cocoa-900">
                      <div className="flex items-center gap-2">
                        {isLow && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Low Stock" />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="bg-cream-100 text-cocoa-700 px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-4 font-bold font-mono">
                      <span className={isLow ? 'text-red-600' : 'text-cocoa-900'}>
                        {item.currentStock} {item.unit}
                      </span>
                      {isLow && (
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold ml-1.5">
                          LOW
                        </span>
                      )}
                    </td>

                    {/* Min Threshold */}
                    <td className="py-3.5 px-4 text-cocoa-500">
                      {item.minThreshold} {item.unit}
                    </td>

                    {/* Unit Cost */}
                    <td className="py-3.5 px-4 font-semibold text-cocoa-900">
                      ₹{item.unitCost} / {item.unit}
                    </td>

                    {/* Supplier */}
                    <td className="py-3.5 px-4 text-cocoa-700 max-w-[160px] truncate">
                      {item.supplier}
                    </td>

                    {/* Last Restocked */}
                    <td className="py-3.5 px-4 text-cocoa-500 text-[11px]">
                      {item.lastRestocked}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustingItem(item);
                            setAdjustDelta(0);
                          }}
                          className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-lg text-xs font-semibold transition-colors"
                          title="Adjust stock quantity"
                        >
                          Adjust Qty
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${item.name} from inventory?`)) {
                              deleteIngredient(item.id);
                            }
                          }}
                          className="p-1 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-sm w-full p-6 shadow-elevated">
            <h3 className="font-serif font-bold text-base text-cocoa-900 mb-1">
              Adjust Stock: {adjustingItem.name}
            </h3>
            <p className="text-xs text-cocoa-500 mb-4">
              Current Stock: <strong>{adjustingItem.currentStock} {adjustingItem.unit}</strong>
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Stock Change (+ to add, - to deduct)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Number(e.target.value))}
                    className="flex-1 p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 text-sm font-bold font-mono"
                    required
                  />
                  <span className="font-bold text-cocoa-600 text-sm">{adjustingItem.unit}</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[1, 2, 5, 10].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setAdjustDelta(val)}
                      className="px-2 py-1 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded text-[10px] font-bold"
                    >
                      +{val}
                    </button>
                  ))}
                  {[-1, -2].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setAdjustDelta(val)}
                      className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[10px] font-bold"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Reason for Adjustment</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                >
                  <option value="Restock purchase">Restock Purchase</option>
                  <option value="Recipe deduction">Recipe Usage Deduction</option>
                  <option value="Wastage / Expiry">Wastage / Spoilage / Expiry</option>
                  <option value="Inventory audit count">Inventory Audit Count</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-cream-100">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingListModal && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-md w-full p-6 shadow-elevated">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-peach-600" />
                <h3 className="font-serif font-bold text-base text-cocoa-900">
                  Restock Shopping List
                </h3>
              </div>
              <button onClick={() => setShowShoppingListModal(false)} className="text-cocoa-400 hover:text-cocoa-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-cocoa-500 my-3">
              Generated automatically for all items at or below safety stock threshold:
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
              {lowStockItems.length === 0 ? (
                <p className="text-center py-6 text-cocoa-400">All ingredients are well stocked!</p>
              ) : (
                lowStockItems.map(item => {
                  const needed = Math.max(1, (item.minThreshold * 2) - item.currentStock);
                  const estCost = Math.round(needed * item.unitCost);

                  return (
                    <div key={item.id} className="p-2.5 bg-cream-50 rounded-xl border border-cream-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-cocoa-900">{item.name}</span>
                        <div className="text-[10px] text-cocoa-500 mt-0.5">
                          In stock: {item.currentStock} {item.unit} · Target: {item.minThreshold * 2} {item.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-peach-700 text-sm">+{needed.toFixed(1)} {item.unit}</span>
                        <div className="text-[10px] text-cocoa-400">≈ ₹{estCost}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-cream-100 flex items-center justify-between">
              <button
                onClick={copyShoppingList}
                className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-cocoa-600" />
                <span>Copy to WhatsApp</span>
              </button>

              <button
                onClick={() => setShowShoppingListModal(false)}
                className="px-4 py-2 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-cream-200 max-w-md w-full p-6 shadow-elevated my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <h3 className="font-serif font-bold text-base text-cocoa-900">Add Raw Ingredient / Material</h3>
              <button onClick={() => setShowAddModal(false)} className="text-cocoa-400 hover:text-cocoa-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIngredientSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Ingredient / Material Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Callebaut 70% Dark Chocolate"
                  required
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  >
                    <option value="dairy">Dairy & Butter</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="flour_grains">Flour & Grains</option>
                    <option value="sugars">Sugars</option>
                    <option value="flavorings">Flavorings & Extracts</option>
                    <option value="packaging">Boxes & Boards</option>
                    <option value="decorations">Sprinkles & Ribbons</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Unit of Measurement</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as any)}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="l">Liters (l)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="box">Box (box)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCurrentStock}
                    onChange={(e) => setNewCurrentStock(Number(e.target.value))}
                    className="w-full p-2 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Min Threshold</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMinThreshold}
                    onChange={(e) => setNewMinThreshold(Number(e.target.value))}
                    className="w-full p-2 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(Number(e.target.value))}
                    className="w-full p-2 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Supplier / Vendor</label>
                <input
                  type="text"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  placeholder="e.g. Fine Foods Importers Bangalore"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>

              <div>
                <label className="font-bold text-cocoa-700 block mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900"
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
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
