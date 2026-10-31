export type StorageStatus = 'Stable' | 'Aging' | 'Priority' | 'Inspection Required'

export type SellingRecommendation = 
  | 'Review / Sell First'
  | 'Review Soon'
  | 'Continue Monitoring'
  | 'Inspect Storage'

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export interface CropItem {
  id: string
  name: string
  quantity: number // in kilograms
  harvestDate: string // YYYY-MM-DD
  storageLocation: string // e.g. "Silo A-1", "Bay 2", "Dry Warehouse"
  moistureContent?: number // in %
  notes?: string
}

export interface EvaluatedCropItem extends CropItem {
  storageAgeDays: number
  status: StorageStatus
  priority: PriorityLevel
  recommendation: SellingRecommendation
  isInspectionRecommended: boolean
  formattedAge: string
  formattedQuantity: string
}

export interface StorageCondition {
  temperature: number // in °C
  humidity: number // in %
  totalCapacityKg: number // e.g. 6250 kg
  lastUpdated: string
  fanAegisStatus: 'Active' | 'Standby' | 'Warning'
  ambientWeather: string
}

export interface StorageThresholds {
  stableMaxDays: number // e.g. 90 days
  agingMaxDays: number // e.g. 270 days
  highHumidityThreshold: number // e.g. 75%
  highTempThreshold: number // e.g. 32°C
}

export interface RecommendationNotice {
  id: string
  type: 'critical' | 'warning' | 'stable' | 'info'
  cropId?: string
  cropName?: string
  title: string
  description: string
  actionLabel?: string
  timestamp?: string
}

export type NavigationTab = 'overview' | 'inventory' | 'storage' | 'recommendations' | 'reports'
