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
    const { title, expectedOutcome, actualOutcome, category, confidence } = req.body

    if (!actualOutcome) {
      return res.status(400).json({ error: 'Actual outcome is required' })
    }

    const prompt = `You are evaluating a PM's prediction accuracy.

Decision: ${title}
Category: ${category || 'Unknown'}
PM's confidence when decided: ${confidence || 3}/5
They expected: ${expectedOutcome || 'Not specified'}
What actually happened: ${actualOutcome}

Score the accuracy of their prediction from 1 to 5:
1 = Completely wrong
2 = Mostly wrong
3 = Partially right
4 = Mostly right
5 = Spot on

Also write one sharp, honest sentence about what this reveals about their judgment.

Respond in JSON only, no markdown:
{"score": 0, "commentary": "one sentence"}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      return res.status(200).json({ score: 3, commentary: 'Could not score at this time.' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text?.trim() || ''

    try {
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      return res.status(200).json(parsed)
    } catch {
      return res.status(200).json({ score: 3, commentary: 'Could not parse score.' })
    }

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(200).json({ score: 3, commentary: 'Something went wrong.' })
  }
}