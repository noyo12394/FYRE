import React, { useEffect, useState } from 'react'
import { REASON_OPTIONS } from '../data/bridges.js'
import { scoreSelection } from '../utils/scoring.js'

// Small animated number that counts up from 0 to `value` for a bit of flair.
function CountUp({ value, duration = 900 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(eased * value))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <>{n}</>
}

const reasonLabel = (id) => {
  const r = REASON_OPTIONS.find((o) => o.id === id)
  return r ? `${r.emoji} ${r.label}` : '🤔 Just a hunch'
}

const outcomeMeta = {
  Collapsed: { cls: 'collapsed', emoji: '💥' },
  'Major damage': { cls: 'major', emoji: '🟠' },
  'Moderate damage': { cls: 'moderate', emoji: '🟡' },
  'Minor damage': { cls: 'minor', emoji: '🟢' },
  Undamaged: { cls: 'safe', emoji: '✅' },
}

function usefulness(b) {
  if (b.outcome === 'Collapsed') return { text: 'Critical catch — this one collapsed.', cls: 'good' }
  if (b.trueRisk === 'high') return { text: 'Great call — it took major damage.', cls: 'good' }
  if (b.trueRisk === 'medium') return { text: 'Reasonable — worth a look.', cls: 'okay' }
  return { text: 'Lower priority this time.', cls: 'meh' }
}

const SAVE_STATUS_TEXT = {
  saving: '⏳ Recording your response…',
  cloud: '✓ Response recorded for your instructor.',
  local: '✓ Saved on this device (class database not connected).',
}

