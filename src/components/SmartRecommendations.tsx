import { 
  Sparkles, 
  ChevronRight
} from 'lucide-react'
import type { RecommendationNotice } from '../types'

interface SmartRecommendationsProps {
  recommendations: RecommendationNotice[]
  onOpenRules?: () => void
  onActionClick?: (cropId?: string) => void
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
  onOpenRules,
  onActionClick,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Today's Recommendations
              </h2>
              <p className="text-[11px] text-slate-500">
                Actionable storage and marketing guidance.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Decision Support
          </span>
        </div>

        {/* Recommendation Items List */}
        <div className="mt-4 space-y-3">
          {recommendations.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No recommendations generated. Add crops to evaluate.
            </p>
          ) : (
            recommendations.map((item) => {
              const isCritical = item.type === 'critical'
              const isWarning = item.type === 'warning'

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
                    isCritical
                      ? 'bg-rose-50/60 border-rose-200/80 hover:bg-rose-50'
                      : isWarning
                      ? 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
                      : 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/70'
                  }`}
                >
                  {/* Indicator Dot / Icon */}
                  <div className="pt-0.5 shrink-0">
                    {isCritical ? (
                      <span className="w-3 h-3 rounded-full bg-rose-600 block shadow-sm shadow-rose-600/50" />
                    ) : isWarning ? (
                      <span className="w-3 h-3 rounded-full bg-amber-500 block shadow-sm shadow-amber-500/50" />
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-emerald-600 block shadow-sm shadow-emerald-600/50" />
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 text-xs">
                    <p className={`font-semibold leading-snug ${
                      isCritical ? 'text-rose-950' : isWarning ? 'text-amber-950' : 'text-slate-900'
                    }`}>
                      {item.description}
                    </p>

                    {item.actionLabel && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => onActionClick && onActionClick(item.cropId)}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded transition inline-flex items-center gap-1 ${
                            isCritical
                              ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                              : isWarning
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          }`}
                        >
                          <span>{item.actionLabel}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer rule notice required by prompt */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="italic">
          Decision support is based on prototype inventory rules.
        </span>
        {onOpenRules && (
          <button
            onClick={onOpenRules}
            className="text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 transition"
          >
            View Logic
          </button>
        )}
      </div>
    </div>
  )
}
