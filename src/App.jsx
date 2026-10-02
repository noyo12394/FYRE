import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import CityMap from './components/CityMap.jsx'
import MissionPanel from './components/MissionPanel.jsx'
import MissionBriefing from './components/MissionBriefing.jsx'
import BridgeChoices from './components/BridgeChoices.jsx'
import ResultsModal from './components/ResultsModal.jsx'
import ActivityTabs, { ACTIVITY_TABS } from './components/ActivityTabs.jsx'
import BridgeInventory from './components/BridgeInventory.jsx'
import ProgressPanel from './components/ProgressPanel.jsx'
import FieldGuide from './components/FieldGuide.jsx'
import Icon from './components/Icon.jsx'
import Toast from './components/Toast.jsx'
import Confetti from './components/Confetti.jsx'
import { bridges, MAX_SELECTIONS } from './data/bridges.js'
import { MISSION, MISSION_ID } from './data/mission.js'
import { scoreMission } from './utils/scoring.js'
import {
  DRAFT_KEY,
  LEGACY_DRAFT_KEY,
  RESPONSE_KEY,
  normalizeWorkspace,
  normalizeResponses,
  readStored,
  writeStored,
  readNavigation,
  csvForResponses,
  lockBaseline,
  isDispatchReady,
  dispatchRequirements,
  responseId,
} from './utils/progress.js'

