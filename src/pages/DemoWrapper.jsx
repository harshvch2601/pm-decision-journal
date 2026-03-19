import { useState } from 'react'
import { DEMO_DECISIONS, DEMO_PATTERNS } from '../lib/demoData'
import DemoAnalyticsDashboard from './DemoAnalyticsDashboard'
import DemoDecisionList from '../components/DemoDecisionList'
import { BookOpen, LogIn, Sparkles } from 'lucide-react'

export default function DemoWrapper({ onSignUp }) {
  const [currentPage, setCurrentPage] = useState('decisions')

  const navItems = [
    { id: 'decisions', label: 'My Decisions' },
    { id: 'dashboard', label: 'Dashboard' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Demo nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">PM Decision Journal</span>
            <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full ml-1">
              Demo Mode
            </span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={onSignUp}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogIn size={13} />
            Sign up free
          </button>
        </div>
      </nav>

      {/* Demo banner */}
      <div className="bg-blue-600 text-white text-center py-2.5 text-xs font-medium">
        <Sparkles size={12} className="inline mr-1.5" />
        You're viewing a demo with sample PM decisions.
        <button onClick={onSignUp} className="underline ml-1.5 font-semibold hover:text-blue-200">
          Sign up free to log your own decisions →
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentPage === 'decisions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Decisions</h1>
                <p className="text-sm text-gray-400 mt-0.5">{DEMO_DECISIONS.length} decisions logged</p>
              </div>
              <button
                onClick={onSignUp}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Sparkles size={14} />
                Log your first decision
              </button>
            </div>
            <DemoDecisionList decisions={DEMO_DECISIONS} onSignUp={onSignUp} />
          </div>
        )}

        {currentPage === 'dashboard' && (
          <DemoAnalyticsDashboard
            decisions={DEMO_DECISIONS}
            patterns={DEMO_PATTERNS}
            onSignUp={onSignUp}
          />
        )}
      </main>
    </div>
  )
}