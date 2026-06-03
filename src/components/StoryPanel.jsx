import React from 'react'

// The story intro panel. Sets up the scenario in friendly, playful language.
export default function StoryPanel() {
  return (
    <section className="story-panel" aria-label="Story introduction">
      <div className="story-panel__speech">
        <div className="story-panel__avatar" aria-hidden="true">🐿️⛑️</div>
        <div className="story-panel__bubble">
          <p>
            <strong>An earthquake just shook QuakeTown!</strong> 😱 You are the city's
            new <strong>resilience planner</strong>.
          </p>
          <p>
            You do not have detailed engineering data yet. Based only on what you can
            see, choose the bridges you think should be inspected first. 🌉🔍
          </p>
          <p className="story-panel__hint">
            Tip: hover a bridge for a clue, then tap to add it to your inspection list!
          </p>
        </div>
      </div>
    </section>
  )
}
