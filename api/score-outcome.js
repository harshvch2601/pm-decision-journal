if (req.method !== 'POST') return res.status(405).end()
// Already have this ✓

// Add this check:
if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).json({ error: 'Request body required' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { title, expectedOutcome, actualOutcome, category, confidence } = req.body

  const prompt = `You are evaluating a PM's prediction accuracy.

Decision: ${title}
Category: ${category}
PM's confidence when decided: ${confidence}/5
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
      'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  const text = data.content[0].text.trim()

  try {
    const parsed = JSON.parse(text)
    res.status(200).json(parsed)
  } catch {
    res.status(200).json({ score: 3, commentary: 'Could not parse response.' })
  }
}