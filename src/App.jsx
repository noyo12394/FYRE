import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header.jsx'
import StoryPanel from './components/StoryPanel.jsx'
import CityMap from './components/CityMap.jsx'
import MissionPanel from './components/MissionPanel.jsx'
import ResultsModal from './components/ResultsModal.jsx'
import LockedModules from './components/LockedModules.jsx'
import Toast from './components/Toast.jsx'
import Confetti from './components/Confetti.jsx'
import { bridges, MAX_SELECTIONS } from './data/bridges.js'

export default function App() {
  const [selectedIds, setSelectedIds] = useState([])
  const [reasons, setReasons] = useState({}) // bridgeId -> reasonId
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState('')

  // A brief opening "aftershock" shudder of the map to set the scene.
  useEffect(() => {
    setShake(true)
    const t = setTimeout(() => setShake(false), 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!showConfetti) return
    const t = setTimeout(() => setShowConfetti(false), 3200)
    return () => clearTimeout(t)
  }, [showConfetti])

  const toggleBridge = useCallback((id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        setReasons((r) => {
          const next = { ...r }
          delete next[id]
          return next
        })
        return prev.filter((b) => b !== id)
      }
      if (prev.length >= MAX_SELECTIONS) {
        setToast('Inspection crews are limited! You can only flag 5 bridges this week.')
        return prev
      }
      setReasons((r) => ({ ...r, [id]: r[id] || 'hunch' }))
      return [...prev, id]
    })
  }, [])

  const setReason = useCallback((id, reasonId) => {
    setReasons((r) => ({ ...r, [id]: reasonId }))
  }, [])

  const handleSubmit = useCallback(() => {
    if (selectedIds.length === 0) return
    setShowResults(true)
    setShowConfetti(true)
  }, [selectedIds])

  const handlePlayAgain = useCallback(() => {
    setSelectedIds([])
    setReasons({})
    setShowResults(false)
    setShowConfetti(false)
  }, [])

  return (
    <div className="app">
      <div className="floaties" aria-hidden="true">
        <span className="floaty floaty--1">🌥️</span>
        <span className="floaty floaty--2">🚁</span>
        <span className="floaty floaty--3">🎈</span>
        <span className="floaty floaty--4">☀️</span>
        <span className="floaty floaty--5">🐦</span>
      </div>

      <Header />

      <main className="app__main">
        <StoryPanel />

        <div className="app__play-area">
          <CityMap
            bridges={bridges}
            selectedIds={selectedIds}
            onToggle={toggleBridge}
            showShake={shake}
          />
          <MissionPanel
            bridges={bridges}
            selectedIds={selectedIds}
            reasons={reasons}
            onToggle={toggleBridge}
            onSetReason={setReason}
            onSubmit={handleSubmit}
          />
        </div>

        <LockedModules />
      </main>

      <footer className="app__footer">
        QuakeQuest · Week 1 · A catastrophe-modeling field module · Based on the
        1994 Northridge earthquake
      </footer>

      {showConfetti && <Confetti />}
      <Toast message={toast} />

      {showResults && (
        <ResultsModal
          bridges={bridges}
          selectedIds={selectedIds}
          reasons={reasons}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
