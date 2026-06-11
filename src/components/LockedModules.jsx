import React from 'react'

// The course roadmap shown as cute-but-credible cards. Each future week maps to
// a real catastrophe-modeling layer. Weeks 1 and 2 are now playable — clicking
// an unlocked card jumps straight to that week's drill. The active week is
// highlighted so students always know where they are.
const MODULES = [
  { week: 1, title: 'Bridge Triage', sub: 'Decide with your eyes', emoji: '🌉', unlocked: true },
  { week: 2, title: 'Shaking Intensity Map', sub: 'How hard did it shake?', emoji: '📳', unlocked: true },
  { week: 3, title: 'Bridge Inventory & Age', sub: 'What is each bridge made of?', emoji: '📚', unlocked: false },
  { week: 4, title: 'Vulnerability Score', sub: 'Which are inherently weak?', emoji: '🛡️', unlocked: false },
  { week: 5, title: 'Damage Probability', sub: 'Turning clues into odds', emoji: '🎲', unlocked: false },
  { week: 6, title: 'Network Criticality', sub: 'Which failures matter most?', emoji: '🗺️', unlocked: false },
]

export default function LockedModules({ currentWeek, onGoToWeek }) {
  return (
    <section className="locked-modules" aria-label="Course roadmap">
      <h2 className="locked-modules__title">
        <span role="img" aria-label="map">🧭</span> Your Catastrophe-Modeling Journey
      </h2>
      <p className="locked-modules__sub">
        Each week swaps a hunch for evidence — building from a glance to a full,
        data-driven model of the event. Tap an unlocked week to play it.
      </p>
      <div className="locked-modules__grid">
        {MODULES.map((m) => {
          const isCurrent = m.week === currentWeek
          const clickable = m.unlocked && onGoToWeek
          return (
            <button
              key={m.week}
              type="button"
              disabled={!clickable}
              onClick={clickable ? () => onGoToWeek(m.week) : undefined}
              className={`module-card ${m.unlocked ? 'module-card--open' : 'module-card--locked'} ${isCurrent ? 'module-card--current' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="module-card__badge">Week {m.week}</div>
              <div className="module-card__emoji">{m.emoji}</div>
              <div className="module-card__name">{m.title}</div>
              <div className="module-card__desc">{m.sub}</div>
              <div className="module-card__status">
                {isCurrent ? '⭐ Playing now' : m.unlocked ? '▶️ Play' : '🔒 Locked'}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
