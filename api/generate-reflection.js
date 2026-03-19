if (req.method !== 'POST') return res.status(405).end()
// Already have this ✓

// Add this check:
if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).json({ error: 'Request body required' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, expectedOutcome, category, rationale, reviewWindow } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const prompt = `You are a PM coach helping a product manager reflect on a past decision.

They made this decision ${reviewWindow || 30} days ago:
Title: ${title}
Category: ${category || 'Unknown'}
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
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      return res.status(200).json({
        reflection: 'What actually happened, and how does it compare to what you expected?'
      })
    }

    const data = await response.json()
    const reflection = data.content?.[0]?.text?.trim() ||
      'What actually happened, and how does it compare to what you expected?'

    return res.status(200).json({ reflection })

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(200).json({
      reflection: 'What actually happened, and how does it compare to what you expected?'
    })
  }
}