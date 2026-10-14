import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  ShoppingBag, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  ArrowRight,
  Calendar,
  ChefHat,
  ChevronRight,
  PlusCircle,
  Plus,
  Receipt,
  MessageSquare
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DashboardOverviewProps {
  onOpenNewOrder: () => void;
  onOpenAddProduct: () => void;
  onOpenAddExpense: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenNewOrder,
  onOpenAddProduct,
  onOpenAddExpense
}) => {
  const { 
    orders, 
    ingredients, 
    expenses, 
    setBakerTab, 
    navigateToOrderDetail,
    updateOrderStatus 
  } = useBakery();

  // Metric Computations
  // Let's treat today as 2026-10-15 for demo consistency
  const todayStr = "2026-10-15";

  const todaysOrders = orders.filter(o => o.requestedDate === todayStr);
  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const awaitingConfirmation = orders.filter(o => o.status === 'new' || o.status === 'pending_confirmation');
  const inPreparation = orders.filter(o => o.status === 'in_preparation' || o.status === 'baking' || o.status === 'decorating');
  const readyForPickup = orders.filter(o => o.status === 'ready');

  const pendingPayments = orders.reduce((sum, o) => sum + o.remainingBalance, 0);

  // Revenue & Expenses
  const totalGrossRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'rejected')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const estimatedProfit = Math.max(0, totalGrossRevenue - totalExpenses);
  const profitMarginPercent = totalGrossRevenue > 0 ? Math.round((estimatedProfit / totalGrossRevenue) * 100) : 0;

  const lowStockIngredients = ingredients.filter(i => i.currentStock <= i.minThreshold);

  // Interactive Chart Data (Last 7 days revenue vs expenses)
  const chartData = [
    { date: 'Oct 09', sales: 2450, expenses: 1200, profit: 1250 },
    { date: 'Oct 10', sales: 3800, expenses: 1500, profit: 2300 },
    { date: 'Oct 11', sales: 1950, expenses: 840, profit: 1110 },
    { date: 'Oct 12', sales: 4200, expenses: 2200, profit: 2000 },
    { date: 'Oct 13', sales: 3100, expenses: 950, profit: 2150 },
    { date: 'Oct 14', sales: 4850, expenses: 1850, profit: 3000 },
    { date: 'Oct 15 (Today)', sales: todaysRevenue || 3694, expenses: 1100, profit: (todaysRevenue || 3694) - 1100 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert if low stock or pending approvals */}
      {(lowStockIngredients.length > 0 || awaitingConfirmation.length > 0) && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-900">Attention Required Today: </span>
              <span className="text-amber-800">
                {awaitingConfirmation.length > 0 && `${awaitingConfirmation.length} order(s) awaiting confirmation · `}
                {lowStockIngredients.length > 0 && `${lowStockIngredients.length} ingredient(s) below reorder threshold.`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {awaitingConfirmation.length > 0 && (
              <button
                onClick={() => setBakerTab('orders')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Review Orders
              </button>
            )}
            {lowStockIngredients.length > 0 && (
              <button
                onClick={() => setBakerTab('inventory')}
                className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors"
              >
                View Stock
              </button>
            )}
          </div>
        </div>
      )}

      {/* 8 Primary Business Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* 1. Today's Orders */}
        <div 
          onClick={() => setBakerTab('orders')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft hover:shadow-card hover:border-peach-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">Today's Orders</span>
            <div className="p-2 rounded-xl bg-peach-50 text-peach-600 group-hover:bg-peach-500 group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-cocoa-900">{todaysOrders.length}</span>
            <span className="text-xs text-cocoa-500">orders</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1 font-medium">₹{todaysRevenue} scheduled</p>
        </div>

        {/* 2. Awaiting Confirmation */}
        <div 
          onClick={() => setBakerTab('orders')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft hover:shadow-card hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-amber-600">{awaitingConfirmation.length}</span>
            <span className="text-xs text-cocoa-500">inquiries</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1">Needs quote or confirm</p>
        </div>

        {/* 3. In Preparation / Baking */}
        <div 
          onClick={() => setBakerTab('production_board')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft hover:shadow-card hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">In The Kitchen</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-cocoa-900">{inPreparation.length}</span>
            <span className="text-xs text-cocoa-500">active</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1">Baking & decorating</p>
        </div>

        {/* 4. Ready for Pickup / Delivery */}
        <div 
          onClick={() => setBakerTab('orders')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">Ready for Pickup</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-emerald-700">{readyForPickup.length}</span>
            <span className="text-xs text-cocoa-500">boxed</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1">Waiting for dispatch</p>
        </div>

        {/* 5. Pending Payments */}
        <div 
          onClick={() => setBakerTab('payments')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft hover:shadow-card hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">Pending Balances</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-serif text-rose-700">₹{pendingPayments}</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1">Receivables to collect</p>
        </div>

        {/* 6. Revenue This Month */}
        <div 
          onClick={() => setBakerTab('reports')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">Revenue (Oct)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-serif text-cocoa-900">₹{totalGrossRevenue}</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">+18% vs last month</p>
        </div>

        {/* 7. Estimated Net Profit */}
        <div 
          onClick={() => setBakerTab('reports')}
          className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft hover:shadow-card hover:border-peach-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">Estimated Profit</span>
            <div className="p-2 rounded-xl bg-peach-50 text-peach-600 group-hover:bg-peach-500 group-hover:text-white transition-colors">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-serif text-cocoa-900">₹{estimatedProfit}</span>
          </div>
          <p className="text-[11px] text-cocoa-500 mt-1 font-medium">{profitMarginPercent}% net margin</p>
        </div>

        {/* 8. Low Stock Ingredients */}
        <div 
          onClick={() => setBakerTab('inventory')}
          className={`bg-white p-4 rounded-2xl border ${lowStockIngredients.length > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-cream-200'} shadow-soft hover:shadow-card transition-all cursor-pointer group`}
        >
          <div className="flex items-center justify-between text-xs text-cocoa-500 mb-2">
            <span className="font-semibold text-cocoa-700">Low Stock Alerts</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-serif ${lowStockIngredients.length > 0 ? 'text-red-600' : 'text-cocoa-900'}`}>
              {lowStockIngredients.length}
            </span>
            <span className="text-xs text-cocoa-500">items</span>
          </div>
          <p className="text-[11px] text-cocoa-400 mt-1">Chocolate, cream, boxes</p>
        </div>

      </div>

      {/* Main Grid: Today's Schedule & Production vs Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Today's Kitchen Schedule */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-cream-100">
            <div>
              <h3 className="font-serif font-bold text-base text-cocoa-900">Today's Kitchen Schedule</h3>
              <p className="text-xs text-cocoa-500 mt-0.5">Orders to prepare, bake, decorate, or dispatch today (Oct 15)</p>
            </div>
            <button
              onClick={() => setBakerTab('production_calendar')}
              className="text-xs font-semibold text-peach-600 hover:text-peach-700 flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todaysOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-cocoa-400">
                No orders scheduled specifically for today.
              </div>
            ) : (
              todaysOrders.map(order => (
                <div 
                  key={order.id}
                  className="p-3.5 rounded-xl border border-cream-200 hover:border-peach-300 bg-cream-50/50 hover:bg-peach-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-xl border border-cream-200 text-cocoa-700 shrink-0 text-center min-w-[58px]">
                      <span className="text-[10px] uppercase font-bold text-cocoa-400 block">Slot</span>
                      <span className="text-[11px] font-bold text-cocoa-900 block mt-0.5">
                        {order.deliveryTimeSlot.split(' - ')[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-cocoa-900">{order.customerName}</span>
                        <span className="text-[11px] text-cocoa-400 font-mono">({order.id})</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          order.status === 'ready' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'decorating'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'baking'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-cocoa-700 font-medium mt-1">
                        {order.items.map(i => `${i.quantity}x ${i.productName} (${i.variantName || 'Standard'})`).join(', ') || 'Custom Cake'}
                      </p>
                      {order.allergyNotes && (
                        <p className="text-[11px] text-amber-700 mt-0.5 font-medium flex items-center gap-1">
                          ⚠️ {order.allergyNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => navigateToOrderDetail(order.id)}
                      className="px-3 py-1.5 bg-white hover:bg-cream-100 text-cocoa-800 border border-cream-300 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Order
                    </button>
                    {order.status === 'decorating' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready', 'Marked ready from dashboard schedule')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Action Shortcuts inside kitchen schedule */}
          <div className="mt-5 pt-4 border-t border-cream-100 grid grid-cols-3 gap-2">
            <button
              onClick={() => setBakerTab('production_board')}
              className="p-2.5 rounded-xl bg-cream-100/70 hover:bg-cream-200/80 text-cocoa-800 text-xs font-medium text-center transition-colors"
            >
              Open Kanban Board
            </button>
            <button
              onClick={() => setBakerTab('inventory')}
              className="p-2.5 rounded-xl bg-cream-100/70 hover:bg-cream-200/80 text-cocoa-800 text-xs font-medium text-center transition-colors"
            >
              Ingredient Check
            </button>
            <button
              onClick={onOpenNewOrder}
              className="p-2.5 rounded-xl bg-peach-100/80 hover:bg-peach-200 text-peach-900 text-xs font-semibold text-center transition-colors"
            >
              + Log Custom Order
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Revenue & Cost Analytics Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cream-100">
              <div>
                <h3 className="font-serif font-bold text-base text-cocoa-900">Weekly Sales & Expenses</h3>
                <p className="text-xs text-cocoa-500 mt-0.5">7-Day Gross Sales vs Raw Material & Ops Expenses</p>
              </div>
              <button
                onClick={() => setBakerTab('reports')}
                className="text-xs font-semibold text-peach-600 hover:text-peach-700"
              >
                Full Analytics →
              </button>
            </div>

            {/* Interactive Chart */}
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EE603D" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#EE603D" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5F826E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#5F826E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4ECE1" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#70453B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#70453B' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FAF6F0', borderColor: '#E4CFCA', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: any) => [`₹${val}`, '']}
                  />
                  <Area type="monotone" dataKey="sales" name="Sales (₹)" stroke="#EE603D" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" dataKey="profit" name="Net Profit (₹)" stroke="#5F826E" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-cocoa-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-peach-500"></span>
              Sales Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-500"></span>
              Net Profit
            </span>
            <span className="font-semibold text-cocoa-900">
              Avg Order: ₹{orders.length > 0 ? Math.round(totalGrossRevenue / orders.length) : 0}
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Row: Upcoming Orders & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-cream-100">
            <div>
              <h3 className="font-serif font-bold text-base text-cocoa-900">Upcoming Orders This Week</h3>
              <p className="text-xs text-cocoa-500 mt-0.5">Orders sorted by required delivery or pickup deadline</p>
            </div>
            <button
              onClick={() => setBakerTab('orders')}
              className="text-xs font-semibold text-peach-600 hover:text-peach-700"
            >
              View All Orders ({orders.length}) →
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cream-100 text-cocoa-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Date & Slot</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-cocoa-900 font-mono">{order.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-cocoa-800">{order.customerName}</div>
                      <div className="text-[10px] text-cocoa-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-cocoa-800">{order.requestedDate}</div>
                      <div className="text-[10px] text-cocoa-400">{order.deliveryType} · {order.deliveryTimeSlot.split(' - ')[0]}</div>
                    </td>
                    <td className="py-3 px-3 max-w-[200px] truncate text-cocoa-700">
                      {order.items.map(i => i.productName).join(', ') || 'Custom Cake'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-cocoa-900">₹{order.totalAmount}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : order.paymentStatus === 'partially_paid'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                        order.status === 'completed' ? 'bg-cocoa-100 text-cocoa-800' : 'bg-peach-100 text-peach-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigateToOrderDetail(order.id)}
                        className="text-peach-600 hover:text-peach-700 font-semibold"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Launch & Recent Activity (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Action Tiles */}
          <div className="bg-gradient-to-br from-cream-100 to-peach-50/50 rounded-2xl border border-cream-200 p-4">
            <h4 className="font-serif font-bold text-sm text-cocoa-900 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenNewOrder}
                className="p-3 bg-white hover:bg-peach-50/80 rounded-xl border border-cream-200 text-left transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-peach-600 mb-1" />
                <span className="font-bold text-xs text-cocoa-900 block leading-tight">Create Order</span>
                <span className="text-[10px] text-cocoa-400 block mt-0.5">Phone/walk-in</span>
              </button>

              <button
                onClick={onOpenAddProduct}
                className="p-3 bg-white hover:bg-peach-50/80 rounded-xl border border-cream-200 text-left transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-bold text-xs text-cocoa-900 block leading-tight">Add Product</span>
                <span className="text-[10px] text-cocoa-400 block mt-0.5">New dessert</span>
              </button>

              <button
                onClick={onOpenAddExpense}
                className="p-3 bg-white hover:bg-peach-50/80 rounded-xl border border-cream-200 text-left transition-all shadow-xs"
              >
                <Receipt className="w-4 h-4 text-amber-600 mb-1" />
                <span className="font-bold text-xs text-cocoa-900 block leading-tight">Log Expense</span>
                <span className="text-[10px] text-cocoa-400 block mt-0.5">Butter, boxes</span>
              </button>

              <button
                onClick={() => setBakerTab('inventory')}
                className="p-3 bg-white hover:bg-peach-50/80 rounded-xl border border-cream-200 text-left transition-all shadow-xs"
              >
                <AlertTriangle className="w-4 h-4 text-cocoa-600 mb-1" />
                <span className="font-bold text-xs text-cocoa-900 block leading-tight">Shopping List</span>
                <span className="text-[10px] text-cocoa-400 block mt-0.5">Restock items</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Template Banner */}
          <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h4 className="font-serif font-bold text-xs text-cocoa-900">WhatsApp Notification Hub</h4>
            </div>
            <p className="text-[11px] text-cocoa-600 mb-3">
              Quickly send order confirmations, ready for pickup messages, or UPI advance requests.
            </p>
            <button
              onClick={() => setBakerTab('notifications')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Message Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
