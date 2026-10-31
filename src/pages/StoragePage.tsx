import React from 'react'
import { 
  AlertTriangle, 
  CheckCircle2, 
  Wind, 
  Sliders
} from 'lucide-react'
import type { EvaluatedCropItem, StorageCondition, StorageThresholds } from '../types'

interface StoragePageProps {
  crops: EvaluatedCropItem[]
  condition: StorageCondition
  thresholds: StorageThresholds
  onUpdateHumidity: (humidity: number) => void
  onUpdateTemperature: (temp: number) => void
  isHighHumidity: boolean
}

export const StoragePage: React.FC<StoragePageProps> = ({
  crops,
  condition,
  thresholds,
  onUpdateHumidity,
  onUpdateTemperature,
  isHighHumidity,
}) => {
  const totalStockKg = crops.reduce((sum, c) => sum + c.quantity, 0)
  const utilization = Math.round((totalStockKg / condition.totalCapacityKg) * 100)

  // Map crops to their physical bays
  const bays = [
    {
      bayId: 'Silo Bay A-1',
      crop: crops.find((c) => c.storageLocation.includes('A-1')) || crops[0],
      capacity: 2500,
      ventilation: 'Active Aeration',
    },
    {
      bayId: 'Silo Bay B-2',
      crop: crops.find((c) => c.storageLocation.includes('B-2')) || crops[1],
      capacity: 2000,
      ventilation: 'Low-Flow Fan',
    },
    {
      bayId: 'Granary Vault 3',
      crop: crops.find((c) => c.storageLocation.includes('Vault 3')) || crops[2],
      capacity: 1000,
      ventilation: 'Sealed Desiccant',
    },
    {
      bayId: 'Dry Warehouse Bay 1',
      crop: crops.find((c) => c.storageLocation.includes('Warehouse')) || crops[3],
      capacity: 750,
      ventilation: 'Natural Crossflow',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Storage Facility Monitoring
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Prototype Storage Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Simulated environmental conditions and bin utilization across Granary Unit #4.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-3">
          {isHighHumidity ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Inspection Recommended</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Conditions Nominal</span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Alert Notice if Humidity is High */}
      {isHighHumidity && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-xs text-rose-900 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">⚠️ Storage inspection recommended</p>
            <p className="text-rose-800 leading-relaxed">
              Relative humidity has reached <strong>{condition.humidity}%</strong> (threshold: &ge;{thresholds.highHumidityThreshold}%). High humidity increases the risk of moisture absorption in grains, mold incubation, and thermal hot spots. Inspect silos, ensure rain seals are intact, and switch aeration fans to maximum displacement.
            </p>
          </div>
        </div>
      )}

      {/* Simulation Controls Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Interactive Environmental Simulation</span>
            </h2>
            <p className="text-xs text-slate-500">
              Change environmental variables to demonstrate live alert thresholds.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Hackathon Demo Control
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Humidity Slider & Presets */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Granary Humidity:</span>
              <span className={`font-mono font-bold text-sm ${isHighHumidity ? 'text-rose-600' : 'text-slate-900'}`}>
                {condition.humidity}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              value={condition.humidity}
              onChange={(e) => onUpdateHumidity(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onUpdateHumidity(65)}
                className="px-2.5 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 font-medium text-slate-600"
              >
                Dry (65%)
              </button>
              <button
                onClick={() => onUpdateHumidity(72)}
                className="px-2.5 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 font-medium text-slate-600"
              >
                Moderate (72%)
              </button>
              <button
                onClick={() => onUpdateHumidity(82)}
                className="px-2.5 py-1 text-xs rounded border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold"
              >
                ⚠️ Spike Alert (82%)
              </button>
            </div>
          </div>

          {/* Temperature Slider & Presets */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Granary Ambient Temperature:</span>
              <span className="font-mono font-bold text-sm text-slate-900">
                {condition.temperature}°C
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={42}
              value={condition.temperature}
              onChange={(e) => onUpdateTemperature(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onUpdateTemperature(22)}
                className="px-2.5 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 font-medium text-slate-600"
              >
                Cool (22°C)
              </button>
              <button
                onClick={() => onUpdateTemperature(28)}
                className="px-2.5 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 font-medium text-slate-600"
              >
                Normal (28°C)
              </button>
              <button
                onClick={() => onUpdateTemperature(34)}
                className="px-2.5 py-1 text-xs rounded border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold"
              >
                Warm (34°C)
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-amber-800 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-lg">
          <strong>Notice:</strong> High humidity can require additional inspection.
        </p>
      </div>

      {/* Silo Bay Visualizer */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Silo & Storage Bays
            </h2>
            <p className="text-xs text-slate-500">
              Physical grain allocation across storage structures.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {utilization}% Total Capacity ({totalStockKg.toLocaleString()} / {condition.totalCapacityKg.toLocaleString()} kg)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bays.map((bay, idx) => {
            const crop = bay.crop
            const fillPercent = crop
              ? Math.min(100, Math.round((crop.quantity / bay.capacity) * 100))
              : 0

            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{bay.bayId}</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Max: {bay.capacity.toLocaleString()} kg
                  </span>
                </div>

                {crop ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{crop.name}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            crop.status === 'Priority'
                              ? 'bg-rose-100 text-rose-800'
                              : crop.status === 'Aging'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {crop.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex justify-between">
                        <span>Stored: {crop.quantity.toLocaleString()} kg</span>
                        <span className="font-mono font-medium">{crop.storageAgeDays}d</span>
                      </div>
                    </div>

                    {/* Fill Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Fill Level</span>
                        <span className="font-mono font-semibold">{fillPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHighHumidity
                              ? 'bg-rose-500'
                              : fillPercent > 80
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-slate-400" />
                        {bay.ventilation}
                      </span>
                      <span>{crop.recommendation}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Bay currently empty.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
