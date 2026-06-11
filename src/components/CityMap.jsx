import React from 'react'
import Bridge from './Bridge.jsx'
import { EPICENTER } from '../data/bridges.js'

// A stylized-but-realistic street map of Bethlehem, PA, drawn entirely with
// HTML/CSS/SVG (no GIS, no mapbox/leaflet). The Lehigh River separates the
// historic North Side from the South Side (Lehigh University + SteelStacks).
// The whole map "draws itself in" on load, the river flows, and a seismic
// shockwave radiates from the drill epicenter.
export default function CityMap({ bridges, selectedIds, onToggle, showShake }) {
  return (
    <div className={`city-map ${showShake ? 'city-map--shake' : ''}`} aria-label="Map of Bethlehem, Pennsylvania">
      <svg
        className="city-map__scenery"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="shakeField" cx={`${EPICENTER.x}%`} cy={`${EPICENTER.y}%`} r="62%">
            <stop offset="0%" stopColor="rgba(255,86,86,0.40)" />
            <stop offset="32%" stopColor="rgba(255,150,86,0.20)" />
            <stop offset="66%" stopColor="rgba(255,205,86,0.07)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7fc4e8" />
            <stop offset="50%" stopColor="#5fb0dd" />
            <stop offset="100%" stopColor="#79bfe6" />
          </linearGradient>
        </defs>

        {/* Land base */}
        <rect x="0" y="0" width="100" height="100" fill="#eef0e6" />

        {/* Green spaces */}
        {PARKS.map((d, i) => (
          <path key={i} d={d} className="map-green" />
        ))}
        {/* South Mountain wooded ridge */}
        <path className="map-ridge" d="M38 100 L40 78 Q62 70 82 76 T112 74 L112 100 Z" />
        <path className="map-ridge map-ridge--far" d="M52 100 L56 82 Q78 76 100 80 T120 80 L120 100 Z" />

        {/* Building blocks (subtle texture) */}
        {BLOCKS.map((b, i) => (
          <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="0.6" className="map-block" />
        ))}

        {/* Minor streets */}
        {MINOR_STREETS.map((d, i) => (
          <path
            key={i}
            d={d}
            className="map-street map-street--minor draw-path"
            pathLength="1"
            style={{ animationDelay: `${0.3 + i * 0.04}s` }}
          />
        ))}

        {/* Major streets (casing + fill) */}
        {MAJOR_STREETS.map((s, i) => (
          <g key={i}>
            <path d={s.d} className="map-street map-street--major-casing" pathLength="1" />
            <path
              d={s.d}
              className="map-street map-street--major draw-path"
              pathLength="1"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            />
          </g>
        ))}

        {/* Railroad */}
        <path d={RAIL} className="map-rail-bed" pathLength="1" />
        <path d={RAIL} className="map-rail-ties draw-path" pathLength="1" style={{ animationDelay: '0.6s' }} />

        {/* Monocacy Creek */}
        <path d={MONOCACY} className="map-creek" pathLength="1" />

        {/* Lehigh River */}
        <path d={RIVER} className="map-river-base" />
        <path d={RIVER} className="map-river-flow" />
        {/* Sand Island */}
        <path d="M24 60.8 Q31 59.4 38 60.6 Q31 62.4 24 61.6 Z" className="map-island" />

        {/* Shaking intensity field */}
        <rect x="0" y="0" width="100" height="100" fill="url(#shakeField)" className="map-shakefield" />

        {/* Quake cracks near epicenter */}
        <path className="map-crack" d="M48 66 l2.4 3 l-1.6 2.4 l3 3" pathLength="1" />
        <path className="map-crack" d="M56 64 l1.6 3.6 l-2.4 2.2 l2.4 3.6" pathLength="1" />
      </svg>

      {/* Region tints + labels */}
      <div className="map-overlay" aria-hidden="true">
        {NEIGHBORHOODS.map((n) => (
          <span key={n.name} className={`map-label ${n.cls || ''}`} style={{ left: `${n.x}%`, top: `${n.y}%`, '--lrot': `${n.rot || 0}deg` }}>
            {n.name}
            {n.sub && <small>{n.sub}</small>}
          </span>
        ))}

        {/* Street name tags */}
        {MAJOR_STREETS.filter((s) => s.name).map((s) => (
          <span key={s.name} className="street-label" style={{ left: `${s.lx}%`, top: `${s.ly}%`, '--srot': `${s.rot || 0}deg` }}>
            {s.name}
          </span>
        ))}

        {/* Landmarks */}
        {LANDMARKS.map((l) => (
          <span key={l.label} className={`landmark ${l.cls || ''}`} style={{ left: `${l.x}%`, top: `${l.y}%` }} title={l.label}>
            <span className="landmark__icon">{l.emoji}</span>
            <span className="landmark__name">{l.label}</span>
          </span>
        ))}
      </div>

      {/* Epicenter + radiating seismic shockwave */}
      <div className="epicenter" style={{ left: `${EPICENTER.x}%`, top: `${EPICENTER.y}%` }} title="Drill epicenter" aria-hidden="true">
        <span className="shockwave" />
        <span className="epicenter__ring epicenter__ring--1" />
        <span className="epicenter__ring epicenter__ring--2" />
        <span className="epicenter__ring epicenter__ring--3" />
        <span className="epicenter__core">★</span>
        <span className="epicenter__label">Epicenter</span>
      </div>

      {/* Interactive bridges */}
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

      {/* Compass rose */}
      <svg className="map-compass" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="17" className="compass-ring" />
        <polygon points="20,4 24,20 20,16 16,20" className="compass-n" />
        <polygon points="20,36 16,20 20,24 24,20" className="compass-s" />
        <text x="20" y="11" className="compass-label">N</text>
      </svg>

      {/* Scale bar */}
      <div className="map-scale" aria-hidden="true">
        <div className="map-scale__bar"><span /><span /></div>
        <div className="map-scale__text">0 ¼ ½ mi</div>
      </div>

      {/* Legend */}
      <div className="map-legend" aria-hidden="true">
        <span className="map-legend__item"><span className="dot dot--shake" /> Stronger shaking</span>
        <span className="map-legend__item">🌉 Bridge · tap to flag</span>
        <span className="map-legend__item">★ Epicenter</span>
      </div>

      {/* Title cartouche */}
      <div className="map-cartouche" aria-hidden="true">
        <strong>BETHLEHEM, PA</strong>
        <span>Lehigh Valley Earthquake Drill</span>
      </div>
    </div>
  )
}

