import type { 
  CropItem, 
  EvaluatedCropItem, 
  StorageStatus, 
  PriorityLevel, 
  SellingRecommendation, 
  StorageThresholds, 
  RecommendationNotice 
} from '../types'

/**
 * Calculates storage age in integer days between harvest date and reference date.
 */
export function calculateStorageAge(harvestDateStr: string, referenceDateStr: string): number {
  const harvest = new Date(harvestDateStr)
  const current = new Date(referenceDateStr)
  
  harvest.setHours(0, 0, 0, 0)
  current.setHours(0, 0, 0, 0)
  
  const diffTime = current.getTime() - harvest.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Formats a YYYY-MM-DD date into friendly readable form: "10 Jul 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const date = new Date(year, month, day)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    }
    return dateStr
  } catch {
    return dateStr
  }
}

/**
 * Formats quantity with appropriate units (kg or Tons).
 */
export function formatQuantityDisplay(kg: number): string {
  if (kg >= 1000) {
    const tons = kg / 1000
    return `${tons % 1 === 0 ? tons.toFixed(0) : tons.toFixed(1)} Tons`
  }
  return `${kg.toLocaleString()} kg`
}

/**
 * Evaluates an individual crop's storage age, priority, and recommendation
 * based on transparent, configurable rules.
 * 
 * NOTE: For production deployments, thresholds should be crop-specific 
 * (e.g. oilseeds like Groundnut have different moisture/rancidity curves than cereal grains)
 * and calibrated against agronomic storage standards.
 */
export function evaluateCrop(
  crop: CropItem,
  referenceDate: string,
  thresholds: StorageThresholds,
  currentHumidity: number
): EvaluatedCropItem {
  const storageAgeDays = calculateStorageAge(crop.harvestDate, referenceDate)
  const isHighHumidity = currentHumidity >= thresholds.highHumidityThreshold

  let status: StorageStatus = 'Stable'
  let priority: PriorityLevel = 'LOW'
  let recommendation: SellingRecommendation = 'Continue Monitoring'

  if (storageAgeDays > thresholds.agingMaxDays) {
    status = 'Priority'
    priority = 'HIGH'
    recommendation = 'Review / Sell First'
  } else if (storageAgeDays > thresholds.stableMaxDays) {
    status = 'Aging'
    priority = 'MEDIUM'
    recommendation = 'Review Soon'
  } else {
    status = 'Stable'
    priority = 'LOW'
    recommendation = 'Continue Monitoring'
  }

  const isInspectionRecommended = isHighHumidity

  return {
    ...crop,
    storageAgeDays,
    status,
    priority,
    recommendation,
    isInspectionRecommended,
    formattedAge: `${storageAgeDays} days`,
    formattedQuantity: `${crop.quantity.toLocaleString()} kg`,
  }
}

/**
 * Generates actionable recommendations using the transparent rule-based engine.
 */
export function generateSmartRecommendations(
  evaluatedCrops: EvaluatedCropItem[],
  currentHumidity: number,
  thresholds: StorageThresholds
): RecommendationNotice[] {
  const notices: RecommendationNotice[] = []

  // Check storage humidity condition first
  if (currentHumidity >= thresholds.highHumidityThreshold) {
    notices.push({
      id: 'humidity-alert',
      type: 'critical',
      title: 'Storage Inspection Recommended',
      description: `Ambient humidity has reached ${currentHumidity}%. Inspect granary aeration ducts, check grain moisture barriers, and monitor for condensation.`,
      actionLabel: 'Inspect Granary',
    })
  }

  // Sort crops descending by age to present highest priority items first
  const sortedCrops = [...evaluatedCrops].sort((a, b) => b.storageAgeDays - a.storageAgeDays)

  sortedCrops.forEach((crop) => {
    if (crop.priority === 'HIGH') {
      notices.push({
        id: `rec-${crop.id}`,
        type: 'critical',
        cropId: crop.id,
        cropName: crop.name,
        title: `Review ${crop.name} stock first`,
        description: `Review ${crop.name.toLowerCase()} stock first due to longer storage duration (${crop.storageAgeDays} days stored).`,
        actionLabel: 'Review / Sell First',
      })
    } else if (crop.priority === 'MEDIUM') {
      notices.push({
        id: `rec-${crop.id}`,
        type: 'warning',
        cropId: crop.id,
        cropName: crop.name,
        title: `Inspect ${crop.name} storage conditions`,
        description: `Inspect ${crop.name.toLowerCase()} storage conditions and review its inventory age (${crop.storageAgeDays} days stored).`,
        actionLabel: 'Review Soon',
      })
    } else {
      if (crop.storageAgeDays < 45) {
        notices.push({
          id: `rec-${crop.id}`,
          type: 'stable',
          cropId: crop.id,
          cropName: crop.name,
          title: `${crop.name} recently harvested`,
          description: `${crop.name} is recently harvested (${crop.storageAgeDays} days) and can remain under monitoring.`,
          actionLabel: 'Continue Monitoring',
        })
      } else {
        notices.push({
          id: `rec-${crop.id}`,
          type: 'stable',
          cropId: crop.id,
          cropName: crop.name,
          title: `${crop.name} within monitoring range`,
          description: `${crop.name} remains within the configured monitoring range (${crop.storageAgeDays} days stored).`,
          actionLabel: 'Continue Monitoring',
        })
      }
    }
  })

  return notices
}
