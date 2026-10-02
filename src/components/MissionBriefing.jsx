import React from 'react'
import Icon from './Icon.jsx'
import { PHASES } from '../data/mission.js'

export default function MissionBriefing({
  phase,
  selectedIds,
  reasons,
  headingRef,
}) {
  const active = PHASES.findIndex((step) => step.id === phase)
  const evidenceCount = selectedIds.filter(
    (id) => reasons[id] && reasons[id] !== 'hunch',
  ).length
  return (
    <div className="mission-briefing">
      <ol className="mission-steps" aria-label="Mission stages">
        {PHASES.map((step, index) => (
          <li
            key={step.id}
            className={
              index < active ? 'is-done' : index === active ? 'is-current' : ''
            }
            aria-current={index === active ? 'step' : undefined}
          >
            <span className="mission-step-icon">
              <Icon name={index < active ? 'check' : step.icon} />
            </span>
            <span>
              <strong>
                {index + 1}. {step.name}
              </strong>
              <small>{step.detail}</small>
            </span>
          </li>
        ))}
      </ol>
      <div className="mission-briefing__body">
        <div>
          <p className="lab-eyebrow">
            INTERACTIVE RESPONSE SIMULATION · 10–15 MIN
          </p>
          <h2 ref={headingRef} tabIndex={-1}>
            {phase === 'recon'
              ? 'The ground stopped. Your mission starts.'
              : phase === 'intel'
                ? 'New intel. Same five crews. Your next move?'
                : phase === 'review'
                  ? 'Five crews. Make the order count.'
                  : 'Mission accomplished. What changed?'}
          </h2>
          <p>
            {phase === 'recon'
              ? 'An M 5.4 quake has shaken the valley. Ten crossings need attention, but you have just five inspection crews. Scout the clues and commit to an initial plan. Then the evidence changes.'
              : phase === 'intel'
                ? 'Your first call is locked. Use the shaking map, structural clues, and the radio request to rethink your flags. Assign an evidence-based reason to each crossing and put your crews in dispatch order.'
                : phase === 'review'
                  ? 'Check the sequence before the final dispatch. No outcomes are revealed until you commit.'
                  : 'Compare your initial instincts with your evidence-led plan and uncover the modeled damage.'}
          </p>
        </div>
        <div className="mission-objective">
          <span className="lab-tag">YOUR OBJECTIVE</span>
          <strong>Inspect smarter. Keep a lifeline open.</strong>
          <p>
            {phase === 'recon'
              ? 'Choose exactly five crossings. Field notes only; shaking data arrives after you lock your plan.'
              : 'Catch the vulnerable crossings, explain your reasoning, and weigh the hospital route against damage risk.'}
          </p>
          <div>
            <span>{selectedIds.length}/5 crews</span>
            {phase !== 'recon' && <span>{evidenceCount}/5 reasons</span>}
            <span>100 points possible</span>
          </div>
        </div>
      </div>
      {phase !== 'recon' && phase !== 'complete' && (
        <aside className="radio-call" aria-label="Hospital radio update">
          <span className="radio-call__icon" aria-hidden="true">
            📻
          </span>
          <div>
            <p className="lab-eyebrow">NEW RADIO TRAFFIC / HOSPITAL DISPATCH</p>
            <strong>
              “Ambulance access is unconfirmed. Can you inspect the St. Luke’s
              link in your first three?”
            </strong>
            <p>
              The hospital connection has lighter shaking, but a critical role.
              Stronger shaking alone does not decide inspection priority.
            </p>
          </div>
          <span className="lab-tag">SIMULATED INJECT</span>
        </aside>
      )}
    </div>
  )
}
