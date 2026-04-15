import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="relative min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial fade — light mode */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, #FAFAF8 100%)',
        }}
      />
      {/* Radial fade — dark mode */}
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, #0d1117 100%)',
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-20 dark:opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, #3b5bdb 50%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-sm text-xs font-medium text-gray-500 dark:text-gray-400 mb-8 shadow-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
          Powered by CarDekho
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-black text-[#1a2234] dark:text-white leading-tight mb-5 tracking-tight">
          Find your perfect car<br />
          <span className="text-[#3b5bdb] dark:text-indigo-400">in 2 minutes.</span>
        </h1>

        {/* Sub */}
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
          Tell us what matters. We&apos;ll cut through 80+ options and show you exactly 3 cars built for your life.
        </p>

        {/* CTA */}
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a2234] dark:bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-[#2a3549] dark:hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          Get My Shortlist
          <span className="text-xl">→</span>
        </Link>

        <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">No sign-up required · Free · Takes 90 seconds</p>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {[
            { icon: '🎯', label: '4 quick questions' },
            { icon: '🤖', label: 'Real AI reasoning' },
            { icon: '🚗', label: 'Exactly 3 cars' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
