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
import { getWeek, LAST_WEEK } from './data/weeks.js'
import { scoreSelection } from './utils/scoring.js'

const LOCAL_KEY = 'quakequest-responses'

// Always keep a local copy of every submission. If the class backend (Supabase
// via /api/submit) is unavailable, this is the source for the instructor's
// local CSV download.
function saveLocally(payload) {
  try {
    const prev = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    prev.push(payload)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(prev))
  } catch {
    /* storage unavailable — nothing else to do */
  }
}

function downloadLocalCsv() {
  let rows = []
  try {
    rows = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  } catch {
    rows = []
  }
  if (rows.length === 0) {
    alert('No responses recorded on this device yet.')
    return
  }
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const header = [
    'submitted_at', 'student', 'week', 'score_label', 'collapses_caught', 'high_flagged',
    'reasoning_hits', 'missed_collapses', 'selections',
  ]
  const lines = [header.join(',')]
  for (const r of rows) {
    const selections = (r.selections || [])
      .map((s) => `${s.name} (${s.reason})`)
      .join('; ')
    lines.push([
      r.submittedAt, r.student, r.week || 1, r.scoreLabel, r.collapsesCaught, r.highFlagged,
      r.reasoningHits, r.missedCollapses, selections,
    ].map(esc).join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'quakequest_responses_local.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function App() {
  const [week, setWeek] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [reasons, setReasons] = useState({}) // bridgeId -> reasonId
  const [studentName, setStudentName] = useState('')
  const [saveStatus, setSaveStatus] = useState(null) // saving | cloud | local
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState('')

  const weekConfig = getWeek(week)
  const hasNextWeek = week < LAST_WEEK
  const nextLabel = hasNextWeek ? getWeek(week + 1).label : null

  // Trigger the opening "aftershock" shudder once on mount.
  useEffect(() => {
    setShake(true)
  }, [])

  // Whenever a shake is triggered (mount or dispatch), clear it shortly after.
  useEffect(() => {
    if (!shake) return
    const t = setTimeout(() => setShake(false), 1200)
    return () => clearTimeout(t)
  }, [shake])

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
    const name = studentName.trim()
    if (!name) {
      setToast('Add your name first — your instructor records the answers! ✍️')
      return
    }

    const score = scoreSelection(bridges, selectedIds, reasons)
    const payload = {
      student: name,
      week,
      submittedAt: new Date().toISOString(),
      scoreLabel: score.label,
      collapsesCaught: score.collapsesCaught.length,
      highFlagged: score.highSelected.length,
      reasoningHits: score.reasoningHits.length,
      missedCollapses: score.missedCollapses.length,
      selections: selectedIds.map((id) => {
        const b = bridges.find((x) => x.id === id)
        return { id, name: b ? b.name : id, reason: reasons[id] || 'hunch' }
      }),
    }

    saveLocally(payload)
    setSaveStatus('saving')
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => setSaveStatus(r.ok ? 'cloud' : 'local'))
      .catch(() => setSaveStatus('local'))

    setShake(true)
    setShowConfetti(true)
    // Let the dramatic shake play briefly before the debrief slides in.
    setTimeout(() => setShowResults(true), 650)
  }, [selectedIds, reasons, studentName, week])

  const handlePlayAgain = useCallback(() => {
    setSelectedIds([])
    setReasons({})
    setSaveStatus(null)
    setShowResults(false)
    setShowConfetti(false)
  }, [])

  // Jump to a specific week's drill — clears the current run and re-triggers the
  // opening shudder so the new briefing lands with a jolt.
  const goToWeek = useCallback((w) => {
    setWeek(w)
    setSelectedIds([])
    setReasons({})
    setSaveStatus(null)
    setShowResults(false)
    setShowConfetti(false)
    setShake(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleAdvanceWeek = useCallback(() => {
    if (week < LAST_WEEK) goToWeek(week + 1)
  }, [week, goToWeek])

  return (
    <div className="app">
      <div className="floaties" aria-hidden="true">
        <span className="floaty floaty--1">🌥️</span>
        <span className="floaty floaty--2">🚁</span>
        <span className="floaty floaty--4">🌤️</span>
      </div>

      <Header week={weekConfig} />

      <main className="app__main">
        <StoryPanel week={weekConfig} />

        <div className="app__play-area">
          <CityMap
            bridges={bridges}
            selectedIds={selectedIds}
            onToggle={toggleBridge}
            showShake={shake}
            revealsShaking={weekConfig.revealsShaking}
          />
          <MissionPanel
            bridges={bridges}
            selectedIds={selectedIds}
            reasons={reasons}
            studentName={studentName}
            week={weekConfig}
            onNameChange={setStudentName}
            onToggle={toggleBridge}
            onSetReason={setReason}
            onSubmit={handleSubmit}
          />
        </div>

        <LockedModules currentWeek={week} onGoToWeek={goToWeek} />
      </main>

      <footer className="app__footer">
        QuakeQuest · Week 1 · A catastrophe-modeling field module · Bethlehem, PA
        earthquake drill <span className="app__build">· build v1.5</span>
        <button type="button" className="instructor-link" onClick={downloadLocalCsv}>
          Instructor: download responses from this device (CSV)
        </button>
      </footer>

      {showConfetti && <Confetti />}
      <Toast message={toast} />

      {showResults && (
        <ResultsModal
          bridges={bridges}
          selectedIds={selectedIds}
          reasons={reasons}
          saveStatus={saveStatus}
          week={weekConfig}
          hasNext={hasNextWeek}
          nextLabel={nextLabel}
          onAdvanceWeek={handleAdvanceWeek}
          onPlayAgain={handlePlayAgain}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
