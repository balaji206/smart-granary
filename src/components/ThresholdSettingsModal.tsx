import React, { useState } from 'react'
import { X, SlidersHorizontal, Check, Info, RefreshCw } from 'lucide-react'
import type { StorageThresholds } from '../types'
import { DEFAULT_THRESHOLDS } from '../data/mockData'

interface ThresholdSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  thresholds: StorageThresholds
  onSaveThresholds: (thresholds: StorageThresholds) => void
}

export const ThresholdSettingsModal: React.FC<ThresholdSettingsModalProps> = ({
  isOpen,
  onClose,
  thresholds,
  onSaveThresholds,
}) => {
  const [stableMaxDays, setStableMaxDays] = useState(thresholds.stableMaxDays)
  const [agingMaxDays, setAgingMaxDays] = useState(thresholds.agingMaxDays)
  const [highHumidityThreshold, setHighHumidityThreshold] = useState(
    thresholds.highHumidityThreshold
  )
  const [highTempThreshold, setHighTempThreshold] = useState(
    thresholds.highTempThreshold
  )

  if (!isOpen) return null

  const handleReset = () => {
    setStableMaxDays(DEFAULT_THRESHOLDS.stableMaxDays)
    setAgingMaxDays(DEFAULT_THRESHOLDS.agingMaxDays)
    setHighHumidityThreshold(DEFAULT_THRESHOLDS.highHumidityThreshold)
    setHighTempThreshold(DEFAULT_THRESHOLDS.highTempThreshold)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveThresholds({
      stableMaxDays: Number(stableMaxDays),
      agingMaxDays: Number(agingMaxDays),
      highHumidityThreshold: Number(highHumidityThreshold),
      highTempThreshold: Number(highTempThreshold),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Rule Engine Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Transparent decision-support parameter thresholds.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-900">
                Transparent Agricultural Rules (No Black Box)
              </p>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                In this hackathon prototype, storage duration is evaluated from <code>Current Date - Harvest Date</code> against these configurable boundaries. Adjusting them dynamically updates all charts and priority badges.
              </p>
            </div>
          </div>

          {/* Threshold inputs */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Stable Maximum Storage (Days):</span>
                <span className="font-mono text-emerald-800 font-bold">&le; {stableMaxDays} days</span>
              </div>
              <input
                type="number"
                min={30}
                max={180}
                value={stableMaxDays}
                onChange={(e) => setStableMaxDays(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-700 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Crops under this age are classified as <strong>Stable</strong> (Advisory: Continue Monitoring).
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Aging Limit (Days):</span>
                <span className="font-mono text-amber-700 font-bold">&le; {agingMaxDays} days</span>
              </div>
              <input
                type="number"
                min={stableMaxDays + 1}
                max={400}
                value={agingMaxDays}
                onChange={(e) => setAgingMaxDays(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-700 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Crops between {stableMaxDays + 1} and {agingMaxDays} days are <strong>Aging</strong> (Advisory: Review Soon). Beyond this is <strong>Priority</strong> (Review / Sell First).
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>High Humidity Alert Trigger (%):</span>
                <span className="font-mono text-rose-700 font-bold">&ge; {highHumidityThreshold}%</span>
              </div>
              <input
                type="number"
                min={60}
                max={90}
                value={highHumidityThreshold}
                onChange={(e) => setHighHumidityThreshold(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-700 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Triggers the <em>⚠️ Storage inspection recommended</em> banner across the dashboard.
              </p>
            </div>
          </div>

          {/* Academic / Production note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 block">Agronomic Note:</span>
            <p>
              Production thresholds should be crop-specific (oilseeds, pulses, and cereals have differing moisture equilibrium curves) and validated against agricultural storage research datasets.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Rules</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
