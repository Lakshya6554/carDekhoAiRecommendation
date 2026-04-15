'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') {
      document.documentElement.classList.remove('dark')
      setDark(false)
    } else {
      // Default to dark mode
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1624] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* CarDekho wordmark replica */}
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8173c] flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 16l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <div className="leading-none">
              <span className="text-base font-black text-[#e8173c] tracking-tight">Car</span>
              <span className="text-base font-black text-[#1a2234] dark:text-white tracking-tight">Dekho</span>
            </div>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wide">AI Advisor</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            claude-sonnet-4-5
          </span>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:border-[#1a2234] dark:hover:border-gray-500 transition-all"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
