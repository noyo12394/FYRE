import React from 'react'
import Icon from './Icon.jsx'
import { WEEKS } from '../data/weeks.js'

const FUTURE = [
  {
    week: '03',
    name: 'Inventory & age',
    description: 'Add the evidence hidden inside each structure.',
  },
  {
    week: '04',
    name: 'Vulnerability',
    description: 'Understand why some bridges are more fragile.',
  },
  {
    week: '05',
    name: 'Damage probability',
    description: 'Turn your evidence into modeled outcomes.',
  },
  {
    week: '06',
    name: 'Network criticality',
    description: 'See how one failure changes the whole city.',
  },
]

export default function Activities({
  drafts,
  responses,
  studentName,
  onStart,
  onTab,
}) {
  const completed = new Set(responses.map((response) => response.week))
  const nextWeek = WEEKS.find((week) => !completed.has(week.id)) || WEEKS[0]
  return (
    <div className="activities-page">
      <section className="lab-hero" aria-labelledby="welcome-title">
        <div className="lab-hero__copy">
          <p className="lab-eyebrow">
            <span className="status-dot" /> BETHLEHEM FIELD LAB
          </p>
          <h2 id="welcome-title">
            A city to protect.
            <br />
            <span>A better call to make.</span>
          </h2>
          <p>
            Ten bridges. Five inspection crews. Build your catastrophe-modeling
            instincts, one layer of evidence at a time.
          </p>
          <button
            className="btn btn--primary"
            onClick={() => onStart(nextWeek.id)}
          >
            {drafts[nextWeek.id]?.selectedIds.length
              ? 'Resume your field drill'
              : completed.size === WEEKS.length
                ? 'Revisit the field drill'
                : 'Start your next activity'}{' '}
            <Icon name="arrow" />
          </button>
          <div className="lab-hero__meta">
            <Icon name="map" /> Lehigh Valley, PA <span>·</span> Earthquake
            simulation
          </div>
        </div>
        <div className="lab-hero__art" aria-hidden="true">
          <div className="lab-map-label">
            LEHIGH RIVER CROSSINGS <span>FIELD AREA 01</span>
          </div>
          <svg viewBox="0 0 460 260" fill="none">
            <defs>
              <pattern
                id="lab-grid"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <path d="M28 0H0V28" stroke="#28423f" strokeWidth=".7" />
              </pattern>
            </defs>
            <rect width="460" height="260" fill="url(#lab-grid)" />
            <path
              d="M-20 180Q110 55 230 135T490 70"
              stroke="#244f56"
              strokeWidth="44"
            />
            <path
              d="M-20 180Q110 55 230 135T490 70"
              stroke="#4a99a1"
              strokeWidth="1.4"
              strokeDasharray="5 7"
            />
            <path
              d="M70 40L108 214 M216 33L245 220 M357 35L330 224 M24 70L433 67 M36 207L422 202"
              stroke="#72968a"
              strokeWidth="2"
              opacity=".55"
            />
            {[
              { x: 88, y: 115 },
              { x: 233, y: 135 },
              { x: 344, y: 133 },
            ].map(({ x, y }) => (
              <g key={x} transform={`translate(${x} ${y})`}>
                <circle
                  r="24"
                  fill="#142c2d"
                  stroke="#7adcb5"
                  strokeOpacity=".45"
                />
                <path
                  d="M-13 7H13 M-11 7V-8 M11 7V-8 M-11-6Q0 10 11-6 M-5 0V7 M5 0V7"
                  stroke="#b4f1cf"
                  strokeWidth="2"
                />
              </g>
            ))}
            <circle cx="266" cy="196" r="24" stroke="#ffbe70" opacity=".2" />
            <circle cx="266" cy="196" r="12" stroke="#ffbe70" opacity=".5" />
            <circle cx="266" cy="196" r="4" fill="#ffbe70" />
            <text
              x="285"
              y="200"
              fill="#f1ce9c"
              fontSize="9"
              fontFamily="monospace"
            >
              DRILL EPICENTER
            </text>
          </svg>
          <div className="lab-map-footer">
            <span>
              <i /> 10 crossings in the field
            </span>
            <span>SCHEMATIC / SIMULATION</span>
          </div>
        </div>
      </section>

      <section className="lab-stats" aria-label="Workspace summary">
        <div>
          <Icon name="grid" />
          <p>
            <strong>02</strong>
            <span>activities ready</span>
          </p>
        </div>
        <div>
          <Icon name="bridge" />
          <p>
            <strong>10</strong>
            <span>bridges to investigate</span>
          </p>
        </div>
        <div>
          <Icon name="flag" />
          <p>
            <strong>05</strong>
            <span>crews per dispatch</span>
          </p>
        </div>
        <div>
          <Icon name="check" />
          <p>
            <strong>
              {String(completed.size).padStart(2, '0')}
              <small> / 02</small>
            </strong>
            <span>activities completed</span>
          </p>
        </div>
      </section>

      <section aria-labelledby="activity-heading">
        <div className="section-heading">
          <div>
            <p className="lab-eyebrow">YOUR NEXT DECISION</p>
            <h2 id="activity-heading">Into the field</h2>
          </div>
          <span className="lab-tag">2 available activities</span>
        </div>
        <div className="activity-cards">
          {WEEKS.map((week) => {
            const isDone = completed.has(week.id)
            const draftCount = drafts[week.id]?.selectedIds.length || 0
            return (
              <article
                key={week.id}
                className={`activity-card activity-card--${week.id}`}
              >
                <div className="activity-card__top">
                  <span className="activity-card__number">0{week.id}</span>
                  <span
                    className={`lab-tag ${isDone ? 'lab-tag--complete' : ''}`}
                  >
                    {isDone ? (
                      <>
                        <Icon name="check" /> Completed
                      </>
                    ) : draftCount ? (
                      'In progress'
                    ) : (
                      'Ready to explore'
                    )}
                  </span>
                </div>
                <div className="activity-card__visual">
                  <Icon name={week.revealsShaking ? 'wave' : 'bridge'} />
                  <span>
                    {week.revealsShaking
                      ? 'OBSERVATION + SHAKING'
                      : 'OBSERVATION ONLY'}
                  </span>
                </div>
                <p className="lab-eyebrow">WEEK {week.id} / FIELD ACTIVITY</p>
                <h3>{week.name}</h3>
                <p>
                  {week.id === 1
                    ? 'Make your first inspection plan using the map, visual clues, and your own judgment.'
                    : 'Revisit your plan with a shaking-intensity layer. Does new evidence change your priorities?'}
                </p>
                <div className="activity-card__bottom">
                  <span>
                    {draftCount
                      ? `${draftCount} bridges in your draft`
                      : week.tagline}
                  </span>
                  <button
                    className="lab-action"
                    onClick={() => onStart(week.id)}
                  >
                    {draftCount
                      ? 'Resume'
                      : isDone
                        ? 'Try again'
                        : 'Open activity'}
                    <Icon name="arrow" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <div className="lab-support-grid">
        <section
          className="lab-panel notebook"
          aria-labelledby="notebook-title"
        >
          <span className="lab-square-icon">
            <Icon name="book" />
          </span>
          <div>
            <h3 id="notebook-title">
              {studentName.trim()
                ? `${studentName.trim()}'s field notebook`
                : 'Your field notebook'}
            </h3>
            <p>
              Your drafts and dispatch history stay with you on this browser.
            </p>
            <div className="lab-progress-line">
              <progress
                aria-label="Activities completed"
                value={completed.size}
                max={WEEKS.length}
              />
              <span>
                {completed.size} of {WEEKS.length} complete
              </span>
            </div>
          </div>
          <button className="lab-action" onClick={() => onTab('progress')}>
            View progress <Icon name="arrow" />
          </button>
        </section>
        <section className="lab-panel lab-tip">
          <p className="lab-eyebrow">PGA PAL'S FIELD NOTE</p>
          <h3>Importance and fragility are different clues.</h3>
          <p>
            A hospital route may need an early inspection even when it looks
            sturdy.
          </p>
          <button className="lab-action" onClick={() => onTab('guide')}>
            Open the field guide <Icon name="arrow" />
          </button>
        </section>
      </div>

      <section
        className="course-preview"
        aria-labelledby="course-preview-title"
      >
        <div className="section-heading">
          <div>
            <p className="lab-eyebrow">THE BIGGER PICTURE</p>
            <h2 id="course-preview-title">More layers, better decisions</h2>
          </div>
          <span className="lab-muted">Future modules</span>
        </div>
        <div className="course-preview__grid">
          {FUTURE.map((item) => (
            <article key={item.week}>
              <span>
                WEEK {item.week}
                <Icon name="lock" />
              </span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <small>Coming soon</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
