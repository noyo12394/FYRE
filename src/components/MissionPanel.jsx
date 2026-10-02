import React from 'react'
import { MAX_SELECTIONS, REASON_OPTIONS } from '../data/bridges.js'
import { isDispatchReady, dispatchRequirements } from '../utils/progress.js'

export default function MissionPanel({
  bridges,
  draft,
  phase,
  studentName,
  onNameChange,
  onToggle,
  onSetReason,
  onMove,
  onAdvance,
  onSubmit,
  inputRef,
  isSubmitting,
  panelRef,
  validationAttempted,
  draftStorageAvailable,
}) {
  const { selectedIds, reasons } = draft
  const selected = selectedIds.map((id) => bridges.find((b) => b.id === id))
  const review = phase === 'review',
    recon = phase === 'recon'
  const ready = isDispatchReady(draft, studentName)
  const missing = dispatchRequirements(draft, studentName)
  return (
    <aside
      ref={panelRef}
      className="mission-panel"
      aria-label="Crew dispatch planner"
    >
      <div className="mission-panel__card">
        <p className="lab-eyebrow">
          {recon
            ? 'FIRST RESPONSE'
            : review
              ? 'FINAL DISPATCH'
              : 'REVISED RESPONSE'}
        </p>
        <h2 className="mission-panel__title">
          Your five-crew plan{' '}
          <span className="lab-tag">{selected.length}/5</span>
        </h2>
        <p className="mission-panel__text">
          {recon
            ? 'Flag five crossings. Your initial plan is saved before the shaking map arrives.'
            : 'Top of the list = first dispatched. Move crews up or down to set priority.'}
        </p>
        <label className="student-field">
          <span className="student-field__label">
            Planner on duty (your name){!recon && ' · required'}
          </span>
          <input
            ref={inputRef}
            className="student-field__input"
            type="text"
            value={studentName}
            maxLength={80}
            autoComplete="name"
            placeholder="e.g. Jordan Rivera"
            readOnly={review}
            aria-required={!recon}
            aria-invalid={
              validationAttempted && !recon && missing.missingName
                ? true
                : undefined
            }
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>
        <p className="planner-save-status" role="status">
          {draftStorageAvailable
            ? 'Name and plan autosaved on this device. View them in Mission log.'
            : 'Not saved: device storage is unavailable. Keep this page open.'}
        </p>
      </div>
      <div className="mission-panel__card">
        <h3 className="mission-panel__subtitle">
          {recon ? 'Initial inspection flags' : 'Dispatch order'}
        </h3>
        {!selected.length ? (
          <div className="mission-panel__empty">
            <span aria-hidden="true">🚧</span>
            <p>
              Your crews are waiting. Tap a bridge on the map or use Bridge
              intel to assign them.
            </p>
          </div>
        ) : (
          <ol className="selected-list crew-list">
            {selected.map((bridge, index) => (
              <li key={bridge.id} className="selected-list__item">
                <div className="selected-list__head">
                  <span
                    className="crew-rank"
                    aria-label={`Priority ${index + 1}`}
                  >
                    {index + 1}
                  </span>
                  <span className="selected-list__name">{bridge.name}</span>
                  {!review && (
                    <button
                      className="selected-list__remove"
                      type="button"
                      onClick={() => onToggle(bridge.id)}
                      aria-label={`Remove ${bridge.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {!recon && !review && (
                  <div className="crew-order">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMove(bridge.id, -1)}
                      aria-label={`Move ${bridge.name} up`}
                    >
                      ↑ Move up
                    </button>
                    <button
                      type="button"
                      disabled={index === selected.length - 1}
                      onClick={() => onMove(bridge.id, 1)}
                      aria-label={`Move ${bridge.name} down`}
                    >
                      ↓ Move down
                    </button>
                  </div>
                )}
                {review ? (
                  <p className="crew-evidence">
                    {
                      REASON_OPTIONS.find((r) => r.id === reasons[bridge.id])
                        ?.label
                    }
                  </p>
                ) : (
                  <label className="reason-picker">
                    <span className="reason-picker__label">
                      {recon
                        ? 'Your first instinct (optional)'
                        : 'What evidence supports this flag?'}
                    </span>
                    <select
                      className="reason-picker__select"
                      id={`reason-${bridge.id}`}
                      aria-invalid={
                        validationAttempted &&
                        !recon &&
                        missing.missingReasons.includes(bridge.id)
                          ? true
                          : undefined
                      }
                      aria-label={`Reason for ${bridge.name}`}
                      value={reasons[bridge.id] || ''}
                      onChange={(e) => onSetReason(bridge.id, e.target.value)}
                    >
                      <option value="">Choose your evidence…</option>
                      {REASON_OPTIONS.filter(
                        (r) => recon || r.id !== 'hunch',
                      ).map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.emoji} {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
      <p id="mission-requirements" className="mission-validation" role="status">
        {recon
          ? missing.missingCrews
            ? `Assign ${missing.missingCrews} more crew${missing.missingCrews === 1 ? '' : 's'} using the map or crossing cards.`
            : 'All five crews assigned. Ready to reveal shaking.'
          : ready
            ? 'Five crews, five reasons. Ready for your final call.'
            : 'Choose five crossings, give each a reason other than a hunch, and add your name.'}
      </p>
      {!recon && !ready && (
        <ul
          className="mission-missing"
          aria-label="Steps needed before dispatch"
        >
          {missing.missingCrews > 0 && (
            <li>
              Assign {missing.missingCrews} more crew
              {missing.missingCrews === 1 ? '' : 's'}.
            </li>
          )}
          {missing.missingName && <li>Add your planner name.</li>}
          {missing.missingReasons.length > 0 && (
            <li>
              Choose evidence for:{' '}
              {missing.missingReasons
                .map((id) => bridges.find((bridge) => bridge.id === id)?.name)
                .join(', ')}
              .
            </li>
          )}
        </ul>
      )}
      <button
        type="button"
        className="btn btn--primary mission-panel__submit"
        disabled={isSubmitting}
        aria-describedby="mission-requirements"
        onClick={review ? onSubmit : onAdvance}
      >
        {isSubmitting
          ? 'Recording dispatch…'
          : recon
            ? missing.missingCrews
              ? `Choose ${missing.missingCrews} more crossing${missing.missingCrews === 1 ? '' : 's'} →`
              : 'Lock plan & reveal shaking →'
            : review
              ? '🚒 Dispatch crews & reveal outcomes'
              : 'Review final dispatch →'}
      </button>
    </aside>
  )
}
