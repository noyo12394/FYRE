import test from 'node:test'
import assert from 'node:assert/strict'
import { missionGuidance } from './missionGuide.js'

const selectedIds = ['fahy', 'hill-to-hill', 'minsi-trail', 'route-412', 'norfolk-southern']
const draft = {
  selectedIds,
  reasons: Object.fromEntries(selectedIds.map((id) => [id, 'old'])),
}

test('first-step guidance directs missing crews to cards, not later stages', () => {
  const guide = missionGuidance('recon', { selectedIds: ['fahy'], reasons: {} }, '')
  assert.equal(guide.target, 'crossings')
  assert.match(guide.next, /1\/5 assigned\. Choose 4 more crossings/)
  assert.match(guide.instructions[1], /optional/)
})
test('first-step guidance directs five assigned crews to locking the initial plan', () => {
  const guide = missionGuidance('recon', draft, '')
  assert.equal(guide.target, 'advance')
  assert.equal(guide.action, 'Go to lock plan')
})
test('evidence guidance prioritizes missing crossings before name and reasons', () => {
  assert.equal(missionGuidance('intel', { selectedIds: [], reasons: {} }, '').target, 'crossings')
  assert.equal(missionGuidance('intel', draft, '').target, 'name')
})
test('evidence guidance points to the first missing reason and rejects a hunch', () => {
  const guide = missionGuidance('intel', {
    ...draft,
    reasons: { ...draft.reasons, fahy: 'hunch', 'route-412': '' },
  }, 'Planner')
  assert.equal(guide.target, 'reason')
  assert.equal(guide.reasonId, 'fahy')
  assert.match(guide.next, /2 crossings/)
})
test('ready evidence guidance directs to review, not immediate submission', () => {
  const guide = missionGuidance('intel', draft, 'Planner')
  assert.equal(guide.target, 'advance')
  assert.equal(guide.action, 'Go to final review')
})
test('review guidance explains editing and final submission', () => {
  const guide = missionGuidance('review', draft, 'Planner')
  assert.equal(guide.action, 'Go to dispatch button')
  assert.match(guide.instructions[1], /Back to editing/)
  assert.match(guide.instructions[2], /Dispatch crews & reveal outcomes/)
})
test('completed guidance opens the saved debrief and explains preserved reports', () => {
  const guide = missionGuidance('complete', draft, 'Planner')
  assert.equal(guide.target, 'results')
  assert.equal(guide.action, 'Open my debrief')
  assert.match(guide.instructions[2], /Earlier reports stay saved/)
})
