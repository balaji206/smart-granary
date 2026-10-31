import { 
  TrendingUp, 
  Clock, 
  PackageCheck,
  ChevronRight
} from 'lucide-react'
import type { EvaluatedCropItem } from '../types'

interface SellingPriorityCardProps {
  crops: EvaluatedCropItem[]
  onSelectCrop?: (crop: EvaluatedCropItem) => void
}

export const SellingPriorityCard: React.FC<SellingPriorityCardProps> = ({
  crops,
  onSelectCrop,
}) => {
  // Sort crops by priority & age: HIGH first, then MEDIUM, then LOW (and highest age)
  const sortedCrops = [...crops].sort((a, b) => {
    const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    const diff = priorityWeight[b.priority] - priorityWeight[a.priority]
    if (diff !== 0) return diff
    return b.storageAgeDays - a.storageAgeDays
  })

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Smart Selling Priority
              </h2>
              <p className="text-[11px] text-slate-500">
                Ranked liquidation advisory for granary inventory.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
            FIFO Decision Logic
          </span>
        </div>

        {/* Subtext description */}
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Priorities are based on storage age, quantity and configurable storage thresholds.
        </p>

        {/* Priority Ranked Cards */}
        <div className="mt-4 space-y-2.5">
          {sortedCrops.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No inventory to evaluate.</p>
          ) : (
            sortedCrops.map((crop, index) => {
              const isHigh = crop.priority === 'HIGH'
              const isMedium = crop.priority === 'MEDIUM'

              return (
                <div
                  key={crop.id}
                  onClick={() => onSelectCrop && onSelectCrop(crop)}
                  className={`p-3 rounded-lg border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                    isHigh
                      ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300'
                      : isMedium
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300'
                      : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-200'
                  }`}
                >
                  {/* Left: Index badge + Crop Details */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isHigh
                          ? 'bg-rose-600 text-white'
                          : isMedium
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{crop.name}</span>
                        <span className="text-xs text-slate-500 font-mono font-medium">
                          ({crop.quantity.toLocaleString()} kg)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {crop.storageAgeDays} days stored
                        </span>
                        <span>•</span>
                        <span>{crop.storageLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Priority Tag & Recommendation */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isMedium
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      Priority: {crop.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                      {crop.recommendation}
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer guideline */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
          High priority lots reduce quality degradation risk.
        </span>
        <span className="font-mono text-slate-500">
          Ranked by shelf-life & age
        </span>
      </div>
    </div>
  )
}
