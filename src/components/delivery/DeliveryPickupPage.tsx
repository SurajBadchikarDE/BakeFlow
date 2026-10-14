import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const DeliveryPickupPage: React.FC = () => {
  const { settings, updateSettings, orders } = useBakery();

  const [pickupAddress, setPickupAddress] = useState(settings.pickupAddress);
  const [dailyCapacity, setDailyCapacity] = useState(settings.dailyOrderCapacity);
  const [zones, setZones] = useState(settings.deliveryZones);
  const [slots, setSlots] = useState(settings.pickupTimeSlots);

  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState(100);
  const [newZoneMin, setNewZoneMin] = useState(500);

  const [newSlot, setNewSlot] = useState('');

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;
    setZones([...zones, { zone: newZoneName, fee: Number(newZoneFee), minOrder: Number(newZoneMin) }]);
    setNewZoneName('');
  };

  const handleRemoveZone = (index: number) => {
    setZones(zones.filter((_, idx) => idx !== index));
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot) return;
    setSlots([...slots, newSlot]);
    setNewSlot('');
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, idx) => idx !== index));
  };

  const handleSaveAll = () => {
    updateSettings({
      pickupAddress,
      dailyOrderCapacity: Number(dailyCapacity),
      deliveryZones: zones,
      pickupTimeSlots: slots
    });
    alert("Delivery & Pickup settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-peach-50 text-peach-600 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base text-cocoa-900">Delivery Zones & Pickup Logistics</h2>
            <p className="text-xs text-cocoa-500">Configure delivery delivery radiuses, fees, and studio collection slots</p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-peach-500 hover:bg-peach-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (6 cols): Pickup Slots & Studio Address */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Pickup Address */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-peach-500" />
              <span>Baking Studio Pickup Location</span>
            </h3>
            <p className="text-xs text-cocoa-500">Address displayed to customers choosing "Studio Pickup":</p>
            <textarea
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900 font-sans"
            />
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 pb-2 border-b border-cream-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-peach-500" />
              <span>Available Daily Time Slots</span>
            </h3>

            <div className="space-y-2">
              {slots.map((slot, idx) => (
                <div key={idx} className="p-2.5 bg-cream-50 rounded-xl border border-cream-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-cocoa-800">{slot}</span>
                  {slots.length > 1 && (
                    <button
                      onClick={() => handleRemoveSlot(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSlot} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                placeholder="e.g. 08:00 PM - 10:00 PM"
                className="flex-1 p-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-cocoa-900"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl text-xs font-bold whitespace-nowrap"
              >
                + Add Slot
              </button>
            </form>
          </div>

        </div>

        {/* Right Column (6 cols): Delivery Zones & Daily Capacity */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Daily Kitchen Capacity Limit */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 pb-2 border-b border-cream-100">
              Daily Kitchen Production Capacity
            </h3>
            <p className="text-xs text-cocoa-500">
              Maximum custom orders accepted per calendar day before marking the date as booked out:
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="50"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(Number(e.target.value))}
                className="w-24 p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-sm font-bold text-cocoa-900"
              />
              <span className="text-xs text-cocoa-600 font-medium">orders per day</span>
            </div>
          </div>

          {/* Delivery Zones */}
          <div className="bg-white rounded-2xl border border-cream-200 p-5 shadow-soft space-y-3">
            <h3 className="font-serif font-bold text-sm text-cocoa-900 pb-2 border-b border-cream-100 flex items-center justify-between">
              <span>Configured Delivery Zones & Charges</span>
              <span className="text-xs text-cocoa-500 font-normal">{zones.length} zones active</span>
            </h3>

            <div className="space-y-2">
              {zones.map((zone, idx) => (
                <div key={idx} className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-cocoa-900 block">{zone.zone}</span>
                    <span className="text-[10px] text-cocoa-500">Min Order: ₹{zone.minOrder}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-peach-700 font-mono text-sm">₹{zone.fee}</span>
                    <button
                      onClick={() => handleRemoveZone(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddZone} className="p-3 bg-cream-100/60 rounded-xl border border-cream-200 space-y-2 text-xs">
              <span className="font-bold text-cocoa-800 block text-[11px]">Add New Delivery Zone</span>
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Zone / Neighborhood name (e.g. JP Nagar & Jayanagar)"
                className="w-full p-2 bg-white border border-cream-300 rounded-lg text-cocoa-900"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-cocoa-400 block">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={newZoneFee}
                    onChange={(e) => setNewZoneFee(Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-cream-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-cocoa-400 block">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newZoneMin}
                    onChange={(e) => setNewZoneMin(Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-cream-300 rounded text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-lg font-bold"
              >
                + Add Delivery Zone
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