/* ----------------------------- Map geometry ----------------------------- */

const RIVER =
  'M-4 54 C 14 56, 24 61, 36 61 S 58 52, 72 49 S 92 44, 112 43'

const MONOCACY = 'M26 4 C 23 18, 29 30, 30 38 S 33 52, 34 60'

const RAIL = 'M-4 66 C 20 64, 40 58, 58 52 S 84 50, 112 52'

const PARKS = [
  // Monocacy park (north)
  'M22 40 Q26 34 33 40 Q36 48 30 52 Q24 52 22 46 Z',
  // riverside greenway west
  'M4 56 Q14 57 20 56 Q16 60 6 60 Z',
  // east riverfront park
  'M86 47 Q94 47 98 49 Q92 52 84 51 Z',
]

// Building-block texture [x, y, w, h]
const BLOCKS = [
  [26, 18, 4, 3], [31, 18, 5, 3], [37, 18, 4, 3], [26, 22, 4, 4], [31, 22, 5, 4],
  [37, 22, 4, 4], [42, 22, 5, 4], [48, 18, 4, 5], [26, 27, 5, 4], [32, 27, 4, 4],
  [37, 27, 5, 4], [43, 27, 4, 4], [48, 27, 5, 4], [55, 24, 4, 5], [60, 24, 5, 4],
  [26, 66, 5, 4], [32, 66, 4, 4], [37, 66, 5, 4], [43, 66, 4, 4], [48, 64, 5, 4],
  [54, 63, 4, 4], [60, 64, 5, 4], [66, 64, 4, 4], [32, 71, 4, 4], [38, 71, 5, 4],
  [44, 71, 4, 4],
]

