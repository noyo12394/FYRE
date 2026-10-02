import test from 'node:test'
import assert from 'node:assert/strict'
import { bridges, MAX_SELECTIONS } from '../data/bridges.js'
import { MISSION_ID } from '../data/mission.js'
import {
  normalizeDraft,
  normalizeWorkspace,
  normalizeResponses,
  readNavigation,
  csvForResponses,
  readStored,
  writeStored,
  lockBaseline,
  isDispatchReady,
} from './progress.js'
import { scoreMission } from './scoring.js'

const ids = [
  'norfolk-southern',
  'route-412',
  'st-lukes-link',
  'hill-to-hill',
  'minsi-trail',
]
const reasons = {
  'norfolk-southern': 'old',
  'route-412': 'soft',
  'st-lukes-link': 'lifeline',
  'hill-to-hill': 'old',
  'minsi-trail': 'old',
}
const draft = { selectedIds: ids, reasons }
const record = {
  id: 'mission-1',
  student: 'Field Tester',
  submittedAt: '2026-10-01T17:00:00Z',
  missionId: MISSION_ID,
  baseline: draft,
  selections: ids.map((id) => ({ id, reason: reasons[id] })),
}

test('migrates the active old draft into one mission, without unlocking evidence', () => {
  const restored = normalizeWorkspace({
    week: 2,
    studentName: 'Tester',
    drafts: {
      1: { selectedIds: ['hill-to-hill'], reasons: { 'hill-to-hill': 'old' } },
      2: { selectedIds: ['route-412'], reasons: { 'route-412': 'soft' } },
    },
  })
  assert.deepEqual(restored.draft, {
    selectedIds: ['route-412'],
    reasons: { 'route-412': 'soft' },
  })
  assert.equal(restored.phase, 'recon')
  assert.equal(restored.baseline, null)
  assert.equal('week' in restored, false)
})
test('damaged drafts never exceed crew limits and require a new evidence choice', () => {
  const restored = normalizeDraft({
    selectedIds: ['missing', ...ids, ...ids],
    reasons: { 'route-412': 'invalid' },
  })
  assert.equal(restored.selectedIds.length, MAX_SELECTIONS)
  assert.equal(new Set(restored.selectedIds).size, MAX_SELECTIONS)
  assert.equal(restored.reasons['route-412'], '')
  assert.equal('missing' in restored.reasons, false)
  assert.equal(normalizeWorkspace(null).studentName, '')
})
test('five crews are required before locking the initial snapshot', () => {
  const empty = normalizeWorkspace({})
  assert.equal(lockBaseline(empty), empty)
  const start = normalizeWorkspace({ draft, studentName: 'Tester' })
  const next = lockBaseline(start)
  assert.equal(next.phase, 'intel')
  assert.deepEqual(next.baseline, draft)
  assert.notEqual(next.baseline, next.draft)
  assert.notEqual(next.baseline.reasons, next.draft.reasons)
  assert.notEqual(next.baseline.selectedIds, next.draft.selectedIds)
  next.draft.reasons['route-412'] = 'shaking'
  assert.equal(next.baseline.reasons['route-412'], 'soft')
  assert.equal(lockBaseline(next), next)
})
test('final dispatch needs five valid reasons and a name, not just a hunch', () => {
  assert.equal(isDispatchReady(draft, 'Tester'), true)
  assert.equal(isDispatchReady(draft, '  '), false)
  assert.equal(
    isDispatchReady({ ...draft, selectedIds: Array(5).fill(ids[0]) }, 'Tester'),
    false,
  )
  assert.equal(
    isDispatchReady(
      {
        selectedIds: ['missing', ...ids.slice(1)],
        reasons: { ...reasons, missing: 'old' },
      },
      'Tester',
    ),
    false,
  )
  assert.equal(
    isDispatchReady({ ...draft, selectedIds: ids.slice(0, 4) }, 'Tester'),
    false,
  )
  for (const reason of ['', 'hunch', 'invalid']) {
    assert.equal(
      isDispatchReady(
        { ...draft, reasons: { ...reasons, 'route-412': reason } },
        'Tester',
      ),
      false,
    )
  }
})
test('restores mission stage, baseline, dispatch order, and reasons across reloads', () => {
  const saved = normalizeWorkspace({
    phase: 'review',
    baseline: draft,
    draft,
    studentName: 'Tester',
  })
  assert.deepEqual(normalizeWorkspace(JSON.parse(JSON.stringify(saved))), saved)
  assert.equal(saved.phase, 'review')
})
test('invalid saved phases cannot skip the initial commitment or final validation', () => {
  assert.equal(normalizeWorkspace({ phase: 'intel', draft }).phase, 'recon')
  assert.equal(
    normalizeWorkspace({
      phase: 'complete',
      baseline: draft,
      draft,
      studentName: 'Tester',
    }).phase,
    'review',
  )
  assert.equal(
    normalizeWorkspace({
      phase: 'review',
      baseline: draft,
      draft,
      studentName: '',
    }).phase,
    'intel',
  )
  assert.equal(normalizeWorkspace({ phase: 'unknown' }).phase, 'recon')
})
test('old week links resolve to the single mission and cannot unlock its evidence', () => {
  assert.deepEqual(readNavigation('?tab=drill&week=2&phase=complete'), {
    tab: 'mission',
  })
  assert.deepEqual(readNavigation('?tab=activities&week=6'), { tab: 'mission' })
  assert.deepEqual(readNavigation('?tab=inventory&week=2'), {
    tab: 'inventory',
  })
  assert.deepEqual(readNavigation('?tab=unknown'), { tab: 'mission' })
})
test('previous attempts survive migration without counting as completed missions', () => {
  const legacy = {
    student: 'Tester',
    week: 2,
    submittedAt: '2026-10-01T17:00:00Z',
    selections: [{ id: 'hill-to-hill', name: 'outdated', reason: 'old' }, null],
  }
  const rows = normalizeResponses([
    null,
    { student: 'Bad', submittedAt: 'broken', selections: [] },
    legacy,
  ])
  assert.equal(rows.length, 1)
  assert.equal(rows[0].missionId, null)
  assert.equal(rows[0].selections[0].name, 'Hill-to-Hill Bridge')
  assert.equal(rows[0].selections[0].reason, 'old')
  assert.ok(rows[0].id)
})
test('mission history preserves its baseline and ranking for replay', () => {
  const restored = normalizeResponses([record])[0]
  assert.equal(restored.missionId, MISSION_ID)
  assert.deepEqual(restored.baseline, draft)
  assert.deepEqual(
    restored.selections.map((s) => s.id),
    ids,
  )
  assert.deepEqual(
    restored.selections.map((s) => s.priority),
    [1, 2, 3, 4, 5],
  )
  assert.equal(
    scoreMission(
      bridges,
      restored.selections.map((s) => s.id),
      reasons,
    ).points,
    100,
  )
})
test('the mission has an attainable 100-point score with four earned badges', () => {
  const score = scoreMission(bridges, ids, reasons)
  assert.equal(score.points, 100)
  assert.equal(score.badges.length, 4)
  assert.equal(score.collapsesCaught.length, 2)
  assert.deepEqual(
    score.selected.map((b) => b.id),
    ids,
  )
  assert.equal(
    score.rubric.reduce((sum, item) => sum + item.max, 0),
    100,
  )
})
test('dispatch order changes the urgency and hospital score, not damage detection', () => {
  const score = scoreMission(
    bridges,
    [
      'hill-to-hill',
      'minsi-trail',
      'norfolk-southern',
      'route-412',
      'st-lukes-link',
    ],
    reasons,
  )
  assert.equal(score.points, 80)
  assert.equal(score.lifelineProtected, false)
  assert.equal(score.urgentDispatch, false)
  assert.equal(score.collapsesCaught.length, 2)
})
test('wrong evidence cannot earn primary vulnerability points', () => {
  const score = scoreMission(
    bridges,
    ids,
    Object.fromEntries(ids.map((id) => [id, 'shaking'])),
  )
  assert.equal(score.reasoningHits.length, 0)
  assert.equal(score.points, 80)
})
test('CSV preserves both plans and neutralizes spreadsheet formulas', () => {
  const csv = csvForResponses([
    { ...record, student: '  =SUM(1,2)', missionScore: 100 },
    { student: 'Rivera, "Jordan"\nPlanner', selections: [] },
  ])
  assert.ok(csv.includes('"\'  =SUM(1,2)"'))
  assert.ok(csv.includes('"Rivera, ""Jordan""\nPlanner"'))
  assert.ok(csv.includes('initial_plan,dispatch_order'))
  assert.ok(csv.includes('1. Norfolk Southern Rail Bridge (old)'))
  assert.ok(csv.includes('The Golden Hour'))
  assert.ok(csv.includes('Previous drill'))
})
test('missing browser storage returns usable fallbacks without throwing', () => {
  assert.deepEqual(readStored('not-available', []), [])
  assert.equal(writeStored('not-available', {}), false)
})
