export const PATTERNS = {
  box: {
    id: 'box',
    name: 'Box Breathing',
    subLabel: '4 – 4 – 4 – 4',
    phases: [4, 4, 4, 4],
    labels: ['Inhale', 'Hold', 'Exhale', 'Hold'],
  },
  p478: {
    id: 'p478',
    name: 'Deep Rest',
    subLabel: '4 – 7 – 8',
    phases: [4, 7, 8, 0],
    labels: ['Inhale', 'Hold', 'Exhale', ''],
  },
  calm: {
    id: 'calm',
    name: 'Calm Breathing',
    subLabel: '4 – 6',
    phases: [4, 0, 6, 0],
    labels: ['Inhale', '', 'Exhale', ''],
  },
}

export const DURATION_OPTIONS = [2, 4, 6]

export const COMPLETION_MESSAGES = [
  'You just chose presence.',
  'That was enough.',
  'Back when you\'re ready.',
  'You showed up for yourself.',
  'This moment counted.',
  'Stillness lives here.',
  'The pause was the point.',
  'Good. Now back to it.',
  'One breath at a time.',
  'You came back to yourself.',
]

export const STORAGE_KEY = 'breathe-settings'

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore storage errors
  }
}
