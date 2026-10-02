import React, { useRef } from 'react'
import Icon from './Icon.jsx'

export const ACTIVITY_TABS = [
  { id: 'mission', name: 'The mission', icon: 'map' },
  { id: 'inventory', name: 'Bridge intel', icon: 'bridge' },
  { id: 'progress', name: 'Mission log', icon: 'chart' },
  { id: 'guide', name: 'Field guide', icon: 'book' },
]

export default function ActivityTabs({ activeTab, onChange }) {
  const buttons = useRef([])
  function onKeyDown(event, index) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? ACTIVITY_TABS.length - 1
          : (index +
              (event.key === 'ArrowRight' ? 1 : -1) +
              ACTIVITY_TABS.length) %
            ACTIVITY_TABS.length
    buttons.current[next].focus()
    onChange(ACTIVITY_TABS[next].id)
  }
  return (
    <div
      className="activity-tabs"
      role="tablist"
      aria-label="Learning workspace"
    >
      {ACTIVITY_TABS.map((tab, index) => (
        <button
          key={tab.id}
          ref={(element) => {
            buttons.current[index] = element
          }}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-controls={`panel-${tab.id}`}
          aria-selected={activeTab === tab.id}
          tabIndex={activeTab === tab.id ? 0 : -1}
          className={`activity-tab ${activeTab === tab.id ? 'is-active' : ''}`}
          onKeyDown={(event) => onKeyDown(event, index)}
          onClick={() => onChange(tab.id)}
        >
          <Icon name={tab.icon} />
          {tab.name}
        </button>
      ))}
    </div>
  )
}
