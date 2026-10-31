import React from 'react'
import { 
  Printer, 
  PieChart as PieChartIcon, 
  BarChart3
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from 'recharts'
import type { EvaluatedCropItem, StorageCondition, StorageThresholds } from '../types'
import { formatQuantityDisplay, formatDisplayDate } from '../utils/calculator'

interface ReportsPageProps {
  crops: EvaluatedCropItem[]
  condition: StorageCondition
  thresholds?: StorageThresholds
  simulationDate: string
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  crops,
  condition,
  simulationDate,
}) => {
  const totalStockKg = crops.reduce((sum, c) => sum + c.quantity, 0)
  const utilization = Math.round((totalStockKg / condition.totalCapacityKg) * 100)

  const stableKg = crops
    .filter((c) => c.status === 'Stable')
    .reduce((sum, c) => sum + c.quantity, 0)
  const agingKg = crops
    .filter((c) => c.status === 'Aging')
    .reduce((sum, c) => sum + c.quantity, 0)
  const priorityKg = crops
    .filter((c) => c.status === 'Priority')
    .reduce((sum, c) => sum + c.quantity, 0)

  // Chart 1: Stock by crop
  const cropStockData = crops.map((c) => ({
    name: c.name,
    quantity: c.quantity,
  }))

  // Chart 2: Inventory Status distribution
  const statusData = [
    { name: 'Stable Stock', value: stableKg, color: '#10b981' },
    { name: 'Aging Stock', value: agingKg, color: '#f59e0b' },
    { name: 'Priority Stock', value: priorityKg, color: '#ef4444' },
  ].filter((d) => d.value > 0)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Granary Status & Inventory Report
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Audit Date: {formatDisplayDate(simulationDate)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Formal inventory longevity audit, capacity allocation, and grain condition summary.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Stock</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {formatQuantityDisplay(totalStockKg)}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            {totalStockKg.toLocaleString()} kg stored
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Storage Utilization</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {utilization}%
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            Max: {condition.totalCapacityKg.toLocaleString()} kg
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Stable Inventory</span>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1 font-mono">
            {formatQuantityDisplay(stableKg)}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">
            {Math.round((stableKg / (totalStockKg || 1)) * 100)}% of stock
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-sm">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Aging Inventory</span>
          <p className="text-2xl font-extrabold text-amber-900 mt-1 font-mono">
            {formatQuantityDisplay(agingKg)}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">
            {Math.round((agingKg / (totalStockKg || 1)) * 100)}% of stock
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase">Priority Inventory</span>
          <p className="text-2xl font-extrabold text-rose-900 mt-1 font-mono">
            {formatQuantityDisplay(priorityKg)}
          </p>
          <span className="text-[11px] text-rose-700 font-medium">
            {Math.round((priorityKg / (totalStockKg || 1)) * 100)}% of stock
          </span>
        </div>
      </div>

      {/* Charts Section: 2 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Stock by Crop */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Stock by Crop (kg)</h2>
              <p className="text-xs text-slate-500">Volume distribution across crop types.</p>
            </div>
            <BarChart3 className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropStockData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()} kg`, 'Quantity']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="quantity" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Inventory Status Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Aging Risk Breakdown</h2>
              <p className="text-xs text-slate-500">Proportion of stock in each decision category.</p>
            </div>
            <PieChartIcon className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString()} kg`, 'Quantity']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabular Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Crop Longevity & Storage Audit</h2>
          <span className="text-[11px] text-slate-500 font-mono">Granary Unit #4</span>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] text-slate-500 uppercase font-semibold">
              <th className="py-2.5 px-4">Crop Name</th>
              <th className="py-2.5 px-4 text-right">Stored Quantity</th>
              <th className="py-2.5 px-4">Harvest Date</th>
              <th className="py-2.5 px-4">Storage Duration</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4">Advisory Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {crops.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">{c.quantity.toLocaleString()} kg</td>
                <td className="py-3 px-4 text-slate-600">{formatDisplayDate(c.harvestDate)}</td>
                <td className="py-3 px-4 font-mono text-slate-800">{c.storageAgeDays} days</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    c.status === 'Priority'
                      ? 'bg-rose-100 text-rose-800'
                      : c.status === 'Aging'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-800">{c.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
