import React from 'react'

// The upcoming weeks, shown as cute locked cards. Week 1 is unlocked (current),
// the rest are teased but locked.
const MODULES = [
  { week: 1, title: 'Bridge Rescue', emoji: '🌉', unlocked: true },
  { week: 2, title: 'Shaking intensity map', emoji: '📳', unlocked: false },
  { week: 3, title: 'Bridge inventory data', emoji: '📚', unlocked: false },
  { week: 4, title: 'Vulnerability score', emoji: '🛡️', unlocked: false },
  { week: 5, title: 'Damage probability', emoji: '🎲', unlocked: false },
  { week: 6, title: 'Policy & recovery planning', emoji: '🏗️', unlocked: false },
]

export default function LockedModules() {
  return (
    <section className="locked-modules" aria-label="Upcoming modules">
      <h2 className="locked-modules__title">
        <span role="img" aria-label="map">🗺️</span> Your QuakeQuest Journey
      </h2>
      <p className="locked-modules__sub">
        Finish each week to unlock new data layers and superpowers!
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
            <div className="module-card__status">
              {m.unlocked ? '⭐ Playing now' : '🔒 Locked'}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
