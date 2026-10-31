import { useState, useMemo } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { AddEditCropModal } from './components/AddEditCropModal'
import { ThresholdSettingsModal } from './components/ThresholdSettingsModal'
import { OverviewPage } from './pages/OverviewPage'
import { InventoryPage } from './pages/InventoryPage'
import { StoragePage } from './pages/StoragePage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { ReportsPage } from './pages/ReportsPage'
import type { 
  CropItem, 
  EvaluatedCropItem, 
  NavigationTab, 
  StorageCondition, 
  StorageThresholds 
} from './types'
import { 
  DEFAULT_SIMULATION_DATE, 
  DEFAULT_THRESHOLDS, 
  INITIAL_STORAGE_CONDITION, 
  INITIAL_CROPS 
} from './data/mockData'
import { evaluateCrop, generateSmartRecommendations } from './utils/calculator'
import { CheckCircle2 } from 'lucide-react'

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview')


  // Core State
  const [crops, setCrops] = useState<CropItem[]>(INITIAL_CROPS)
  const [simulationDate, setSimulationDate] = useState<string>(DEFAULT_SIMULATION_DATE)
  const [thresholds, setThresholds] = useState<StorageThresholds>(DEFAULT_THRESHOLDS)
  const [storageCondition, setStorageCondition] = useState<StorageCondition>(INITIAL_STORAGE_CONDITION)

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false)
  const [cropToEdit, setCropToEdit] = useState<EvaluatedCropItem | null>(null)

  // Subtle Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Evaluate crops dynamically
  const evaluatedCrops: EvaluatedCropItem[] = useMemo(() => {
    return crops.map((crop) =>
      evaluateCrop(crop, simulationDate, thresholds, storageCondition.humidity)
    )
  }, [crops, simulationDate, thresholds, storageCondition.humidity])

  // Generate dynamic recommendations
  const recommendations = useMemo(() => {
    return generateSmartRecommendations(
      evaluatedCrops,
      storageCondition.humidity,
      thresholds
    )
  }, [evaluatedCrops, storageCondition.humidity, thresholds])

  const isHighHumidity = storageCondition.humidity >= thresholds.highHumidityThreshold
  const attentionCount = evaluatedCrops.filter(
    (c) => c.status === 'Aging' || c.status === 'Priority'
  ).length + (isHighHumidity ? 1 : 0)

  // CRUD Actions
  const handleSaveCrop = (cropData: CropItem) => {
    if (cropToEdit) {
      setCrops((prev) => prev.map((c) => (c.id === cropData.id ? cropData : c)))
      showToast(`Updated "${cropData.name}" lot in granary inventory.`)
    } else {
      setCrops((prev) => [cropData, ...prev])
      showToast(`Added new batch of "${cropData.name}" to granary inventory.`)
    }
    setCropToEdit(null)
  }

  const handleDeleteCrop = (id: string) => {
    const toDelete = crops.find((c) => c.id === id)
    setCrops((prev) => prev.filter((c) => c.id !== id))
    showToast(`Removed "${toDelete?.name || 'crop'}" lot from inventory.`)
  }

  const handleEditCrop = (crop: EvaluatedCropItem) => {
    setCropToEdit(crop)
    setIsAddModalOpen(true)
  }

  // Demo Reset
  const handleResetDemo = () => {
    setCrops(INITIAL_CROPS)
    setSimulationDate(DEFAULT_SIMULATION_DATE)
    setThresholds(DEFAULT_THRESHOLDS)
    setStorageCondition(INITIAL_STORAGE_CONDITION)
    showToast('Restored standard hackathon demo dataset.')
  }

  // Storage Condition Handlers
  const handleUpdateHumidity = (newHumidity: number) => {
    setStorageCondition((prev) => ({
      ...prev,
      humidity: newHumidity,
      lastUpdated: 'Just now',
    }))
  }

  const handleUpdateTemperature = (newTemp: number) => {
    setStorageCondition((prev) => ({
      ...prev,
      temperature: newTemp,
      lastUpdated: 'Just now',
    }))
  }

  return (
    <div className="flex h-screen bg-[#f8faf9] text-slate-800 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        onOpenRules={() => setIsRulesModalOpen(true)}
        attentionCount={attentionCount}
        isHighHumidity={isHighHumidity}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenAddModal={() => {
            setCropToEdit(null)
            setIsAddModalOpen(true)
          }}
          onResetDemo={handleResetDemo}
          simulationDate={simulationDate}
          setSimulationDate={setSimulationDate}
          notifications={recommendations}
          isHighHumidity={isHighHumidity}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === 'overview' && (
            <OverviewPage
              crops={evaluatedCrops}
              storageCondition={storageCondition}
              thresholds={thresholds}
              recommendations={recommendations}
              isHighHumidity={isHighHumidity}
              onDeleteCrop={handleDeleteCrop}
              onEditCrop={handleEditCrop}
              onOpenAddModal={() => {
                setCropToEdit(null)
                setIsAddModalOpen(true)
              }}
              onOpenRules={() => setIsRulesModalOpen(true)}
              onUpdateHumidity={handleUpdateHumidity}
              onUpdateTemperature={handleUpdateTemperature}
              onSelectCrop={(_crop) => {
                setActiveTab('inventory')
              }}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryPage
              crops={evaluatedCrops}
              onDeleteCrop={handleDeleteCrop}
              onEditCrop={handleEditCrop}
              onOpenAddModal={() => {
                setCropToEdit(null)
                setIsAddModalOpen(true)
              }}
            />
          )}

          {activeTab === 'storage' && (
            <StoragePage
              crops={evaluatedCrops}
              condition={storageCondition}
              thresholds={thresholds}
              onUpdateHumidity={handleUpdateHumidity}
              onUpdateTemperature={handleUpdateTemperature}
              isHighHumidity={isHighHumidity}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsPage
              crops={evaluatedCrops}
              recommendations={recommendations}
              thresholds={thresholds}
              isHighHumidity={isHighHumidity}
              onOpenRules={() => setIsRulesModalOpen(true)}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              crops={evaluatedCrops}
              condition={storageCondition}
              thresholds={thresholds}
              simulationDate={simulationDate}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Crop Modal */}
      <AddEditCropModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setCropToEdit(null)
        }}
        onSaveCrop={handleSaveCrop}
        cropToEdit={cropToEdit}
        simulationDate={simulationDate}
        thresholds={thresholds}
        currentHumidity={storageCondition.humidity}
      />

      {/* Threshold Configuration Modal */}
      <ThresholdSettingsModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        thresholds={thresholds}
        onSaveThresholds={(newThresholds) => {
          setThresholds(newThresholds)
          showToast('Updated rule engine thresholds.')
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default App
