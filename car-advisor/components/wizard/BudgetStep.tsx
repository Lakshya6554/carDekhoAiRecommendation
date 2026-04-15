'use client'

import { UserPreferences } from '@/lib/types'

interface BudgetOption {
  label: string
  sublabel: string
  min: number
  max: number
}

const BUDGET_OPTIONS: BudgetOption[] = [
  { label: 'Under ₹5L', sublabel: 'Entry-level hatchbacks', min: 300000, max: 500000 },
  { label: '₹5L – ₹8L', sublabel: 'Popular hatchbacks & small cars', min: 500000, max: 800000 },
  { label: '₹8L – ₹12L', sublabel: 'Premium hatchbacks & compact SUVs', min: 800000, max: 1200000 },
  { label: '₹12L – ₹18L', sublabel: 'Compact SUVs & sedans', min: 1200000, max: 1800000 },
  { label: '₹18L – ₹25L', sublabel: 'Mid-size SUVs & premium sedans', min: 1800000, max: 2500000 },
  { label: 'Above ₹25L', sublabel: 'Full-size SUVs & luxury cars', min: 2500000, max: 5000000 },
]

interface BudgetStepProps {
  preferences: Partial<UserPreferences>
  onUpdate: (updates: Partial<UserPreferences>) => void
}

export default function BudgetStep({ preferences, onUpdate }: BudgetStepProps) {
  const selectedKey = preferences.budget_max ? `${preferences.budget_min}-${preferences.budget_max}` : null

  return (
    <div>
      <h2 className="text-2xl font-black text-[#1a2234] dark:text-white mb-2">What&apos;s your budget?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Choose your comfortable spending range (on-road price)</p>
      <div className="grid grid-cols-1 gap-3">
        {BUDGET_OPTIONS.map((opt) => {
          const key = `${opt.min}-${opt.max}`
          const isSelected = selectedKey === key
          return (
            <button
              key={key}
              onClick={() => onUpdate({ budget_min: opt.min, budget_max: opt.max })}
              className={`flex items-center justify-between w-full px-5 py-4 rounded-xl border-2 text-left transition-all min-h-[56px] ${
                isSelected
                  ? 'border-[#1a2234] dark:border-indigo-500 bg-[#1a2234] dark:bg-indigo-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161b22] text-[#1a2234] dark:text-gray-200 hover:border-[#1a2234]/50 dark:hover:border-indigo-500/50 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="font-semibold text-base">{opt.label}</span>
              <span className={`text-sm ${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                {opt.sublabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
