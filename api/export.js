// Vercel serverless function: instructor CSV export of all student responses.
//
// Usage (instructor only):
//   https://<your-site>/api/export?key=<EXPORT_KEY>
//
// Environment variables (Vercel → Settings → Environment Variables):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  — same as api/submit.js
//   EXPORT_KEY — any secret string; required as ?key= to download the CSV.

function csvEscape(v) {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const exportKey = process.env.EXPORT_KEY

  if (!url || !key) {
    res.status(503).send('Backend not configured (set SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).')
    return
  }
  if (!exportKey || req.query.key !== exportKey) {
    res.status(401).send('Unauthorized: append ?key=<EXPORT_KEY> to the URL.')
    return
  }

  const r = await fetch(
    `${url}/rest/v1/quake_responses?select=*&order=created_at.asc`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  )
  if (!r.ok) {
    res.status(502).send('Supabase error: ' + (await r.text()))
    return
  }
  const rows = await r.json()

  const header = [
    'created_at', 'student', 'score_label', 'collapses_caught', 'high_flagged',
    'reasoning_hits', 'missed_collapses', 'selections',
  ]
  const lines = [header.join(',')]
  for (const row of rows) {
    const selections = (row.selections || [])
      .map((s) => `${s.name || s.id} (${s.reason || 'hunch'})`)
      .join('; ')
    lines.push([
      row.created_at, row.student, row.score_label, row.collapses_caught,
      row.high_flagged, row.reasoning_hits, row.missed_collapses, selections,
    ].map(csvEscape).join(','))
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="quakequest_responses.csv"')
  res.status(200).send(lines.join('\n'))
}
