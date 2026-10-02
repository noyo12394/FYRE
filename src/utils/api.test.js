import test from 'node:test'
import assert from 'node:assert/strict'
import submit from '../../api/submit.js'
import exportResponses from '../../api/export.js'

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
    send(body) {
      this.body = body
      return this
    },
    setHeader(name, value) {
      this.headers[name] = value
    },
  }
}
function backend(t, configured = true) {
  const names = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'EXPORT_KEY']
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  )
  const previousFetch = globalThis.fetch
  t.after(() => {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name]
      else process.env[name] = previous[name]
    }
    globalThis.fetch = previousFetch
  })
  if (configured) {
    process.env.SUPABASE_URL = 'https://example.invalid'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-key'
    process.env.EXPORT_KEY = 'test-export-key'
  } else
    names.forEach((name) => {
      delete process.env[name]
    })
}
test('submission stays local when no instructor backend is configured', async (t) => {
  backend(t, false)
  const res = response()
  await submit({ method: 'POST', body: {} }, res)
  assert.equal(res.statusCode, 503)
  assert.equal(res.body.stored, false)
})
test('submission retains mission ranking and initial-plan metadata in the existing JSON column', async (t) => {
  backend(t)
  let stored
  globalThis.fetch = async (_url, options) => {
    stored = JSON.parse(options.body)
    return { ok: true }
  }
  const selections = [
    {
      id: 'route-412',
      name: 'Route 412 Overpass',
      reason: 'soft',
      priority: 1,
      missionId: 'golden-hour',
      missionScore: 80,
      initialPlan: { selectedIds: ['fahy'], reasons: { fahy: 'hunch' } },
    },
  ]
  const res = response()
  await submit(
    {
      method: 'POST',
      body: {
        student: 'Test Planner',
        week: 1,
        scoreLabel: 'Strong response · 80/100',
        selections,
      },
    },
    res,
  )
  assert.equal(res.body.stored, true)
  assert.deepEqual(stored.selections, selections)
  assert.equal(stored.week, 1)
  assert.equal(stored.score_label, 'Strong response · 80/100')
})
test('instructor export still requires its existing secret', async (t) => {
  backend(t)
  globalThis.fetch = async () => {
    throw new Error('Must not fetch unauthenticated records')
  }
  const res = response()
  await exportResponses({ query: { key: 'wrong' } }, res)
  assert.equal(res.statusCode, 401)
})
test('instructor CSV includes the initial plan and final crew order and escapes learner input', async (t) => {
  backend(t)
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => [
      {
        student: '=SUM(1,2)',
        score_label: 'Test',
        selections: [
          {
            id: 'route-412',
            name: 'Route 412 Overpass',
            reason: 'soft',
            priority: 1,
            initialPlan: { selectedIds: ['fahy'], reasons: { fahy: 'hunch' } },
          },
        ],
      },
    ],
  })
  const res = response()
  await exportResponses({ query: { key: 'test-export-key' } }, res)
  assert.equal(res.statusCode, 200)
  assert.ok(res.body.includes('initial_plan,dispatch_order'))
  assert.ok(res.body.includes('1. fahy (hunch)'))
  assert.ok(res.body.includes('1. Route 412 Overpass (soft)'))
  assert.ok(res.body.includes('"\'=SUM(1,2)"'))
})
