import { useState } from 'react'
import { COMPLETION_MESSAGES } from './constants'
import { ConfigScreen } from './components/ConfigScreen'
import { SessionScreen } from './components/SessionScreen'
import { CompletionScreen } from './components/CompletionScreen'

export default function App() {
  const [screen, setScreen] = useState('config')
  const [sessionConfig, setSessionConfig] = useState(null)
  const [sessionKey, setSessionKey] = useState(0)
  const [completionMessage, setCompletionMessage] = useState('')

  function handleBegin(config) {
    setSessionConfig(config)
    setScreen('session')
  }

  function handleComplete() {
    const msg = COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)]
    setCompletionMessage(msg)
    setScreen('completion')
  }

  function handleAgain() {
    setSessionKey((k) => k + 1)
    setScreen('session')
  }

  function handleClose() {
    setScreen('config')
  }

  return (
    <>
      {screen === 'config' && (
        <ConfigScreen onBegin={handleBegin} />
      )}
      {screen === 'session' && (
        <SessionScreen
          key={sessionKey}
          config={sessionConfig}
          onComplete={handleComplete}
          onEnd={handleClose}
        />
      )}
      {screen === 'completion' && (
        <CompletionScreen
          message={completionMessage}
          onAgain={handleAgain}
          onClose={handleClose}
        />
      )}
    </>
  )
}
