import React, { useState, useEffect } from 'react'
import { X, Wheat, Sparkles, Check, AlertCircle } from 'lucide-react'
import type { CropItem, EvaluatedCropItem, StorageThresholds } from '../types'
import { calculateStorageAge, evaluateCrop } from '../utils/calculator'

interface AddEditCropModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveCrop: (crop: CropItem) => void
  cropToEdit?: EvaluatedCropItem | null
  simulationDate: string
  thresholds: StorageThresholds
  currentHumidity: number
}

const COMMON_CROPS = [
  'Rice',
  'Wheat',
  'Maize',
  'Groundnut',
  'Barley',
  'Soybean',
  'Millets',
  'Sorghum',
  'Chickpeas',
]

const COMMON_LOCATIONS = [
  'Silo Bay A-1',
  'Silo Bay B-2',
  'Silo Bay C-3',
  'Granary Vault 1',
  'Granary Vault 3',
  'Dry Warehouse Bay 1',
  'Grain Bunker North',
]

export const AddEditCropModal: React.FC<AddEditCropModalProps> = ({
  isOpen,
  onClose,
  onSaveCrop,
  cropToEdit,
  simulationDate,
  thresholds,
  currentHumidity,
}) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number | ''>(1000)
  const [harvestDate, setHarvestDate] = useState('2026-06-01')
  const [storageLocation, setStorageLocation] = useState('Silo Bay A-1')
  const [moistureContent, setMoistureContent] = useState<number | ''>(12.5)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cropToEdit) {
      setName(cropToEdit.name)
      setQuantity(cropToEdit.quantity)
      setHarvestDate(cropToEdit.harvestDate)
      setStorageLocation(cropToEdit.storageLocation)
      setMoistureContent(cropToEdit.moistureContent ?? 12.0)
      setNotes(cropToEdit.notes ?? '')
    } else {
      setName('')
      setQuantity(1000)
      setHarvestDate('2026-06-01')
      setStorageLocation('Silo Bay A-1')
      setMoistureContent(12.5)
      setNotes('')
    }
    setError(null)
  }, [cropToEdit, isOpen])

  if (!isOpen) return null

  // Live preview evaluation
  const previewAge = calculateStorageAge(harvestDate || simulationDate, simulationDate)
  const dummyCrop: CropItem = {
    id: 'preview',
    name: name || 'Preview Crop',
    quantity: Number(quantity) || 0,
    harvestDate: harvestDate || simulationDate,
    storageLocation: storageLocation || 'Silo Bay A-1',
  }
  const previewEval = evaluateCrop(dummyCrop, simulationDate, thresholds, currentHumidity)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a crop name.')
      return
    }
    if (!quantity || Number(quantity) <= 0) {
      setError('Please provide a valid quantity in kg.')
      return
    }
    if (!harvestDate) {
      setError('Please select a harvest date.')
      return
    }

    const newCrop: CropItem = {
      id: cropToEdit ? cropToEdit.id : `crop-${Date.now()}`,
      name: name.trim(),
      quantity: Number(quantity),
      harvestDate,
      storageLocation: storageLocation.trim() || 'General Granary',
      moistureContent: moistureContent ? Number(moistureContent) : undefined,
      notes: notes.trim() || undefined,
    }

    onSaveCrop(newCrop)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Wheat className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {cropToEdit ? 'Edit Crop Lot' : 'Add New Stored Crop'}
              </h3>
              <p className="text-xs text-slate-500">
                Register batch lot into granary inventory.
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Crop Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Crop Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rice, Wheat, Maize, Groundnut..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_CROPS.slice(0, 5).map((crop) => (
                <button
                  type="button"
                  key={crop}
                  onClick={() => setName(crop)}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                >
                  +{crop}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Harvest Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity (kg) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  step={10}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  placeholder="2000"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                  kg
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harvest Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Storage Location & Moisture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Storage Location
              </label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {COMMON_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grain Moisture (%) <span className="text-slate-400 font-normal">Optional</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={5}
                  max={30}
                  step={0.1}
                  value={moistureContent}
                  onChange={(e) => setMoistureContent(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  placeholder="12.5"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Live Decision Support Preview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Live Rule Engine Preview
              </span>
              <span className="font-mono text-[11px]">
                Ref Date: {simulationDate}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Storage Age</p>
                <p className="font-bold text-slate-900 font-mono text-sm">{previewAge} days</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Status</p>
                <span
                  className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                    previewEval.status === 'Priority'
                      ? 'bg-rose-100 text-rose-800'
                      : previewEval.status === 'Aging'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {previewEval.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Advisory</p>
                <p className="font-semibold text-slate-800 truncate text-[11px]" title={previewEval.recommendation}>
                  {previewEval.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{cropToEdit ? 'Save Changes' : 'Add to Granary'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
