import { bridges, MAX_SELECTIONS, REASON_OPTIONS } from '../data/bridges.js'
import { MISSION_ID } from '../data/mission.js'

export const DRAFT_KEY = 'quakequest-mission-v3'
export const LEGACY_DRAFT_KEY = 'quakequest-workspace-v2'
export const RESPONSE_KEY = 'quakequest-responses'
export const TABS = ['mission', 'inventory', 'progress', 'guide']
const bridgeIds = new Set(bridges.map((bridge) => bridge.id))
const reasonIds = new Set(REASON_OPTIONS.map((reason) => reason.id))

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
      reasonIds.has(draft?.reasons?.[id]) ? draft.reasons[id] : '',
    ]),
  )
  return { selectedIds, reasons }
}

export function isDispatchReady(draft, studentName) {
  return (
    Boolean(studentName?.trim()) &&
    draft.selectedIds.length === MAX_SELECTIONS &&
    new Set(draft.selectedIds).size === MAX_SELECTIONS &&
    draft.selectedIds.every(
      (id) =>
        bridgeIds.has(id) &&
        reasonIds.has(draft.reasons[id]) &&
        draft.reasons[id] !== 'hunch',
    )
  )
}

export function normalizeWorkspace(value) {
  const legacy = value?.drafts?.[value?.week === 2 ? 2 : 1]
  const draft = normalizeDraft(value?.draft || legacy)
  const baseline = value?.baseline ? normalizeDraft(value.baseline) : null
  const hasBaseline = baseline?.selectedIds.length === MAX_SELECTIONS
  let phase =
    hasBaseline && ['intel', 'review', 'complete'].includes(value?.phase)
      ? value.phase
      : 'recon'
  const studentName =
    typeof value?.studentName === 'string' ? value.studentName.slice(0, 80) : ''
  if (
    ['review', 'complete'].includes(phase) &&
    !isDispatchReady(draft, studentName)
  )
    phase = 'intel'
  if (phase === 'complete' && typeof value?.lastResultId !== 'string')
    phase = 'review'
  return {
    studentName,
    draft,
    baseline: hasBaseline ? baseline : null,
    phase,
    lastResultId:
      typeof value?.lastResultId === 'string' ? value.lastResultId : null,
  }
}

export function lockBaseline(workspace) {
  if (
    workspace.phase !== 'recon' ||
    workspace.draft.selectedIds.length !== MAX_SELECTIONS
  )
    return workspace
  return {
    ...workspace,
    phase: 'intel',
    baseline: normalizeDraft(workspace.draft),
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

// Keep previous learner records without turning separate old drills into a
// completed mission. Unknown or damaged selections never enter the new draft.
export function normalizeResponses(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (row) =>
        row &&
        typeof row.student === 'string' &&
        Number.isFinite(Date.parse(row.submittedAt)) &&
        Array.isArray(row.selections) &&
        row.selections.some((selection) => bridgeIds.has(selection?.id)),
    )
    .map((row, index) => {
      const draft = normalizeDraft({
        selectedIds: row.selections.map((s) => s?.id),
        reasons: Object.fromEntries(
          row.selections.filter(Boolean).map(({ id, reason }) => [id, reason]),
        ),
      })
      const baseline = row.baseline ? normalizeDraft(row.baseline) : null
      const isMission =
        row.missionId === MISSION_ID &&
        baseline?.selectedIds.length === MAX_SELECTIONS &&
        isDispatchReady(draft, row.student)
      return {
        ...row,
        id: typeof row.id === 'string' ? row.id : `${row.submittedAt}-${index}`,
        missionId: isMission ? MISSION_ID : null,
        baseline: isMission ? baseline : null,
        selections: draft.selectedIds.map((id, priority) => ({
          ...row.selections.find((s) => s?.id === id),
          id,
          name: bridges.find((bridge) => bridge.id === id).name,
          reason: draft.reasons[id] || 'hunch',
          priority: priority + 1,
        })),
      }
    })
}

export function readNavigation(search) {
  const tab = new URLSearchParams(search).get('tab')
  return { tab: TABS.includes(tab) ? tab : 'mission' }
}

export function csvForResponses(rows) {
  const escape = (value) => {
    let text = value == null ? '' : String(value)
    if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const fields = [
    'submitted_at',
    'student',
    'mission',
    'score_label',
    'mission_score',
    'collapses_caught',
    'high_flagged',
    'reasoning_hits',
    'missed_collapses',
    'initial_plan',
    'dispatch_order',
  ]
  return [
    fields.join(','),
    ...rows.map((row) =>
      [
        row.submittedAt,
        row.student,
        row.missionId ? 'The Golden Hour' : 'Previous drill',
        row.scoreLabel,
        row.missionId ? row.missionScore : '',
        row.collapsesCaught,
        row.highFlagged,
        row.reasoningHits,
        row.missedCollapses,
        row.baseline?.selectedIds
          .map(
            (id, i) =>
              `${i + 1}. ${bridges.find((b) => b.id === id)?.name} (${row.baseline.reasons[id] || 'no reason'})`,
          )
          .join('; ') || '',
        row.selections
          .map((s, i) => `${i + 1}. ${s.name} (${s.reason})`)
          .join('; '),
      ]
        .map(escape)
        .join(','),
    ),
  ].join('\r\n')
}
