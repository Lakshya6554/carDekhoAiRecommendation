'use client'

import { UserPreferences, UseCase } from '@/lib/types'

interface UseCaseOption {
  value: UseCase
  label: string
  description: string
  icon: string
}

const USE_CASE_OPTIONS: UseCaseOption[] = [
  { value: 'city', label: 'City Driving', description: 'Mostly office commutes, errands, and short trips in town', icon: '🏙️' },
  { value: 'highway', label: 'Highway Trips', description: 'Frequent long-distance travel between cities', icon: '🛣️' },
  { value: 'mixed', label: 'Mixed Use', description: 'Daily city driving with regular weekend highway runs', icon: '🗺️' },
]

interface UseCaseStepProps {
  preferences: Partial<UserPreferences>
  onUpdate: (updates: Partial<UserPreferences>) => void
}

export default function UseCaseStep({ preferences, onUpdate }: UseCaseStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-[#1a2234] dark:text-white mb-2">How will you use the car?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">This helps us match the right engine and suspension setup</p>
      <div className="grid grid-cols-1 gap-3">
        {USE_CASE_OPTIONS.map((opt) => {
          const isSelected = preferences.use_case === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onUpdate({ use_case: opt.value })}
              className={`flex items-start gap-4 w-full px-5 py-4 rounded-xl border-2 text-left transition-all min-h-[72px] ${
                isSelected
                  ? 'border-[#1a2234] dark:border-indigo-500 bg-[#1a2234] dark:bg-indigo-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161b22] text-[#1a2234] dark:text-gray-200 hover:border-[#1a2234]/50 dark:hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-2xl mt-0.5">{opt.icon}</span>
              <div>
                <div className="font-semibold text-base">{opt.label}</div>
                <div className={`text-sm mt-0.5 ${isSelected ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>
                  {opt.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
