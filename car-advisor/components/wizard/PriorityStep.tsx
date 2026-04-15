'use client'

import { UserPreferences, Priority } from '@/lib/types'

interface PriorityOption {
  value: Priority
  label: string
  description: string
  icon: string
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'mileage', label: 'Mileage', description: 'I want the lowest running cost possible', icon: '📊' },
  { value: 'safety', label: 'Safety', description: 'NCAP ratings and airbags matter most to me', icon: '🛡️' },
  { value: 'comfort', label: 'Comfort', description: 'Smooth ride, spacious cabin, and nice interiors', icon: '🛋️' },
  { value: 'performance', label: 'Performance', description: 'Powerful engine and sporty driving feel', icon: '🏎️' },
  { value: 'value', label: 'Value for Money', description: 'Best features and specs for the price paid', icon: '💎' },
]

const FAMILY_SIZES = [2, 4, 5, 7] as const

interface PriorityStepProps {
  preferences: Partial<UserPreferences>
  onUpdate: (updates: Partial<UserPreferences>) => void
}

export default function PriorityStep({ preferences, onUpdate }: PriorityStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-[#1a2234] dark:text-white mb-2">What matters most to you?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-5">Pick your single most important factor</p>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {PRIORITY_OPTIONS.map((opt) => {
          const isSelected = preferences.top_priority === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onUpdate({ top_priority: opt.value })}
              className={`flex items-start gap-4 w-full px-5 py-4 rounded-xl border-2 text-left transition-all min-h-[64px] ${
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

      <div>
        <h3 className="text-base font-semibold text-[#1a2234] dark:text-gray-200 mb-3">Family size (including you)</h3>
        <div className="grid grid-cols-4 gap-2">
          {FAMILY_SIZES.map((size) => {
            const isSelected = preferences.family_size === size
            return (
              <button
                key={size}
                onClick={() => onUpdate({ family_size: size })}
                className={`py-3 rounded-xl border-2 font-semibold text-base transition-all min-h-[52px] ${
                  isSelected
                    ? 'border-[#1a2234] dark:border-indigo-500 bg-[#1a2234] dark:bg-indigo-600 text-white'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161b22] text-[#1a2234] dark:text-gray-200 hover:border-[#1a2234]/50 dark:hover:border-indigo-500/50'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {preferences.family_size === 7 ? 'Looking at 7-seaters for you' :
           preferences.family_size === 5 ? 'Standard 5-seater recommended' :
           preferences.family_size === 4 ? 'Any 5-seater will work comfortably' :
           preferences.family_size === 2 ? 'Hatchbacks and compact options included' :
           'Select your family size above'}
        </p>
      </div>
    </div>
  )
}
