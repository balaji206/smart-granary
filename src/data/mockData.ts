import type { CropItem, StorageCondition, StorageThresholds } from '../types'

export const DEFAULT_SIMULATION_DATE = '2026-09-25'

export const DEFAULT_THRESHOLDS: StorageThresholds = {
  stableMaxDays: 90,
  agingMaxDays: 270,
  highHumidityThreshold: 75,
  highTempThreshold: 32,
}

export const INITIAL_STORAGE_CONDITION: StorageCondition = {
  temperature: 28, // 28°C Normal
  humidity: 72,    // 72% Moderate
  totalCapacityKg: 6250, // 4,500 kg / 6,250 kg = 72% utilization
  lastUpdated: '10 mins ago',
  fanAegisStatus: 'Active',
  ambientWeather: 'Dry Sunny / 29°C outside',
}

export const INITIAL_CROPS: CropItem[] = [
  {
    id: 'crop-1',
    name: 'Rice',
    quantity: 2000,
    harvestDate: '2026-07-10',
    storageLocation: 'Silo Bay A-1',
    moistureContent: 12.8,
    notes: 'Long-grain variety, aerated bins, uniform drying applied.',
  },
  {
    id: 'crop-2',
    name: 'Wheat',
    quantity: 1200,
    harvestDate: '2026-01-15',
    storageLocation: 'Silo Bay B-2',
    moistureContent: 13.5,
    notes: 'Hard red winter wheat, inspected in June, approaching target turn cycle.',
  },
  {
    id: 'crop-3',
    name: 'Maize',
    quantity: 800,
    harvestDate: '2025-12-01',
    storageLocation: 'Granary Vault 3',
    moistureContent: 14.2,
    notes: 'Stored since late 2025. Storage duration exceeds 9 months; prompt market sale advised.',
  },
  {
    id: 'crop-4',
    name: 'Groundnut',
    quantity: 500,
    harvestDate: '2026-08-20',
    storageLocation: 'Dry Warehouse Bay 1',
    moistureContent: 8.5,
    notes: 'Freshly harvested pods, bagged in breathable jute, excellent stability.',
  },
]
