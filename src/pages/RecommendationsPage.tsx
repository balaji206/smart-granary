import React from 'react'
import { 
  Info, 
  SlidersHorizontal,
  AlertTriangle
} from 'lucide-react'
import type { EvaluatedCropItem, RecommendationNotice, StorageThresholds } from '../types'
import { formatDisplayDate } from '../utils/calculator'

interface RecommendationsPageProps {
  crops: EvaluatedCropItem[]
  recommendations: RecommendationNotice[]
  thresholds: StorageThresholds
  isHighHumidity?: boolean
  onOpenRules: () => void
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  crops,
  recommendations,
  thresholds,
  isHighHumidity = false,
  onOpenRules,
}) => {
  // Sort crops by priority: HIGH first
  const sortedCrops = [...crops].sort((a, b) => b.storageAgeDays - a.storageAgeDays)

  return (
    <div className="space-y-6">
      {/* High Humidity Alert if active */}
      {isHighHumidity && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-xs text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Storage Inspection Alert Active</p>
            <p className="text-rose-800 mt-0.5">
              High humidity condition detected (&ge;{thresholds.highHumidityThreshold}%). Review storage ventilation before approving long-term holding of aging grains.
            </p>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Storage & Marketing Decision Support
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Rule-Based Advisory
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            SmartGranary evaluates storage longevity against agronomic risk curves to advise farmers on which crops to prioritize for inspection or market release.
          </p>
        </div>

        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
          <span>Configured Thresholds</span>
        </button>
      </div>

      {/* Decision Support Positioning Disclaimer Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-emerald-900">
            About This Decision Support System
          </p>
          <p className="text-emerald-800 leading-relaxed text-[11px]">
            This prototype assists farm managers with objective, rule-based inventory tracking. It does not predict future commodity market swings or guarantee profits; rather, it minimizes quality loss by surfacing aging inventory before nutritional and moisture degradation occur.
          </p>
        </div>
      </div>

      {/* Today's Recommendations List */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Active Advisory Actions
            </h2>
            <p className="text-xs text-slate-500">
              Generated using current granary reference date and environmental readings.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
            {recommendations.length} Active Items
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((item) => {
            const isCritical = item.type === 'critical'
            const isWarning = item.type === 'warning'

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                  isCritical
                    ? 'bg-rose-50/70 border-rose-200'
                    : isWarning
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-emerald-50/50 border-emerald-100'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCritical ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 block shadow-sm shadow-rose-600/50" />
                  ) : isWarning ? (
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 block shadow-sm shadow-amber-500/50" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 block shadow-sm shadow-emerald-600/50" />
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <p className={`font-bold text-sm ${
                      isCritical ? 'text-rose-950' : isWarning ? 'text-amber-950' : 'text-emerald-950'
                    }`}>
                      {item.title}
                    </p>
                    {item.actionLabel && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCritical ? 'bg-rose-200 text-rose-900' : isWarning ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {item.actionLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-slate-700 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-slate-500 italic pt-2">
          Decision support is based on prototype inventory rules.
        </p>
      </div>

      {/* Crop Decision Matrix Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Grain Turnaround & Selling Priority Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rationale breakdown for each crop currently stored in the facility.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedCrops.map((crop) => (
            <div key={crop.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{crop.name}</span>
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    {crop.quantity.toLocaleString()} kg
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    crop.priority === 'HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : crop.priority === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {crop.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Harvested {formatDisplayDate(crop.harvestDate)} &bull; Stored for{' '}
                  <strong className="text-slate-800 font-mono">{crop.storageAgeDays} days</strong> in{' '}
                  {crop.storageLocation}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {crop.recommendation}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {crop.storageAgeDays > thresholds.agingMaxDays
                      ? 'Exceeds max aging threshold'
                      : crop.storageAgeDays > thresholds.stableMaxDays
                      ? 'Approaching threshold turn'
                      : 'Within fresh safety envelope'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
