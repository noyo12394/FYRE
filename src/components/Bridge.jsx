import React from 'react'
import { SHAKE_META } from '../data/bridges.js'

// A single clickable bridge on the valley map. It's a little cartoon bridge
// (SVG) — not just a button — with a hover tooltip showing the bridge name,
// its route, and a vague field observation (the "clue"). In Week 1 no risk
// numbers show; in Week 2 (`showShaking`) each bridge wears a shaking-intensity
// chip and its measured ground motion appears in the tooltip.
export default function Bridge({ bridge, selected, showShaking, onToggle }) {
  const { name, route, x, y, rotation, clue, emoji, trueRisk, shaking } = bridge
  const zone = shaking ? SHAKE_META[shaking.zone] : null

  return (
    <button
      type="button"
      className={`bridge bridge--risk-${trueRisk} ${selected ? 'bridge--selected' : ''} ${showShaking ? 'bridge--shaking' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, '--rot': `${rotation}deg` }}
      onClick={() => onToggle(bridge.id)}
      aria-pressed={selected}
      aria-label={`${name} on ${route}. Field note: ${clue}.${showShaking && shaking ? ` Shaking: ${zone.label}, ${shaking.pga}.` : ''} ${selected ? 'Flagged' : 'Not flagged'}`}
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
          {/* supports */}
          <line x1="22" y1="34" x2="22" y2="20" className="bridge__cable" />
          <line x1="40" y1="34" x2="40" y2="10" className="bridge__cable" />
          <line x1="58" y1="34" x2="58" y2="20" className="bridge__cable" />
        </svg>
        <span className="bridge__emoji">{emoji}</span>
        {selected && <span className="bridge__check" aria-hidden="true">✅</span>}
      </span>

      {showShaking && zone && (
        <span
          className="bridge__shake"
          style={{ '--zone': zone.color }}
          aria-hidden="true"
          title={`Shaking: ${zone.label} (${shaking.pga})`}
        >
          {shaking.pga}
        </span>
      )}

      <span className="bridge__tooltip" role="tooltip">
        <strong>{name}</strong>
        <span className="bridge__route">{route}</span>
        <em>“{clue}”</em>
        {showShaking && zone && (
          <span className="bridge__shake-line" style={{ '--zone': zone.color }}>
            📳 {zone.label} shaking · {shaking.pga}
          </span>
        )}
      </span>
    </button>
  )
}
