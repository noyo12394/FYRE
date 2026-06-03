import React from 'react'

// A single clickable bridge object placed on the cartoon map.
// It is a little cartoon bridge (SVG) — not just a button — with a hover
// tooltip showing the bridge name and a vague observation (the "clue").
export default function Bridge({ bridge, selected, onToggle }) {
  const { name, x, y, rotation, clue, emoji, trueRisk } = bridge

  return (
    <button
      type="button"
      className={`bridge bridge--risk-${trueRisk} ${selected ? 'bridge--selected' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, '--rot': `${rotation}deg` }}
      onClick={() => onToggle(bridge.id)}
      aria-pressed={selected}
      aria-label={`${name}. Clue: ${clue}. ${selected ? 'Selected' : 'Not selected'}`}
    >
      <span className="bridge__art" aria-hidden="true">
        <svg viewBox="0 0 80 46" width="80" height="46">
          {/* arch */}
          <path
            d="M6 38 Q40 2 74 38"
            fill="none"
            className="bridge__arch"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* deck */}
          <rect x="4" y="34" width="72" height="8" rx="4" className="bridge__deck" />
          {/* cables / supports */}
          <line x1="22" y1="34" x2="22" y2="20" className="bridge__cable" />
          <line x1="40" y1="34" x2="40" y2="10" className="bridge__cable" />
          <line x1="58" y1="34" x2="58" y2="20" className="bridge__cable" />
        </svg>
        <span className="bridge__emoji">{emoji}</span>
        {selected && <span className="bridge__check" aria-hidden="true">✅</span>}
      </span>

      <span className="bridge__tooltip" role="tooltip">
        <strong>{name}</strong>
        <em>“{clue}”</em>
      </span>
    </button>
  )
}
