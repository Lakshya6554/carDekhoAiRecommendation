'use client'

import { UserPreferences, FuelType } from '@/lib/types'

interface FuelOption {
  value: FuelType
  label: string
  costHint: string
  icon: string
}

const FUEL_OPTIONS: FuelOption[] = [
  { value: 'petrol', label: 'Petrol', costHint: '~₹7–9/km running cost', icon: '⛽' },
  { value: 'diesel', label: 'Diesel', costHint: '~₹5–7/km · best for 1500+ km/month', icon: '🛢️' },
  { value: 'cng', label: 'CNG', costHint: '~₹2–3/km · lowest running cost', icon: '🔵' },
  { value: 'electric', label: 'Electric', costHint: '~₹1–2/km · zero tailpipe emissions', icon: '⚡' },
  { value: 'any', label: 'No Preference', costHint: 'Let us pick the best option for you', icon: '🎯' },
]

interface FuelStepProps {
  preferences: Partial<UserPreferences>
  onUpdate: (updates: Partial<UserPreferences>) => void
}

export default function FuelStep({ preferences, onUpdate }: FuelStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-[#1a2234] dark:text-white mb-2">Fuel preference?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Fuel type affects running cost and the right buying choice</p>
      <div className="grid grid-cols-1 gap-3">
        {FUEL_OPTIONS.map((opt) => {
          const isSelected = preferences.fuel_preference === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onUpdate({ fuel_preference: opt.value })}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl border-2 text-left transition-all min-h-[60px] ${
                isSelected
                  ? 'border-[#1a2234] dark:border-indigo-500 bg-[#1a2234] dark:bg-indigo-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161b22] text-[#1a2234] dark:text-gray-200 hover:border-[#1a2234]/50 dark:hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <div className="flex-1 flex items-center justify-between gap-3">
                <span className="font-semibold text-base">{opt.label}</span>
                <span className={`text-sm ${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                  {opt.costHint}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
