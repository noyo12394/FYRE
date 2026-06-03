import React from 'react'

// The course roadmap shown as cute-but-credible cards. Each future week maps to
// a real catastrophe-modeling layer from the Northridge capstone — students see
// where the intuition of Week 1 is headed. Method names appear only here, as
// teasers for locked content (not in Week 1 gameplay).
const MODULES = [
  { week: 1, title: 'Bridge Triage', sub: 'Decide with your eyes', emoji: '🌉', unlocked: true },
  { week: 2, title: 'Shaking Intensity Map', sub: 'How hard did it shake?', emoji: '📳', unlocked: false },
  { week: 3, title: 'Bridge Inventory & Age', sub: 'What is each bridge made of?', emoji: '📚', unlocked: false },
  { week: 4, title: 'Vulnerability Score', sub: 'Which are inherently weak?', emoji: '🛡️', unlocked: false },
  { week: 5, title: 'Damage Probability', sub: 'Turning clues into odds', emoji: '🎲', unlocked: false },
  { week: 6, title: 'Network Criticality', sub: 'Which failures matter most?', emoji: '🗺️', unlocked: false },
]

export default function LockedModules() {
  return (
    <section className="locked-modules" aria-label="Course roadmap">
      <h2 className="locked-modules__title">
        <span role="img" aria-label="map">🧭</span> Your Catastrophe-Modeling Journey
      </h2>
      <p className="locked-modules__sub">
        Each week swaps a hunch for evidence — building from a glance to a full,
        data-driven model of the Northridge event.
      </p>
      <div className="locked-modules__grid">
        {MODULES.map((m) => (
          <div
            key={m.week}
            className={`module-card ${m.unlocked ? 'module-card--open' : 'module-card--locked'}`}
          >
            <div className="module-card__badge">Week {m.week}</div>
            <div className="module-card__emoji">{m.emoji}</div>
            <div className="module-card__name">{m.title}</div>
            <div className="module-card__desc">{m.sub}</div>
            <div className="module-card__status">
              {m.unlocked ? '⭐ Playing now' : '🔒 Locked'}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