export default function ResultsModal({ bridges, selectedIds, reasons, saveStatus, onPlayAgain, onClose }) {
  const r = scoreSelection(bridges, selectedIds, reasons)

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Inspection results">
      <div className="modal">
        <button className="modal__close" onClick={onClose} aria-label="Close results">
          ✕
        </button>

        <div className="modal__header">
          <div className="modal__mascot" aria-hidden="true">🐿️⛑️</div>
          <h2 className="modal__title">Inspection Debrief</h2>
          <p className="modal__label">{r.label}</p>
        </div>

        {/* Quick stats */}
        <div className="results-stats">
          <div className="results-stat results-stat--high">
            <span className="results-stat__num"><CountUp value={r.collapsesCaught.length} /><span className="results-stat__den">/{r.totalCollapses}</span></span>
            <span className="results-stat__cap">Collapses caught</span>
          </div>
          <div className="results-stat results-stat--medium">
            <span className="results-stat__num"><CountUp value={r.highSelected.length} /><span className="results-stat__den">/{r.totalHigh}</span></span>
            <span className="results-stat__cap">High-risk flagged</span>
          </div>
          <div className="results-stat results-stat--reason">
            <span className="results-stat__num"><CountUp value={r.reasoningHits.length} /></span>
            <span className="results-stat__cap">Reasons that matched</span>
          </div>
          <div className="results-stat results-stat--missed">
            <span className="results-stat__num"><CountUp value={r.missedCollapses.length} /></span>
            <span className="results-stat__cap">Collapses missed</span>
          </div>
        </div>

        {/* Per-bridge feedback */}
        <h3 className="results-section-title">Your Flagged Bridges 🌉</h3>
        <div className="feedback-cards">
          {r.selected.map((b) => {
            const use = usefulness(b)
            const om = outcomeMeta[b.outcome] || outcomeMeta.Undamaged
            const picked = reasons[b.id] || 'hunch'
            const matched = b.trueRisk === 'high' && picked === b.primaryFactor
            return (
              <div key={b.id} className={`feedback-card feedback-card--${om.cls}`}>
                <div className="feedback-card__top">
                  <span className="feedback-card__emoji">{b.emoji}</span>
                  <span className="feedback-card__name">
                    {b.name}
                    <span className="feedback-card__route">{b.route}</span>
                  </span>
                  <span className={`outcome-pill outcome-pill--${om.cls}`}>
                    {om.emoji} {b.outcome}
                  </span>
                </div>
                <p className="feedback-card__reason">{b.reason}</p>
                {b.trueRisk === 'high' && (
                  <p className={`feedback-card__match ${matched ? 'is-hit' : 'is-miss'}`}>
                    Your hunch: {reasonLabel(picked)} —{' '}
                    {matched
                      ? 'spot on, that was the real driver! ✓'
                      : `the real driver was “${b.factors[0]}”.`}
                  </p>
                )}
                <p className={`feedback-card__use feedback-card__use--${use.cls}`}>{use.text}</p>
              </div>
            )
          })}
        </div>

        {/* Missed high-risk bridges */}
        {r.missedHigh.length > 0 && (
          <>
            <h3 className="results-section-title">Missed Clues 🔍</h3>
            <div className="feedback-cards">
              {r.missedHigh.map((b) => (
                <div key={b.id} className="feedback-card feedback-card--missed">
                  <div className="feedback-card__top">
                    <span className="feedback-card__emoji">{b.emoji}</span>
                    <span className="feedback-card__name">
                      {b.name}
                      <span className="feedback-card__route">{b.route}</span>
                    </span>
                    <span className="outcome-pill outcome-pill--collapsed">
                      {(outcomeMeta[b.outcome] || {}).emoji} {b.outcome}
                    </span>
                  </div>
                  <p className="feedback-card__reason">
                    <strong>Missed:</strong> {b.reason}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Real-event insights */}
        <h3 className="results-section-title">What Real Earthquakes Teach Us 🎓</h3>
        <div className="insight-cards">
          <div className="insight-card">
            <span className="insight-card__icon">🎭</span>
            <p>
              <strong>Looks can deceive.</strong> The La Cienega–Venice bridge collapsed
              under only <em>moderate</em> shaking — its 1960s design and sharp angle, not
              strong ground motion, brought it down. A shaking map alone would have
              under-rated it.
            </p>
          </div>
          <div className="insight-card">
            <span className="insight-card__icon">💸</span>
            <p>
              <strong>A few failures dominate.</strong> Just 6 bridges collapsed out of
              3,500+ (~0.17%) — yet they caused about <strong>69%</strong> of all bridge
              repair costs. Predicting <em>which</em> failures matter most is its own skill.
            </p>
          </div>
          <div className="insight-card">
            <span className="insight-card__icon">🚑</span>
            <p>
              <strong>Importance is invisible.</strong> The hospital link wasn't the weakest
              bridge — but it was the only route for ambulances. Consequence is not the same
              as fragility.
            </p>
          </div>
        </div>

        {/* Week 1 lesson */}
        <div className="lesson-box">
          <h3 className="lesson-box__title">📘 Week 1 Lesson</h3>
          <p>
            Early disaster decisions are made with incomplete information. Visual clues help,
            but they can mislead — and the bridges that matter most aren't always the ones
            that look worst. <strong>Catastrophe modeling</strong> lets us add better layers
            of evidence, one week at a time.
          </p>
        </div>

        {/* Teaser */}
        <div className="week2-teaser">
          <span className="week2-teaser__emoji">🔓</span>
          <p>
            <strong>Next week,</strong> you'll unlock the real <strong>shaking-intensity
            map</strong> — and start replacing hunches with data: bridge age, ground type,
            and vulnerability.
          </p>
        </div>

        {saveStatus && (
          <p className={`save-status save-status--${saveStatus}`}>
            {SAVE_STATUS_TEXT[saveStatus] || ''}
          </p>
        )}

        {/* Actions */}
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={onPlayAgain}>
            🔁 Run the drill again
          </button>
          <button className="btn btn--locked" disabled>
            🔒 Continue to Week 2 — Coming soon
          </button>
        </div>
      </div>
    </div>
  )
}
