import React from 'react'
import Icon from './Icon.jsx'
import { MAX_SELECTIONS, SHAKE_META } from '../data/bridges.js'

export default function BridgeChoices({
  bridges,
  selectedIds,
  revealsShaking,
  editable,
  onToggle,
  sectionRef,
  onReturn,
}) {
  return (
    <section
      className="bridge-choices"
      ref={sectionRef}
      tabIndex={-1}
      aria-labelledby="bridge-choices-title"
    >
      <div className="bridge-choices__heading">
        <div>
          <p className="lab-eyebrow">SELECT HERE OR ON THE MAP</p>
          <h3 id="bridge-choices-title">Choose your five crossings</h3>
        </div>
        <span className="lab-tag">
          {selectedIds.length}/{MAX_SELECTIONS} assigned
        </span>
      </div>
      <p>
        Numbers match the map. Tap a card to assign a crew; tap it again to
        remove that assignment.
      </p>
      <div className="bridge-choices__grid">
        {bridges.map((bridge, index) => {
          const priority = selectedIds.indexOf(bridge.id),
            selected = priority >= 0
          return (
            <button
              key={bridge.id}
              type="button"
              className={`bridge-choice ${selected ? 'is-selected' : ''}`}
              aria-pressed={selected}
              aria-label={`${selected ? 'Unassign crew from' : 'Assign crew to'} ${bridge.name}`}
              disabled={!editable}
              onClick={() => onToggle(bridge.id)}
            >
              <span className="bridge-choice__number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="bridge-choice__details">
                <strong>{bridge.name}</strong>
                <small>{bridge.route}</small>
                <span>{bridge.clue}</span>
                {revealsShaking && (
                  <small className="bridge-choice__shaking">
                    {SHAKE_META[bridge.shaking.zone].label} shaking ·{' '}
                    {bridge.shaking.pga}
                  </small>
                )}
              </span>
              <span className="bridge-choice__status">
                {selected ? (
                  <>
                    <Icon name="check" /> Crew {priority + 1}
                  </>
                ) : (
                  <>
                    <Icon name="flag" /> Assign
                  </>
                )}
              </span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        className="lab-action bridge-choices__return"
        onClick={onReturn}
      >
        Return to crew planner <Icon name="arrow" />
      </button>
    </section>
  )
}
