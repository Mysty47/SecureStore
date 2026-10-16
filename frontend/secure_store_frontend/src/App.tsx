import { useEffect, useState } from 'react'
import './App.css'

type HealthState = 'loading' | 'connected' | 'error'

function App() {
  const [health, setHealth] = useState<HealthState>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = window.setTimeout(() => controller.abort(), 5000)

    async function checkHealth() {
      try {
        const response = await fetch('/api/health', {
          signal: controller.signal,
          cache: 'no-store',
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data: unknown = await response.json()
        if (
          typeof data !== 'object' || data === null ||
          !('status' in data) || data.status !== 'UP'
        ) {
          throw new Error('Unexpected health response')
        }
        if (active) setHealth('connected')
      } catch {
        if (active) setHealth('error')
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void checkHealth()
    return () => {
      active = false
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  return (
    <main className="health-page">
      <h1>SecureStore</h1>
      <p>Backend connection</p>
      <div className={`health-status ${health}`} role="status" aria-live="polite">
        {health === 'loading' && 'Checking Spring Boot…'}
        {health === 'connected' && 'Connected — backend status: UP'}
        {health === 'error' && 'Cannot reach the backend. Make sure Spring Boot is running on port 8080, then try again.'}
      </div>
      <button
        type="button"
        disabled={health === 'loading'}
        onClick={() => {
          setHealth('loading')
          setAttempt((previous) => previous + 1)
        }}
      >
        {health === 'loading' ? 'Checking…' : 'Check again'}
      </button>
    </main>
  )
}

export default App
