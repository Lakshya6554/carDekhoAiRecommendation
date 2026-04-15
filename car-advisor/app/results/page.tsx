'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ShortlistGrid from '@/components/results/ShortlistGrid'
import FollowUpChat from '@/components/results/FollowUpChat'
import { UserPreferences, CarRecommendation } from '@/lib/types'

export default function ResultsPage() {
  const router = useRouter()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const rawPrefs = sessionStorage.getItem('preferences')
      const rawRecs = sessionStorage.getItem('recommendations')

      if (!rawPrefs || !rawRecs) {
        router.replace('/')
        return
      }

      const prefs = JSON.parse(rawPrefs) as UserPreferences
      const recs = JSON.parse(rawRecs) as CarRecommendation[]

      if (!recs || recs.length !== 3) {
        setError('We got an unexpected number of recommendations. Please try again.')
      } else {
        setPreferences(prefs)
        setRecommendations(recs)
      }
    } catch {
      setError('Failed to load your recommendations. Please start over.')
    } finally {
      setIsLoaded(true)
    }
  }, [router])

  const handleStartOver = () => {
    sessionStorage.clear()
    router.push('/')
  }

  const handleRetry = () => {
    sessionStorage.clear()
    router.push('/onboarding')
  }

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#1a2234] dark:bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Sub-header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-sm px-5 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#1a2234] dark:text-white leading-none">Your Shortlist</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">3 of 80 cars matched to your profile</p>
          </div>

          {preferences && (
            <div className="hidden md:flex items-center gap-1.5 flex-wrap">
              {[
                `₹${(preferences.budget_min / 100000).toFixed(0)}L – ₹${(preferences.budget_max / 100000).toFixed(0)}L`,
                preferences.use_case,
                preferences.fuel_preference === 'any' ? 'Any fuel' : preferences.fuel_preference,
                preferences.top_priority,
                `${preferences.family_size} people`,
              ].map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleStartOver}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:border-[#1a2234] dark:hover:border-gray-400 hover:text-[#1a2234] dark:hover:text-white transition-all"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Cards — full width */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <ShortlistGrid
          recommendations={recommendations}
          isLoading={false}
          error={error ?? undefined}
          onRetry={handleRetry}
        />
      </div>

      {/* Floating chat widget */}
      {preferences && recommendations.length === 3 && (
        <FollowUpChat preferences={preferences} recommendations={recommendations} />
      )}
    </div>
  )
}
