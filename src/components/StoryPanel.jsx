import React from 'react'

// Briefing panel. Frames the Bethlehem earthquake drill in plain, engaging
// language — accessible to first-years, grounded in their own city.
export default function StoryPanel() {
  return (
    <section className="story-panel" aria-label="Mission briefing">
      <div className="story-panel__speech">
        <div className="story-panel__avatar" aria-hidden="true">🐿️⛑️</div>
        <div className="story-panel__bubble">
          <p>
            <strong>Drill alert:</strong> a rare but possible earthquake has just
            struck the Lehigh Valley, with its epicenter under the South Side of
            <strong> Bethlehem</strong>. 🏭〰️
          </p>
          <p>
            You're the resilience planner in the city's Emergency Operations Center.
            The Lehigh River splits the city, and every crossing matters — but you
            have <strong>no engineering data yet</strong>, only the map.
          </p>
          <p>
            <strong>Your call:</strong> which river bridges get an inspection crew
            first? Hover each one for a field note, then flag it and tell us why. 🔍🌉
          </p>
          <p className="story-panel__hint">
            ⚠️ The ground shook hardest near the glowing epicenter — but as you'll
            learn, shaking is only one clue among many.
          </p>
        </div>
      </div>
    </section>
  )
}
