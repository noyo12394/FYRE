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
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [toast, setToast] = useState('')

  // Auto-dismiss the warning toast.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  // Confetti only shows for a short celebratory burst.
  useEffect(() => {
    if (!showConfetti) return
    const t = setTimeout(() => setShowConfetti(false), 3200)
    return () => clearTimeout(t)
  }, [showConfetti])

  const toggleBridge = useCallback((id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((b) => b !== id)
      }
      if (prev.length >= MAX_SELECTIONS) {
        setToast('Inspection crews are limited! You can only pick 5 bridges this week.')
        return prev
      }
      return [...prev, id]
    })
  }, [])

  const handleSubmit = useCallback(() => {
    if (selectedIds.length === 0) return
    setShowResults(true)
    setShowConfetti(true)
  }, [selectedIds])

  const handlePlayAgain = useCallback(() => {
    setSelectedIds([])
    setShowResults(false)
    setShowConfetti(false)
  }, [])

  return (
    <div className="app">
      {/* floating decorative icons in the background */}
      <div className="floaties" aria-hidden="true">
        <span className="floaty floaty--1">🌥️</span>
        <span className="floaty floaty--2">🐦</span>
        <span className="floaty floaty--3">🎈</span>
        <span className="floaty floaty--4">☀️</span>
        <span className="floaty floaty--5">🦋</span>
      </div>

      <Header />

      <main className="app__main">
        <StoryPanel />

        <div className="app__play-area">
          <CityMap
            bridges={bridges}
            selectedIds={selectedIds}
            onToggle={toggleBridge}
          />
          <MissionPanel
            bridges={bridges}
            selectedIds={selectedIds}
            onToggle={toggleBridge}
            onSubmit={handleSubmit}
          />
        </div>

        <LockedModules />
      </main>

      <footer className="app__footer">
        Made with 💖 for QuakeQuest · Week 1 prototype · Have fun, planner!
      </footer>

      {showConfetti && <Confetti />}
      <Toast message={toast} />

      {showResults && (
        <ResultsModal
          bridges={bridges}
          selectedIds={selectedIds}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
