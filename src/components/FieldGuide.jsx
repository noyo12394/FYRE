import React from 'react'
import Icon from './Icon.jsx'

export default function FieldGuide({ onStart }) {
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="lab-eyebrow">PGA PAL'S FIELD GUIDE</p>
          <h2>A little context. A better decision.</h2>
          <p className="lab-muted">
            The concepts behind your next inspection plan.
          </p>
        </div>
        <span className="lab-tag">Keep this close</span>
      </div>
      <section className="guide-callout lab-panel">
        <span aria-hidden="true">🐿️</span>
        <div>
          <h3>You're running a learning drill.</h3>
          <p>
            Bethlehem is the setting. Shaking values and bridge outcomes are
            simulated teaching data, not live earthquake reports or engineering
            assessments. Use the exercise to practice reasoning with incomplete
            information.
          </p>
        </div>
      </section>
      <div className="guide-grid">
        <article className="lab-panel">
          <Icon name="flag" />
          <h3>01 / Observe & prioritize</h3>
          <p>
            Inspect the map or searchable inventory. Flag up to five crossings
            and give a reason for each. There is no single visual clue that
            tells the whole story.
          </p>
          <button className="lab-action" onClick={() => onStart(1)}>
            Try Week 1 <Icon name="arrow" />
          </button>
        </article>
        <article className="lab-panel">
          <Icon name="wave" />
          <h3>02 / Add the shaking layer</h3>
          <p>
            Week 2 adds simulated ground-motion evidence. Warmer colors mean
            stronger shaking. Compare bridges across zones, then decide whether
            to revise your first plan.
          </p>
          <button className="lab-action" onClick={() => onStart(2)}>
            Try Week 2 <Icon name="arrow" />
          </button>
        </article>
        <article className="lab-panel">
          <Icon name="chart" />
          <h3>03 / Dispatch & reflect</h3>
          <p>
            Add your planner name and dispatch your crews. The debrief reveals
            modeled damage and compares your reasons with the scenario's
            drivers. My progress keeps your attempts for review.
          </p>
        </article>
      </div>
      <section
        className="lab-panel guide-glossary"
        aria-labelledby="glossary-title"
      >
        <p className="lab-eyebrow">WORDS YOU'LL MEET IN THE FIELD</p>
        <h3 id="glossary-title">The essentials</h3>
        <dl>
          <div>
            <dt>Epicenter</dt>
            <dd>
              The point on Earth's surface directly above where an earthquake
              starts. Nearby bridges do not necessarily experience the same
              shaking.
            </dd>
          </div>
          <div>
            <dt>Peak ground acceleration (PGA)</dt>
            <dd>
              A measure of the greatest ground acceleration during shaking,
              expressed here as a fraction of gravity, g. A drill value of 0.46g
              means 46% of gravitational acceleration.
            </dd>
          </div>
          <div>
            <dt>Vulnerability</dt>
            <dd>
              How susceptible a structure is to damage. Age, materials, design,
              retrofits, and ground conditions all help explain different
              outcomes under similar shaking.
            </dd>
          </div>
          <div>
            <dt>Critical lifeline</dt>
            <dd>
              A connection that supports essential services, such as ambulance
              access. Consequences can make a crossing a priority even when its
              modeled damage is minor.
            </dd>
          </div>
          <div>
            <dt>Reasoning match</dt>
            <dd>
              A point in this exercise when your selected reason matches the
              scenario's assigned primary factor for a high-risk bridge. It is
              feedback on the teaching model, not a safety judgment.
            </dd>
          </div>
        </dl>
      </section>
      <section className="lab-panel guide-faq">
        <h3>Your workspace, explained</h3>
        <details>
          <summary>What happens when I switch activities?</summary>
          <p>
            Each week keeps a separate draft. You can switch tabs or weeks and
            return to your flags and reasons. Starting a fresh plan clears only
            that week's draft; recorded attempts stay in My progress.
          </p>
        </details>
        <details>
          <summary>Where are my responses saved?</summary>
          <p>
            Drafts and dispatch history are stored in this browser. When the
            class database is connected, new dispatches are also sent to your
            instructor. The debrief shows the actual save status. Browser
            storage is specific to this device and can be cleared by its
            settings.
          </p>
        </details>
        <details>
          <summary>Why are later weeks unavailable?</summary>
          <p>
            Weeks 3–6 describe the planned course roadmap. The currently
            playable field activities are Bridge Triage and Shaking Intensity
            Map.
          </p>
        </details>
      </section>
    </div>
  )
}
