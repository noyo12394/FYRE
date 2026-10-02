import React, { useState } from 'react'
import Icon from './Icon.jsx'
import { MISSION_ID, PHASES } from '../data/mission.js'
import { bridges } from '../data/bridges.js'
import { scoreMission } from '../utils/scoring.js'

export default function ProgressPanel({
  responses,
  studentName,
  phase,
  onResume,
  onReplay,
  onExport,
  onRestart,
  isSubmitting,
}) {
  const [filter, setFilter] = useState('all')
  const names = [...new Set(responses.map((row) => row.student))]
  const visible = responses.filter(
    (row) => filter === 'all' || row.student === filter,
  )
  const missions = visible.filter((row) => row.missionId === MISSION_ID)
  const getScore = (row) =>
    scoreMission(
      bridges,
      row.selections.map((s) => s.id),
      Object.fromEntries(row.selections.map((s) => [s.id, s.reason])),
    )
  const best = missions.length
    ? Math.max(...missions.map((row) => getScore(row).points))
    : null
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="lab-eyebrow">EVERY CALL LEAVES A LESSON</p>
          <h2>Mission log</h2>
          <p className="lab-muted">
            Completed missions and earlier saved attempts on this device.
          </p>
        </div>
        <button
          className="lab-action"
          onClick={onExport}
          disabled={!responses.length}
        >
          <Icon name="download" /> Export all attempts
        </button>
      </div>
      <div className="mission-log-stats">
        <article className="lab-panel">
          <p className="lab-eyebrow">COMPLETED MISSIONS</p>
          <strong>{missions.length}</strong>
          <p>One continuous challenge, played your way.</p>
        </article>
        <article className="lab-panel">
          <p className="lab-eyebrow">BEST SCENARIO SCORE</p>
          <strong>{best === null ? '—' : `${best}/100`}</strong>
          <p>For the learner filter below.</p>
        </article>
        <article className="lab-panel">
          <p className="lab-eyebrow">CURRENT WORKSPACE</p>
          <strong>{PHASES.find((step) => step.id === phase).name}</strong>
          <p>{studentName || 'Add your planner name in the mission.'}</p>
          <button className="lab-action" onClick={onResume}>
            Resume mission <Icon name="arrow" />
          </button>
        </article>
      </div>
      <div className="section-heading">
        <h3>Saved attempts</h3>
        <label className="lab-select">
          Learner
          <select
            aria-label="Filter mission log by learner"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All learners</option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {visible.length ? (
        <div className="mission-history">
          {[...visible].reverse().map((row) => {
            const mission = row.missionId === MISSION_ID,
              score = mission ? getScore(row) : null
            return (
              <article className="lab-panel mission-history__row" key={row.id}>
                <div>
                  <span className="lab-tag">
                    {mission ? 'THE GOLDEN HOUR' : 'PREVIOUS DRILL ATTEMPT'}
                  </span>
                  <h3>
                    {row.student}{' '}
                    <small>{new Date(row.submittedAt).toLocaleString()}</small>
                  </h3>
                  <p>
                    {mission
                      ? `${score.points}/100 · ${score.label} · ${score.badges.length} badges earned`
                      : row.scoreLabel || 'Saved response'}{' '}
                    ·{' '}
                    {row.storage === 'cloud'
                      ? 'Instructor database'
                      : row.storage === 'memory'
                        ? 'In this session only'
                        : 'Saved on this device'}
                  </p>
                </div>
                <button className="lab-action" onClick={() => onReplay(row)}>
                  Open debrief <Icon name="arrow" />
                </button>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="lab-empty">
          <Icon name="flag" />
          <h3>Your first mission starts here</h3>
          <p>
            Complete the challenge to save your plan, score, and earned badges.
          </p>
          <button className="lab-action" onClick={onResume}>
            Go to the mission <Icon name="arrow" />
          </button>
        </div>
      )}
      <div className="mission-log-footer">
        <p className="lab-muted">
          A new mission resets only the active plan. Your saved reports stay
          here.
        </p>
        <button
          className="lab-action"
          disabled={isSubmitting}
          onClick={onRestart}
        >
          Start a new mission <Icon name="arrow" />
        </button>
      </div>
    </div>
  )
}
