if (req.method !== 'POST') return res.status(405).end()
// Already have this ✓

// Add this check:
if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).json({ error: 'Request body required' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { title, expectedOutcome, category, rationale, reviewWindow } = req.body

  const prompt = `You are a PM coach helping a product manager reflect on a past decision.

They made this decision ${reviewWindow} days ago:
Title: ${title}
Category: ${category}
Their rationale: ${rationale || 'Not provided'}
They expected: ${expectedOutcome || 'Not specified'}

Generate ONE specific, thought-provoking reflection question to help them honestly assess what actually happened. 
- Make it specific to their decision, not generic
- Challenge their assumptions gently
- Keep it under 45 words
- Do not use phrases like "looking back" or "in hindsight"

Return plain text only, no quotes, no JSON.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  res.status(200).json({ reflection: data.content[0].text.trim() })
}