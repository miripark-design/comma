import { useCallback } from 'react'

const canAudio = typeof Audio !== 'undefined'

const audioInhale  = canAudio ? new Audio('/singingbowl_inhale.mp3')    : null
const audioExhale  = canAudio ? new Audio('/singingbowl_exhale.mp3')    : null
const audioEnd     = canAudio ? new Audio('/singingbowl_exhale_end.mp3'): null

if (audioInhale) audioInhale.preload = 'auto'
if (audioExhale) audioExhale.preload = 'auto'
if (audioEnd)    audioEnd.preload    = 'auto'

// Call synchronously inside a user gesture (the Begin button click).
// Plays then immediately pauses all elements to satisfy iOS Safari's
// requirement that the first play() occur within a gesture handler.
export function unlockAudio() {
  for (const a of [audioInhale, audioExhale, audioEnd]) {
    if (!a) continue
    const p = a.play()
    if (p) p.then(() => { a.pause(); a.currentTime = 0 }).catch(() => {})
  }
}

export function playEndSound() {
  if (!audioEnd) return
  audioEnd.currentTime = 0
  audioEnd.play().catch(() => {})
}

export function useAudio(enabled) {
  // phaseIndex: 0 = inhale, 2 = exhale (hold phases never call this)
  const playBowl = useCallback((phaseIndex) => {
    if (!enabled) return
    const a = phaseIndex === 0 ? audioInhale : audioExhale
    if (!a) return
    a.currentTime = 0
    a.play().catch(() => {})
  }, [enabled])

  return { playBowl }
}
