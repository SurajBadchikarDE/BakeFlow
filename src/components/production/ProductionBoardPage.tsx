import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ProductionStage } from '../../types';
import { 
  Columns, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Layers
} from 'lucide-react';

export const ProductionBoardPage: React.FC = () => {
  const { 
    orders, 
    updateOrderProductionStage, 
    navigateToOrderDetail, 
    settings 
  } = useBakery();

  const stages: { id: ProductionStage; label: string; icon: string; color: string; desc: string }[] = [
    { id: 'to_prepare', label: 'To Prepare', icon: '🥣', color: 'border-blue-300 bg-blue-50/40 text-blue-900', desc: 'Mise en place & weighing' },
    { id: 'baking', label: 'Baking', icon: '🔥', color: 'border-amber-300 bg-amber-50/40 text-amber-900', desc: 'In ovens baking' },
    { id: 'cooling', label: 'Cooling & Resting', icon: '❄️', color: 'border-sky-300 bg-sky-50/40 text-sky-900', desc: 'Chilling on wire racks' },
    { id: 'decorating', label: 'Decorating', icon: '🎨', color: 'border-purple-300 bg-purple-50/40 text-purple-900', desc: 'Layering, ganache, piping' },
    { id: 'packaging', label: 'Packaging', icon: '🎁', color: 'border-pink-300 bg-pink-50/40 text-pink-900', desc: 'Boxing, ribbons & tags' },
    { id: 'ready', label: 'Ready for Dispatch', icon: '✅', color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900', desc: 'Tagged in pickup chiller' },
  ];

  // Exclude cancelled and completed orders from active board
  const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'rejected' && o.status !== 'completed');

  const moveOrder = (orderId: string, currentStage: ProductionStage, direction: 'prev' | 'next') => {
    const stageIds = stages.map(s => s.id);
    const currentIndex = stageIds.indexOf(currentStage);
    if (direction === 'next' && currentIndex < stageIds.length - 1) {
      updateOrderProductionStage(orderId, stageIds[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      updateOrderProductionStage(orderId, stageIds[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner with Kitchen Capacity */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Kitchen Production Pipeline (Kanban)</h2>
            <p className="text-xs text-cocoa-500">Live stage progression from raw sponge baking to packaging</p>
          </div>
        </div>

        {/* Capacity Meter */}
        <div className="flex items-center gap-3 bg-cream-50 px-3 py-2 rounded-xl border border-cream-200">
          <div className="text-xs">
            <span className="text-cocoa-500 block text-[10px] uppercase font-bold">Daily Kitchen Load</span>
            <span className="font-bold text-cocoa-900">
              {activeOrders.length} / {settings.dailyOrderCapacity} Orders
            </span>
          </div>
          <div className="w-24 bg-cream-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                activeOrders.length > settings.dailyOrderCapacity ? 'bg-red-500' : 'bg-peach-500'
              }`}
              style={{ width: `${Math.min(100, (activeOrders.length / settings.dailyOrderCapacity) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {stages.map((stage, stageIdx) => {
          const stageOrders = activeOrders.filter(o => (o.productionStage || 'to_prepare') === stage.id);

          return (
            <div 
              key={stage.id}
              className="bg-cream-100/60 rounded-2xl border border-cream-200/90 p-3 flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cream-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{stage.icon}</span>
                  <div>
                    <h3 className="font-serif font-bold text-xs text-cocoa-900 leading-tight">
                      {stage.label}
                    </h3>
                    <p className="text-[9px] text-cocoa-400 leading-none mt-0.5">{stage.desc}</p>
                  </div>
                </div>
                <span className="w-5 h-5 rounded-full bg-cream-200 text-cocoa-800 text-[10px] font-bold flex items-center justify-center">
                  {stageOrders.length}
                </span>
              </div>

              {/* Order Cards List */}
              <div className="space-y-2.5 flex-1">
                {stageOrders.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-cocoa-400 border border-dashed border-cream-300 rounded-xl bg-white/40">
                    No orders at this stage
                  </div>
                ) : (
                  stageOrders.map(order => (
                    <div 
                      key={order.id}
                      className="bg-white rounded-xl border border-cream-200 shadow-soft hover:shadow-card hover:border-peach-300 p-3 transition-all space-y-2 text-xs"
                    >
                      {/* Header of card */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigateToOrderDetail(order.id)}
                          className="font-bold text-cocoa-900 hover:text-peach-600 font-mono text-[11px]"
                        >
                          #{order.id}
                        </button>
                        <span className="text-[10px] font-semibold text-cocoa-500 bg-cream-100 px-1.5 py-0.5 rounded">
                          {order.deliveryTimeSlot.split(' - ')[0]}
                        </span>
                      </div>

                      {/* Customer Name */}
                      <div className="font-semibold text-cocoa-800 text-[11px]">
                        {order.customerName}
                      </div>

                      {/* Item description */}
                      <div className="text-[11px] text-cocoa-600 bg-cream-50 p-2 rounded-lg border border-cream-100">
                        {order.customCakeDetails ? (
                          <div className="font-medium text-peach-700">
                            🎂 {order.customCakeDetails.cakeType}
                            <span className="block text-[10px] text-cocoa-500 font-normal">
                              {order.customCakeDetails.flavor} ({order.customCakeDetails.servings} pax)
                            </span>
                          </div>
                        ) : (
                          order.items.map(i => (
                            <div key={i.id} className="truncate">
                              {i.quantity}x {i.productName} ({i.variantName})
                            </div>
                          ))
                        )}
                      </div>

                      {/* Allergy pill if present */}
                      {order.allergyNotes && (
                        <div className="text-[9px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold truncate">
                          ⚠️ {order.allergyNotes}
                        </div>
                      )}

                      {/* Due date tag */}
                      <div className="text-[10px] text-cocoa-400 flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-peach-500" />
                          Due: {order.requestedDate.slice(5)}
                        </span>
                        <span className="capitalize font-medium text-cocoa-600">{order.deliveryType}</span>
                      </div>

                      {/* Direction Move Buttons */}
                      <div className="pt-2 border-t border-cream-100 flex items-center justify-between gap-1">
                        {stageIdx > 0 ? (
                          <button
                            onClick={() => moveOrder(order.id, stage.id, 'prev')}
                            className="p-1 hover:bg-cream-100 text-cocoa-600 rounded transition-colors text-[10px] flex items-center gap-0.5"
                            title="Move to previous stage"
                          >
                            <ChevronLeft className="w-3 h-3" />
                            <span>Back</span>
                          </button>
                        ) : <div />}

                        <button
                          onClick={() => navigateToOrderDetail(order.id)}
                          className="text-[10px] text-cocoa-500 hover:text-cocoa-800 font-medium"
                        >
                          View
                        </button>

                        {stageIdx < stages.length - 1 && (
                          <button
                            onClick={() => moveOrder(order.id, stage.id, 'next')}
                            className="px-2 py-0.8 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded text-[10px] font-bold transition-colors flex items-center gap-0.5 ml-auto"
                            title="Advance to next stage"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3 h-3 text-peach-300" />
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
