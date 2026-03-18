import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { addDays } from 'date-fns'
import { Loader2, Sparkles } from 'lucide-react'
import { track } from '../lib/analytics'

const CATEGORIES = ['Prioritization', 'Trade-off', 'Stakeholder', 'Technical', 'Scope']

export default function DecisionForm({ session, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    rationale: '',
    expected_outcome: '',
    confidence: 3,
    sprint_label: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [tagging, setTagging] = useState(false)
  const [error, setError] = useState('')

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const autoTag = async () => {
    if (!form.title) return
    setTagging(true)
    try {
      const res = await fetch('/api/tag-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, rationale: form.rationale })
      })
      const data = await res.json()
      if (data.category) set('category', data.category)
    } catch {
      // fail silently, user can pick manually
    }
    setTagging(false)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.category) {
      setError('Title and category are required.')
      return
    }
    setLoading(true)
    setError('')

    const now = new Date()
    const { error: dbError } = await supabase.from('decisions').insert({
      user_id: session.user.id,
      title: form.title,
      rationale: form.rationale,
      category: form.category,
      confidence: form.confidence,
      expected_outcome: form.expected_outcome,
      sprint_label: form.sprint_label,
      review_30_due: addDays(now, 30).toISOString(),
      review_60_due: addDays(now, 60).toISOString(),
      review_90_due: addDays(now, 90).toISOString(),
    })

    if (dbError) {
      setError(dbError.message)
    } else {
      if (dbError) {
  setError(dbError.message)
} else {
  track('decision_logged', {
    category: form.category,
    confidence: form.confidence,
    has_rationale: !!form.rationale,
    has_expected_outcome: !!form.expected_outcome,
  })
  onSuccess()
}
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Log a Decision</h2>
      <p className="text-sm text-gray-400 mb-6">Takes 60 seconds. Future you will thank you.</p>

      <div className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decision <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            onBlur={autoTag}
            placeholder="e.g. Deprioritize API v2 to ship mobile feature by Q2"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Category auto-tags when you leave this field</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-400">*</span>
            {tagging && <span className="ml-2 text-blue-500 text-xs inline-flex items-center gap-1"><Loader2 size={10} className="animate-spin" />Auto-tagging...</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => set('category', cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  form.category === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rationale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Why did you make this call?</label>
          <textarea
            value={form.rationale}
            onChange={e => set('rationale', e.target.value)}
            placeholder="What data, pressure, or reasoning led to this decision?"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Expected Outcome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What do you expect to happen?</label>
          <textarea
            value={form.expected_outcome}
            onChange={e => set('expected_outcome', e.target.value)}
            placeholder="Be specific — this is what we'll compare against in 30/60/90 days"
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Confidence + Sprint */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confidence: <span className="text-blue-600 font-bold">{form.confidence}/5</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={form.confidence}
              onChange={e => set('confidence', parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-0.5">
              <span>Uncertain</span><span>Very confident</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sprint / Period</label>
            <input
              type="text"
              value={form.sprint_label}
              onChange={e => set('sprint_label', e.target.value)}
              placeholder="e.g. Sprint 24 / Q2 2026"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Sparkles size={14} />Log Decision</>}
        </button>

      </div>
    </div>
  )
}