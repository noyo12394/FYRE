import React from 'react'

// Top title bar with the game name and our friendly mascot, PGA Pal.
// (We do NOT explain what "PGA" means yet — that's a later week!)
export default function Header() {
  return (
    <header className="header">
      <div className="header__mascot" title="Hi, I'm PGA Pal!">
        <span className="header__mascot-emoji" role="img" aria-label="hard-hat squirrel mascot">
          🐿️
        </span>
        <span className="header__hat" aria-hidden="true">⛑️</span>
      </div>
      <div className="header__titles">
        <h1 className="header__title">
          QuakeQuest <span className="header__sparkle">✨</span>
        </h1>
        <p className="header__subtitle">Bridge Rescue · Week 1</p>
      </div>
      <div className="header__badge">
        <span role="img" aria-label="city">🏙️</span> QuakeTown
      </div>
    </header>
  )
}
