import React from 'react'
import { KpiCards } from '../components/KpiCards'
import { InventoryTable } from '../components/InventoryTable'
import { InventoryAgingChart } from '../components/InventoryAgingChart'
import { SellingPriorityCard } from '../components/SellingPriorityCard'
import { StorageConditionPanel } from '../components/StorageConditionPanel'
import { SmartRecommendations } from '../components/SmartRecommendations'
import type { 
  EvaluatedCropItem, 
  StorageCondition, 
  StorageThresholds, 
  RecommendationNotice 
} from '../types'

interface OverviewPageProps {
  crops: EvaluatedCropItem[]
  storageCondition: StorageCondition
  thresholds: StorageThresholds
  recommendations: RecommendationNotice[]
  isHighHumidity: boolean
  onDeleteCrop: (id: string) => void
  onEditCrop: (crop: EvaluatedCropItem) => void
  onOpenAddModal: () => void
  onOpenRules: () => void
  onUpdateHumidity: (humidity: number) => void
  onUpdateTemperature: (temp: number) => void
  onSelectCrop?: (crop: EvaluatedCropItem) => void
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  crops,
  storageCondition,
  thresholds,
  recommendations,
  isHighHumidity,
  onDeleteCrop,
  onEditCrop,
  onOpenAddModal,
  onOpenRules,
  onUpdateHumidity,
  onUpdateTemperature,
  onSelectCrop,
}) => {
  return (
    <div className="space-y-6">
      {/* Top KPI Summary Cards */}
      <KpiCards
        crops={crops}
        totalCapacityKg={storageCondition.totalCapacityKg}
        isHighHumidity={isHighHumidity}
      />

      {/* Main Grid: 2 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Table + Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Current Inventory Table */}
          <InventoryTable
            crops={crops}
            onDeleteCrop={onDeleteCrop}
            onEditCrop={onEditCrop}
            onOpenAddModal={onOpenAddModal}
          />

          {/* Inventory Aging Visualization */}
          <InventoryAgingChart
            crops={crops}
            thresholds={thresholds}
          />
        </div>

        {/* Right Column (5 cols): Storage Condition + Selling Priority + Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Storage Condition Panel */}
          <StorageConditionPanel
            condition={storageCondition}
            onUpdateHumidity={onUpdateHumidity}
            onUpdateTemperature={onUpdateTemperature}
            isHighHumidity={isHighHumidity}
            highHumidityThreshold={thresholds.highHumidityThreshold}
          />

          {/* Smart Selling Priority */}
          <SellingPriorityCard
            crops={crops}
            onSelectCrop={onSelectCrop}
          />

          {/* Today's Recommendations */}
          <SmartRecommendations
            recommendations={recommendations}
            onOpenRules={onOpenRules}
          />
        </div>
      </div>
    </div>
  )
}
