import React from 'react'

// Briefing-style title bar with a live animated seismograph trace. Friendly but
// professional. Our field-guide mascot, PGA Pal, stays — but we don't explain
// what "PGA" means yet (that's Week 2).
export default function Header() {
  return (
    <header className="header">
      <div className="header__mascot" title="Hi, I'm PGA Pal — your field guide!">
        <span className="header__mascot-emoji" role="img" aria-label="hard-hat squirrel field guide">
          🐿️
        </span>
        <span className="header__hat" aria-hidden="true">⛑️</span>
      </div>

      <div className="header__titles">
        <p className="header__eyebrow">Catastrophe Modeling · Week 1 Field Module</p>
        <h1 className="header__title">QuakeQuest: Bridge Triage</h1>
        <p className="header__subtitle">Lehigh Valley Earthquake Drill · Bethlehem, PA</p>
      </div>

      {/* Animated seismograph */}
      <div className="seismograph" aria-hidden="true">
        <svg viewBox="0 0 120 44" preserveAspectRatio="none">
          <line className="seismo-baseline" x1="0" y1="22" x2="120" y2="22" />
          <path
            className="seismo-trace"
            d="M0 22 L10 22 L14 22 L18 22 L22 12 L26 33 L30 8 L34 36 L38 14 L42 22 L52 22 L58 22 L62 18 L66 27 L70 22 L82 22 L88 22 L92 16 L96 28 L100 22 L120 22"
          />
        </svg>
        <span className="seismograph__mag">M 5.4 · drill</span>
      </div>
    </header>
  )
}
