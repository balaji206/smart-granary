import React from 'react'
import { 
  Thermometer, 
  Droplets, 
  Database, 
  AlertTriangle, 
  Sliders, 
  Wind 
} from 'lucide-react'
import type { StorageCondition } from '../types'

interface StorageConditionPanelProps {
  condition: StorageCondition
  onUpdateHumidity: (newHumidity: number) => void
  onUpdateTemperature: (newTemp: number) => void
  isHighHumidity: boolean
  highHumidityThreshold: number
}

export const StorageConditionPanel: React.FC<StorageConditionPanelProps> = ({
  condition,
  onUpdateHumidity,
  onUpdateTemperature,
  isHighHumidity,
  highHumidityThreshold,
}) => {
  const handlePresetSelect = (humidityVal: number, tempVal: number) => {
    onUpdateHumidity(humidityVal)
    onUpdateTemperature(tempVal)
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Storage Conditions
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Prototype Storage Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated granary microclimate parameters and capacity metrics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-mono text-slate-400">Live Sync</span>
          </div>
        </div>

        {/* High Humidity Alert Banner */}
        {isHighHumidity && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-rose-900">
                ⚠️ Storage inspection recommended
              </p>
              <p className="text-rose-700 mt-0.5 leading-relaxed">
                Granary relative humidity has spiked to <strong>{condition.humidity}%</strong> (exceeding safe limit of {highHumidityThreshold}%). High humidity increases risk of moisture migration and fungal spoil. Inspect bins and activate aeration fans.
              </p>
            </div>
          </div>
        )}

        {/* Primary Metric Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
          {/* Temperature */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Temperature</span>
              <Thermometer className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 font-sans">
                {condition.temperature}°C
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {condition.temperature > 30 ? 'Warm' : 'Normal'}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (condition.temperature / 45) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Safe zone: 15°C - 30°C</p>
          </div>

          {/* Humidity */}
          <div className={`p-3.5 rounded-lg border transition-all ${
            isHighHumidity 
              ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200' 
              : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Humidity</span>
              <Droplets className={`w-4 h-4 ${isHighHumidity ? 'text-rose-600' : 'text-blue-600'}`} />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className={`text-2xl font-extrabold font-sans ${isHighHumidity ? 'text-rose-700' : 'text-slate-900'}`}>
                {condition.humidity}%
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                isHighHumidity
                  ? 'bg-rose-100 text-rose-800'
                  : condition.humidity > 68
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isHighHumidity ? 'Critical' : condition.humidity > 68 ? 'Moderate' : 'Optimal'}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isHighHumidity ? 'bg-rose-600' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, condition.humidity)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Safe limit: &lt;{highHumidityThreshold}%
            </p>
          </div>

          {/* Storage Capacity */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Storage Capacity</span>
              <Database className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 font-sans">
                72%
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                Good
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-300"
                style={{ width: '72%' }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">4,500 / 6,250 kg utilized</p>
          </div>
        </div>

        {/* Warning text requested by prompt */}
        <p className="text-xs text-amber-800 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-lg mt-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>High humidity can require additional inspection.</span>
        </p>

        {/* Live Simulation Controls for Hackathon Judges */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              <span>Simulate Condition (Demo Control)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Test threshold trigger</span>
          </div>

          {/* Humidity Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Granary Humidity:</span>
              <span className="font-bold text-slate-900 font-mono">{condition.humidity}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              value={condition.humidity}
              onChange={(e) => onUpdateHumidity(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
          </div>

          {/* Quick Preset Buttons for presentation */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Quick Scenarios:</span>
            
            <button
              onClick={() => handlePresetSelect(65, 26)}
              className={`px-2.5 py-1 text-xs rounded-md border transition ${
                condition.humidity === 65
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Optimal Dry (65%)
            </button>

            <button
              onClick={() => handlePresetSelect(72, 28)}
              className={`px-2.5 py-1 text-xs rounded-md border transition ${
                condition.humidity === 72
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Standard (72%)
            </button>

            <button
              onClick={() => handlePresetSelect(82, 31)}
              className={`px-2.5 py-1 text-xs rounded-md border font-semibold transition ${
                condition.humidity === 82
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              ⚠️ High Humidity (82%)
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-slate-400" />
          Aegis Aeration Fans: {condition.fanAegisStatus}
        </span>
        <span className="font-mono text-slate-500">
          Last sync: {condition.lastUpdated}
        </span>
      </div>
    </div>
  )
}
