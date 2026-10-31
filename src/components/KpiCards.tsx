import { 
  Boxes, 
  Layers, 
  AlertCircle, 
  PieChart, 
  CheckCircle2
} from 'lucide-react'
import type { EvaluatedCropItem } from '../types'
import { formatQuantityDisplay } from '../utils/calculator'

interface KpiCardsProps {
  crops: EvaluatedCropItem[]
  totalCapacityKg: number
  isHighHumidity: boolean
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  crops,
  totalCapacityKg,
  isHighHumidity,
}) => {
  // Calculations
  const totalStockKg = crops.reduce((sum, c) => sum + c.quantity, 0)
  const formattedTotalStock = formatQuantityDisplay(totalStockKg)
  const cropTypesCount = new Set(crops.map((c) => c.name.toLowerCase().trim())).size

  const agingCount = crops.filter((c) => c.status === 'Aging').length
  const priorityCount = crops.filter((c) => c.status === 'Priority').length
  const needsAttentionCount = agingCount + priorityCount + (isHighHumidity ? 1 : 0)

  const utilizationPercent = Math.min(
    100,
    Math.round((totalStockKg / (totalCapacityKg || 6250)) * 100)
  )

  const cards = [
    {
      label: 'TOTAL STOCK',
      value: formattedTotalStock,
      context: `${totalStockKg.toLocaleString()} kg stored across ${crops.length} batch lots`,
      icon: Boxes,
      iconBg: 'bg-emerald-50 text-emerald-800 border-emerald-100',
      badge: '+12% vs last month',
      badgeColor: 'text-emerald-700 bg-emerald-50',
      accentBorder: 'hover:border-emerald-300',
    },
    {
      label: 'CROP TYPES',
      value: cropTypesCount.toString(),
      context: crops.map(c => c.name).slice(0, 3).join(', ') + (crops.length > 3 ? '...' : ''),
      icon: Layers,
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      badge: 'Diversified',
      badgeColor: 'text-slate-600 bg-slate-100',
      accentBorder: 'hover:border-slate-300',
    },
    {
      label: 'NEEDS ATTENTION',
      value: needsAttentionCount.toString(),
      context: isHighHumidity
        ? 'High humidity alert + aging grain lots'
        : `${priorityCount} Priority, ${agingCount} Aging lot`,
      icon: needsAttentionCount > 0 ? AlertCircle : CheckCircle2,
      iconBg: needsAttentionCount > 0 
        ? 'bg-amber-50 text-amber-700 border-amber-200' 
        : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: needsAttentionCount > 0 ? 'Action Required' : 'All Nominal',
      badgeColor: needsAttentionCount > 0 ? 'text-amber-800 bg-amber-100' : 'text-emerald-800 bg-emerald-100',
      accentBorder: needsAttentionCount > 0 ? 'hover:border-amber-300' : 'hover:border-emerald-300',
    },
    {
      label: 'STORAGE UTILIZATION',
      value: `${utilizationPercent}%`,
      context: `${(totalCapacityKg - totalStockKg).toLocaleString()} kg remaining capacity`,
      icon: PieChart,
      iconBg: 'bg-teal-50 text-teal-800 border-teal-100',
      badge: 'Optimal Fill',
      badgeColor: 'text-teal-800 bg-teal-100/70',
      accentBorder: 'hover:border-teal-300',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-200 ${card.accentBorder} hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {card.value}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 truncate font-medium">
              {card.context}
            </p>
          </div>
        )
      })}
    </div>
  )
}
