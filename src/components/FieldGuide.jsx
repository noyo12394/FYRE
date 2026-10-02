import React from 'react'
import Icon from './Icon.jsx'
import { PHASES } from '../data/mission.js'

export default function FieldGuide({ onStart }) {
  return (
    <div className="field-guide">
      <div className="section-heading">
        <div>
          <p className="lab-eyebrow">YOUR POCKET FIELD GUIDE</p>
          <h2>One mission, four steps.</h2>
          <p className="lab-muted">
            Follow the sequence tracker in order. Tabs are tools; the crew
            planner buttons advance the mission.
          </p>
        </div>
        <button className="lab-action" onClick={onStart}>
          Return to mission <Icon name="arrow" />
        </button>
      </div>
      <div className="guide-steps">
        {PHASES.map((step, i) => (
          <article className="lab-panel" key={step.id}>
            <span className="lab-tag">0{i + 1}</span>
            <h3>{step.name}</h3>
            <p>
              {
                [
                  'Assign exactly five crews using visible field notes. Reasons are optional here. Lock the plan to preserve your first instincts.',
                  'The simulated shaking map and a hospital radio call arrive together. Reconsider your flags, give every crossing a reason, and rank crews with Move up / Move down.',
                  'Add your name and review all five assignments. Dispatch to commit your final plan. The first two crews and the hospital’s place in the queue matter.',
                  'See modeled damage, a transparent score, earned badges, and a before-and-after comparison. Start a new mission to test another strategy.',
                ][i]
              }
            </p>
          </article>
        ))}
      </div>
      <div className="guide-bottom">
        <section className="lab-panel">
          <p className="lab-eyebrow">HOW THE 100 POINTS WORK</p>
          <h3>Risk, evidence, and a lifeline.</h3>
          <ul className="guide-rubric">
            <li>40 · Catch the two modeled collapses (20 each).</li>
            <li>20 · Flag the four high-risk crossings (5 each).</li>
            <li>20 · Match their primary vulnerability (5 each).</li>
            <li>10 · Put the hospital link in your first three.</li>
            <li>10 · Put a modeled collapsed bridge in your first two.</li>
          </ul>
          <p className="lab-muted">
            The rubric uses a fixed teaching scenario, not a universal
            inspection rule. You can see a full breakdown after dispatch.
          </p>
        </section>
        <section className="lab-panel">
          <p className="lab-eyebrow">READ THE MAP</p>
          <h3>Shaking is only one clue.</h3>
          <dl className="mission-glossary">
            <dt>PGA</dt>
            <dd>
              Peak ground acceleration, shown here as a simulated fraction of
              gravity (g). It describes shaking, not guaranteed damage.
            </dd>
            <dt>Vulnerability</dt>
            <dd>
              Age, shape, construction, and soft ground can change how a
              crossing responds.
            </dd>
            <dt>Lifeline</dt>
            <dd>
              A route’s importance to emergency access can make it a priority
              even with lighter shaking.
            </dd>
          </dl>
        </section>
      </div>
      <section className="lab-panel guide-faq">
        <h3>Good to know</h3>
        <details>
          <summary>Can I change my initial plan?</summary>
          <p>
            You can edit until you lock it. After that, the initial snapshot
            stays unchanged, but you can revise the final plan before dispatch.
          </p>
        </details>
        <details>
          <summary>Where is my progress saved?</summary>
          <p>
            Drafts and mission reports are saved on this browser when device
            storage is available. Submissions also try the existing instructor
            database. The debrief states whether that succeeded. Export the
            Mission log to keep a CSV copy.
          </p>
        </details>
        <details>
          <summary>Is this real disaster information?</summary>
          <p>
            No. The shaking, damage, and radio message are simulated for
            learning. This is not current infrastructure information or an
            engineering assessment.
          </p>
        </details>
      </section>
    </div>
  )
}
