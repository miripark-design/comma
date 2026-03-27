import { useMemo } from 'react'

const X0 = 60
const Y0 = 60
const X1 = 340
const Y1 = 340

function getDotPosition(phaseIndex, progress) {
  switch (phaseIndex) {
    case 0: return { x: X0 + progress * (X1 - X0), y: Y0 }          // top: left→right
    case 1: return { x: X1, y: Y0 + progress * (Y1 - Y0) }          // right: top→bottom
    case 2: return { x: X1 - progress * (X1 - X0), y: Y1 }          // bottom: right→left
    case 3: return { x: X0, y: Y1 - progress * (Y1 - Y0) }          // left: bottom→top
    default: return { x: X0, y: Y0 }
  }
}

const SIDE_PHASES = [0, 1, 2, 3]

export function BoxAnimation({ phaseIndex, phaseProgress, pattern, prefersReduced }) {
  const dot = useMemo(
    () => getDotPosition(phaseIndex, phaseProgress),
    [phaseIndex, phaseProgress]
  )

  const phaseDuration = pattern.phases[phaseIndex]
  const phaseLabel = pattern.labels[phaseIndex]
  const countdown = Math.ceil(phaseDuration * (1 - phaseProgress))

  function getSideStroke(sideIndex) {
    if (pattern.phases[sideIndex] === 0) return 'var(--surface)'
    return sideIndex === phaseIndex ? 'var(--text-primary)' : 'var(--surface)'
  }

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Breathing animation. ${phaseLabel}. ${countdown} seconds.`}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {/* Corner marks */}
      {[[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="var(--surface)" />
      ))}

      {/* Box sides — drawn as separate lines so each can be colored */}
      {/* Top (phase 0) */}
      <line
        x1={X0} y1={Y0} x2={X1} y2={Y0}
        stroke={getSideStroke(0)}
        strokeWidth={SIDE_PHASES[0] === phaseIndex ? 1.5 : 1}
        strokeLinecap="round"
      />
      {/* Right (phase 1) */}
      <line
        x1={X1} y1={Y0} x2={X1} y2={Y1}
        stroke={getSideStroke(1)}
        strokeWidth={SIDE_PHASES[1] === phaseIndex ? 1.5 : 1}
        strokeLinecap="round"
      />
      {/* Bottom (phase 2) */}
      <line
        x1={X1} y1={Y1} x2={X0} y2={Y1}
        stroke={getSideStroke(2)}
        strokeWidth={SIDE_PHASES[2] === phaseIndex ? 1.5 : 1}
        strokeLinecap="round"
      />
      {/* Left (phase 3) */}
      <line
        x1={X0} y1={Y1} x2={X0} y2={Y0}
        stroke={getSideStroke(3)}
        strokeWidth={SIDE_PHASES[3] === phaseIndex ? 1.5 : 1}
        strokeLinecap="round"
      />

      {/* Dot — hidden for reduced motion */}
      {!prefersReduced && (
        <circle
          cx={dot.x}
          cy={dot.y}
          r={8}
          fill="var(--accent)"
        />
      )}

      {/* Phase label */}
      {phaseLabel && (
        <text
          x="200"
          y="178"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-sans)"
          fontSize="10"
          fontWeight="500"
          letterSpacing="0.15em"
          fill="var(--text-secondary)"
          style={{ textTransform: 'uppercase' }}
        >
          {phaseLabel.toUpperCase()}
        </text>
      )}

      {/* Countdown */}
      <text
        x="200"
        y="222"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-mono)"
        fontSize="52"
        fontWeight="300"
        fill="var(--text-primary)"
      >
        {countdown}
      </text>
    </svg>
  )
}
