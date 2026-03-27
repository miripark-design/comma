import { useEffect } from 'react'
import { playEndSound } from '../hooks/useAudio'

export function CompletionScreen({ message, onAgain, onClose }) {
  useEffect(() => {
    playEndSound()
  }, [])

  return (
    <main className="completion" aria-label="Session complete">
      <p className="completion__message">{message}</p>
      <div className="completion__actions">
        <button className="completion__again" onClick={onAgain}>
          Go again
        </button>
        <button className="completion__close" onClick={onClose}>
          Close
        </button>
      </div>
    </main>
  )
}
