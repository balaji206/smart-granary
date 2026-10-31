import React from 'react'
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  Sparkles, 
  FileText, 
  Wheat, 
  RotateCcw, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import type { NavigationTab } from '../types'

interface SidebarProps {
  activeTab: NavigationTab
  setActiveTab: (tab: NavigationTab) => void
  onResetDemo: () => void
  onOpenRules: () => void
  attentionCount: number
  isHighHumidity: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  onOpenRules,
  attentionCount,
  isHighHumidity,
}) => {
  const navItems = [
    { 
      id: 'overview' as NavigationTab, 
      label: 'Overview', 
      icon: LayoutDashboard,
      badge: attentionCount > 0 ? `${attentionCount} alerts` : undefined,
      badgeColor: isHighHumidity ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
    },
    { 
      id: 'inventory' as NavigationTab, 
      label: 'Inventory', 
      icon: Package 
    },
    { 
      id: 'storage' as NavigationTab, 
      label: 'Storage', 
      icon: Warehouse,
      badge: isHighHumidity ? 'Alert' : 'Normal',
      badgeColor: isHighHumidity ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'
    },
    { 
      id: 'recommendations' as NavigationTab, 
      label: 'Recommendations', 
      icon: Sparkles,
      badge: attentionCount > 0 ? String(attentionCount) : undefined,
      badgeColor: 'bg-emerald-700 text-white'
    },
    { 
      id: 'reports' as NavigationTab, 
      label: 'Reports', 
      icon: FileText 
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Brand & Logo Header */}
      <div>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-950/15">
              <Wheat className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                  SmartGranary
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-800">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Storage & Inventory Decision System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-5">
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-900/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Quick Granary Status Banner */}
        <div className="px-4 mx-3 py-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-500 font-medium">Storage Safety</span>
            {isHighHumidity ? (
              <span className="flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                <AlertTriangle className="w-3 h-3" /> Inspection Needed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Nominal
              </span>
            )}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${isHighHumidity ? 'bg-rose-500' : 'bg-emerald-600'}`}
              style={{ width: '72%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Granary Bay 4</span>
            <span>72% Capacity</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer & Prototype Controls */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-800 font-medium py-1 px-1.5 rounded hover:bg-slate-200/60 transition"
            title="Configure Rule Thresholds"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Rule Engine</span>
          </button>

          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-medium py-1 px-2 rounded hover:bg-emerald-100/60 transition"
            title="Reset to default demo dataset"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-600">Prototype Mode</span>
          </div>
          <span className="text-[10px] font-mono">v1.0-MVP</span>
        </div>
      </div>
    </aside>
  )
}
