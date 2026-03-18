import posthog from 'posthog-js'

export const track = (event, properties = {}) => {
  try {
    posthog.capture(event, properties)
  } catch {
    // fail silently — never break the app for analytics
  }
}

export const identifyUser = (userId, email) => {
  try {
    posthog.identify(userId, { email })
  } catch {}
}

export const resetUser = () => {
  try {
    posthog.reset()
  } catch {}
}