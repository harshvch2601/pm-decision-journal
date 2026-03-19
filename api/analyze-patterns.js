if (req.method !== 'POST') return res.status(405).end()
// Already have this ✓

// Add this check:
if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).json({ error: 'Request body required' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { decisions } = req.body

  if (!decisions || decisions.length < 3) {
    return res.status(200).json({
      blindSpots: ['Log at least 3 reviewed decisions to unlock pattern analysis.'],
      strengths: [],
      summary: 'Not enough data yet.'
    })
  }

  const decisionSummary = decisions.map((d, i) =>
    `${i + 1}. [${d.category}] "${d.title}" — confidence: ${d.confidence}/5, accuracy: ${d.accuracy_score}/5, outcome: ${d.outcome_rating}`
  ).join('\n')

  const prompt = `You are analyzing a PM's decision-making patterns based on their tracked decisions and outcomes.

Here are their decisions with outcomes:
${decisionSummary}

Identify:
1. Their top 2 blind spots (where they consistently misjudge)
2. Their top 2 strengths (where they consistently nail it)
3. A 2-sentence honest summary of their decision-making style

Respond in JSON only, no markdown:
{
  "blindSpots": ["string", "string"],
  "strengths": ["string", "string"],
  "summary": "two sentences"
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  const text = data.content[0].text.trim()

  try {
    const parsed = JSON.parse(text)
    res.status(200).json(parsed)
  } catch {
    res.status(200).json({
      blindSpots: ['Could not analyze patterns yet.'],
      strengths: [],
      summary: 'Log more decisions with outcomes to unlock insights.'
    })
  }
}