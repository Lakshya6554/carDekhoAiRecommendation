'use client'

import { useState, useRef, useEffect } from 'react'
import { UserPreferences, CarRecommendation } from '@/lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface FollowUpChatProps {
  preferences: UserPreferences
  recommendations: CarRecommendation[]
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

const SUGGESTIONS = [
  'Which for highway trips?',
  'Compare safety ratings',
  'Service costs?',
  'Lowest running cost?',
]

export default function FollowUpChat({ preferences, recommendations }: FollowUpChatProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I've shortlisted these 3 cars for your profile. Ask me anything — compare them, dig into specs, or ask about ownership costs.`,
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [messages, isOpen])

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || isStreaming) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsStreaming(true)
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          preferences,
          shortlisted_car_ids: recommendations.map((r) => r.car_id),
        }),
      })

      if (!res.ok) throw new Error('Chat request failed')
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk }
          }
          return updated
        })
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last.role === 'assistant' && last.content === '') {
          updated[updated.length - 1] = { ...last, content: 'Sorry, something went wrong. Please try again.' }
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
      if (!isOpen) setUnreadCount((n) => n + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded chat panel */}
      {isOpen && (
        <div
          className="w-[360px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161b22]"
          style={{ height: '680px', animation: 'chatSlideUp 0.25s ease-out' }}
        >
          <style>{`
            @keyframes chatSlideUp {
              from { opacity: 0; transform: translateY(16px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#1a2234] to-[#2d3f5e] flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-base flex-shrink-0">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">Car Advisor AI</p>
              <p className="text-[11px] text-white/50 mt-0.5 truncate">Ask about your shortlist</p>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-[11px] text-white/50">Online</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Minimise chat"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-[#0d1117]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] flex-shrink-0 mb-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1a2234] dark:bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-[#21262d] text-[#1a2234] dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-700 shadow-sm'
                  }`}
                >
                  {msg.content === '' && isStreaming && i === messages.length - 1
                    ? <TypingIndicator />
                    : msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#0d1117] border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Try asking</p>
              <div className="grid grid-cols-2 gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-xs px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700 flex gap-2 items-end flex-shrink-0 bg-white dark:bg-[#161b22]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about these cars..."
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] px-3.5 py-2.5 text-sm text-[#1a2234] dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/10 transition-all disabled:opacity-50 min-h-[40px] max-h-[100px]"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              className="w-10 h-10 bg-[#1a2234] dark:bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-[#2d3f5e] dark:hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative w-14 h-14 rounded-full bg-[#1a2234] dark:bg-indigo-600 text-white shadow-xl hover:bg-[#2d3f5e] dark:hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center"
        aria-label={isOpen ? 'Minimise chat' : 'Open AI chat'}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {/* Unread badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  )
}
