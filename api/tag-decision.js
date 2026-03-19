export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, rationale } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const prompt = `You are a PM decision classifier. Classify this decision into exactly ONE category.

Categories:
- Prioritization: deciding what to build or defer
- Trade-off: balancing competing constraints (speed vs quality, scope vs resources)
- Stakeholder: decisions driven by stakeholder alignment or politics
- Technical: architecture, tooling, or implementation choices
- Scope: adding, cutting, or changing what's in a release

Decision title: ${title}
Rationale: ${rationale || 'Not provided'}

Respond in JSON only, no markdown, no explanation:
{"category": "...", "confidence": 0.0, "reasoning": "one sentence"}`

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
      return res.status(200).json({ category: 'Trade-off', confidence: 0.5, reasoning: 'Could not tag' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text?.trim() || ''

    try {
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      return res.status(200).json(parsed)
    } catch {
      return res.status(200).json({ category: 'Trade-off', confidence: 0.5, reasoning: 'Could not parse' })
    }

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(200).json({ category: 'Trade-off', confidence: 0.5, reasoning: 'Error occurred' })
  }
}