# PM Decision Journal — Outcome Tracker
An AI-powered decision journal that resurfaces PM decisions at 30/60/90 days and scores prediction accuracy over time — built for product managers who want to turn intuition into institutional knowledge.

## The Problem
Product managers make 400+ decisions per year — prioritization calls, trade-off choices, stakeholder pivots — but almost never review whether those decisions were right. Without a feedback loop, PM intuition never compounds into expertise. The same judgment errors repeat across sprints, quarters, and years because there is no personal data to learn from.

## The Solution
PM Decision Journal lets you log a decision and your rationale in under 60 seconds. Claude auto-tags it by type (Prioritization, Trade-off, Stakeholder, Technical, Scope) and sets 30/60/90 day review reminders. When a review window opens, Claude generates a specific reflection prompt based on your original reasoning — not a generic question. You record what actually happened, Claude scores your prediction accuracy from 1–5, and over time the dashboard surfaces your blind spots and strengths with pattern analysis.

## Demo
🔗 [Live App — pm-decision-journal.vercel.app](https://pm-decision-journal.vercel.app)

**Dashboard view:** 4 stats cards (total decisions, reviewed, avg accuracy, reviews due) + accuracy by category bar chart + confidence calibration scatter plot + Claude AI pattern analysis panel.

**Review flow:** Decision resurfaces with your original rationale → Claude asks a tailored reflection question → you record the actual outcome → Claude scores accuracy and gives honest commentary.

## How to Use

### Prerequisites
- Node.js 18+
- A Supabase account (free tier) — [supabase.com](https://supabase.com)
- An Anthropic API key — [console.anthropic.com](https://console.anthropic.com)
- A PostHog account (free tier) — [posthog.com](https://posthog.com)

### Setup
```bash
git clone https://github.com/YOUR_USERNAME/pm-decision-journal.git
cd pm-decision-journal
npm install
cp .env.example .env
# Add your keys to .env
```

Run `supabase/schema.sql` in your Supabase SQL editor to create the decisions and outcomes tables with Row Level Security.

### Run
```bash
npm run dev
```
App runs at `http://localhost:5173`

### Example
```
Input:  "Deprioritize API v2 to ship mobile checkout feature by Q2"
        Rationale: "Mobile conversion is 40% lower than desktop — this is the highest leverage fix"
        Expected outcome: "Mobile conversion improves 15% within 60 days of ship"
        Confidence: 4/5

Claude tags it as: Prioritization (confidence: 0.94)

--- 30 days later ---

Claude asks: "You bet on mobile conversion being the primary constraint —
              did the data after launch confirm that hypothesis,
              or did a different bottleneck emerge?"

You record: "Shipped on time. Conversion up 11%, not 15%. Bottleneck
             turned out to be payment form UX, not the feature itself."

Claude scores: 4/5 — Mostly right
Commentary: "Strong directional accuracy — you identified the right
             problem but slightly overestimated the magnitude of impact."
```

## How It Works
The app is a React + Vite SPA backed by Supabase (Postgres + Auth) and deployed on Vercel with serverless functions handling all Claude API calls. When a decision is logged, `/api/tag-decision.js` sends the title and rationale to Claude and returns a category and confidence score. Review due dates are calculated at decision creation time (today + 30/60/90 days) and stored as timestamps — no cron job needed, the frontend compares them to today on load. At review time, `/api/generate-reflection.js` generates a tailored prompt, and `/api/score-outcome.js` compares expected vs actual outcome and returns an accuracy score with commentary. The `/api/analyze-patterns.js` endpoint receives the last N reviewed decisions and returns blind spots, strengths, and a decision-making summary. PostHog captures product events (decision_logged, review_completed, pattern_analysis_run) and Vercel Analytics captures traffic.

## Tradeoffs and Decisions

- **Why prompt-based Claude API over RAG:** At launch there is no corpus of decisions to retrieve from — RAG requires data to search, and we have none until users log 50+ decisions. Prompt engineering covers all four AI features cleanly at near-zero cost. The v2 roadmap adds pgvector to Supabase for semantic search once the data exists to make it useful.

- **Why fixed 30/60/90 day windows over user-configurable intervals:** Fixed intervals map directly to how PMs already think — sprint retrospectives, quarterly OKRs, annual reviews. User-configurable windows add UI complexity and decision fatigue with no v1 payoff. Storing due dates as timestamps at creation time also eliminates the need for any background job to determine when reviews are due.

- **Why Vite over Next.js:** The entire app is behind authentication, which means server-side rendering provides zero SEO benefit. Vite sets up in minutes, hot-reloads faster, and mirrors the stack already used across my other deployed tools — no new deployment patterns to learn.

- **What I'd do differently:** I would add a 7-day review window from the start. Some of the most important PM decisions are tactical sprint calls that need a fast feedback loop — 30 days is too long to wait to learn whether a scope cut was the right call.

## What I Learned

- **Prompt design is product design.** The quality of Claude's reflection prompts determines whether users have a genuine insight or just fill in a form. Writing prompts that feel like a thoughtful coach — not a survey — required more iteration than any UI component. The constraint of 45 words and no phrases like "looking back" forced specificity that generic prompts lack.

- **Default prop values are load-bearing architecture.** The most persistent bug in this build was `InsightsPanel` receiving `undefined` before Supabase data loaded — a one-word fix (`decisions = []`) that took three debugging sessions to trace. In React components that process fetched data, defensive defaults are not optional.

- **Tailwind v4 is not ready for Vite v8.** Vite v8 auto-installs Tailwind v4 which breaks the standard PostCSS configuration. Always pin to `tailwindcss@3` explicitly until the v4 PostCSS plugin ecosystem stabilizes. This cost 45 minutes and is now in the setup docs.

## Next Steps
- [ ] Email reminders for 30/60/90 day reviews via Supabase Edge Functions + Resend
- [ ] Google OAuth for frictionless signup
- [ ] CSV export of full decision log for personal archiving
- [ ] 7-day review window for tactical sprint-level decisions
- [ ] Semantic search across past decisions using pgvector (find similar past decisions before logging a new one)
- [ ] Persist AI pattern analysis to Supabase so insights survive page refresh
- [ ] Team mode — share decision log with manager for 1:1 coaching

## Built With
- [React + Vite](https://vitejs.dev) — frontend framework
- [Tailwind CSS v3](https://tailwindcss.com) — styling
- [Supabase](https://supabase.com) — Postgres database + authentication + Row Level Security
- [Claude API (Anthropic)](https://anthropic.com) — auto-tagging, reflection prompts, outcome scoring, pattern analysis
- [Vercel](https://vercel.com) — hosting + serverless functions
- [Recharts](https://recharts.org) — accuracy and calibration charts
- [PostHog](https://posthog.com) — product analytics and event tracking
- [Vercel Analytics](https://vercel.com/analytics) — traffic analytics

---
Built by Harsh Choubey | [LinkedIn](https://linkedin.com/in/harshchoubey) | [Portfolio](https://harshchoubey.com)