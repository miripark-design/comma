import { useState } from 'react'
import { PATTERNS, DURATION_OPTIONS, loadSettings, saveSettings } from '../constants'
import { unlockAudio } from '../hooks/useAudio'

const saved = loadSettings()

export function ConfigScreen({ onBegin }) {
  const [patternId, setPatternId] = useState(saved?.lastPattern || 'box')
  const [duration, setDuration] = useState(saved?.lastDuration || 4)
  const [isCustom, setIsCustom] = useState(
    saved?.lastDuration ? !DURATION_OPTIONS.includes(saved.lastDuration) : false
  )
  const [customDuration, setCustomDuration] = useState(
    saved?.lastDuration && !DURATION_OPTIONS.includes(saved.lastDuration)
      ? String(saved.lastDuration)
      : ''
  )
  const [soundEnabled, setSoundEnabled] = useState(saved?.soundEnabled || false)

  function handleDurationSelect(mins) {
    setIsCustom(false)
    setDuration(mins)
  }

  function handleCustomSelect() {
    setIsCustom(true)
    const val = parseInt(customDuration)
    if (val > 0) setDuration(val)
  }

  function handleCustomInput(e) {
    const raw = e.target.value.replace(/\D/g, '')
    setCustomDuration(raw)
    const val = parseInt(raw)
    if (val > 0) setDuration(val)
  }

  function handleBegin() {
    const finalDuration = isCustom ? (parseInt(customDuration) || 4) : duration
    saveSettings({ lastPattern: patternId, lastDuration: finalDuration, soundEnabled })
    unlockAudio()
    onBegin({ patternId, duration: finalDuration, soundEnabled })
  }

  return (
    <main className="config" aria-label="Session configuration">
      <div className="config__identity">
        <h1 className="config__title">Comma<span style={{ color: 'var(--accent)' }}>,</span></h1>
        <p className="config__byline">by oddly calm</p>
      </div>

      {/* Pattern */}
      <section className="config__section" aria-labelledby="pattern-label">
        <p id="pattern-label" className="config__label">Pattern</p>
        <div className="config__options" role="radiogroup" aria-labelledby="pattern-label">
          {Object.values(PATTERNS).map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={patternId === p.id}
              className={`config__option${patternId === p.id ? ' config__option--active' : ''}`}
              onClick={() => setPatternId(p.id)}
            >
              <span className="config__option-name">{p.name}</span>
              <span className="config__option-sub">{p.subLabel}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Duration */}
      <section className="config__section" aria-labelledby="duration-label">
        <p id="duration-label" className="config__label">Duration</p>
        <div className="config__options" role="radiogroup" aria-labelledby="duration-label">
          {DURATION_OPTIONS.map((mins) => (
            <button
              key={mins}
              role="radio"
              aria-checked={!isCustom && duration === mins}
              className={`config__option${!isCustom && duration === mins ? ' config__option--active' : ''}`}
              onClick={() => handleDurationSelect(mins)}
            >
              {mins} min
            </button>
          ))}
          <button
            role="radio"
            aria-checked={isCustom}
            className={`config__option${isCustom ? ' config__option--active' : ''}`}
            onClick={handleCustomSelect}
          >
            Custom
          </button>
        </div>
        {isCustom && (
          <div className="config__custom">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="config__custom-input"
              value={customDuration}
              onChange={handleCustomInput}
              placeholder="—"
              aria-label="Custom duration in minutes"
              autoFocus
              maxLength={3}
            />
            <span className="config__label">min</span>
          </div>
        )}
      </section>

      {/* Sound */}
      <section className="config__section">
        <p className="config__label">Sound</p>
        <button
          className="config__toggle"
          role="switch"
          aria-checked={soundEnabled}
          onClick={() => setSoundEnabled((v) => !v)}
          aria-label={`Sound ${soundEnabled ? 'on' : 'off'}`}
        >
          <span className="config__toggle-side" style={{ color: !soundEnabled ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            off
          </span>
          <span className={`config__toggle-track${soundEnabled ? ' config__toggle-track--on' : ''}`}>
            <span className="config__toggle-thumb" />
          </span>
          <span className="config__toggle-side" style={{ color: soundEnabled ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            on
          </span>
        </button>
      </section>

      {/* Begin */}
      <button className="config__begin" onClick={handleBegin}>
        Begin
      </button>
    </main>
  )
}
