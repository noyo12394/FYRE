import React from 'react'
import Bridge from './Bridge.jsx'

// The main cartoon city map. Built entirely with HTML/CSS/SVG — no GIS,
// no mapbox/leaflet. It draws a river, curvy roads, cute buildings (incl. a
// hospital, a school and a market), trees, earthquake cracks, and places all
// the clickable bridges on top.
export default function CityMap({ bridges, selectedIds, onToggle }) {
  return (
    <div className="city-map" aria-label="Cartoon map of QuakeTown">
      {/* ---- Scenery layer (SVG) ---- */}
      <svg
        className="city-map__scenery"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* River winding through the city */}
        <path
          className="map-river"
          d="M-5 70 C 20 60, 25 85, 45 82 S 75 70, 80 55 S 95 35, 110 40"
          fill="none"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          className="map-river-shine"
          d="M-5 70 C 20 60, 25 85, 45 82 S 75 70, 80 55 S 95 35, 110 40"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Curvy roads */}
        <path className="map-road" d="M0 20 C 25 25, 35 45, 60 45 S 95 50, 105 48" fill="none" strokeWidth="6" />
        <path className="map-road map-road--dash" d="M0 20 C 25 25, 35 45, 60 45 S 95 50, 105 48" fill="none" strokeWidth="0.8" />
        <path className="map-road" d="M15 -5 C 18 30, 40 55, 38 105" fill="none" strokeWidth="6" />
        <path className="map-road map-road--dash" d="M15 -5 C 18 30, 40 55, 38 105" fill="none" strokeWidth="0.8" />
        <path className="map-road" d="M80 -5 C 78 25, 88 60, 86 105" fill="none" strokeWidth="6" />
        <path className="map-road map-road--dash" d="M80 -5 C 78 25, 88 60, 86 105" fill="none" strokeWidth="0.8" />

        {/* Earthquake cracks ⚡ */}
        <path className="map-crack" d="M20 40 l3 4 l-2 3 l4 4" fill="none" strokeWidth="0.9" />
        <path className="map-crack" d="M52 36 l2 5 l-3 3 l3 5" fill="none" strokeWidth="0.9" />
        <path className="map-crack" d="M40 88 l3 3 l-2 4 l3 3" fill="none" strokeWidth="0.9" />
      </svg>

      {/* ---- Building / decoration layer (emoji + CSS) ---- */}
      <div className="city-map__props" aria-hidden="true">
        <Prop emoji="🏥" label="Hospital" x={78} y={16} className="prop--hospital" />
        <span className="prop-cross" style={{ left: '78%', top: '16%' }}>➕</span>
        <Prop emoji="🏫" label="School" x={62} y={48} />
        <Prop emoji="🏬" label="Market" x={48} y={30} />
        <Prop emoji="🏠" label="House" x={30} y={12} />
        <Prop emoji="🏠" label="House" x={9} y={48} />
        <Prop emoji="🏢" label="Office" x={66} y={72} />
        <Prop emoji="🏘️" label="Suburb" x={26} y={86} />
        <Prop emoji="🌳" label="Tree" x={40} y={58} small />
        <Prop emoji="🌲" label="Tree" x={56} y={84} small />
        <Prop emoji="🌳" label="Tree" x={92} y={48} small />
        <Prop emoji="🌲" label="Tree" x={20} y={28} small />
        <Prop emoji="🌳" label="Tree" x={70} y={40} small />
        <Prop emoji="🚗" label="Car" x={50} y={42} small />
        <Prop emoji="🚙" label="Car" x={36} y={20} small />
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
    </div>
  )
}

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
