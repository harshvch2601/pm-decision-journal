export const DEMO_DECISIONS = [
  {
    id: 'demo-1',
    title: 'Deprioritize API v2 to ship mobile checkout feature by Q2',
    category: 'Prioritization',
    rationale: 'Mobile conversion is 40% lower than desktop. This is the highest leverage fix we have before the Q2 board review.',
    expected_outcome: 'Mobile conversion improves 15% within 60 days of ship.',
    confidence: 4,
    sprint_label: 'Sprint 22 / Q1 2026',
    created_at: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: [{
      review_window: 30,
      actual_outcome: 'Shipped on time. Mobile conversion up 11%, not 15%. Bottleneck turned out to be payment form UX, not the feature itself.',
      outcome_rating: 'as_expected',
      accuracy_score: 4,
      claude_reflection: 'You bet on mobile conversion being the primary constraint — did the data after launch confirm that hypothesis, or did a different bottleneck emerge?',
      lessons_learned: 'Feature was right but impact was overestimated. Should have done more UX research on the payment form before committing to the metric.'
    }]
  },
  {
    id: 'demo-2',
    title: 'Cut onboarding flow from 7 steps to 3 to improve activation rate',
    category: 'Trade-off',
    rationale: 'Drop-off at step 4 is 62%. We are losing users before they see core value. Cutting steps means losing some data collection but gaining activated users.',
    expected_outcome: 'Activation rate improves from 34% to 50%+ within 45 days.',
    confidence: 3,
    sprint_label: 'Sprint 20 / Q1 2026',
    created_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: [{
      review_window: 30,
      actual_outcome: 'Activation rate jumped to 58%. Exceeded target. Lost persona data from removed steps but product analytics filled the gap.',
      outcome_rating: 'better',
      accuracy_score: 5,
      claude_reflection: 'You sacrificed data collection for activation — was the data you cut actually missed, or did other signals cover it?',
      lessons_learned: 'Less is more in onboarding. Should have cut steps 6 months earlier. The data we gave up turned out to be noise anyway.'
    }]
  },
  {
    id: 'demo-3',
    title: 'Agree to CFO request to add cost reporting module in Q2 scope',
    category: 'Stakeholder',
    rationale: 'CFO threatened to cut headcount if product did not show direct cost savings. Politically could not say no. Added to scope despite engineering pushback.',
    expected_outcome: 'CFO satisfied, headcount preserved, module ships without delaying core roadmap.',
    confidence: 2,
    sprint_label: 'Sprint 21 / Q1 2026',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: [{
      review_window: 30,
      actual_outcome: 'Module shipped 2 weeks late. Core roadmap delayed by 3 weeks. CFO used the module once in a board meeting then never referenced it again.',
      outcome_rating: 'worse',
      accuracy_score: 2,
      claude_reflection: 'You made a political call under pressure — looking at what actually shipped and what it cost, was the trade-off worth it?',
      lessons_learned: 'Never commit to scope under political pressure without a written impact assessment shared with all stakeholders. Should have negotiated timeline, not scope.'
    }]
  },
  {
    id: 'demo-4',
    title: 'Choose Supabase over Firebase for new product database layer',
    category: 'Technical',
    rationale: 'Needed relational data model, built-in Row Level Security, and SQL flexibility. Firebase would require NoSQL modeling that does not fit our data structure.',
    expected_outcome: 'Faster development velocity, lower cost, cleaner data model than Firebase alternative.',
    confidence: 5,
    sprint_label: 'Sprint 19 / Q4 2025',
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: [{
      review_window: 30,
      actual_outcome: 'Supabase was the right call. RLS policies saved 2 weeks of auth engineering. SQL made reporting trivial. Team velocity noticeably higher.',
      outcome_rating: 'better',
      accuracy_score: 5,
      claude_reflection: 'You were highly confident in this call — what specific bets did that confidence rest on, and did they all pay off?',
      lessons_learned: 'High confidence was justified. The one miss: free tier pauses after inactivity — should have documented this for the team upfront.'
    }]
  },
  {
    id: 'demo-5',
    title: 'Expand beta to 500 users before fixing known search latency bug',
    category: 'Scope',
    rationale: 'Need more user signal before investing in search optimization. Latency is 3s — not ideal but acceptable for beta. Learning velocity more important than polish.',
    expected_outcome: 'Beta expansion gives us enough data to prioritize correctly. Search complaints manageable.',
    confidence: 3,
    sprint_label: 'Sprint 23 / Q2 2026',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: []
  },
  {
    id: 'demo-6',
    title: 'Sunset legacy CSV import in favor of API-only data ingestion',
    category: 'Prioritization',
    rationale: 'CSV import is used by 12% of users but consumes 30% of support tickets. API-only simplifies the stack significantly.',
    expected_outcome: 'Support ticket volume drops 25%. Some churn from CSV-dependent users — estimated under 5%.',
    confidence: 3,
    sprint_label: 'Sprint 18 / Q4 2025',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: [{
      review_window: 30,
      actual_outcome: 'Support tickets down 18%, not 25%. Churn was 9%, nearly double the estimate. Three enterprise accounts churned specifically citing CSV loss.',
      outcome_rating: 'worse',
      accuracy_score: 2,
      claude_reflection: 'You underestimated churn — were the CSV-dependent users actually a distinct segment you had not fully mapped before this decision?',
      lessons_learned: 'Should have interviewed CSV users before sunsetting. The 12% usage masked that they were disproportionately enterprise and high-ACV. Usage % alone is a bad proxy for business impact.'
    }]
  },
  {
    id: 'demo-7',
    title: 'Skip usability testing to hit Q1 launch deadline',
    category: 'Trade-off',
    rationale: 'Engineering is done. Usability testing would push launch 3 weeks. Competitive pressure from a rival announcement makes speed critical.',
    expected_outcome: 'Launch on time. Minor UX issues surfaced post-launch but fixed in week 2 patch.',
    confidence: 2,
    sprint_label: 'Sprint 17 / Q4 2025',
    created_at: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: [{
      review_window: 30,
      actual_outcome: 'Launched on time. Week 2 patch turned into a 6-week firefight. Three critical flows were broken for power users. NPS dropped 14 points.',
      outcome_rating: 'worse',
      accuracy_score: 1,
      claude_reflection: 'You traded testing time for speed — how much of the post-launch firefighting time could have been caught in even 2 days of usability testing?',
      lessons_learned: 'Skipping usability testing is almost never worth it. The real cost is not the 3 weeks of testing — it is the credibility you burn with users when basics are broken at launch.'
    }]
  },
  {
    id: 'demo-8',
    title: 'Align with Sales to add custom reporting as a Q2 priority',
    category: 'Stakeholder',
    rationale: 'Sales says 6 enterprise deals are blocked pending custom reporting. If true, this is $2M ARR sitting on the table. Hard to ignore even with a full roadmap.',
    expected_outcome: 'Custom reporting ships in Q2. At least 4 of 6 deals close within 30 days of ship.',
    confidence: 3,
    sprint_label: 'Sprint 24 / Q2 2026',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    review_30_due: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    review_60_due: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    review_90_due: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    outcomes: []
  },
]

export const DEMO_PATTERNS = {
  blindSpots: [
    'You consistently underestimate churn impact when removing features — usage % alone is masking business value in your decisions.',
    'Stakeholder-driven scope additions under political pressure are your weakest decision type. You tend to agree without negotiating constraints.'
  ],
  strengths: [
    'Technical architecture decisions are your strongest category — high confidence and high accuracy. Your instincts on tooling choices are well-calibrated.',
    'Trade-off decisions where you have data to anchor the call (activation rates, conversion metrics) show strong directional accuracy.'
  ],
  summary: 'Your decision-making is data-driven when data exists, but vulnerable to political pressure and stakeholder urgency when it does not. You are well-calibrated on technical choices and undercalibrated on user impact estimates for feature removals.'
}