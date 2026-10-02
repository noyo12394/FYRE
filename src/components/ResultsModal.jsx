import React, { useEffect, useRef } from 'react'
import { REASON_OPTIONS, SHAKE_META } from '../data/bridges.js'
import { MISSION_ID } from '../data/mission.js'
import { scoreMission } from '../utils/scoring.js'

const reasonLabel = (id) =>
  REASON_OPTIONS.find((reason) => reason.id === id)?.label ||
  'No reason recorded'
const SAVE_STATUS = {
  saving: 'Recording your response…',
  cloud: 'Response recorded for your instructor.',
  local: 'Saved on this device. The instructor database could not be reached.',
  memory:
    'Device storage is unavailable. Export your Mission log before leaving.',
}

export default function ResultsModal({
  bridges,
  payload,
  saveStatus,
  onClose,
  onPlayAgain,
  isSubmitting,
}) {
  const dialogRef = useRef(null),
    closeHandler = useRef(onClose)
  closeHandler.current = onClose
  useEffect(() => {
    const previousFocus = document.activeElement,
      previousOverflow = document.body.style.overflow
    const background = [
      ...document.querySelectorAll(
        '.lab-topline, .header, .activity-tabs, .app__main, .app__footer, .skip-link',
      ),
    ]
    const previousInert = background.map((element) => element.inert)
    background.forEach((element) => {
      element.inert = true
    })
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('button')?.focus()
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeHandler.current()
        return
      }
      if (event.key !== 'Tab') return
      const controls = [
        ...dialogRef.current.querySelectorAll(
          'button:not(:disabled), a[href], select, input, [tabindex="0"]',
        ),
      ]
      const first = controls[0],
        last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      background.forEach((element, index) => {
        element.inert = previousInert[index]
      })
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus()
      else document.getElementById('workspace-panel')?.focus()
    }
  }, [])
  const ids = payload.selections.map((s) => s.id)
  const reasons = Object.fromEntries(
    payload.selections.map((s) => [s.id, s.reason]),
  )
  const score = scoreMission(bridges, ids, reasons),
    mission = payload.missionId === MISSION_ID
  const baseline = payload.baseline
  const changeRows = baseline
    ? [...new Set([...baseline.selectedIds, ...ids])].map((id) =>
        bridges.find((b) => b.id === id),
      )
    : []
  const added = baseline
    ? ids.filter((id) => !baseline.selectedIds.includes(id)).length
    : 0
  const changes = baseline
    ? ids.filter(
        (id) =>
          baseline.selectedIds.indexOf(id) !== ids.indexOf(id) ||
          baseline.reasons[id] !== reasons[id],
      ).length
    : 0
  return (
    <div className="modal-backdrop">
      <section
        ref={dialogRef}
        className="results-modal mission-results"
        role="dialog"
        aria-modal="true"
        aria-labelledby="debrief-title"
        aria-describedby="debrief-notice"
      >
        <button
          type="button"
          className="results-modal__close"
          onClick={onClose}
          aria-label="Close mission debrief"
        >
          ✕
        </button>
        <header className="debrief-header">
          <p className="lab-eyebrow">
            {mission
              ? 'THE GOLDEN HOUR / MISSION DEBRIEF'
              : 'PREVIOUS DRILL / SAVED REPORT'}
          </p>
          <h2 id="debrief-title">
            {mission ? score.label : 'Your earlier response'}
          </h2>
          <p>
            {payload.student}, here’s what your crews found in this teaching
            scenario.
          </p>
          <p id="debrief-notice" className="lab-footnote">
            All damage and shaking are modeled. This is not a real inspection
            report.
          </p>
        </header>
        {mission && (
          <>
            <div className="debrief-score">
              <strong>
                {score.points}
                <small>/100</small>
              </strong>
              <div>
                <h3>
                  {score.collapsesCaught.length}/{score.totalCollapses}{' '}
                  collapses caught
                </h3>
                <p>
                  {score.highSelected.length}/{score.totalHigh} high-risk
                  crossings flagged · {score.reasoningHits.length}/
                  {score.totalHigh} primary vulnerabilities matched
                </p>
              </div>
            </div>
            <div className="earned-badges">
              {score.badges.length ? (
                score.badges.map((badge) => (
                  <div key={badge.name}>
                    <span aria-hidden="true">{badge.emoji}</span>
                    <strong>{badge.name}</strong>
                    <small>{badge.detail}</small>
                  </div>
                ))
              ) : (
                <p>
                  No badges yet. Use the feedback below to plan another
                  response.
                </p>
              )}
            </div>
            <details className="debrief-rubric">
              <summary>See your score breakdown</summary>
              <ul>
                {score.rubric.map((item) => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <strong>
                      {item.earned}/{item.max}
                    </strong>
                  </li>
                ))}
              </ul>
            </details>
            <section className="debrief-comparison">
              <h3>First instincts → final call</h3>
              <p>
                {added} new crossing{added === 1 ? '' : 's'} added · {changes}{' '}
                final assignment{changes === 1 ? '' : 's'} with a changed
                priority or reason.
              </p>
              <div className="comparison-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Crossing</th>
                      <th>Initial plan</th>
                      <th>Final dispatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changeRows.map((bridge) => (
                      <tr key={bridge.id}>
                        <th scope="row">{bridge.name}</th>
                        <td>
                          {baseline.selectedIds.includes(bridge.id) ? (
                            <>
                              <strong>
                                #{baseline.selectedIds.indexOf(bridge.id) + 1}
                              </strong>{' '}
                              · {reasonLabel(baseline.reasons[bridge.id])}
                            </>
                          ) : (
                            'Not flagged'
                          )}
                        </td>
                        <td>
                          {ids.includes(bridge.id) ? (
                            <>
                              <strong>#{ids.indexOf(bridge.id) + 1}</strong> ·{' '}
                              {reasonLabel(reasons[bridge.id])}
                            </>
                          ) : (
                            'Crew reassigned'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        <section className="debrief-outcomes">
          <h3>Modeled outcomes: every crossing</h3>
          <p className="lab-muted">
            Your dispatch number appears beside assigned crossings. Unflagged
            bridges are included so missed damage is visible.
          </p>
          <div className="outcome-grid">
            {bridges.map((bridge) => {
              const priority = ids.indexOf(bridge.id),
                flagged = priority >= 0
              return (
                <article
                  key={bridge.id}
                  className={`outcome-card ${bridge.outcome === 'Collapsed' ? 'outcome-card--critical' : ''}`}
                >
                  <div>
                    <span aria-hidden="true">{bridge.emoji}</span>
                    <span className="lab-tag">
                      {flagged ? `CREW #${priority + 1}` : 'NOT FLAGGED'}
                    </span>
                  </div>
                  <h4>{bridge.name}</h4>
                  <strong>{bridge.outcome}</strong>
                  <p className="outcome-card__shaking">
                    {SHAKE_META[bridge.shaking.zone].label} shaking ·{' '}
                    {bridge.shaking.pga}
                  </p>
                  <p>{bridge.reason}</p>
                  {flagged && (
                    <p className="outcome-card__reason">
                      Your reason: {reasonLabel(reasons[bridge.id])}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </section>
        <div className="debrief-takeaway">
          <h3>Take this back into the field</h3>
          <p>
            Shaking tells you the hazard. Structure and ground conditions shape
            vulnerability. A hospital route adds a consequence. A strong
            response weighs all three.
          </p>
          {mission && !score.lifelineProtected && (
            <p>
              Try moving the hospital link into your first three while still
              catching the most vulnerable crossings.
            </p>
          )}
        </div>
        <p className="debrief-save" role="status">
          {SAVE_STATUS[saveStatus] || SAVE_STATUS.local}
        </p>
        <div className="mission-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={onPlayAgain}
            disabled={isSubmitting}
          >
            Try a new strategy
          </button>
          <button type="button" className="lab-action" onClick={onClose}>
            Back to workspace
          </button>
        </div>
      </section>
    </div>
  )
}