const MAJOR_STREETS = [
  // North-south, North Side (end at the meandering river)
  { d: 'M30 6 L30 59.5', name: 'Main St', lx: 30, ly: 12, rot: -90 },
  { d: 'M40 6 L41 59', name: 'Center St', lx: 40, ly: 10, rot: -90 },
  { d: 'M44 6 L44.5 58', name: 'New St', lx: 47, ly: 9, rot: -90 },
  { d: 'M52 6 L52 54' },
  { d: 'M66 6 L66 50', name: 'Stefko Blvd', lx: 68, ly: 18, rot: -90 },
  // East-west, North Side
  { d: 'M6 16 L72 14', name: 'Elizabeth Ave', lx: 18, ly: 15.2 },
  { d: 'M6 26 L95 23', name: 'Broad St', lx: 76, ly: 24 },
  { d: 'M6 38 L95 34.5', name: 'Union Blvd', lx: 80, ly: 36 },
  // South Side grid (sits below the river's southern dip)
  { d: 'M10 65 L96 62', name: 'E 3rd St', lx: 16, ly: 65.6 },
  { d: 'M10 69 L96 66.5', name: 'E 4th St', lx: 16, ly: 69.6 },
  { d: 'M40 61.5 L41 92', name: 'Brodhead Ave', lx: 41.5, ly: 88, rot: -90 },
  { d: 'M30 62.5 L30 92', name: 'Wyandotte St', lx: 28, ly: 88, rot: -90 },
  { d: 'M46 73 L86 74.5', name: 'Packer Ave', lx: 74, ly: 73.6 },
  { d: 'M58 52.5 L60 92' },
]

const MINOR_STREETS = [
  'M34 6 L34 52', 'M37 6 L37 52', 'M47 6 L47.5 53', 'M56 6 L56 51', 'M60 7 L60 50',
  'M63 8 L63 49', 'M6 21 L70 19', 'M6 31 L92 28', 'M6 44 L60 41',
  'M14 64 L14 90', 'M20 63 L20 91', 'M24 63 L24 92', 'M36 63 L36 91', 'M46 61 L47 91',
  'M52 58 L53 90', 'M64 53 L66 90', 'M70 51 L72 88', 'M76 50 L78 86',
  'M10 73 L96 71', 'M14 77 L90 75', 'M30 81 L88 80',
]

const NEIGHBORHOODS = [
  { name: 'HISTORIC DOWNTOWN', sub: 'North Side', x: 38, y: 30, cls: 'map-label--district' },
  { name: 'WEST BETHLEHEM', x: 12, y: 30, cls: 'map-label--district' },
  { name: 'EAST SIDE', x: 78, y: 18, cls: 'map-label--district' },
  { name: 'SOUTH SIDE', x: 26, y: 74, cls: 'map-label--district' },
  { name: 'Lehigh River', x: 82, y: 45.2, rot: -6, cls: 'map-label--river' },
  { name: 'Monocacy Cr.', x: 24, y: 44, rot: -78, cls: 'map-label--creek' },
  { name: 'SOUTH MOUNTAIN', x: 74, y: 90, cls: 'map-label--ridge' },
]

const LANDMARKS = [
  { emoji: '⛪', label: 'Moravian Hist. District', x: 34, y: 22, cls: 'landmark--hist' },
  { emoji: '🏛️', label: 'City Hall', x: 50, y: 20 },
  { emoji: '🏭', label: 'SteelStacks', x: 54, y: 78, cls: 'landmark--steel' },
  { emoji: '🎰', label: 'Wind Creek', x: 64, y: 77 },
  { emoji: '🎓', label: 'Lehigh University', x: 70, y: 84, cls: 'landmark--lehigh' },
  { emoji: '🏥', label: "St. Luke's", x: 7, y: 70 },
  { emoji: '🌳', label: 'Sand Island', x: 31, y: 64.5, cls: 'landmark--small' },
]
