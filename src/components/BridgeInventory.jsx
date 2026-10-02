import React, { useMemo, useState } from 'react'
import Icon from './Icon.jsx'
import { MAX_SELECTIONS, SHAKE_META, SHAKE_ZONES } from '../data/bridges.js'

export default function BridgeInventory({
  bridges,
  revealsShaking,
  editable,
  selectedIds,
  onToggle,
  onReturn,
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('name')
  const visible = useMemo(
    () =>
      bridges
        .filter((bridge) => {
          const matchesText = `${bridge.name} ${bridge.route} ${bridge.clue}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
          const matchesFilter =
            filter === 'all' ||
            (filter === 'flagged' && selectedIds.includes(bridge.id)) ||
            (revealsShaking && bridge.shaking.zone === filter)
          return matchesText && matchesFilter
        })
        .sort((a, b) =>
          sort === 'shaking' && revealsShaking
            ? b.shaking.level - a.shaking.level || a.name.localeCompare(b.name)
            : a.name.localeCompare(b.name),
        ),
    [bridges, search, filter, sort, selectedIds, revealsShaking],
  )

  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="lab-eyebrow">TEN CROSSINGS. DIFFERENT CLUES.</p>
          <h2>Bridge intel</h2>
          <p className="lab-muted">
            Explore the field notes and add crossings to your current inspection
            plan.
          </p>
        </div>
        <button className="lab-action" onClick={onReturn}>
          Return to mission <Icon name="arrow" />
        </button>
      </div>
      <div className="inventory-context">
        <span>
          <Icon name="flag" />
          <strong>Your mission plan</strong> · {selectedIds.length}/
          {MAX_SELECTIONS} crews assigned
        </span>
        <span>
          {revealsShaking
            ? 'Evidence: field notes + simulated shaking'
            : 'Field notes only · lock your first plan to unlock shaking'}
        </span>
      </div>
      <div className="inventory-tools">
        <label className="lab-search">
          <Icon name="search" />
          <input
            aria-label="Search bridges"
            type="search"
            placeholder="Search a bridge, route, or field note…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className="lab-select">
          Show
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All bridges</option>
            <option value="flagged">Flagged bridges</option>
            {revealsShaking &&
              SHAKE_ZONES.map((zone) => (
                <option key={zone.key} value={zone.key}>
                  {zone.label} shaking
                </option>
              ))}
          </select>
        </label>
        <label className="lab-select">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="name">Name A–Z</option>
            {revealsShaking && (
              <option value="shaking">Strongest shaking</option>
            )}
          </select>
        </label>
      </div>
      <p className="inventory-count" role="status">
        {visible.length} of {bridges.length} bridges
        {search.trim() ? ` matching “${search.trim()}”` : ''}
      </p>
      {visible.length ? (
        <div className="inventory-grid">
          {visible.map((bridge) => {
            const selected = selectedIds.includes(bridge.id)
            return (
              <article
                key={bridge.id}
                className={`inventory-card ${selected ? 'is-flagged' : ''}`}
              >
                <div className="inventory-card__top">
                  <span className="inventory-card__emoji" aria-hidden="true">
                    {bridge.emoji}
                  </span>
                  <span className="lab-tag">{bridge.route}</span>
                </div>
                <h3>{bridge.name}</h3>
                <p className="inventory-card__clue">“{bridge.clue}”</p>
                {revealsShaking && (
                  <span
                    className="inventory-shaking"
                    style={{ '--zone': SHAKE_META[bridge.shaking.zone].color }}
                  >
                    <i />
                    {SHAKE_META[bridge.shaking.zone].label} shaking ·{' '}
                    {bridge.shaking.pga}
                    <small>Simulated PGA</small>
                  </span>
                )}
                <button
                  className="inventory-card__flag"
                  disabled={!editable}
                  aria-pressed={selected}
                  aria-label={`${selected ? 'Unflag' : 'Flag'} ${bridge.name}`}
                  onClick={() => onToggle(bridge.id)}
                >
                  <Icon name={selected ? 'check' : 'flag'} />
                  {selected
                    ? 'Flagged for inspection'
                    : 'Add to inspection plan'}
                </button>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="lab-empty">
          <Icon name="search" />
          <h3>No bridges match this view</h3>
          <p>Try a different name, route, or filter.</p>
          <button
            className="lab-action"
            onClick={() => {
              setSearch('')
              setFilter('all')
            }}
          >
            Show all bridges <Icon name="arrow" />
          </button>
        </div>
      )}
      <p className="lab-footnote">
        These are teaching scenarios, not a current engineering inventory.
        Damage outcomes are revealed in the debrief.
      </p>
    </div>
  )
}
