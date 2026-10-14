import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  PieChart as PieIcon, 
  Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const FinancialReportsPage: React.FC = () => {
  const { orders, expenses, products, exportToCsv } = useBakery();

  const totalGrossRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'rejected')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = Math.max(0, totalGrossRevenue - totalExpenses);
  const profitMarginPercent = totalGrossRevenue > 0 ? Math.round((netProfit / totalGrossRevenue) * 100) : 0;
  const avgOrderValue = orders.length > 0 ? Math.round(totalGrossRevenue / orders.length) : 0;

  // Monthly breakdown data for 6 months
  const monthlyData = [
    { month: 'May', revenue: 28500, expenses: 14200, profit: 14300 },
    { month: 'Jun', revenue: 34200, expenses: 16800, profit: 17400 },
    { month: 'Jul', revenue: 41000, expenses: 19500, profit: 21500 },
    { month: 'Aug', revenue: 38900, expenses: 18100, profit: 20800 },
    { month: 'Sep', revenue: 47600, expenses: 22400, profit: 25200 },
    { month: 'Oct (Current)', revenue: totalGrossRevenue + 32000, expenses: totalExpenses + 14000, profit: totalGrossRevenue + 32000 - (totalExpenses + 14000) }
  ];

  // Expense distribution by category
  const expenseCategories = [
    { name: 'Raw Ingredients', value: expenses.filter(e => e.category === 'ingredients').reduce((s, e) => s + e.amount, 0), color: '#EE603D' },
    { name: 'Boxes & Packaging', value: expenses.filter(e => e.category === 'packaging').reduce((s, e) => s + e.amount, 0), color: '#D4948A' },
    { name: 'Electricity & Gas', value: expenses.filter(e => e.category === 'electricity').reduce((s, e) => s + e.amount, 0), color: '#5F826E' },
    { name: 'Instagram Ads', value: expenses.filter(e => e.category === 'marketing').reduce((s, e) => s + e.amount, 0), color: '#F59E0B' },
    { name: 'Delivery Partners', value: expenses.filter(e => e.category === 'delivery').reduce((s, e) => s + e.amount, 0), color: '#70453B' }
  ].filter(c => c.value > 0);

  // Top products
  const topProducts = [
    { name: 'Signature Belgian Truffle Cake', units: 38, revenue: 32300 },
    { name: 'Lotus Biscoff Dream Cake', units: 24, revenue: 28800 },
    { name: 'Pastel Bento Cakes (Korean)', units: 48, revenue: 23952 },
    { name: 'Red Velvet with Cream Cheese', units: 22, revenue: 20900 },
    { name: 'Belgian Walnut Brownies', units: 35, revenue: 16800 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Financial Reports & Profit Analytics</h2>
            <p className="text-xs text-cocoa-500">Comprehensive breakdown of sales, operating margins & top revenue drivers</p>
          </div>
        </div>

        <button
          onClick={() => exportToCsv('orders')}
          className="px-3.5 py-1.5 bg-cream-100 hover:bg-cream-200 text-cocoa-800 rounded-xl text-xs font-semibold border border-cream-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Sales Report (CSV)</span>
        </button>
      </div>

      {/* 4 Core Financial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Gross Sales Revenue</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{totalGrossRevenue}
          </span>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            +24% growth vs Q2
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Total Business Expenses</span>
          <span className="font-serif font-bold text-2xl text-rose-700 mt-1 block">
            ₹{totalExpenses}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Raw materials & overheads</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Net Business Profit</span>
          <span className="font-serif font-bold text-2xl text-emerald-700 mt-1 block">
            ₹{netProfit}
          </span>
          <p className="text-[11px] text-cocoa-600 font-semibold mt-1">
            {profitMarginPercent}% net profit margin
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <span className="text-cocoa-500 text-xs font-semibold block">Average Order Value (AOV)</span>
          <span className="font-serif font-bold text-2xl text-cocoa-900 mt-1 block">
            ₹{avgOrderValue}
          </span>
          <p className="text-[11px] text-cocoa-400 mt-1">Per bakery order</p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 6-Month Revenue vs Net Profit Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
          <div className="pb-3 border-b border-cream-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-cocoa-900">Revenue & Profit Trajectory</h3>
              <p className="text-xs text-cocoa-500 mt-0.5">Monthly gross revenue vs operating expenses</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-peach-500"></span>
                Sales
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                Net Profit
              </span>
            </div>
          </div>

          <div className="h-72 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EE603D" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EE603D" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="chartProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5F826E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#5F826E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4ECE1" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#70453B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#70453B' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF6F0', borderColor: '#E4CFCA', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val: any) => [`₹${val}`, '']}
                />
                <Area type="monotone" dataKey="revenue" name="Sales Revenue" stroke="#EE603D" strokeWidth={2.5} fill="url(#chartRevenue)" />
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#5F826E" strokeWidth={2.5} fill="url(#chartProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Pie (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-cream-200 p-5 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-cocoa-900 pb-3 border-b border-cream-100">
              Expense Distribution
            </h3>

            <div className="h-52 mt-3 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FAF6F0', borderColor: '#E4CFCA', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val: any) => [`₹${val}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-cream-100">
            {expenseCategories.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-cocoa-700">{item.name}</span>
                </div>
                <span className="font-bold text-cocoa-900">₹{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Bestselling Cakes Table */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
        <h3 className="font-serif font-bold text-base text-cocoa-900 pb-3 border-b border-cream-100 mb-3">
          Top Revenue Generating Confections
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-50 border-b border-cream-200 text-cocoa-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-4">Rank & Item Name</th>
                <th className="py-2.5 px-4 text-center">Units Sold</th>
                <th className="py-2.5 px-4 text-right">Revenue Generated</th>
                <th className="py-2.5 px-4 text-right">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-cream-50/50">
                  <td className="py-3 px-4 font-bold text-cocoa-900">
                    <span className="text-peach-600 font-mono mr-2">#{idx + 1}</span>
                    {p.name}
                  </td>
                  <td className="py-3 px-4 text-center text-cocoa-700 font-semibold">{p.units}</td>
                  <td className="py-3 px-4 text-right font-bold text-cocoa-900">₹{p.revenue}</td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-bold">
                    {Math.round((p.revenue / 122752) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
