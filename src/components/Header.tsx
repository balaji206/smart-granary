import React, { useState } from 'react'
import {
  Bell,
  Plus,
  Calendar,
  ChevronDown,
  User,
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'
import type { RecommendationNotice } from '../types'

interface HeaderProps {
  onOpenAddModal: () => void
  onResetDemo: () => void
  simulationDate: string
  setSimulationDate: (date: string) => void
  notifications: RecommendationNotice[]
  isHighHumidity: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onResetDemo,
  simulationDate,
  setSimulationDate,
  notifications,
  isHighHumidity,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const criticalCount = notifications.filter(n => n.type === 'critical').length

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span>Good morning, Farmer</span>
          <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-mono">
            Granary Unit #4
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Here's your granary overview and today's storage priorities.
        </p>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Simulation Date Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-slate-400 font-medium">Ref Date:</span>
          <input
            type="date"
            value={simulationDate}
            onChange={(e) => setSimulationDate(e.target.value)}
            className="bg-transparent text-slate-800 font-medium text-xs border-none focus:outline-none cursor-pointer"
            title="Adjust simulation reference date to test dynamic aging"
          />
        </div>

        {/* Demo Scenario Quick Restore Button */}
        <button
          onClick={onResetDemo}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-emerald-800 hover:bg-slate-50 transition"
          title="Restore standard demo data (Rice, Wheat, Maize, Groundnut)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
          <span>Demo Scenario</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg border transition ${isHighHumidity
                ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            title="Notifications & storage alerts"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${criticalCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'
                }`}>
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Storage Alerts & Notices</span>
                <span className="text-[10px] text-slate-400 font-mono">{notifications.length} active</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 text-center">No alerts at this time.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition text-xs">
                      <div className="flex items-start gap-2">
                        {n.type === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: Add Crop */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm shadow-emerald-950/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300 flex items-center justify-center text-emerald-900 font-bold text-xs">
            <User className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Farmer Balaji</p>
            <p className="text-[10px] text-slate-400">Cooperative Member</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  )
}
