import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Loader2, X, Brain, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { track } from '../lib/analytics'

const RATING_OPTIONS = [
  { value: 'better', label: '✅ Better than expected', color: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'as_expected', label: '🎯 Exactly as expected', color: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'worse', label: '❌ Worse than expected', color: 'border-red-400 bg-red-50 text-red-700' },
]

export default function ReviewModal({ decision, reviewWindow, onClose, onComplete }) {
  const [reflection, setReflection] = useState('')
  const [loadingReflection, setLoadingReflection] = useState(true)
  const [actualOutcome, setActualOutcome] = useState('')
  const [rating, setRating] = useState('')
  const [lessons, setLessons] = useState('')
  const [scoring, setScoring] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReflection = async () => {
      try {
        const res = await fetch('/api/generate-reflection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: decision.title,
            expectedOutcome: decision.expected_outcome,
            category: decision.category,
            rationale: decision.rationale,
            reviewWindow
          })
        })
        const data = await res.json()
        setReflection(data.reflection)
      } catch {
        setReflection('What actually happened, and how does it compare to what you expected?')
      }
      setLoadingReflection(false)
    }
    fetchReflection()
  }, [])

  const handleSubmit = async () => {
    if (!actualOutcome || !rating) {
      setError('Please describe what happened and select an outcome rating.')
      return
    }
    setScoring(true)
    setError('')

    try {
      const res = await fetch('/api/score-outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decision.title,
          expectedOutcome: decision.expected_outcome,
          actualOutcome,
          category: decision.category,
          confidence: decision.confidence
        })
      })
      const scored = await res.json()

      await supabase.from('outcomes').insert({
        decision_id: decision.id,
        review_window: reviewWindow,
        actual_outcome: actualOutcome,
        outcome_rating: rating,
        lessons_learned: lessons,
        accuracy_score: scored.score,
        claude_reflection: reflection,
      })

      setResult(scored)
      track('review_completed', {
        review_window: reviewWindow,
        outcome_rating: rating,
        accuracy_score: scored.score,
        category: decision.category,
      })
    } catch (e) {
      setError('Something went wrong. Please try again.')
    }
    setScoring(false)
  }

  const SCORE_COLORS = {
    1: 'text-red-600 bg-red-50',
    2: 'text-orange-600 bg-orange-50',
    3: 'text-yellow-600 bg-yellow-50',
    4: 'text-blue-600 bg-blue-50',
    5: 'text-green-600 bg-green-50',
  }

  const SCORE_LABELS = {
    1: 'Completely off', 2: 'Mostly wrong', 3: 'Partially right',
    4: 'Mostly right', 5: 'Spot on'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {reviewWindow}-day review
              </span>
              <span className="text-xs text-gray-400">
                Logged {format(new Date(decision.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <h2 className="font-bold text-gray-900 text-base leading-snug">{decision.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4 shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Original context */}
          {(decision.rationale || decision.expected_outcome) && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {decision.rationale && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Your rationale</p>
                  <p className="text-sm text-gray-600">{decision.rationale}</p>
                </div>
              )}
              {decision.expected_outcome && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">You expected</p>
                  <p className="text-sm text-gray-600">{decision.expected_outcome}</p>
                </div>
              )}
            </div>
          )}

          {/* Claude reflection prompt */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-blue-600" />
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Claude asks</p>
            </div>
            {loadingReflection ? (
              <div className="flex items-center gap-2 text-sm text-blue-400">
                <Loader2 size={14} className="animate-spin" />
                Generating reflection prompt...
              </div>
            ) : (
              <p className="text-sm font-medium text-blue-900">{reflection}</p>
            )}
          </div>

          {!result ? (
            <>
              {/* Actual outcome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What actually happened? <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={actualOutcome}
                  onChange={e => setActualOutcome(e.target.value)}
                  placeholder="Be honest — the good, the bad, the unexpected..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did it go? <span className="text-red-400">*</span>
                </label>
                <div className="space-y-2">
                  {RATING_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setRating(opt.value)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                        rating === opt.value ? opt.color : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lessons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key lesson learned <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={lessons}
                  onChange={e => setLessons(e.target.value)}
                  placeholder="What would you do differently? What signal did you miss?"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={scoring}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {scoring
                  ? <><Loader2 size={14} className="animate-spin" />Scoring with Claude...</>
                  : <><Brain size={14} />Submit & Score with Claude</>
                }
              </button>
            </>
          ) : (
            /* Result screen */
            <div className="text-center space-y-4">
              <CheckCircle size={40} className="text-green-500 mx-auto" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Claude's accuracy score</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-2xl ${SCORE_COLORS[result.score]}`}>
                  {result.score}/5
                  <span className="text-base font-medium">{SCORE_LABELS[result.score]}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Claude's take</p>
                <p className="text-sm text-gray-700">{result.commentary}</p>
              </div>
              <button
                onClick={onComplete}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                Done — back to decisions
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}