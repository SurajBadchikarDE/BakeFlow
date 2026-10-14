import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  Plus, 
  ShoppingBag,
  List
} from 'lucide-react';

export const ProductionCalendarPage: React.FC = () => {
  const { orders, navigateToOrderDetail, settings } = useBakery();

  const [currentView, setCurrentView] = useState<'week' | 'month' | 'list'>('week');
  
  // Kitchen daily checklist
  const [tasks, setTasks] = useState([
    { id: 1, text: "Preheat Deck Ovens to 165°C for afternoon sponge batches", done: true },
    { id: 2, text: "Melt Callebaut 54.5% Dark Chocolate for truffle ganache", done: true },
    { id: 3, text: "Whip Philadelphia cream cheese with Madagascar vanilla", done: false },
    { id: 4, text: "Apply edible gold leaf & acrylic charm on Order #BF-2026-101", done: false },
    { id: 5, text: "Pack sugarcane bento boxes with wooden spoons & ribbons", done: false },
    { id: 6, text: "Coordinate 3:30 PM pickup dispatch with Dunzo delivery rider", done: false }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Week days starting around Oct 14 - Oct 20, 2026
  const weekDays = [
    { date: '2026-10-14', dayName: 'Wednesday' },
    { date: '2026-10-15', dayName: 'Thursday (Today)' },
    { date: '2026-10-16', dayName: 'Friday' },
    { date: '2026-10-17', dayName: 'Saturday' },
    { date: '2026-10-18', dayName: 'Sunday' },
    { date: '2026-10-19', dayName: 'Monday' },
    { date: '2026-10-20', dayName: 'Tuesday' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header & View Controls */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Baking & Production Schedule</h2>
            <p className="text-xs text-cocoa-500">October 2026 · Daily capacity & fulfillment deadlines</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="bg-cream-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1 rounded-lg transition-colors ${currentView === 'week' ? 'bg-white text-cocoa-900 shadow-xs' : 'text-cocoa-600 hover:text-cocoa-900'}`}
            >
              Week View
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`px-3 py-1 rounded-lg transition-colors ${currentView === 'list' ? 'bg-white text-cocoa-900 shadow-xs' : 'text-cocoa-600 hover:text-cocoa-900'}`}
            >
              Agenda List
            </button>
          </div>
        </div>
      </div>

      {/* Week View Grid */}
      {currentView === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 items-start">
          {weekDays.map(day => {
            const dayOrders = orders.filter(o => o.requestedDate === day.date && o.status !== 'cancelled');
            const isToday = day.date === '2026-10-15';
            const isOverloaded = dayOrders.length >= settings.dailyOrderCapacity;

            return (
              <div 
                key={day.date}
                className={`rounded-2xl border p-3 flex flex-col min-h-[360px] transition-all ${
                  isToday 
                    ? 'bg-peach-50/60 border-peach-300 shadow-card' 
                    : 'bg-white border-cream-200 shadow-soft'
                }`}
              >
                {/* Day Header */}
                <div className="pb-2 mb-2 border-b border-cream-200">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold ${isToday ? 'text-peach-700' : 'text-cocoa-600'}`}>
                      {day.dayName.split(' ')[0]}
                    </span>
                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isToday ? 'bg-peach-500 text-white' : 'bg-cream-100 text-cocoa-800'
                    }`}>
                      {day.date.slice(8)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-cocoa-400">
                    <span>{dayOrders.length} order(s)</span>
                    {isOverloaded && (
                      <span className="text-red-600 font-bold flex items-center gap-0.5">
                        ⚠️ Full
                      </span>
                    )}
                  </div>
                </div>

                {/* Day Orders */}
                <div className="space-y-2 flex-1">
                  {dayOrders.length === 0 ? (
                    <div className="py-8 text-center text-[10px] text-cocoa-400 italic">
                      No orders
                    </div>
                  ) : (
                    dayOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => navigateToOrderDetail(order.id)}
                        className="p-2.5 rounded-xl border border-cream-200 hover:border-peach-300 bg-cream-50/50 hover:bg-white transition-all cursor-pointer shadow-xs text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cocoa-900 font-mono text-[10px]">{order.id}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold capitalize ${
                            order.status === 'ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="font-semibold text-cocoa-800 text-[11px] truncate">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-cocoa-500 truncate">
                          {order.items[0]?.productName || 'Custom Cake'}
                        </div>
                        <div className="text-[9px] text-cocoa-400 flex items-center gap-1 pt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {order.deliveryTimeSlot.split(' - ')[0]} · {order.deliveryType}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
          <h3 className="font-serif font-bold text-sm text-cocoa-900 mb-4">Complete Production Agenda</h3>
          <div className="space-y-3">
            {orders.map(order => (
              <div 
                key={order.id}
                onClick={() => navigateToOrderDetail(order.id)}
                className="p-3.5 rounded-xl border border-cream-200 hover:border-peach-300 bg-cream-50/40 hover:bg-peach-50/20 transition-all flex items-center justify-between cursor-pointer text-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center font-mono">
                    <span className="text-[10px] text-cocoa-400 block uppercase">Due</span>
                    <span className="font-bold text-cocoa-900 text-sm">{order.requestedDate.slice(5)}</span>
                  </div>
                  <div>
                    <span className="font-bold text-cocoa-900">{order.customerName} ({order.id})</span>
                    <p className="text-cocoa-600 mt-0.5">
                      {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ') || 'Custom Cake'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-cocoa-900">₹{order.totalAmount}</span>
                  <div className="text-[10px] text-peach-600 capitalize">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Kitchen Prep Checklist */}
      <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-cream-100">
          <div>
            <h3 className="font-serif font-bold text-sm text-cocoa-900">Today's Kitchen Prep Checklist</h3>
            <p className="text-xs text-cocoa-500 mt-0.5">Daily station prep tasks & dispatch milestones</p>
          </div>
          <span className="text-xs font-semibold text-cocoa-600">
            {tasks.filter(t => t.done).length} / {tasks.length} completed
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all text-xs ${
                task.done 
                  ? 'bg-emerald-50/50 border-emerald-200 text-cocoa-500 line-through' 
                  : 'bg-cream-50/60 border-cream-200 text-cocoa-900 hover:border-peach-300'
              }`}
            >
              {task.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-cocoa-400 shrink-0" />
              )}
              <span className="font-medium">{task.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
