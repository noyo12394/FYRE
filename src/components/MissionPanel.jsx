import React from 'react'
import { MAX_SELECTIONS, REASON_OPTIONS } from '../data/bridges.js'

// Side mission panel: the triage brief, a crew tracker, the flagged-bridge
// list (each with a "why did you flag it?" reason selector), and the submit
// button. The reasoning step is the extra Week-1 depth — we later compare each
// student's hunch to the real cause of failure.
export default function MissionPanel({
  bridges,
  selectedIds,
  reasons,
  onToggle,
  onSetReason,
  onSubmit,
}) {
  const selectedBridges = bridges.filter((b) => selectedIds.includes(b.id))
  const remaining = MAX_SELECTIONS - selectedIds.length

  return (
    <aside className="mission-panel" aria-label="Triage panel">
      <div className="mission-panel__card">
        <h2 className="mission-panel__title">
          <span role="img" aria-label="clipboard">📋</span> Triage Brief
        </h2>
        <p className="mission-panel__text">
          Flag up to <strong>{MAX_SELECTIONS} bridges</strong> for the first
          inspection wave. For each, tell us <em>why</em> — your reasoning gets
          scored too. 🧠
        </p>

        <div className="crew-tracker" aria-label="Inspection crews remaining">
          {Array.from({ length: MAX_SELECTIONS }).map((_, i) => (
            <span
              key={i}
              className={`crew-tracker__dot ${i < selectedIds.length ? 'crew-tracker__dot--used' : ''}`}
              aria-hidden="true"
            >
              {i < selectedIds.length ? '🚧' : '⚪'}
            </span>
          ))}
        </div>
        <p className="mission-panel__remaining">
          {remaining > 0
            ? `${remaining} crew${remaining === 1 ? '' : 's'} left to assign`
            : 'All crews assigned! 🎉'}
        </p>
      </div>

      <div className="mission-panel__card">
        <h3 className="mission-panel__subtitle">
          <span role="img" aria-label="bridge">🌉</span> Flagged Bridges
        </h3>
        {selectedBridges.length === 0 ? (
          <p className="mission-panel__empty">
            Nothing flagged yet. Tap a bridge on the map! 👆
          </p>
        ) : (
          <ul className="selected-list">
            {selectedBridges.map((b) => (
              <li key={b.id} className="selected-list__item">
                <div className="selected-list__head">
                  <span className="selected-list__emoji">{b.emoji}</span>
                  <span className="selected-list__name">{b.name}</span>
                  <button
                    type="button"
                    className="selected-list__remove"
                    onClick={() => onToggle(b.id)}
                    aria-label={`Remove ${b.name}`}
                  >
                    ✕
                  </button>
                </div>
                <label className="reason-picker">
                  <span className="reason-picker__label">Why flag it?</span>
                  <select
                    className="reason-picker__select"
                    value={reasons[b.id] || 'hunch'}
                    onChange={(e) => onSetReason(b.id, e.target.value)}
                  >
                    {REASON_OPTIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.emoji} {r.label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="btn btn--primary mission-panel__submit"
        disabled={selectedIds.length === 0}
        onClick={onSubmit}
      >
        🚒 Dispatch Inspection Crews
      </button>
    </aside>
  )
}