export default function App() {
  const [workspace, setWorkspace] = useState(() =>
    normalizeWorkspace(readStored(DRAFT_KEY, readStored(LEGACY_DRAFT_KEY, {}))),
  )
  const [activeTab, setActiveTab] = useState(
    () => readNavigation(window.location.search).tab,
  )
  const [responses, setResponses] = useState(() =>
    normalizeResponses(readStored(RESPONSE_KEY, [])),
  )
  const [result, setResult] = useState(null)
  const [draftStorageAvailable, setDraftStorageAvailable] = useState(true)
  const [historyStorageAvailable, setHistoryStorageAvailable] = useState(true)
  const storageAvailable = draftStorageAvailable && historyStorageAvailable
  const [showConfetti, setShowConfetti] = useState(false)
  const [toast, setToast] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showShake, setShowShake] = useState(true)
  const [validationAttempted, setValidationAttempted] = useState(false)
  const submitLock = useRef(false)
  const nameInput = useRef(null)
  const phaseHeading = useRef(null)
  const choicesRef = useRef(null)
  const plannerRef = useRef(null)
  const { studentName, draft, phase, baseline } = workspace
  const { selectedIds, reasons } = draft
  const revealsShaking = phase !== 'recon'
  const editable = ['recon', 'intel'].includes(phase) && !isSubmitting
  const lastResult = responses.find((row) => row.id === workspace.lastResultId)

  useEffect(() => {
    setDraftStorageAvailable(writeStored(DRAFT_KEY, workspace))
  }, [workspace])
  useEffect(() => {
    if (responses.length)
      setHistoryStorageAvailable(writeStored(RESPONSE_KEY, responses))
  }, [responses])
  useEffect(() => {
    function syncNavigation() {
      const tab = readNavigation(window.location.search).tab
      setActiveTab(tab)
      setResult(null)
      const url = new URL(window.location.href)
      url.searchParams.delete('week')
      url.searchParams.set('tab', tab)
      window.history.replaceState({}, '', url)
    }
    syncNavigation()
    window.addEventListener('popstate', syncNavigation)
    return () => window.removeEventListener('popstate', syncNavigation)
  }, [])
  useEffect(() => {
    document.title = `QuakeQuest · The Golden Hour · ${ACTIVITY_TABS.find((tab) => tab.id === activeTab).name}`
  }, [activeTab])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 4200)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (!showConfetti) return
    const timer = setTimeout(() => setShowConfetti(false), 3200)
    return () => clearTimeout(timer)
  }, [showConfetti])

  function navigate(tab) {
    setActiveTab(tab)
    setResult(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('week')
    url.searchParams.set('tab', tab)
    if (url.href !== window.location.href) window.history.pushState({}, '', url)
  }
  function updateDraft(updater) {
    if (!editable) return
    setWorkspace((current) => ({ ...current, draft: updater(current.draft) }))
  }
  function toggleBridge(id) {
    if (!editable) {
      setToast('Return to editing to change your dispatch plan.')
      return
    }
    if (!bridges.some((bridge) => bridge.id === id)) return
    if (!selectedIds.includes(id) && selectedIds.length >= MAX_SELECTIONS) {
      setToast('Five crews, five crossings. Remove a flag to free a crew.')
      return
    }
    updateDraft((current) => {
      if (current.selectedIds.includes(id)) {
        const nextReasons = { ...current.reasons }
        delete nextReasons[id]
        return {
          selectedIds: current.selectedIds.filter(
            (selected) => selected !== id,
          ),
          reasons: nextReasons,
        }
      }
      if (current.selectedIds.length >= MAX_SELECTIONS) return current
      return {
        selectedIds: [...current.selectedIds, id],
        reasons: { ...current.reasons, [id]: '' },
      }
    })
  }
  function setReason(id, reason) {
    updateDraft((current) => ({
      ...current,
      reasons: { ...current.reasons, [id]: reason },
    }))
  }
  function setPlannerName(name) {
    if (!editable) return
    setWorkspace((current) => ({ ...current, studentName: name.slice(0, 80) }))
  }
  function moveCrew(id, direction) {
    updateDraft((current) => {
      const ids = [...current.selectedIds],
        index = ids.indexOf(id),
        target = index + direction
      if (index < 0 || target < 0 || target >= ids.length) return current
      ;[ids[index], ids[target]] = [ids[target], ids[index]]
      return { ...current, selectedIds: ids }
    })
  }
  function advancePhase() {
    setValidationAttempted(true)
    if (phase === 'recon') {
      if (selectedIds.length !== MAX_SELECTIONS) {
        setToast(
          `Assign ${MAX_SELECTIONS - selectedIds.length} more crews using the numbered crossing cards.`,
        )
        showChoices()
        return
      }
      setWorkspace((current) => lockBaseline(current))
      setToast('Shaking map unlocked. Hospital dispatch is on the radio!')
    } else if (phase === 'intel') {
      if (!isDispatchReady(draft, studentName)) {
        const missing = dispatchRequirements(draft, studentName)
        if (missing.missingCrews) {
          showChoices()
          setToast(
            `Assign ${missing.missingCrews} more crews before reviewing.`,
          )
        } else if (missing.missingName) {
          nameInput.current?.focus()
          setToast('Add your planner name to continue.')
        } else {
          document
            .getElementById(`reason-${missing.missingReasons[0]}`)
            ?.focus()
          setToast(
            'Choose an evidence-based reason for each assigned crossing.',
          )
        }
        return
      }
      setWorkspace((current) => ({ ...current, phase: 'review' }))
    }
    setValidationAttempted(false)
    requestAnimationFrame(() => phaseHeading.current?.focus())
  }
  async function handleSubmit() {
    if (
      phase !== 'review' ||
      !baseline ||
      !isDispatchReady(draft, studentName) ||
      submitLock.current
    )
      return
    submitLock.current = true
    setIsSubmitting(true)
    const score = scoreMission(bridges, selectedIds, reasons)
    const payload = {
      id: responseId(),
      student: studentName.trim(),
      missionId: MISSION_ID,
      // Existing instructor table keeps its numeric column; no new weekly UI.
      week: 1,
      submittedAt: new Date().toISOString(),
      baseline,
      missionScore: score.points,
      scoreLabel: `${score.label} · ${score.points}/100`,
      collapsesCaught: score.collapsesCaught.length,
      highFlagged: score.highSelected.length,
      reasoningHits: score.reasoningHits.length,
      missedCollapses: score.missedCollapses.length,
      storage: 'local',
      selections: score.selected.map((bridge, i) => ({
        id: bridge.id,
        name: bridge.name,
        reason: reasons[bridge.id],
        priority: i + 1,
        initialPriority:
          baseline.selectedIds.indexOf(bridge.id) >= 0
            ? baseline.selectedIds.indexOf(bridge.id) + 1
            : null,
        initialReason: baseline.reasons[bridge.id] || null,
        ...(i === 0
          ? {
              missionId: MISSION_ID,
              missionScore: score.points,
              initialPlan: baseline,
            }
          : {}),
      })),
    }
    const nextResponses = [...responses, payload]
    const localSaved = writeStored(RESPONSE_KEY, nextResponses)
    if (!localSaved) {
      payload.storage = 'memory'
      setHistoryStorageAvailable(false)
    }
    setResponses(nextResponses)
    setResult({ payload, saveStatus: 'saving' })
    setWorkspace((current) => ({
      ...current,
      phase: 'complete',
      lastResultId: payload.id,
    }))
    setShowConfetti(true)
    const controller = new AbortController(),
      timeout = setTimeout(() => controller.abort(), 10000)
    let saveStatus = localSaved ? 'local' : 'memory'
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      if (response.ok && (await response.json()).stored === true)
        saveStatus = 'cloud'
    } catch {
      /* The playable mission is also usable without a class database. */
    } finally {
      clearTimeout(timeout)
      setResponses((current) =>
        current.map((row) =>
          row.id === payload.id ? { ...row, storage: saveStatus } : row,
        ),
      )
      setResult((current) =>
        current?.payload.id === payload.id
          ? { ...current, saveStatus }
          : current,
      )
      setIsSubmitting(false)
      submitLock.current = false
    }
  }
  function startFresh() {
    if (isSubmitting) return
    setWorkspace(normalizeWorkspace({ studentName }))
    setResult(null)
    setShowConfetti(false)
    setShowShake(true)
    setValidationAttempted(false)
    navigate('mission')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function showChoices() {
    choicesRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    choicesRef.current?.focus({ preventScroll: true })
  }
  function showPlanner() {
    plannerRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    nameInput.current?.focus({ preventScroll: true })
  }
  function downloadCSV() {
    if (!responses.length) {
      setToast('Complete a mission to create an export.')
      return
    }
    const url = URL.createObjectURL(
      new Blob([csvForResponses(responses)], {
        type: 'text/csv;charset=utf-8;',
      }),
    )
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'quakequest-mission-log.csv'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="app lab-app single-mission">
      <a className="skip-link" href="#workspace-panel">
        Skip to mission workspace
      </a>
      <div className="lab-topline">
        <span>
          <i /> QUAKEQUEST / RESPONSE LAB
        </span>
        <a
          href="https://github.com/noyo12394/FYRE"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="github" /> View on GitHub
        </a>
      </div>
      <Header mission={MISSION} />
      <ActivityTabs activeTab={activeTab} onChange={navigate} />
      <main id="workspace-panel" className="app__main" tabIndex={-1}>
        <section
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'mission' && (
            <>
              <MissionBriefing
                phase={phase}
                baseline={baseline}
                selectedIds={selectedIds}
                reasons={reasons}
                headingRef={phaseHeading}
              />
              {phase === 'complete' ? (
                <div className="mission-complete lab-panel">
                  <span className="mission-complete__icon" aria-hidden="true">
                    🏁
                  </span>
                  <p className="lab-eyebrow">CREWS DISPATCHED</p>
                  <h2>One mission. A city of lessons.</h2>
                  <p>
                    Your original plan and final dispatch are saved in the
                    Mission log. Try a new strategy, or explore your debrief.
                  </p>
                  <div className="mission-actions">
                    {lastResult && (
                      <button
                        className="btn btn--primary"
                        onClick={() =>
                          setResult({
                            payload: lastResult,
                            saveStatus: lastResult.storage || 'local',
                          })
                        }
                      >
                        Open mission debrief
                      </button>
                    )}
                    <button
                      className="lab-action"
                      onClick={startFresh}
                      disabled={isSubmitting}
                    >
                      Start a new mission <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {phase === 'review' && (
                    <div className="dispatch-review lab-panel">
                      <h2>Final radio check</h2>
                      <p>
                        {studentName.trim()}, your five crews will be dispatched
                        in the order below. The hospital request is a trade-off,
                        not a mandatory answer. This is your call.
                      </p>
                      <button
                        className="lab-action"
                        onClick={() =>
                          setWorkspace((current) => ({
                            ...current,
                            phase: 'intel',
                          }))
                        }
                      >
                        Back to editing <Icon name="arrow" />
                      </button>
                    </div>
                  )}
                  <div className="app__play-area">
                    <div className="mission-map-wrap">
                      <CityMap
                        bridges={bridges}
                        selectedIds={selectedIds}
                        onToggle={toggleBridge}
                        showShake={revealsShaking && showShake}
                        revealsShaking={revealsShaking}
                        editable={editable}
                      />
                      <div className="mission-map-caption">
                        <span>
                          Select a numbered bridge, or use the crossing cards
                          below.
                        </span>
                        <button className="lab-action" onClick={showChoices}>
                          Choose crossings <Icon name="arrow" />
                        </button>
                      </div>
                      {revealsShaking && (
                        <label className="shake-toggle">
                          <input
                            type="checkbox"
                            checked={showShake}
                            onChange={(e) => setShowShake(e.target.checked)}
                          />{' '}
                          Show simulated shaking overlay
                        </label>
                      )}
                      <BridgeChoices
                        bridges={bridges}
                        selectedIds={selectedIds}
                        revealsShaking={revealsShaking}
                        editable={editable}
                        onToggle={toggleBridge}
                        sectionRef={choicesRef}
                        onReturn={showPlanner}
                      />
                    </div>
                    <MissionPanel
                      bridges={bridges}
                      draft={draft}
                      phase={phase}
                      studentName={studentName}
                      inputRef={nameInput}
                      isSubmitting={isSubmitting}
                      panelRef={plannerRef}
                      validationAttempted={validationAttempted}
                      onNameChange={setPlannerName}
                      draftStorageAvailable={draftStorageAvailable}
                      onToggle={toggleBridge}
                      onSetReason={setReason}
                      onMove={moveCrew}
                      onAdvance={advancePhase}
                      onSubmit={handleSubmit}
                    />
                  </div>
                </>
              )}
            </>
          )}
          {activeTab === 'inventory' && (
            <BridgeInventory
              bridges={bridges}
              revealsShaking={revealsShaking}
              editable={editable}
              selectedIds={selectedIds}
              onToggle={toggleBridge}
              onReturn={() => navigate('mission')}
            />
          )}
          {activeTab === 'progress' && (
            <ProgressPanel
              responses={responses}
              studentName={studentName}
              phase={phase}
              draft={draft}
              draftStorageAvailable={draftStorageAvailable}
              editable={editable}
              onNameChange={setPlannerName}
              onResume={() => navigate('mission')}
              onReplay={(payload) =>
                setResult({ payload, saveStatus: payload.storage || 'local' })
              }
              onExport={downloadCSV}
              onRestart={startFresh}
              isSubmitting={isSubmitting}
            />
          )}
          {activeTab === 'guide' && (
            <FieldGuide onStart={() => navigate('mission')} />
          )}
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
        <span>One continuous challenge · QuakeQuest v3.1</span>
        <span>Simulated outcomes. Not an engineering assessment.</span>
        <button className="lab-action" onClick={downloadCSV}>
          <Icon name="download" /> Export mission log
        </button>
      </footer>
      {!storageAvailable && (
        <p className="storage-warning" role="status">
          Device storage is unavailable. Keep this page open and export your
          mission log before leaving.
        </p>
      )}
      <Toast message={toast} />
      {showConfetti && <Confetti />}
      {result && (
        <ResultsModal
          bridges={bridges}
          payload={result.payload}
          saveStatus={result.saveStatus}
          onClose={() => setResult(null)}
          onPlayAgain={startFresh}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
