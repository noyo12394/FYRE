import React from 'react'

// Briefing panel. Sets up the real Northridge scenario in plain, engaging
// language — accessible to first-years, but more grounded than a fairy tale.
export default function StoryPanel() {
  return (
    <section className="story-panel" aria-label="Mission briefing">
      <div className="story-panel__speech">
        <div className="story-panel__avatar" aria-hidden="true">🐿️⛑️</div>
        <div className="story-panel__bubble">
          <p>
            <strong>It's 4:31 a.m. on January 17, 1994.</strong> A magnitude 6.7
            earthquake on a hidden fault has just struck beneath the San Fernando
            Valley. 🌆💥
          </p>
          <p>
            You're the resilience planner in the city's Emergency Operations Center.
            Inspection crews are scrambling, but you have <strong>no engineering
            data yet</strong> — only the map and what your eyes can tell you.
          </p>
          <p>
            <strong>Your call:</strong> which bridges get a crew first? Hover each
            one for a field note, then flag the ones you'd inspect. 🔍🌉
          </p>
          <p className="story-panel__hint">
            ⚠️ The ground shook hardest near the glowing epicenter — but as you'll
            learn, that's only one clue among many.
          </p>
        </div>
      </div>
    </section>
  )
}
