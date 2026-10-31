import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  MapPin, 
  Edit3, 
  Trash2, 
  Download
} from 'lucide-react'
import type { EvaluatedCropItem, StorageStatus } from '../types'
import { formatDisplayDate, formatQuantityDisplay } from '../utils/calculator'

interface InventoryPageProps {
  crops: EvaluatedCropItem[]
  onDeleteCrop: (id: string) => void
  onEditCrop: (crop: EvaluatedCropItem) => void
  onOpenAddModal: () => void
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  crops,
  onDeleteCrop,
  onEditCrop,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | StorageStatus>('All')

  const totalKg = crops.reduce((sum, c) => sum + c.quantity, 0)
  const stableCount = crops.filter(c => c.status === 'Stable').length
  const agingCount = crops.filter(c => c.status === 'Aging').length
  const priorityCount = crops.filter(c => c.status === 'Priority').length

  const filtered = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.storageLocation.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'All' ? true : crop.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Export CSV mock
  const handleExportCSV = () => {
    const headers = 'ID,Crop,Quantity (kg),Harvest Date,Storage Age (days),Status,Priority,Location\n'
    const rows = crops
      .map(
        (c) =>
          `"${c.id}","${c.name}",${c.quantity},"${c.harvestDate}",${c.storageAgeDays},"${c.status}","${c.priority}","${c.storageLocation}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `SmartGranary_Inventory_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Granary Inventory Lots
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
              {crops.length} Batches Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Detailed registry of stored grain varieties, harvest timestamps, calculated storage longevity, and assigned granary bays.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Crop</span>
          </button>
        </div>
      </div>

      {/* Lot Status Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Inventory</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{formatQuantityDisplay(totalKg)}</p>
          <span className="text-[11px] text-slate-500">{totalKg.toLocaleString()} kg active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/60 bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Stable Lots</span>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1 font-mono">{stableCount}</p>
          <span className="text-[11px] text-emerald-700">&le; 90 days stored</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/60 bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Aging Lots</span>
          <p className="text-2xl font-extrabold text-amber-900 mt-1 font-mono">{agingCount}</p>
          <span className="text-[11px] text-amber-700">91-270 days stored</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200/60 bg-rose-50/20">
          <span className="text-[11px] font-bold text-rose-700 uppercase">Priority Lots</span>
          <p className="text-2xl font-extrabold text-rose-900 mt-1 font-mono">{priorityCount}</p>
          <span className="text-[11px] text-rose-700">&gt; 270 days stored</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop name, bay location, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter by Status:</span>
          {(['All', 'Stable', 'Aging', 'Priority'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((crop) => {
          const isHigh = crop.priority === 'HIGH'
          const isMedium = crop.priority === 'MEDIUM'

          return (
            <div
              key={crop.id}
              className={`bg-white rounded-xl p-5 border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                isHigh
                  ? 'border-rose-200 bg-rose-50/10'
                  : isMedium
                  ? 'border-amber-200 bg-amber-50/10'
                  : 'border-slate-200/90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {crop.storageLocation}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stock Weight:</span>
                    <span className="font-mono font-bold text-slate-900">{crop.quantity.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Harvest Date:</span>
                    <span className="text-slate-700 font-medium">{formatDisplayDate(crop.harvestDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Storage Age:</span>
                    <span className="font-mono font-bold text-slate-900">{crop.storageAgeDays} days</span>
                  </div>
                  {crop.moistureContent && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Grain Moisture:</span>
                      <span className="font-mono text-slate-700">{crop.moistureContent}%</span>
                    </div>
                  )}
                </div>

                {crop.notes && (
                  <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic line-clamp-2">
                    "{crop.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${
                  isHigh ? 'text-rose-700' : isMedium ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {crop.recommendation}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCrop(crop)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                    title="Edit lot"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCrop(crop.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    title="Delete lot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
