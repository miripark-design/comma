import { useEffect, useState } from 'react'

export function useBreathing(pattern, durationMinutes) {
  const [state, setState] = useState({
    phaseIndex: 0,
    phaseProgress: 0,
    cyclesComplete: 0,
    sessionProgress: 0,
    totalCycles: 0,
    done: false,
  })

  useEffect(() => {
    const phases = pattern.phases
    const durationMs = durationMinutes * 60 * 1000

    const effectivePhases = phases
      .map((dur, index) => ({ dur, index }))
      .filter((p) => p.dur > 0)

    const cycleDurationMs = effectivePhases.reduce((sum, p) => sum + p.dur * 1000, 0)
    const totalCycles = Math.ceil(durationMs / cycleDurationMs)

    setState({
      phaseIndex: effectivePhases[0].index,
      phaseProgress: 0,
      cyclesComplete: 0,
      sessionProgress: 0,
      totalCycles,
      done: false,
    })

    let startTime = null
    let rafId = null

    function tick(now) {
      if (startTime === null) startTime = now
      const elapsed = now - startTime

      const cycleElapsed = elapsed % cycleDurationMs
      const cyclesComplete = Math.floor(elapsed / cycleDurationMs)
      const sessionProgress = cyclesComplete / totalCycles

      if (cyclesComplete >= totalCycles) {
        setState((s) => ({ ...s, sessionProgress: 1, done: true }))
        return
      }

      let phaseIndex = effectivePhases[0].index
      let phaseProgress = 0
      let accumulated = 0

      for (const phase of effectivePhases) {
        const phaseDurMs = phase.dur * 1000
        if (cycleElapsed < accumulated + phaseDurMs) {
          phaseIndex = phase.index
          phaseProgress = (cycleElapsed - accumulated) / phaseDurMs
          break
        }
        accumulated += phaseDurMs
      }

      setState({ phaseIndex, phaseProgress, cyclesComplete, sessionProgress, totalCycles, done: false })
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [pattern.id, durationMinutes])

  return state
}
