import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import StatsCard from '../components/StatsCard'
import InsightsPanel from '../components/InsightsPanel'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, CartesianGrid,
} from 'recharts'

const CATEGORY_COLORS = {
  Prioritization: '#8b5cf6',
  'Trade-off': '#f97316',
  Stakeholder: '#22c55e',
  Technical: '#3b82f6',
  Scope: '#ec4899',
}

export default function AnalyticsDashboard() {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('decisions')
        .select('*, outcomes(*)')
        .order('created_at', { ascending: false })
      setDecisions(data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="text-center py-20 text-gray-400 text-sm">Loading analytics...</div>
  )

  const reviewed = decisions.filter(d => (d.outcomes ?? []).length > 0)

  const reviewsDue = decisions.reduce((acc, d) => {
    const completed = (d.outcomes ?? []).map(o => o.review_window)
    const due = [
      { w: 30, date: d.review_30_due },
      { w: 60, date: d.review_60_due },
      { w: 90, date: d.review_90_due },
    ].filter(r => r.date && new Date(r.date) <= new Date() && !completed.includes(r.w))
    return acc + due.length
  }, 0)

  const allScores = reviewed.flatMap(d =>
    (d.outcomes ?? []).map(o => o.accuracy_score).filter(Boolean)
  )
  const avgAccuracy = allScores.length
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
    : '—'

  const categoryData = Object.keys(CATEGORY_COLORS).map(cat => {
    const catDecisions = reviewed.filter(d => d.category === cat)
    const scores = catDecisions.flatMap(d =>
      (d.outcomes ?? []).map(o => o.accuracy_score).filter(Boolean)
    )
    const avg = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : null
    return { category: cat, accuracy: avg ? parseFloat(avg) : 0, count: catDecisions.length }
  }).filter(d => d.count > 0)

  const calibrationData = reviewed.flatMap(d =>
    (d.outcomes ?? []).map(o => ({
      confidence: d.confidence,
      accuracy: o.accuracy_score,
    })).filter(o => o.accuracy)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Your PM decision intelligence at a glance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard label="Total Decisions" value={decisions.length} sub="logged" color="blue" />
        <StatsCard label="Reviewed" value={reviewed.length} sub="with outcomes" color="green" />
        <StatsCard label="Avg Accuracy" value={avgAccuracy} sub="out of 5" color="purple" />
        <StatsCard label="Reviews Due" value={reviewsDue} sub="awaiting review" color="amber" />
      </div>

      {categoryData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Accuracy by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val) => [`${val}/5`, 'Avg Accuracy']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} fill="#3b82f6"
                label={{ position: 'top', fontSize: 11, fill: '#6b7280' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {calibrationData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">Confidence Calibration</h3>
          <p className="text-xs text-gray-400 mb-4">Are your confident decisions actually more accurate?</p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="confidence" name="Confidence" domain={[0, 6]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="accuracy" name="Accuracy" domain={[0, 6]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(val, name) => [`${val}/5`, name]}
              />
              <Scatter data={calibrationData} fill="#8b5cf6" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {reviewed.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-3xl mb-3">📊</p>
          <p className="font-medium text-gray-500">Charts unlock after your first review</p>
          <p className="text-sm text-gray-400 mt-1">
            Log decisions and complete a 30-day review to see your accuracy patterns
          </p>
        </div>
      )}

      <InsightsPanel decisions={decisions} />

    </div>
  )
}