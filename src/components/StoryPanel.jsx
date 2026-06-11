import React from 'react'

// Briefing panel. Frames the current week's earthquake drill in plain, engaging
// language — accessible to first-years, grounded in their own city. Copy is
// driven by the active week's config so Week 2 reframes around the new
// shaking-intensity layer.
export default function StoryPanel({ week }) {
  const s = (week && week.story) || {}
  const isWeek2 = week && week.revealsShaking

  return (
    <section className="story-panel" aria-label="Mission briefing">
      <div className="story-panel__speech">
        <div className="story-panel__avatar" aria-hidden="true">🐿️⛑️</div>
        <div className="story-panel__bubble">
          <p>
            <strong>{isWeek2 ? 'Update:' : 'Drill alert:'}</strong> {s.alert}
          </p>
          <p>{s.role}</p>
          <p>
            <strong>Your call:</strong> {s.call}
          </p>
          <p className="story-panel__hint">{s.hint}</p>
        </div>
      </div>
    </section>
  )
}
