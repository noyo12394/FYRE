import React from 'react'
import Icon from './Icon.jsx'
import { PHASES } from '../data/mission.js'

export default function MissionSequence({ phase, activeTab, onReturn }) {
  const active = PHASES.findIndex((step) => step.id === phase)
  return (
    <section className="mission-sequence" aria-label="Mission sequence">
      <div className="mission-sequence__heading">
        <div>
          <p className="lab-eyebrow">
            MISSION SEQUENCE · STEP {active + 1} OF 4
          </p>
          <p id="mission-sequence-help">
            Follow these steps in order. The tabs above are tools, not steps.
            Complete the action in your crew planner to move forward.
          </p>
        </div>
        {activeTab !== 'mission' && (
          <button className="lab-action" onClick={onReturn}>
            Continue step {active + 1} <Icon name="arrow" />
          </button>
        )}
      </div>
      <ol
        className="mission-steps"
        aria-label="Mission stages"
        aria-describedby="mission-sequence-help"
      >
        {PHASES.map((step, index) => (
          <li
            key={step.id}
            className={
              index < active ? 'is-done' : index === active ? 'is-current' : ''
            }
            aria-current={index === active ? 'step' : undefined}
          >
            <span className="mission-step-icon" aria-hidden="true">
              {index < active ? <Icon name="check" /> : index + 1}
            </span>
            <span className="mission-step-copy">
              <span className="mission-step-status">
                {index < active
                  ? 'Completed'
                  : index === active
                    ? 'You are here'
                    : index === active + 1
                      ? 'Up next'
                      : 'Later'}
              </span>
              <strong>{step.name}</strong>
              <small>{step.detail}</small>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
