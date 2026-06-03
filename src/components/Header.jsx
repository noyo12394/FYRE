import React from 'react'

// Briefing-style title bar. Friendly but a notch more professional: it frames
// the session as a real post-event triage exercise. Our field-guide mascot,
// PGA Pal, stays — but we don't explain what "PGA" means yet (that's Week 2).
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
        <p className="header__subtitle">
          1994 Northridge Earthquake · San Fernando Valley
        </p>
      </div>

      <div className="header__facts" aria-label="Event facts">
        <span className="header__fact"><strong>Mw 6.7</strong> magnitude</span>
        <span className="header__fact"><strong>4:31 a.m.</strong> · Jan 17, 1994</span>
        <span className="header__fact"><strong>~$40B</strong> in damage</span>
      </div>
    </header>
  )
}
