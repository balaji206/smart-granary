import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts'
import type { EvaluatedCropItem, StorageThresholds } from '../types'
import { Info } from 'lucide-react'

interface InventoryAgingChartProps {
  crops: EvaluatedCropItem[]
  thresholds: StorageThresholds
}

export const InventoryAgingChart: React.FC<InventoryAgingChartProps> = ({
  crops,
  thresholds,
}) => {
  // Prepare data for horizontal bar chart
  // Prompt order: Rice (77d), Groundnut (35d), Wheat (253d), Maize (298d) or sorted
  const chartData = crops.map((crop) => ({
    name: crop.name,
    days: crop.storageAgeDays,
    quantity: crop.quantity,
    status: crop.status,
    priority: crop.priority,
    color:
      crop.status === 'Priority'
        ? '#ef4444' // Rose/Red for Priority
        : crop.status === 'Aging'
        ? '#f59e0b' // Amber for Aging
        : '#10b981', // Emerald for Stable
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-bold flex items-center justify-between gap-3 text-sm">
            <span>{data.name}</span>
            <span
              className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: data.color }}
            >
              {data.status}
            </span>
          </div>
          <div className="text-slate-300">
            Storage Age: <span className="font-semibold text-white font-mono">{data.days} days</span>
          </div>
          <div className="text-slate-300">
            Current Stock: <span className="font-semibold text-white font-mono">{data.quantity.toLocaleString()} kg</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Classification rule: {data.days > thresholds.agingMaxDays ? '>270d Priority' : data.days > thresholds.stableMaxDays ? '91-270d Aging' : '<=90d Stable'}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Inventory Aging Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Days in granary storage relative to configured shelf-life thresholds.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Stable (&le;{thresholds.stableMaxDays}d)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Aging ({thresholds.stableMaxDays + 1}-{thresholds.agingMaxDays}d)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Priority (&gt;{thresholds.agingMaxDays}d)
          </span>
        </div>
      </div>

      {/* Recharts Horizontal Bar Chart */}
      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No crop data available to graph.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 'dataMax + 40']}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                unit=" d"
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 600 }}
                width={75}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <ReferenceLine
                x={thresholds.stableMaxDays}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: 'Stable limit',
                  position: 'top',
                  fill: '#10b981',
                  fontSize: 10,
                }}
              />
              <ReferenceLine
                x={thresholds.agingMaxDays}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: 'Priority cutoff',
                  position: 'top',
                  fill: '#ef4444',
                  fontSize: 10,
                }}
              />
              <Bar dataKey="days" radius={[0, 6, 6, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footnote */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Horizontal bar displays elapsed storage duration in days.
        </span>
        <span className="font-mono text-slate-500">
          Target turnaround &lt; 270 days
        </span>
      </div>
    </div>
  )
}
