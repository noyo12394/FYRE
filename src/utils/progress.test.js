import test from 'node:test'
import assert from 'node:assert/strict'
import { bridges, MAX_SELECTIONS } from '../data/bridges.js'
import {
  normalizeDraft,
  normalizeWorkspace,
  normalizeResponses,
  readNavigation,
  csvForResponses,
  readStored,
  writeStored,
} from './progress.js'
import { scoreSelection } from './scoring.js'

test('restore separate week drafts without carrying flags or reasons between activities', () => {
  const restored = normalizeWorkspace(
    JSON.parse(
      JSON.stringify({
        week: 2,
        studentName: 'Field Tester',
        drafts: {
          1: {
            selectedIds: ['hill-to-hill'],
            reasons: { 'hill-to-hill': 'old' },
          },
          2: { selectedIds: ['route-412'], reasons: { 'route-412': 'soft' } },
        },
      }),
    ),
  )
  assert.deepEqual(restored.drafts[1], {
    selectedIds: ['hill-to-hill'],
    reasons: { 'hill-to-hill': 'old' },
  })
  assert.deepEqual(restored.drafts[2], {
    selectedIds: ['route-412'],
    reasons: { 'route-412': 'soft' },
  })
  assert.equal(restored.week, 2)
})

test('damaged or outdated drafts cannot exceed crew limits or reference missing bridges', () => {
  const restored = normalizeDraft({
    selectedIds: [
      'missing',
      'hill-to-hill',
      'hill-to-hill',
      ...bridges.map((bridge) => bridge.id),
    ],
    reasons: { 'hill-to-hill': 'invalid', missing: 'old' },
  })
  assert.equal(restored.selectedIds.length, MAX_SELECTIONS)
  assert.equal(new Set(restored.selectedIds).size, MAX_SELECTIONS)
  assert.equal(restored.reasons['hill-to-hill'], 'hunch')
  assert.equal('missing' in restored.reasons, false)
  assert.equal(
    normalizeWorkspace({ week: 99, studentName: 123, drafts: null }).week,
    1,
  )
  assert.equal(normalizeWorkspace(null).studentName, '')
})

test('v1 dispatch history survives migration while corrupt records are ignored', () => {
  const rows = normalizeResponses([
    null,
    { student: 'Invalid', submittedAt: 'not a date', selections: [] },
    {
      student: 'Field Tester',
      submittedAt: '2026-10-01T17:00:00Z',
      selections: [
        { id: 'hill-to-hill', name: 'old display name', reason: 'old' },
        null,
      ],
    },
  ])
  assert.equal(rows.length, 1)
  assert.equal(rows[0].week, 1)
  assert.equal(rows[0].selections[0].name, 'Hill-to-Hill Bridge')
  assert.equal(rows[0].selections[0].reason, 'old')
  assert.ok(rows[0].id)
  assert.deepEqual(normalizeResponses({}), [])
})

test('activity links validate tabs and weeks and fall back to the saved week', () => {
  assert.deepEqual(readNavigation('?tab=inventory&week=2'), {
    tab: 'inventory',
    week: 2,
  })
  assert.deepEqual(readNavigation('?tab=unknown&week=99', 2), {
    tab: 'activities',
    week: 2,
  })
  assert.deepEqual(readNavigation('?tab=progress', 2), {
    tab: 'progress',
    week: 2,
  })
})

test('reopened debriefs score the recorded selection and reasons, independent of current draft', () => {
  const record = normalizeResponses([
    {
      student: 'Test',
      week: 2,
      submittedAt: '2026-10-01T17:00:00Z',
      selections: [
        { id: 'norfolk-southern', reason: 'old' },
        { id: 'route-412', reason: 'soft' },
      ],
    },
  ])[0]
  const score = scoreSelection(
    bridges,
    record.selections.map((selection) => selection.id),
    Object.fromEntries(record.selections.map(({ id, reason }) => [id, reason])),
  )
  assert.equal(score.collapsesCaught.length, 2)
  assert.equal(score.reasoningHits.length, 2)
  assert.equal(score.missedCollapses.length, 0)
})

test('CSV escapes names and neutralizes spreadsheet formulas', () => {
  const csv = csvForResponses([
    { student: '  =SUM(1,2)', week: 1, selections: [] },
    {
      student: 'Rivera, "Jordan"\nPlanner',
      week: 2,
      selections: [{ name: 'Hill-to-Hill Bridge', reason: 'old' }],
    },
  ])
  assert.ok(csv.includes('"\'  =SUM(1,2)"'))
  assert.ok(csv.includes('"Rivera, ""Jordan""\nPlanner"'))
  assert.ok(csv.includes('Hill-to-Hill Bridge (old)'))
})

test('storage unavailable keeps the workspace usable and reports failed persistence', () => {
  assert.deepEqual(readStored('missing', { drafts: {} }), { drafts: {} })
  assert.equal(writeStored('missing', {}), false)
})
