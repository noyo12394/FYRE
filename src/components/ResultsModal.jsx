import React from 'react'

// Computes friendly results from the player's selection.
function scoreSelection(bridges, selectedIds) {
  const selected = bridges.filter((b) => selectedIds.includes(b.id))
  const highSelected = selected.filter((b) => b.trueRisk === 'high')
  const mediumSelected = selected.filter((b) => b.trueRisk === 'medium')
  const lowSelected = selected.filter((b) => b.trueRisk === 'low')
  const missedHigh = bridges.filter(
    (b) => b.trueRisk === 'high' && !selectedIds.includes(b.id),
  )

  // A gentle "points" idea just to pick an encouraging label — never shown as a grade.
  const points = highSelected.length * 2 + mediumSelected.length

  let label
  if (highSelected.length >= 2 && missedHigh.length === 0) {
    label = 'Great first instincts! 🌟'
  } else if (points >= 3) {
    label = 'Nice start, planner! 😊'
  } else if (points >= 1) {
    label = 'Good effort — but data will help! 📈'
  } else {
    label = 'Your city needs more clues! 🔍'
  }

  return { selected, highSelected, mediumSelected, lowSelected, missedHigh, label }
}

function usefulness(risk) {
  if (risk === 'high') return { text: 'Smart pick! High priority. ✅', cls: 'good' }
  if (risk === 'medium') return { text: 'Reasonable choice. 👍', cls: 'okay' }
  return { text: 'Lower priority this time. 🤷', cls: 'meh' }
}

export default function ResultsModal({ bridges, selectedIds, onPlayAgain, onClose }) {
  const { selected, highSelected, mediumSelected, missedHigh, label } = scoreSelection(
    bridges,
    selectedIds,
  )

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Results">
      <div className="modal">
        <button className="modal__close" onClick={onClose} aria-label="Close results">
          ✕
        </button>

        <div className="modal__header">
          <div className="modal__mascot" aria-hidden="true">🐿️⛑️</div>
          <h2 className="modal__title">Inspection Report</h2>
          <p className="modal__label">{label}</p>
        </div>

        {/* Quick stats */}
        <div className="results-stats">
          <div className="results-stat results-stat--high">
            <span className="results-stat__num">{highSelected.length}</span>
            <span className="results-stat__cap">High-risk found</span>
          </div>
          <div className="results-stat results-stat--medium">
            <span className="results-stat__num">{mediumSelected.length}</span>
            <span className="results-stat__cap">Medium-risk found</span>
          </div>
          <div className="results-stat results-stat--missed">
            <span className="results-stat__num">{missedHigh.length}</span>
            <span className="results-stat__cap">High-risk missed</span>
          </div>
        </div>

        {/* Feedback per selected bridge */}
        <h3 className="results-section-title">Your Inspected Bridges 🌉</h3>
        <div className="feedback-cards">
          {selected.map((b) => {
            const use = usefulness(b.trueRisk)
            return (
              <div key={b.id} className={`feedback-card feedback-card--${b.trueRisk}`}>
                <div className="feedback-card__top">
                  <span className="feedback-card__emoji">{b.emoji}</span>
                  <span className="feedback-card__name">{b.name}</span>
                  <span className={`risk-pill risk-pill--${b.trueRisk}`}>
                    {b.trueRisk} risk
                  </span>
                </div>
                <p className="feedback-card__reason">{b.reason}</p>
                <p className={`feedback-card__use feedback-card__use--${use.cls}`}>
                  {use.text}
                </p>
              </div>
            )
          })}
        </div>

        {/* Missed high-risk bridges */}
        {missedHigh.length > 0 && (
          <>
            <h3 className="results-section-title">Missed Clues 🔍</h3>
            <div className="feedback-cards">
              {missedHigh.map((b) => (
                <div key={b.id} className="feedback-card feedback-card--missed">
                  <div className="feedback-card__top">
                    <span className="feedback-card__emoji">{b.emoji}</span>
                    <span className="feedback-card__name">{b.name}</span>
                    <span className="risk-pill risk-pill--high">high risk</span>
                  </div>
                  <p className="feedback-card__reason">
                    <strong>Missed clue:</strong> {b.name} looked normal, but {b.reason}{' '}
                    In catastrophe modeling, importance is not always visible.
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Week 1 lesson */}
        <div className="lesson-box">
          <h3 className="lesson-box__title">🎓 Week 1 Lesson</h3>
          <p>
            Early disaster decisions are often made with incomplete information. Visual
            clues help, but they can be misleading. <strong>Catastrophe modeling</strong>{' '}
            helps us add better layers of evidence over time.
          </p>
        </div>

        {/* Teaser */}
        <div className="week2-teaser">
          <span className="week2-teaser__emoji">🔒</span>
          <p>
            <strong>Next week,</strong> you'll unlock real data layers like shaking
            intensity, bridge age, and vulnerability!
          </p>
        </div>

        {/* Actions */}
        <div className="modal__actions">
          <button className="btn btn--primary" onClick={onPlayAgain}>
            🔁 Play again
          </button>
          <button className="btn btn--locked" disabled>
            🔒 Continue to Week 2 — Coming soon
          </button>
        </div>
      </div>
    </div>
  )
}
