import { useState, useMemo } from 'react'
import {
  Search,
  ArrowUpDown,
  Trash2,
  Edit3,
  Plus,
  MapPin,
  AlertCircle
} from 'lucide-react'
import type { EvaluatedCropItem, StorageStatus } from '../types'
import { formatDisplayDate } from '../utils/calculator'

interface InventoryTableProps {
  crops: EvaluatedCropItem[]
  onDeleteCrop: (id: string) => void
  onEditCrop: (crop: EvaluatedCropItem) => void
  onOpenAddModal: () => void
}

type SortField = 'storageAgeDays' | 'quantity' | 'name'
type SortOrder = 'asc' | 'desc'

export const InventoryTable: React.FC<InventoryTableProps> = ({
  crops,
  onDeleteCrop,
  onEditCrop,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | StorageStatus>('All')
  const [sortField, setSortField] = useState<SortField>('storageAgeDays')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Filter and sort crops
  const filteredCrops = useMemo(() => {
    return crops
      .filter((crop) => {
        const matchesSearch =
          crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.storageLocation.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
          statusFilter === 'All' ? true : crop.status === statusFilter

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        let valA: number | string = a[sortField]
        let valB: number | string = b[sortField]

        if (sortField === 'name') {
          return sortOrder === 'asc'
            ? valA.toString().localeCompare(valB.toString())
            : valB.toString().localeCompare(valA.toString())
        }

        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number)
      })
  }, [crops, searchQuery, statusFilter, sortField, sortOrder])

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder(field === 'name' ? 'asc' : 'desc')
    }
  }

  const renderStatusBadge = (status: StorageStatus) => {
    switch (status) {
      case 'Stable':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Stable
          </span>
        )
      case 'Aging':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Aging
          </span>
        )
      case 'Priority':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Priority
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        )
    }
  }

  const renderPriorityBadge = (recommendation: string) => {
    if (recommendation.includes('Sell First')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Review / Sell First
        </span>
      )
    }
    if (recommendation.includes('Soon')) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
          Review Soon
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 bg-emerald-50/70 px-2 py-1 rounded-md border border-emerald-100">
        Continue Monitoring
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header and Controls */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Current Inventory
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                {crops.length} Lots
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live grain stock classified by storage age and sell-priority rules.
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Crop</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop or storage bay..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Status:</span>
            {(['All', 'Stable', 'Aging', 'Priority'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${statusFilter === filter
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th
                className="py-3 px-5 cursor-pointer hover:text-slate-800 transition select-none"
                onClick={() => handleSortToggle('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Crop</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-800 transition select-none text-right"
                onClick={() => handleSortToggle('quantity')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Quantity</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Harvest Date</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-slate-800 transition select-none"
                onClick={() => handleSortToggle('storageAgeDays')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Storage Age</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Storage Status</th>
              <th className="py-3 px-4">Priority & Recommendation</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCrops.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                  No crops matching the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredCrops.map((crop) => (
                <tr
                  key={crop.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Crop Name & Location */}
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{crop.name}</span>
                      {crop.notes && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" title={crop.notes} />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{crop.storageLocation}</span>
                      {crop.moistureContent && (
                        <span className="ml-2 font-mono text-[10px] text-slate-500 bg-slate-100 px-1 rounded">
                          {crop.moistureContent}% moist
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 text-sm">
                    {crop.quantity.toLocaleString()} kg
                  </td>

                  {/* Harvest Date */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {formatDisplayDate(crop.harvestDate)}
                  </td>

                  {/* Storage Age */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 font-mono">
                      {crop.formattedAge}
                    </div>
                    <div className="w-24 bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${crop.status === 'Priority'
                            ? 'bg-rose-500'
                            : crop.status === 'Aging'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        style={{
                          width: `${Math.min(100, (crop.storageAgeDays / 365) * 100)}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    {renderStatusBadge(crop.status)}
                  </td>

                  {/* Priority / Recommendation */}
                  <td className="py-3.5 px-4">
                    {renderPriorityBadge(crop.recommendation)}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEditCrop(crop)}
                        className="p-1.5 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                        title="Edit lot details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCrop(crop.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Remove crop lot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Showing {filteredCrops.length} of {crops.length} lots</span>
        <span className="font-mono">Storage duration calculated from harvest date</span>
      </div>
    </div>
  )
}
