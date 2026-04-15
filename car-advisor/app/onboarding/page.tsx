'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import WizardShell from '@/components/wizard/WizardShell'
import { UserPreferences } from '@/lib/types'

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleComplete = async (preferences: UserPreferences) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to get recommendations')
      }

      const data = await res.json()

      sessionStorage.setItem('preferences', JSON.stringify(preferences))
      sessionStorage.setItem('recommendations', JSON.stringify(data.recommendations))
      sessionStorage.setItem('session_id', data.session_id)

      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-lg">

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <WizardShell onComplete={handleComplete} isLoading={isLoading} />

        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#1a2234] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">AI is analysing 80 cars for your profile...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
