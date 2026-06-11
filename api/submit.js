// Vercel serverless function: records one student response.
//
// Storage backend is Supabase (free tier is fine). Configure these environment
// variables in Vercel → Project → Settings → Environment Variables:
//   SUPABASE_URL               e.g. https://abcd1234.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  the service_role key (server-side only — never
//                              expose it in client code)
//
// If they are not set, the endpoint answers 503 and the client falls back to
// saving the response in the browser (localStorage) so the game still works.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    res.status(503).json({ stored: false, reason: 'backend-not-configured' })
    return
  }

  const b = req.body || {}
  if (!b.student || !Array.isArray(b.selections) || b.selections.length === 0) {
    res.status(400).json({ error: 'student and selections are required' })
    return
  }

  const row = {
    student: String(b.student).slice(0, 120),
    week: Number(b.week) || 1,
    score_label: String(b.scoreLabel || '').slice(0, 120),
    collapses_caught: Number(b.collapsesCaught) || 0,
    high_flagged: Number(b.highFlagged) || 0,
    reasoning_hits: Number(b.reasoningHits) || 0,
    missed_collapses: Number(b.missedCollapses) || 0,
    selections: b.selections, // [{ id, name, reason }]
  }

  try {
    const r = await fetch(`${url}/rest/v1/quake_responses`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    })
    if (!r.ok) {
      const detail = await r.text()
      res.status(502).json({ stored: false, reason: 'supabase-error', detail })
      return
    }
    res.status(200).json({ stored: true })
  } catch (err) {
    res.status(502).json({ stored: false, reason: 'network-error' })
  }
}
