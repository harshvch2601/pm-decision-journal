import { useState } from 'react'
import { Brain, Loader2, AlertTriangle, TrendingUp } from 'lucide-react'
import { track } from '../lib/analytics'

export default function InsightsPanel({ decisions = [] }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)

  const reviewed = decisions.filter(d => (d.outcomes || []).length > 0)

  const analyze = async () => {
    setLoading(true)
    try {
      const payload = reviewed.map(d => ({
        category: d.category,
        title: d.title,
        confidence: d.confidence,
        accuracy_score: d.outcomes?.[0]?.accuracy_score,
        outcome_rating: d.outcomes?.[0]?.outcome_rating,
      }))

      const res = await fetch('/api/analyze-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisions: payload })
      })
      const data = await res.json()
      setInsights(data)
      track('pattern_analysis_run', {
        decisions_analyzed: reviewed.length,
        })
    } catch {
      setInsights({
        blindSpots: ['Could not analyze patterns right now.'],
        strengths: [],
        summary: 'Try again in a moment.'
      })
    }
    setLoading(false)
  }

  if (reviewed.length < 3) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={16} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-sm">AI Pattern Analysis</h3>
        </div>
        <p className="text-sm text-gray-400">
          Complete <span className="font-medium text-gray-600">{Math.max(0, 3 - reviewed.length)} more</span> decision reviews to unlock Claude's pattern analysis.
        </p>
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full">
          <div
            className="h-1.5 bg-blue-400 rounded-full transition-all"
            style={{ width: `${Math.min(100, (reviewed.length / 3) * 100)}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-sm">AI Pattern Analysis</h3>
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading
            ? <><Loader2 size={11} className="animate-spin" />Analyzing...</>
            : <><Brain size={11} />Analyze now</>}
        </button>
      </div>

      {!insights && !loading && (
        <p className="text-sm text-gray-400">
          Click analyze to generate Claude's assessment of your decision patterns.
        </p>
      )}

      {insights && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">{insights.summary}</p>

          {(insights.blindSpots || []).length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={13} className="text-amber-500" />
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Blind Spots</p>
              </div>
              <ul className="space-y-1.5">
                {insights.blindSpots.map((b, i) => (
                  <li key={i} className="text-sm text-gray-600 bg-amber-50 rounded-lg px-3 py-2">{b}</li>
                ))}
              </ul>
            </div>
          )}

          {(insights.strengths || []).length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={13} className="text-green-500" />
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Strengths</p>
              </div>
              <ul className="space-y-1.5">
                {insights.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 bg-green-50 rounded-lg px-3 py-2">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}