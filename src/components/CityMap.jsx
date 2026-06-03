import React from 'react'
import Bridge from './Bridge.jsx'
import { EPICENTER } from '../data/bridges.js'

// Cartoon map of the San Fernando Valley after the 1994 Northridge quake.
// Built entirely with HTML/CSS/SVG (no GIS, no mapbox/leaflet). It shows a
// stylized freeway network, the LA River, hills, key buildings, earthquake
// cracks, a pulsing epicenter with a radial "shaking field", and the
// clickable bridges placed across the valley.
export default function CityMap({ bridges, selectedIds, onToggle, showShake }) {
  return (
    <div className={`city-map ${showShake ? 'city-map--shake' : ''}`} aria-label="Map of the San Fernando Valley">
      {/* ---- Scenery layer (SVG) ---- */}
      <svg
        className="city-map__scenery"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="shakeField" cx={`${EPICENTER.x}%`} cy={`${EPICENTER.y}%`} r="60%">
            <stop offset="0%" stopColor="rgba(255,99,99,0.42)" />
            <stop offset="35%" stopColor="rgba(255,168,99,0.22)" />
            <stop offset="70%" stopColor="rgba(255,214,99,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Shaking intensity field (a hint — no numbers yet) */}
        <rect x="0" y="0" width="100" height="100" fill="url(#shakeField)" />

        {/* Hills along the north / west rim */}
        <path className="map-hill" d="M-2 18 Q 15 4, 34 12 T 70 8 T 110 16 L 110 -5 L -2 -5 Z" />
        <path className="map-hill map-hill--back" d="M-2 12 Q 22 2, 48 8 T 110 6 L 110 -6 L -2 -6 Z" />

        {/* LA River / wash winding through the valley */}
        <path
          className="map-river"
          d="M-5 62 C 18 58, 30 74, 50 70 S 80 60, 90 46 S 102 36, 110 40"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          className="map-river-shine"
          d="M-5 62 C 18 58, 30 74, 50 70 S 80 60, 90 46 S 102 36, 110 40"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Freeway network (casing + lane line) */}
        {FREEWAYS.map((f) => (
          <g key={f.id}>
            <path className="map-fwy" d={f.d} fill="none" />
            <path className="map-fwy map-fwy--lane" d={f.d} fill="none" />
          </g>
        ))}

        {/* Earthquake cracks near the epicenter */}
        <path className="map-crack" d="M26 44 l3 4 l-2 3 l4 4" fill="none" />
        <path className="map-crack" d="M36 36 l2 5 l-3 3 l3 5" fill="none" />
        <path className="map-crack" d="M22 34 l3 3 l-2 4 l3 3" fill="none" />
      </svg>

      {/* Freeway shields */}
      <div className="city-map__shields" aria-hidden="true">
        {FREEWAYS.map((f) => (
          <span key={f.id} className="fwy-shield" style={{ left: `${f.label.x}%`, top: `${f.label.y}%` }}>
            {f.name}
          </span>
        ))}
      </div>

      {/* ---- Epicenter ---- */}
      <div
        className="epicenter"
        style={{ left: `${EPICENTER.x}%`, top: `${EPICENTER.y}%` }}
        title="Earthquake epicenter (strongest shaking)"
        aria-hidden="true"
      >
        <span className="epicenter__ring epicenter__ring--1" />
        <span className="epicenter__ring epicenter__ring--2" />
        <span className="epicenter__ring epicenter__ring--3" />
        <span className="epicenter__core">★</span>
        <span className="epicenter__label">Epicenter</span>
      </div>

      {/* ---- Buildings / decoration ---- */}
      <div className="city-map__props" aria-hidden="true">
        <Prop emoji="🏥" label="Hospital" x={61} y={45} className="prop--hospital" />
        <span className="prop-cross" style={{ left: '61%', top: '45%' }}>➕</span>
        <Prop emoji="🏫" label="School" x={45} y={54} />
        <Prop emoji="🏙️" label="Downtown" x={80} y={74} />
        <Prop emoji="🏬" label="Mall" x={52} y={40} />
        <Prop emoji="🏠" label="Homes" x={26} y={52} />
        <Prop emoji="🏘️" label="Suburb" x={78} y={20} />
        <Prop emoji="🌳" label="Park" x={43} y={64} small />
        <Prop emoji="🌲" label="Tree" x={16} y={40} small />
        <Prop emoji="🌳" label="Tree" x={88} y={54} small />
        <Prop emoji="🌴" label="Palm" x={55} y={78} small />
        <Prop emoji="🌲" label="Tree" x={20} y={22} small />
      </div>

      {/* ---- Interactive bridges ---- */}
      <div className="city-map__bridges">
        {bridges.map((bridge) => (
          <Bridge
            key={bridge.id}
            bridge={bridge}
            selected={selectedIds.includes(bridge.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="map-legend" aria-hidden="true">
        <span className="map-legend__item"><span className="dot dot--shake" /> Stronger shaking</span>
        <span className="map-legend__item">🌉 Bridge · tap to flag</span>
        <span className="map-legend__item">★ Epicenter</span>
      </div>
    </div>
  )
}

// Stylized freeway paths + label positions (not to scale).
const FREEWAYS = [
  { id: 'i5', name: 'I-5', d: 'M40 -4 C 38 18, 30 30, 26 55 S 30 90, 34 110', label: { x: 24, y: 60 } },
  { id: 'sr14', name: 'SR-14', d: 'M41 7 C 55 0, 70 4, 95 -2', label: { x: 66, y: 2 } },
  { id: 'us101', name: 'US-101', d: 'M-4 24 C 20 18, 30 14, 50 30 S 78 70, 105 78', label: { x: 70, y: 58 } },
  { id: 'sr118', name: 'SR-118', d: 'M-4 30 C 25 26, 45 22, 65 26 S 95 30, 108 28', label: { x: 86, y: 26 } },
  { id: 'i405', name: 'I-405', d: 'M70 -4 C 66 20, 64 38, 60 52 S 66 90, 70 110', label: { x: 70, y: 64 } },
  { id: 'i10', name: 'I-10', d: 'M-4 86 C 30 82, 55 84, 80 84 S 104 82, 110 84', label: { x: 86, y: 88 } },
]

function Prop({ emoji, label, x, y, small, className = '' }) {
  return (
    <span
      className={`map-prop ${small ? 'map-prop--small' : ''} ${className}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      title={label}
    >
      {emoji}
    </span>
  )
}
