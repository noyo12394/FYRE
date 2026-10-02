import { bridges, MAX_SELECTIONS, REASON_OPTIONS } from '../data/bridges.js'
import { WEEKS, FIRST_WEEK } from '../data/weeks.js'

export const DRAFT_KEY = 'quakequest-workspace-v2'
export const RESPONSE_KEY = 'quakequest-responses'
export const TABS = ['activities', 'drill', 'inventory', 'progress', 'guide']

const bridgeIds = new Set(bridges.map((bridge) => bridge.id))
const reasonIds = new Set(REASON_OPTIONS.map((reason) => reason.id))
const isWeek = (week) => WEEKS.some((item) => item.id === Number(week))

export function normalizeDraft(draft) {
  const selectedIds = Array.isArray(draft?.selectedIds)
    ? [...new Set(draft.selectedIds.filter((id) => bridgeIds.has(id)))].slice(
        0,
        MAX_SELECTIONS,
      )
    : []
  const reasons = Object.fromEntries(
    selectedIds.map((id) => [
      id,
      reasonIds.has(draft?.reasons?.[id]) ? draft.reasons[id] : 'hunch',
    ]),
  )
  return { selectedIds, reasons }
}

export function normalizeWorkspace(value) {
  return {
    week: isWeek(value?.week) ? Number(value.week) : FIRST_WEEK,
    studentName:
      typeof value?.studentName === 'string'
        ? value.studentName.slice(0, 80)
        : '',
    drafts: Object.fromEntries(
      WEEKS.map(({ id }) => [id, normalizeDraft(value?.drafts?.[id])]),
    ),
  }
}

export function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Existing v1 responses are still readable. Ignore malformed entries so one
// damaged record cannot prevent the workspace or instructor export from opening.
export function normalizeResponses(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (row) =>
        row &&
        typeof row.student === 'string' &&
        Number.isFinite(Date.parse(row.submittedAt)) &&
        isWeek(row.week || FIRST_WEEK) &&
        Array.isArray(row.selections) &&
        row.selections.some((selection) => bridgeIds.has(selection?.id)),
    )
    .map((row, index) => ({
      ...row,
      id: typeof row.id === 'string' ? row.id : `${row.submittedAt}-${index}`,
      week: Number(row.week) || FIRST_WEEK,
      selections: normalizeDraft({
        selectedIds: row.selections.map((selection) => selection?.id),
        reasons: Object.fromEntries(
          row.selections.filter(Boolean).map(({ id, reason }) => [id, reason]),
        ),
      }).selectedIds.map((id) => ({
        id,
        name: bridges.find((bridge) => bridge.id === id).name,
        reason: reasonIds.has(
          row.selections.find((selection) => selection?.id === id)?.reason,
        )
          ? row.selections.find((selection) => selection?.id === id).reason
          : 'hunch',
      })),
    }))
}

export function readNavigation(search, fallbackWeek = FIRST_WEEK) {
  const params = new URLSearchParams(search)
  return {
    tab: TABS.includes(params.get('tab')) ? params.get('tab') : 'activities',
    week: isWeek(params.get('week'))
      ? Number(params.get('week'))
      : fallbackWeek,
  }
}

export function csvForResponses(rows) {
  // Neutralize spreadsheet formulas in learner-supplied names before export.
  const escape = (value) => {
    let text = value == null ? '' : String(value)
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const fields = [
    'submitted_at',
    'student',
    'week',
    'score_label',
    'collapses_caught',
    'high_flagged',
    'reasoning_hits',
    'missed_collapses',
    'selections',
  ]
  return [
    fields.join(','),
    ...rows.map((row) =>
      [
        row.submittedAt,
        row.student,
        row.week,
        row.scoreLabel,
        row.collapsesCaught,
        row.highFlagged,
        row.reasoningHits,
        row.missedCollapses,
        row.selections
          .map((selection) => `${selection.name} (${selection.reason})`)
          .join('; '),
      ]
        .map(escape)
        .join(','),
    ),
  ].join('\r\n')
}
