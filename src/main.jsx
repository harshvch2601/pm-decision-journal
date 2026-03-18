import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { inject } from '@vercel/analytics'
import posthog from 'posthog-js'

// Vercel Analytics
inject()

// PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  capture_pageview: true,
  capture_pageleave: true,
  autocapture: true,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)