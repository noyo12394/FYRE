import React from 'react'
import Icon from './Icon.jsx'
import { WEEKS, getWeek } from '../data/weeks.js'
import { bridges, REASON_OPTIONS } from '../data/bridges.js'

const formatDate = (value) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))

export default function ProgressPanel({
  responses,
  allResponses,
  studentName,
  drafts,
  onNameChange,
  onStart,
  onReview,
  onExport,
}) {
  const completed = new Set(responses.map((response) => response.week))
  const history = [...responses].sort(
    (a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt),
  )
  const latest = Object.fromEntries(
    WEEKS.map((week) => [week.id, history.find((row) => row.week === week.id)]),
  )
  const plannerNames = [
    ...new Set([
      ...allResponses.map((row) => row.student),
      ...(studentName ? [studentName] : []),
    ]),
  ]

  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="lab-eyebrow">YOUR DECISIONS, OVER TIME</p>
          <h2>My progress</h2>
          <p className="lab-muted">
            Revisit your reasoning and see what changed when you gained more
            evidence.
          </p>
        </div>
        <button
          className="lab-action"
          disabled={!allResponses.length}
          onClick={onExport}
        >
          <Icon name="download" /> Export device responses
        </button>
      </div>
      {plannerNames.length > 0 && (
        <label className="lab-select progress-planner">
          Planner
          <select
            value={studentName}
            onChange={(event) => onNameChange(event.target.value)}
          >
            {!studentName && <option value="">Choose a planner</option>}
            {plannerNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="progress-overview lab-panel">
        <div>
          <span className="lab-square-icon">
            <Icon name="chart" />
          </span>
          <h3>
            {completed.size === WEEKS.length
              ? 'Both field activities completed'
              : 'Every decision adds to your field experience'}
          </h3>
          <p>
            {studentName.trim()
              ? `Showing attempts for ${studentName.trim()}. `
              : ''}
            Drafts and history are saved in this browser.
          </p>
        </div>
        <div className="progress-overview__meter">
          <strong>
            {Math.round((completed.size / WEEKS.length) * 100)}
            <small>%</small>
          </strong>
          <progress
            aria-label="Activities completed"
            value={completed.size}
            max={WEEKS.length}
          />
          <span>
            {completed.size} of {WEEKS.length} activities completed
          </span>
        </div>
      </div>
      <div className="progress-activities">
        {WEEKS.map((week) => (
          <article className="lab-panel" key={week.id}>
            <div className="progress-activities__heading">
              <span className="lab-square-icon">
                <Icon name={week.revealsShaking ? 'wave' : 'bridge'} />
              </span>
              <span
                className={`lab-tag ${completed.has(week.id) ? 'lab-tag--complete' : ''}`}
              >
                {completed.has(week.id)
                  ? 'Completed'
                  : drafts[week.id]?.selectedIds.length
                    ? 'Draft saved'
                    : 'Not started'}
              </span>
            </div>
            <p className="lab-eyebrow">WEEK {week.id}</p>
            <h3>{week.name}</h3>
            <p>
              {responses.filter((row) => row.week === week.id).length} recorded
              attempts · {drafts[week.id]?.selectedIds.length || 0} bridges in
              draft
            </p>
            <button className="lab-action" onClick={() => onStart(week.id)}>
              {completed.has(week.id) ? 'Practice again' : 'Continue activity'}
              <Icon name="arrow" />
            </button>
          </article>
        ))}
      </div>
      {latest[1] && latest[2] && (
        <section
          className="comparison lab-panel"
          aria-labelledby="comparison-title"
        >
          <div className="section-heading">
            <div>
              <p className="lab-eyebrow">YOUR LATEST PLAN IN EACH WEEK</p>
              <h3 id="comparison-title">What did the shaking map change?</h3>
            </div>
          </div>
          <div className="lab-table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Bridge</th>
                  <th scope="col">Week 1 · observation</th>
                  <th scope="col">Week 2 · shaking</th>
                </tr>
              </thead>
              <tbody>
                {bridges
                  .filter((bridge) =>
                    [latest[1], latest[2]].some((row) =>
                      row.selections.some(
                        (selection) => selection.id === bridge.id,
                      ),
                    ),
                  )
                  .map((bridge) => (
                    <tr key={bridge.id}>
                      <th scope="row">{bridge.name}</th>
                      {[1, 2].map((week) => {
                        const selected = latest[week].selections.find(
                          (item) => item.id === bridge.id,
                        )
                        return (
                          <td key={week}>
                            {selected ? (
                              <>
                                <span className="comparison__flag">
                                  <Icon name="flag" />
                                  Flagged
                                </span>
                                <small>
                                  {REASON_OPTIONS.find(
                                    (reason) => reason.id === selected.reason,
                                  )?.label || 'Just a hunch'}
                                </small>
                              </>
                            ) : (
                              <span className="lab-muted">Not flagged</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section aria-labelledby="history-title">
        <div className="section-heading">
          <h3 id="history-title">Dispatch history</h3>
          <span className="lab-muted">
            {history.length} {history.length === 1 ? 'attempt' : 'attempts'}
          </span>
        </div>
        {history.length ? (
          <div className="dispatch-history">
            {history.map((row) => (
              <article className="dispatch-row" key={row.id}>
                <span className="lab-square-icon">
                  <Icon name="check" />
                </span>
                <div className="dispatch-row__details">
                  <span className="lab-eyebrow">
                    {getWeek(row.week).label} · {formatDate(row.submittedAt)}
                  </span>
                  <h4>{row.scoreLabel}</h4>
                  <p>
                    {row.selections.length} bridges flagged ·{' '}
                    {row.collapsesCaught ?? 0} modeled collapses caught ·{' '}
                    {row.reasoningHits ?? 0} matching reasons
                  </p>
                  <small>
                    {row.storage === 'cloud'
                      ? 'Recorded for instructor'
                      : row.storage === 'memory'
                        ? 'Available this session only'
                        : 'Saved on this device'}
                  </small>
                </div>
                <button className="lab-action" onClick={() => onReview(row)}>
                  View debrief <Icon name="arrow" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="lab-empty">
            <Icon name="flag" />
            <h3>Your first dispatch starts the story</h3>
            <p>
              Complete a field activity to record your choices and unlock a
              debrief.
            </p>
            <button className="btn btn--primary" onClick={() => onStart(1)}>
              Open Bridge Triage <Icon name="arrow" />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
