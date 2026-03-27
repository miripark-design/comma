import { useEffect, useRef } from 'react'
import { PATTERNS } from '../constants'
import { useBreathing } from '../hooks/useBreathing'
import { useAudio } from '../hooks/useAudio'
import { BoxAnimation } from './BoxAnimation'

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SessionScreen({ config, onComplete, onEnd }) {
  const pattern = PATTERNS[config.patternId]
  const { playBowl } = useAudio(config.soundEnabled)
  const breathState = useBreathing(pattern, config.duration)
  const prevPhaseRef = useRef(null)
  const liveRef = useRef(null)

  // Play inhale sound immediately on session start
  useEffect(() => {
    playBowl(0)
  }, [])

  // Play bowl on phase change
  useEffect(() => {
    if (prevPhaseRef.current === null) {
      prevPhaseRef.current = breathState.phaseIndex
      return
    }
    if (prevPhaseRef.current !== breathState.phaseIndex) {
      prevPhaseRef.current = breathState.phaseIndex
      // Only sound on inhale (0) and exhale (2) — not on hold phases
      if (breathState.phaseIndex === 0 || breathState.phaseIndex === 2) {
        playBowl(breathState.phaseIndex)
      }
      if (liveRef.current) {
        liveRef.current.textContent = pattern.labels[breathState.phaseIndex] || ''
      }
    }
  }, [breathState.phaseIndex])

  // Transition to completion when done
  useEffect(() => {
    if (breathState.done) {
      onComplete()
    }
  }, [breathState.done])

  const cycleDisplay = breathState.totalCycles > 0
    ? `${breathState.cyclesComplete + 1} / ${breathState.totalCycles}`
    : null

  return (
    <main className="session" aria-label="Active breathing session">
      {/* Session progress bar */}
      <div
        className="session__progress"
        style={{ width: `${breathState.sessionProgress * 100}%` }}
        role="progressbar"
        aria-valuenow={Math.round(breathState.sessionProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Session progress"
      />

      {/* Screen-reader live phase announcements */}
      <div
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />

      {/* Animation */}
      <div className="session__animation">
        <BoxAnimation
          phaseIndex={breathState.phaseIndex}
          phaseProgress={breathState.phaseProgress}
          pattern={pattern}
          prefersReduced={prefersReduced}
        />
      </div>

      {/* Cycle count */}
      {cycleDisplay && (
        <p className="session__cycles" aria-hidden="true">
          cycle {cycleDisplay}
        </p>
      )}

      {/* End session */}
      <button className="session__end" onClick={onEnd} aria-label="End session">
        End session
      </button>
    </main>
  )
}
