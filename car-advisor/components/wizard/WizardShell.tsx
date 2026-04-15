'use client'

import { useState } from 'react'
import { UserPreferences } from '@/lib/types'
import BudgetStep from './BudgetStep'
import UseCaseStep from './UseCaseStep'
import FuelStep from './FuelStep'
import PriorityStep from './PriorityStep'

const STEPS = ['Budget', 'Use Case', 'Fuel', 'Priority']

interface WizardShellProps {
  onComplete: (preferences: UserPreferences) => void
  isLoading: boolean
}

export default function WizardShell({ onComplete, isLoading }: WizardShellProps) {
  const [step, setStep] = useState(0)
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({})
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)

  const update = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }))
  }

  const isStepComplete = () => {
    switch (step) {
      case 0: return !!preferences.budget_min && !!preferences.budget_max
      case 1: return !!preferences.use_case
      case 2: return !!preferences.fuel_preference
      case 3: return !!preferences.top_priority && !!preferences.family_size
      default: return false
    }
  }

  const goNext = () => {
    if (!isStepComplete() || animating) return
    if (step === STEPS.length - 1) {
      onComplete(preferences as UserPreferences)
      return
    }
    setDirection('forward')
    setAnimating(true)
    setTimeout(() => { setStep((s) => s + 1); setAnimating(false) }, 200)
  }

  const goBack = () => {
    if (step === 0 || animating) return
    setDirection('back')
    setAnimating(true)
    setTimeout(() => { setStep((s) => s - 1); setAnimating(false) }, 200)
  }

  const progressPct = ((step + (isStepComplete() ? 1 : 0)) / STEPS.length) * 100

  const stepComponents = [
    <BudgetStep key="budget" preferences={preferences} onUpdate={update} />,
    <UseCaseStep key="usecase" preferences={preferences} onUpdate={update} />,
    <FuelStep key="fuel" preferences={preferences} onUpdate={update} />,
    <PriorityStep key="priority" preferences={preferences} onUpdate={update} />,
  ]

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Step {step + 1} of {STEPS.length}
        </span>
        <span className="text-sm font-semibold text-[#1a2234] dark:text-gray-200">{STEPS[step]}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-[#1a2234] dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step content */}
      <div
        className={`transition-all duration-200 ${
          animating
            ? direction === 'forward' ? 'opacity-0 translate-x-4' : 'opacity-0 -translate-x-4'
            : 'opacity-100 translate-x-0'
        }`}
      >
        {stepComponents[step]}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={goBack}
            disabled={isLoading}
            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-[#1a2234] dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all min-h-[52px] disabled:opacity-50"
          >
            Back
          </button>
        )}
        <button
          onClick={goNext}
          disabled={!isStepComplete() || isLoading}
          className={`flex-1 py-3.5 rounded-xl font-semibold text-white transition-all min-h-[52px] ${
            isStepComplete() && !isLoading
              ? 'bg-[#1a2234] dark:bg-indigo-600 hover:bg-[#2a3549] dark:hover:bg-indigo-700 cursor-pointer'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Finding your cars...' : step === STEPS.length - 1 ? 'Find My Cars' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
