import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import StoryPanel from './components/StoryPanel.jsx'
import CityMap from './components/CityMap.jsx'
import MissionPanel from './components/MissionPanel.jsx'
import ResultsModal from './components/ResultsModal.jsx'
import ActivityTabs, { ACTIVITY_TABS } from './components/ActivityTabs.jsx'
import Activities from './components/Activities.jsx'
import BridgeInventory from './components/BridgeInventory.jsx'
import ProgressPanel from './components/ProgressPanel.jsx'
import FieldGuide from './components/FieldGuide.jsx'
import Icon from './components/Icon.jsx'
import Toast from './components/Toast.jsx'
import Confetti from './components/Confetti.jsx'
import { bridges, MAX_SELECTIONS } from './data/bridges.js'
import { getWeek, LAST_WEEK, WEEKS } from './data/weeks.js'
import { scoreSelection } from './utils/scoring.js'
import {
  DRAFT_KEY,
  RESPONSE_KEY,
  normalizeWorkspace,
  normalizeResponses,
  readStored,
  writeStored,
  readNavigation,
  csvForResponses,
} from './utils/progress.js'

export default function App() {
  const [workspace, setWorkspace] = useState(() => {
    const saved = normalizeWorkspace(readStored(DRAFT_KEY, {}))
    return {
      ...saved,
      week: readNavigation(window.location.search, saved.week).week,
    }
  })
  const [activeTab, setActiveTab] = useState(
    () => readNavigation(window.location.search).tab,
  )
  const [responses, setResponses] = useState(() =>
    normalizeResponses(readStored(RESPONSE_KEY, [])),
  )
  const [result, setResult] = useState(null)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitLock = useRef(false)
  const nameInput = useRef(null)
  const { week, studentName, drafts } = workspace
  const { selectedIds, reasons } = drafts[week]
  const weekConfig = getWeek(week)
  const learnerResponses = responses.filter(
    (row) =>
      row.student.trim().toLowerCase() === studentName.trim().toLowerCase(),
  )

  useEffect(() => {
    setStorageAvailable(writeStored(DRAFT_KEY, workspace))
  }, [workspace])

  useEffect(() => {
    if (responses.length && !writeStored(RESPONSE_KEY, responses))
      setStorageAvailable(false)
  }, [responses])

  useEffect(() => {
    function onPopState() {
      const navigation = readNavigation(window.location.search, week)
      setActiveTab(navigation.tab)
      setWorkspace((current) => ({ ...current, week: navigation.week }))
      setResult(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [week])

  useEffect(() => {
    document.title = `QuakeQuest · ${ACTIVITY_TABS.find((tab) => tab.id === activeTab).name}${activeTab === 'drill' ? ` · Week ${week}` : ''}`
  }, [activeTab, week])

  useEffect(() => {
    if (!shake) return
    const timer = setTimeout(() => setShake(false), 1200)
    return () => clearTimeout(timer)
  }, [shake])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!showConfetti) return
    const timer = setTimeout(() => setShowConfetti(false), 3200)
    return () => clearTimeout(timer)
  }, [showConfetti])

  function navigate(tab, nextWeek = week) {
    setActiveTab(tab)
    setWorkspace((current) => ({ ...current, week: nextWeek }))
    setResult(null)
    setShowConfetti(false)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    url.searchParams.set('week', String(nextWeek))
    if (url.href !== window.location.href) window.history.pushState({}, '', url)
  }

  function goToWeek(nextWeek) {
    navigate('drill', nextWeek)
    setShake(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateDraft(next) {
    setWorkspace((current) => ({
      ...current,
      drafts: { ...current.drafts, [week]: next },
    }))
  }

  function toggleBridge(id) {
    if (!bridges.some((bridge) => bridge.id === id)) return
    if (selectedIds.includes(id)) {
      const nextReasons = { ...reasons }
      delete nextReasons[id]
      updateDraft({
        selectedIds: selectedIds.filter((selected) => selected !== id),
        reasons: nextReasons,
      })
      return
    }
    if (selectedIds.length >= MAX_SELECTIONS) {
      setToast(
        'All five crews are assigned. Remove a flag to inspect another bridge.',
      )
      return
    }
    updateDraft({
      selectedIds: [...selectedIds, id],
      reasons: { ...reasons, [id]: 'hunch' },
    })
  }

  function setReason(id, reasonId) {
    updateDraft({ selectedIds, reasons: { ...reasons, [id]: reasonId } })
  }

  function setStudentName(name) {
    setWorkspace((current) => ({ ...current, studentName: name }))
  }

  function handleSubmit() {
    if (!selectedIds.length || submitLock.current || result) return
    const name = studentName.trim()
    if (!name) {
      setToast(
        'Add your planner name before dispatching your inspection crews.',
      )
      nameInput.current?.focus()
      return
    }
    submitLock.current = true
    setIsSubmitting(true)
    const score = scoreSelection(bridges, selectedIds, reasons)
    const payload = {
      id: crypto.randomUUID(),
      student: name,
      week,
      submittedAt: new Date().toISOString(),
      scoreLabel: score.label,
      collapsesCaught: score.collapsesCaught.length,
      highFlagged: score.highSelected.length,
      reasoningHits: score.reasoningHits.length,
      missedCollapses: score.missedCollapses.length,
      storage: 'local',
      selections: selectedIds.map((id) => ({
        id,
        name: bridges.find((bridge) => bridge.id === id).name,
        reason: reasons[id] || 'hunch',
      })),
    }
    const locallySaved = writeStored(RESPONSE_KEY, [...responses, payload])
    if (!locallySaved) payload.storage = 'memory'
    setResponses((current) => [...current, payload])
    setResult({ payload, status: 'saving' })
    setShake(true)
    setShowConfetti(true)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10000)
    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null)
        return response.ok && body?.stored === true
          ? 'cloud'
          : locallySaved
            ? 'local'
            : 'memory'
      })
      .catch(() => (locallySaved ? 'local' : 'memory'))
      .then((status) => {
        setResult((current) =>
          current?.payload.id === payload.id ? { ...current, status } : current,
        )
        setResponses((current) =>
          current.map((row) =>
            row.id === payload.id ? { ...row, storage: status } : row,
          ),
        )
      })
      .finally(() => {
        clearTimeout(timer)
        submitLock.current = false
        setIsSubmitting(false)
      })
  }

  function startFresh(nextWeek = week) {
    setWorkspace((current) => ({
      ...current,
      week: nextWeek,
      drafts: {
        ...current.drafts,
        [nextWeek]: { selectedIds: [], reasons: {} },
      },
    }))
    navigate('drill', nextWeek)
  }

  function downloadLocalCsv() {
    if (!responses.length) {
      setToast('Complete a dispatch to record your first response.')
      return
    }
    const url = URL.createObjectURL(
      new Blob([csvForResponses(responses)], {
        type: 'text/csv;charset=utf-8',
      }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'quakequest_responses_local.csv'
    link.hidden = true
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const resultWeek = result ? getWeek(result.payload.week) : weekConfig

  return (
    <div className="app lab-app">
      <a className="skip-link" href="#workspace-content">
        Skip to activity content
      </a>
      <div className="lab-topline">
        <span>
          <span className="status-dot" /> QUAKEQUEST / LEARNING WORKSPACE
        </span>
        <a
          href="https://github.com/noyo12394/FYRE"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="github" /> Project on GitHub <Icon name="arrow" />
        </a>
      </div>
      <Header
        week={
          activeTab === 'drill'
            ? weekConfig
            : {
                name: 'Field Lab',
                eyebrow: 'Catastrophe Modeling · Learn by Doing',
                subtitle: 'Lehigh Valley Earthquake Drill · Bethlehem, PA',
              }
        }
      />
      <ActivityTabs activeTab={activeTab} onChange={navigate} />

      <main id="workspace-content" className="app__main" tabIndex={-1}>
        <section
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className="activity-panel"
        >
          {activeTab === 'activities' && (
            <Activities
              drafts={drafts}
              responses={learnerResponses}
              studentName={studentName}
              onStart={goToWeek}
              onTab={navigate}
            />
          )}
          {activeTab === 'drill' && (
            <>
              <div className="drill-toolbar">
                <div
                  className="week-switch"
                  role="group"
                  aria-label="Choose field activity"
                >
                  {WEEKS.map((item) => (
                    <button
                      key={item.id}
                      className={week === item.id ? 'is-active' : ''}
                      aria-pressed={week === item.id}
                      onClick={() => goToWeek(item.id)}
                    >
                      <Icon name={item.revealsShaking ? 'wave' : 'bridge'} />
                      {item.label}
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
                <span className="draft-status" role="status">
                  <span
                    className={`status-dot ${storageAvailable ? '' : 'status-dot--warning'}`}
                  />
                  {storageAvailable
                    ? 'Draft saved on this device'
                    : 'Draft available this session only'}
                </span>
              </div>
              <StoryPanel week={weekConfig} />
              <div className="drill-context">
                <span>
                  <Icon name="map" /> Field map · Bethlehem, PA
                </span>
                <button
                  className="lab-action"
                  onClick={() => navigate('inventory')}
                >
                  Browse all bridges <Icon name="arrow" />
                </button>
              </div>
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
                  inputRef={nameInput}
                  isSubmitting={isSubmitting}
                />
              </div>
              <div className="drill-bottom">
                <p className="lab-muted">
                  Simulated earthquake data · Select up to five bridges, then
                  explain your choices.
                </p>
                <button
                  className="lab-action"
                  disabled={!selectedIds.length}
                  onClick={() => startFresh()}
                >
                  Clear this draft
                </button>
              </div>
            </>
          )}
          {activeTab === 'inventory' && (
            <BridgeInventory
              key={week}
              bridges={bridges}
              week={weekConfig}
              selectedIds={selectedIds}
              onToggle={toggleBridge}
              onReturn={() => navigate('drill')}
            />
          )}
          {activeTab === 'progress' && (
            <ProgressPanel
              responses={learnerResponses}
              allResponses={responses}
              studentName={studentName}
              drafts={drafts}
              onNameChange={setStudentName}
              onStart={goToWeek}
              onReview={(payload) =>
                setResult({ payload, status: payload.storage || 'local' })
              }
              onExport={downloadLocalCsv}
            />
          )}
          {activeTab === 'guide' && <FieldGuide onStart={goToWeek} />}
        </section>
        {ACTIVITY_TABS.filter((tab) => tab.id !== activeTab).map((tab) => (
          <section
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden
          />
        ))}
      </main>

      <footer className="app__footer lab-footer">
        <div>
          <strong>QuakeQuest</strong>
          <span>Made for curious minds and better decisions.</span>
        </div>
        <div>
          <span>Bethlehem, PA · Learning drill · v2.0</span>
          <button className="instructor-link" onClick={downloadLocalCsv}>
            Instructor: download device responses (CSV)
          </button>
        </div>
      </footer>
      {!storageAvailable && (
        <p className="storage-notice" role="status">
          Browser storage is unavailable. Your work is available for this
          session; export recorded responses before leaving.
        </p>
      )}
      {showConfetti && <Confetti />}
      <Toast message={toast} />
      {result && (
        <ResultsModal
          bridges={bridges}
          selectedIds={result.payload.selections.map(
            (selection) => selection.id,
          )}
          reasons={Object.fromEntries(
            result.payload.selections.map(({ id, reason }) => [id, reason]),
          )}
          saveStatus={result.status}
          week={resultWeek}
          hasNext={resultWeek.id < LAST_WEEK}
          nextLabel={
            resultWeek.id < LAST_WEEK ? getWeek(resultWeek.id + 1).label : null
          }
          onAdvanceWeek={() => goToWeek(resultWeek.id + 1)}
          onPlayAgain={() => startFresh(resultWeek.id)}
          onClose={() => setResult(null)}
        />
      )}
    </div>
  )
}
