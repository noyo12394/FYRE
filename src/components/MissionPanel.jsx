import React from 'react'
import { MAX_SELECTIONS } from '../data/bridges.js'

// Side mission panel: shows the mission, how many inspection crews remain,
// the list of currently selected bridges, and the submit button.
export default function MissionPanel({
  bridges,
  selectedIds,
  onToggle,
  onSubmit,
}) {
  const selectedBridges = bridges.filter((b) => selectedIds.includes(b.id))
  const remaining = MAX_SELECTIONS - selectedIds.length

  return (
    <aside className="mission-panel" aria-label="Mission panel">
      <div className="mission-panel__card">
        <h2 className="mission-panel__title">
          <span role="img" aria-label="clipboard">📋</span> Your Mission
        </h2>
        <p className="mission-panel__text">
          Pick up to <strong>{MAX_SELECTIONS} bridges</strong> to inspect first.
          Trust your instincts! 🧠💡
        </p>

        {/* Crew tracker */}
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

      {/* Selected bridges list */}
      <div className="mission-panel__card">
        <h3 className="mission-panel__subtitle">
          <span role="img" aria-label="bridge">🌉</span> Selected Bridges
        </h3>
        {selectedBridges.length === 0 ? (
          <p className="mission-panel__empty">
            No bridges chosen yet. Tap a bridge on the map! 👆
          </p>
        ) : (
          <ul className="selected-list">
            {selectedBridges.map((b) => (
              <li key={b.id} className="selected-list__item">
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
        🚒 Send Inspection Crew
      </button>
    </aside>
  )
}
